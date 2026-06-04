import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";

// ─── config ──────────────────────────────────────────────────
const API = process.env.REACT_APP_API_URL || "";

const MOOD_CONFIG = {
  HAPPY:  { label: "Happy",   accent: "#22c55e", dim: "#052e16", symbol: "◉", ring: "#166534" },
  SAD:    { label: "Sad",     accent: "#60a5fa", dim: "#0c1a3a", symbol: "◎", ring: "#1e3a5f" },
  ANGRY:  { label: "Angry",   accent: "#f87171", dim: "#2d0a0a", symbol: "◈", ring: "#7f1d1d" },
  NORMAL: { label: "Neutral", accent: "#a78bfa", dim: "#1a1030", symbol: "◌", ring: "#4c1d95" },
};

const SCORE_BARS = [
  { key: "happinessScore", label: "Happiness", color: "#22c55e", glow: "#22c55e44" },
  { key: "sadnessScore",   label: "Sadness",   color: "#60a5fa", glow: "#60a5fa44" },
  { key: "stressScore",    label: "Stress",    color: "#f87171", glow: "#f8717144" },
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
    <div style={{ height: 7, borderRadius: 99, background: "rgba(255,255,255,0.06)" }}>
      <div style={{
        height: "100%", width: `${w}%`, borderRadius: 99,
        background: color,
        boxShadow: animated && w > 0 ? `0 0 10px ${glow}` : "none",
        transition: animated ? "width 1.3s cubic-bezier(0.16,1,0.3,1)" : "none",
      }} />
    </div>
  );
}

