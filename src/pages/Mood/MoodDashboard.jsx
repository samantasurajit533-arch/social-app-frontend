import { useState, useEffect, useRef } from "react";

// ─── constants ───────────────────────────────────────────────
const API = "https://social-app-backend-pogv.onrender.com";

const MOOD_CONFIG = {
  HAPPY:  { label: "Happy",   accent: "#22c55e", dim: "#052e16", symbol: "◉", ring: "#166534" },
  SAD:    { label: "Sad",     accent: "#60a5fa", dim: "#0c1a3a", symbol: "◎", ring: "#1e3a5f" },
  ANGRY:  { label: "Angry",   accent: "#f87171", dim: "#2d0a0a", symbol: "◈", ring: "#7f1d1d" },
  NORMAL: { label: "Neutral", accent: "#a78bfa", dim: "#1a1030", symbol: "◌", ring: "#4c1d95" },
};

const SCORE_BARS = [
  { key: "happinessScore", label: "Happiness", color: "#22c55e", glow: "#22c55e55" },
  { key: "sadnessScore",   label: "Sadness",   color: "#60a5fa", glow: "#60a5fa55" },
  { key: "stressScore",    label: "Stress",    color: "#f87171", glow: "#f8717155" },
];

// ─── animated bar ────────────────────────────────────────────
function Bar({ value, color, glow, animated }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    if (!animated) { setW(value); return; }
    const t = setTimeout(() => setW(value), 120);
    return () => clearTimeout(t);
  }, [value, animated]);

  return (
    <div style={{
      position: "relative", height: 8, borderRadius: 99,
      background: "rgba(255,255,255,0.06)", overflow: "visible",
    }}>
      <div style={{
        height: "100%", width: `${w}%`, borderRadius: 99,
        background: color,
        boxShadow: animated && w > 0 ? `0 0 12px ${glow}` : "none",
        transition: animated ? "width 1.3s cubic-bezier(0.16,1,0.3,1)" : "none",
      }} />
    </div>
  );
}