// ─── main ─────────────────────────────────────────────────────
export default function MoodDashboard() {
  const { userId } = useParams();

  // ── tracker state ─────────────────────────────────────────
  const [watchTime,    setWatchTime]    = useState(0);
  const [repeatViews,  setRepeatViews]  = useState(0);
  const [comments,     setComments]     = useState([]);
  const [categories,   setCategories]   = useState([]);
  const [isTracking,   setIsTracking]   = useState(true);

  // ── result state ──────────────────────────────────────────
  const [result,    setResult]    = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [animated,  setAnimated]  = useState(false);
  const [analyzed,  setAnalyzed]  = useState(false);
  const [lastTime,  setLastTime]  = useState(null);
  const [nextIn,    setNextIn]    = useState(0);

  // ── refs ──────────────────────────────────────────────────
  const watchRef      = useRef(null);
  const countdownRef  = useRef(null);
  const scrollRef     = useRef(0);
  const pageVisitRef  = useRef(Date.now());

  // ── TRACK: watch time (increments every second while on page) ─
  useEffect(() => {
    if (!isTracking) return;
    watchRef.current = setInterval(() => {
      setWatchTime(t => t + 1);
    }, 1000);
    return () => clearInterval(watchRef.current);
  }, [isTracking]);

  // ── TRACK: scroll depth → derives categories & repeat views ──
  useEffect(() => {
    const handleScroll = () => {
      const depth = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      if (depth > scrollRef.current) {
        scrollRef.current = depth;
        // derive categories from scroll depth bands
        const cats = [];
        if (depth > 10) cats.push("general");
        if (depth > 30) cats.push("trending");
        if (depth > 60) cats.push("deep-content");
        if (depth > 85) cats.push("long-form");
        setCategories(cats);
        // count as a repeat view every time user scrolls back to top
        if (depth < 5 && scrollRef.current > 50) {
          setRepeatViews(v => v + 1);
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── TRACK: capture comments from Redux store via localStorage ─
  // (reads the last comment the user typed anywhere in the app)
  useEffect(() => {
    const stored = localStorage.getItem("lastUserComment") || "";
    if (stored) setComments([stored]);
  }, []);

  // ── AUTO-ANALYZE: triggers when watchTime hits 35s threshold ──
  const analyze = useCallback(async () => {
    if (loading) return;

    // cooldown: don't re-analyze within 60s
    if (lastTime && Date.now() - lastTime < 60000) return;

    setLoading(true);
    setAnimated(false);

    const payload = {
      userId:             userId || "user_001",
      recentComments:     comments.join(" "),
      scrolledCategories: categories.join(","),
      watchTime:          watchTime,
      repeatViews:        repeatViews,
    };

    try {
      const res  = await fetch(`${API}/api/ai/mood/analyze`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success && !data.cooldown) {
        setResult(data);
        setAnimated(true);
        setAnalyzed(true);
        setLastTime(Date.now());
        setIsTracking(false); // stop tracking after first analysis

        // restart tracking + countdown for next analysis
        startNextCountdown();
      }
    } catch (e) {
      console.error("Mood analyze error:", e);
    } finally {
      setLoading(false);
    }
  }, [userId, comments, categories, watchTime, repeatViews, loading, lastTime]);

  // ── trigger analyze when watchTime reaches 35 seconds ────────
  useEffect(() => {
    if (watchTime >= 35 && !analyzed && !loading) {
      analyze();
    }
  }, [watchTime, analyzed, loading, analyze]);

  // ── countdown for next auto-refresh (every 5 minutes) ────────
  const startNextCountdown = () => {
    let secs = 300; // 5 minutes
    setNextIn(secs);
    clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      secs -= 1;
      setNextIn(secs);
      if (secs <= 0) {
        clearInterval(countdownRef.current);
        setAnalyzed(false);
        setIsTracking(true);
        setWatchTime(0);
      }
    }, 1000);
  };

  useEffect(() => () => {
    clearInterval(watchRef.current);
    clearInterval(countdownRef.current);
  }, []);

  const mood = result ? (MOOD_CONFIG[result.mood] || MOOD_CONFIG.NORMAL) : null;

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .md-root {
          min-height: 100vh;
          background: transparent;
          font-family: 'JetBrains Mono', monospace;
          padding: clamp(16px, 4vw, 48px);
          color: #e2e8f0;
        }
        .md-wrap { max-width: 560px; margin: 0 auto; }

        /* header */
        .md-header { margin-bottom: clamp(24px, 5vw, 40px); }
        .md-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(32px, 8vw, 52px);
          font-weight: 800; color: #f8fafc;
          letter-spacing: -0.03em; line-height: 1.05;
        }
        .md-title span { color: #60a5fa; }
        .md-sub {
          font-size: clamp(10px, 2.5vw, 12px);
          color: #334155; letter-spacing: 0.15em;
          text-transform: uppercase; margin-top: 8px;
        }

        /* tracker card */
        .md-tracker {
          background: #0f1623;
          border: 1px solid #1e293b;
          border-radius: 16px;
          padding: clamp(14px, 3vw, 22px);
          margin-bottom: 16px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 12px;
        }
        .md-stat { text-align: center; padding: 8px; }
        .md-stat-val {
          font-size: clamp(22px, 5vw, 30px);
          font-weight: 500; line-height: 1;
          color: #60a5fa;
          font-family: 'JetBrains Mono', monospace;
        }
        .md-stat-label {
          font-size: 10px; color: #334155;
          text-transform: uppercase; letter-spacing: 0.1em;
          margin-top: 5px;
        }

        /* loading state */
        .md-loading {
          background: #0f1623;
          border: 1px solid #1e293b;
          border-radius: 16px;
          padding: clamp(28px, 6vw, 48px) clamp(16px, 4vw, 28px);
          text-align: center;
          margin-bottom: 16px;
        }
        .md-loading-symbol {
          font-size: 42px; margin-bottom: 14px;
          animation: breathe 2s ease-in-out infinite;
        }
        .md-loading-text {
          font-size: 13px; color: #475569;
          letter-spacing: 0.08em;
        }
        .md-progress-track {
          height: 3px; background: #1e293b;
          border-radius: 99px; margin: 16px 0 8px;
          overflow: hidden;
        }
        .md-progress-fill {
          height: 100%; background: #60a5fa;
          border-radius: 99px;
          transition: width 1s linear;
        }
        .md-progress-label {
          font-size: 11px; color: #334155;
          display: flex; justify-content: space-between;
        }

        /* mood hero */
        .md-mood-hero {
          border-radius: 16px;
          padding: clamp(18px, 5vw, 28px);
          margin-bottom: 14px;
          display: flex; align-items: center;
          gap: clamp(14px, 4vw, 24px);
          border: 1px solid transparent;
          animation: fadeUp 0.45s ease both;
        }
        .md-mood-symbol { font-size: clamp(40px, 10vw, 58px); line-height: 1; flex-shrink: 0; }
        .md-mood-label {
          font-family: 'Syne', sans-serif;
          font-size: clamp(24px, 6vw, 34px);
          font-weight: 800; letter-spacing: -0.02em; line-height: 1;
        }
        .md-mood-meta {
          font-size: 11px; color: #475569;
          letter-spacing: 0.1em; text-transform: uppercase;
          margin-top: 6px; display: flex; flex-wrap: wrap; gap: 10px;
        }
        .md-ai-dot {
          display: inline-block; width: 6px; height: 6px;
          border-radius: 50%; background: #22c55e;
          margin-right: 5px; animation: pulse 2s infinite;
          vertical-align: middle;
        }

        /* scores */
        .md-scores {
          background: #0f1623; border: 1px solid #1e293b;
          border-radius: 16px; padding: clamp(16px, 4vw, 24px);
          margin-bottom: 14px;
          animation: fadeUp 0.45s 0.08s ease both;
        }
        .md-score-row { margin-bottom: 20px; }
        .md-score-row:last-child { margin-bottom: 0; }
        .md-score-header {
          display: flex; justify-content: space-between;
          align-items: baseline; margin-bottom: 9px;
        }
        .md-score-name { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #475569; }
        .md-score-value { font-size: clamp(18px, 5vw, 24px); font-weight: 500; line-height: 1; }
        .md-score-denom { font-size: 10px; color: #334155; margin-left: 2px; }

        /* protection */
        .md-protection {
          display: flex; align-items: flex-start; gap: 10px;
          background: #1a0f00; border: 1px solid #78350f;
          border-radius: 10px;
          padding: clamp(10px, 3vw, 14px) clamp(12px, 3vw, 16px);
          font-size: 12px; color: #fbbf24; margin-bottom: 14px;
          line-height: 1.6; animation: fadeUp 0.45s 0.1s ease both;
        }

        /* tags */
        .md-tags-card {
          background: #0f1623; border: 1px solid #1e293b;
          border-radius: 16px; padding: clamp(16px, 4vw, 24px);
          margin-bottom: 14px;
          animation: fadeUp 0.45s 0.16s ease both;
        }
        .md-tag-section { margin-bottom: 14px; }
        .md-tag-section:last-child { margin-bottom: 0; }
        .md-tags-wrap { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
        .md-tag {
          font-size: 11px; padding: 4px 10px; border-radius: 999px;
          letter-spacing: 0.05em; font-family: 'JetBrains Mono', monospace;
        }
        .md-tag-block { background: #2d0a0a; color: #f87171; border: 1px solid #450a0a; }
        .md-tag-boost { background: #052e16; color: #4ade80; border: 1px solid #14532d; }

        /* next refresh */
        .md-next {
          background: #0f1623; border: 1px solid #1e293b;
          border-radius: 12px;
          padding: 12px 16px;
          display: flex; align-items: center; justify-content: space-between;
          font-size: 11px; color: #334155;
          animation: fadeUp 0.45s 0.2s ease both;
        }
        .md-next span { color: #475569; }
        .md-next strong { color: #60a5fa; font-family: 'JetBrains Mono', monospace; }

        /* label */
        .md-label {
          display: block; font-size: 10px;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: #334155; margin-bottom: 6px;
        }

        /* spinner */
        .md-spinner {
          width: 32px; height: 32px;
          border: 2px solid #1e293b;
          border-top-color: #60a5fa;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes breathe {
          0%,100% { transform: scale(1); opacity: 0.7; }
          50%     { transform: scale(1.08); opacity: 1; }
        }

        @media (max-width: 400px) {
          .md-tracker { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="md-root">
        <div className="md-wrap">

          {/* header */}
          <div className="md-header">
            <h1 className="md-title">Mood<br /><span>Analyzer</span></h1>
            <p className="md-sub">AI-powered emotional intelligence</p>
          </div>

          {/* live tracker stats */}
          <div className="md-tracker">
            <div className="md-stat">
              <div className="md-stat-val">{watchTime}s</div>
              <div className="md-stat-label">Watch time</div>
            </div>
            <div className="md-stat">
              <div className="md-stat-val">{Math.round(scrollRef.current)}%</div>
              <div className="md-stat-label">Scroll depth</div>
            </div>
            <div className="md-stat">
              <div className="md-stat-val">{repeatViews}</div>
              <div className="md-stat-label">Repeat views</div>
            </div>
            <div className="md-stat">
              <div className="md-stat-val" style={{ color: isTracking ? "#22c55e" : "#334155" }}>
                {isTracking ? "ON" : "OFF"}
              </div>
              <div className="md-stat-label">Tracking</div>
            </div>
          </div>

          {/* loading / waiting state */}
          {!analyzed && !result && (
            <div className="md-loading">
              {loading ? (
                <>
                  <div className="md-spinner" />
                  <div className="md-loading-text">Analyzing your emotional state…</div>
                </>
              ) : (
                <>
                  <div className="md-loading-symbol">◌</div>
                  <div className="md-loading-text">
                    Auto-analyzing after {35}s of activity
                  </div>
                  <div className="md-progress-track">
                    <div
                      className="md-progress-fill"
                      style={{ width: `${Math.min((watchTime / 35) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="md-progress-label">
                    <span>0s</span>
                    <span style={{ color: "#60a5fa" }}>{watchTime}s</span>
                    <span>35s</span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* results */}
          {result && mood && (
            <>
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

              {/* protection */}
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
                    <Bar value={result[s.key] ?? 0} color={s.color} glow={s.glow} animated={animated} />
                  </div>
                ))}
              </div>

              {/* tags */}
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

              {/* next refresh countdown */}
              <div className="md-next">
                <span>Next auto-refresh in</span>
                <strong>{fmt(nextIn)}</strong>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}