// ─── main component ───────────────────────────────────────────
export default function MoodDashboard(){

  const [form, setForm] = useState({
    userId: "user_001",
    recentComments: "",
    scrolledCategories: "music,education",
    watchTime: 20,
    repeatViews: 1,
  });
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [cooldown, setCooldown] = useState(0);
  const [animated, setAnimated] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const startCooldown = () => {
    setCooldown(60);
    timerRef.current = setInterval(() => {
      setCooldown(c => {
        if (c <= 1) { clearInterval(timerRef.current); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  const analyze = async () => {
    if (loading || cooldown > 0) return;
    setLoading(true); setError(null); setAnimated(false);
    try {
      const res = await fetch(`${API}/api/ai/mood/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          watchTime: Number(form.watchTime),
          repeatViews: Number(form.repeatViews),
        }),
      });
      const data = await res.json();
      if (data.cooldown) {
        setError("Already analyzed recently. Please wait.");
        startCooldown();
        return;
      }
      if (!data.success) throw new Error(data.message || "Analysis failed");
      setResult(data);
      setAnimated(true);
      startCooldown();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const mood = result ? (MOOD_CONFIG[result.mood] || MOOD_CONFIG.NORMAL) : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .md-root {
          min-height: 100vh;
          background: #080c12;
          font-family: 'JetBrains Mono', monospace;
          padding: clamp(16px, 4vw, 48px);
          color: #e2e8f0;
        }

        .md-wrap {
          max-width: 560px;
          margin: 0 auto;
          width: 100%;
        }

        /* ── header ── */
        .md-header { margin-bottom: clamp(28px, 6vw, 48px); }
        .md-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(32px, 8vw, 52px);
          font-weight: 800;
          color: #f8fafc;
          letter-spacing: -0.03em;
          line-height: 1.05;
        }
        .md-title span { color: #60a5fa; }
        .md-sub {
          font-size: clamp(10px, 2.5vw, 12px);
          color: #334155;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-top: 10px;
        }

        /* ── form card ── */
        .md-card {
          background: #0f1623;
          border: 1px solid #1e293b;
          border-radius: 16px;
          padding: clamp(16px, 4vw, 28px);
          margin-bottom: 14px;
        }

        /* ── labels ── */
        .md-label {
          display: block;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #334155;
          margin-bottom: 7px;
        }

        /* ── inputs ── */
        .md-input {
          width: 100%;
          background: #080c12;
          border: 1px solid #1e293b;
          border-radius: 8px;
          color: #cbd5e1;
          font-size: clamp(12px, 3vw, 13px);
          font-family: 'JetBrains Mono', monospace;
          padding: 10px 12px;
          outline: none;
          transition: border-color 0.2s;
          -webkit-appearance: none;
        }
        .md-input:focus { border-color: #334155; }
        .md-textarea { resize: vertical; min-height: 68px; }

        /* ── 2-col grid collapses on mobile ── */
        .md-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 20px;
        }

        /* ── range sliders ── */
        .md-range-label {
          display: flex; justify-content: space-between;
          font-size: 10px; color: #334155; letter-spacing: 0.1em;
          text-transform: uppercase; margin-bottom: 10px;
        }
        .md-range-label span { color: #60a5fa; }
        input[type=range] {
          width: 100%;
          accent-color: #60a5fa;
          cursor: pointer;
        }

        /* ── button ── */
        .md-btn {
          width: 100%;
          padding: clamp(13px, 3vw, 16px);
          background: #f8fafc;
          color: #080c12;
          border: none;
          border-radius: 10px;
          font-family: 'Syne', sans-serif;
          font-size: clamp(14px, 3.5vw, 16px);
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.02em;
          transition: opacity 0.2s, transform 0.12s;
          margin-top: 4px;
          -webkit-tap-highlight-color: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .md-btn:hover:not(:disabled) { opacity: 0.88; }
        .md-btn:active:not(:disabled) { transform: scale(0.97); }
        .md-btn:disabled { opacity: 0.25; cursor: not-allowed; }
        .md-btn.loading { background: #1e293b; color: #475569; }

        /* ── error ── */
        .md-error {
          background: #1a0606;
          border: 1px solid #450a0a;
          border-radius: 8px;
          padding: 10px 14px;
          color: #f87171;
          font-size: clamp(11px, 2.8vw, 12px);
          margin-top: 12px;
          line-height: 1.5;
        }

        /* ── result section ── */
        .md-result { margin-top: 20px; }

        /* ── mood hero card ── */
        .md-mood-hero {
          border-radius: 16px;
          padding: clamp(18px, 5vw, 28px);
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: clamp(14px, 4vw, 24px);
          border: 1px solid transparent;
          animation: fadeUp 0.45s ease both;
        }
        .md-mood-symbol {
          font-size: clamp(38px, 10vw, 56px);
          line-height: 1;
          flex-shrink: 0;
        }
        .md-mood-label {
          font-family: 'Syne', sans-serif;
          font-size: clamp(22px, 6vw, 34px);
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .md-mood-meta {
          font-size: clamp(10px, 2.5vw, 11px);
          color: #475569;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-top: 6px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
        }
        .md-ai-dot {
          display: inline-block;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #22c55e;
          margin-right: 5px;
          animation: pulse 2s infinite;
          vertical-align: middle;
        }

        /* ── scores card ── */
        .md-scores {
          background: #0f1623;
          border: 1px solid #1e293b;
          border-radius: 16px;
          padding: clamp(16px, 4vw, 24px);
          margin-bottom: 14px;
          animation: fadeUp 0.45s 0.08s ease both;
        }
        .md-score-row { margin-bottom: 22px; }
        .md-score-row:last-child { margin-bottom: 0; }
        .md-score-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 10px;
        }
        .md-score-name {
          font-size: clamp(10px, 2.5vw, 11px);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #475569;
        }
        .md-score-value {
          font-size: clamp(18px, 5vw, 24px);
          font-weight: 500;
          line-height: 1;
        }
        .md-score-denom { font-size: 10px; color: #334155; margin-left: 2px; }

        /* ── protection banner ── */
        .md-protection {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: #1a0f00;
          border: 1px solid #78350f;
          border-radius: 10px;
          padding: clamp(10px, 3vw, 14px) clamp(12px, 3vw, 16px);
          font-size: clamp(11px, 2.8vw, 12px);
          color: #fbbf24;
          margin-bottom: 14px;
          line-height: 1.6;
          animation: fadeUp 0.45s 0.1s ease both;
        }

        /* ── tags card ── */
        .md-tags-card {
          background: #0f1623;
          border: 1px solid #1e293b;
          border-radius: 16px;
          padding: clamp(16px, 4vw, 24px);
          animation: fadeUp 0.45s 0.16s ease both;
        }
        .md-tag-section { margin-bottom: 16px; }
        .md-tag-section:last-child { margin-bottom: 0; }
        .md-tags-wrap { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
        .md-tag {
          font-size: clamp(10px, 2.5vw, 11px);
          padding: 4px 10px;
          border-radius: 999px;
          letter-spacing: 0.05em;
          font-family: 'JetBrains Mono', monospace;
        }
        .md-tag-block { background: #2d0a0a; color: #f87171; border: 1px solid #450a0a; }
        .md-tag-boost { background: #052e16; color: #4ade80; border: 1px solid #14532d; }

        /* ── misc ── */
        .md-field { margin-bottom: 14px; }
        .md-field:last-child { margin-bottom: 0; }
        .md-divider { height: 1px; background: #1e293b; margin: 16px 0; }

        /* ── animations ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .md-spinner {
          width: 14px; height: 14px;
          border: 2px solid #1e293b;
          border-top-color: #60a5fa;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }

        /* ── mobile ── */
        @media (max-width: 400px) {
          .md-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="md-root">
        <div className="md-wrap">

          {/* ── header ── */}
          <div className="md-header">
            <h1 className="md-title">Mood<br /><span>Analyzer</span></h1>
            <p className="md-sub">AI-powered emotional intelligence</p>
          </div>

          {/* ── form card ── */}
          <div className="md-card">

            <div className="md-field">
              <label className="md-label">User ID</label>
              <input
                className="md-input"
                value={form.userId}
                onChange={e => setForm(f => ({ ...f, userId: e.target.value }))}
                placeholder="user_001"
              />
            </div>

            <div className="md-field">
              <label className="md-label">Recent comments</label>
              <textarea
                className="md-input md-textarea"
                placeholder="e.g. I feel so happy today, love this content!"
                value={form.recentComments}
                onChange={e => setForm(f => ({ ...f, recentComments: e.target.value }))}
              />
            </div>

            <div className="md-field">
              <label className="md-label">Scrolled categories</label>
              <input
                className="md-input"
                value={form.scrolledCategories}
                placeholder="e.g. music, education, news"
                onChange={e => setForm(f => ({ ...f, scrolledCategories: e.target.value }))}
              />
            </div>

            <div className="md-divider" />

            <div className="md-grid">
              <div>
                <div className="md-range-label">
                  Watch time <span>{form.watchTime}s</span>
                </div>
                <input
                  type="range" min="0" max="120" step="1"
                  value={form.watchTime}
                  onChange={e => setForm(f => ({ ...f, watchTime: e.target.value }))}
                />
              </div>
              <div>
                <div className="md-range-label">
                  Repeat views <span>{form.repeatViews}</span>
                </div>
                <input
                  type="range" min="0" max="10" step="1"
                  value={form.repeatViews}
                  onChange={e => setForm(f => ({ ...f, repeatViews: e.target.value }))}
                />
              </div>
            </div>

          </div>

          {/* ── button ── */}
          <button
            className={`md-btn${loading ? " loading" : ""}`}
            onClick={analyze}
            disabled={loading || cooldown > 0}
          >
            {loading
              ? <><div className="md-spinner" />Analyzing…</>
              : cooldown > 0
              ? `Wait ${cooldown}s`
              : "Analyze Mood"}
          </button>

          {error && <div className="md-error">{error}</div>}

          {/* ── result ── */}
          {result && mood && (
            <div className="md-result">

              {/* mood hero */}
              <div
                className="md-mood-hero"
                style={{ background: mood.dim, borderColor: mood.ring }}
              >
                <div className="md-mood-symbol" style={{ color: mood.accent }}>
                  {mood.symbol}
                </div>
                <div>
                  <div className="md-mood-label" style={{ color: mood.accent }}>
                    {mood.label}
                  </div>
                  <div className="md-mood-meta">
                    <span>Risk — {result.riskLevel}</span>
                    {result.aiUsed && (
                      <span><span className="md-ai-dot" />AI analyzed</span>
                    )}
                  </div>
                </div>
              </div>

              {/* protection banner */}
              {result.protectionMode && (
                <div className="md-protection">
                  <span>⚠</span>
                  <span>Protection mode active — sensitive content is being filtered from your feed.</span>
                </div>
              )}

              {/* score bars */}
              <div className="md-scores">
                {SCORE_BARS.map(s => (
                  <div key={s.key} className="md-score-row">
                    <div className="md-score-header">
                      <span className="md-score-name">{s.label}</span>
                      <span className="md-score-value" style={{ color: s.color }}>
                        {Math.round(result[s.key] ?? 0)}
                        <span className="md-score-denom">/100</span>
                      </span>
                    </div>
                    <Bar
                      value={result[s.key] ?? 0}
                      color={s.color}
                      glow={s.glow}
                      animated={animated}
                    />
                  </div>
                ))}
              </div>

              {/* category tags */}
              {(result.blockCategories?.length > 0 || result.boostCategories?.length > 0) && (
                <div className="md-tags-card">
                  {result.blockCategories?.length > 0 && (
                    <div className="md-tag-section">
                      <span className="md-label">Blocked categories</span>
                      <div className="md-tags-wrap">
                        {result.blockCategories.map(c => (
                          <span key={c} className="md-tag md-tag-block">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {result.boostCategories?.length > 0 && (
                    <div className="md-tag-section">
                      <span className="md-label">Boosted categories</span>
                      <div className="md-tags-wrap">
                        {result.boostCategories.map(c => (
                          <span key={c} className="md-tag md-tag-boost">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </>
  );
}
