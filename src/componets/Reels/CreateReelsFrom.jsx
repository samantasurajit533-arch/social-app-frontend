import { Box, Button, CircularProgress, Typography, IconButton } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Video, Loader2, Image as ImageIcon, CheckCircle2, X, Sparkles, Wand2 } from 'lucide-react';
import { api } from '../../componets/config/api'; // ✅ use api instead of axios directly
import { uploadToCloudniry } from '../../utils/uploadToCloudniry';
import { createReelAction } from '../../pages/Redux/Post/post.action';

const CreateReelsForm = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const dispatch = useDispatch();

  // ✅ Use api interceptor so JWT is sent automatically
  const handleAiGenerate = async () => {
    if (!caption.trim()) {
      alert("Please type a few keywords first (e.g., beach, sunset)!");
      return;
    }
    setAiLoading(true);
    try {
      const response = await api.get(`/api/ai/generate-caption`, {
        params: { keywords: caption }
      });

      if (response.data && response.data.caption) {
        setCaption(response.data.caption);
      } else {
        alert("AI returned no caption. Try different keywords.");
      }
    } catch (error) {
      console.error("AI Generation failed:", error);
      const errMsg = error.response?.data?.error || "AI generation failed. Please try again.";
      alert(errMsg);
    } finally {
      setAiLoading(false);
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert("Video too large. Maximum size is 50MB.");
      return;
    }

    setUploading(true);
    setShowSuccess(false);
    try {
      const uploadedUrl = await uploadToCloudniry(file, "video");
      if (uploadedUrl) setVideoUrl(uploadedUrl);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Video upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleCreateReel = async () => {
    if (!videoUrl || !caption.trim()) return;
    const reelData = { title: caption, video: videoUrl };
    dispatch(createReelAction(reelData));
    setShowSuccess(true);
    setTimeout(() => {
      setCaption("");
      setVideoUrl("");
      setShowSuccess(false);
    }, 2500);
  };

  return (
    <Box sx={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', p: { xs: 2, md: 4 }, bgcolor: '#07090d'
    }}>

      {/* ── SUCCESS TOAST ── */}
      {showSuccess && (
        <Box sx={{
          position: 'fixed', top: 30, zIndex: 1000,
          display: 'flex', alignItems: 'center', gap: 2,
          background: 'linear-gradient(45deg, #6366f1, #a855f7)',
          px: 4, py: 2, borderRadius: '50px',
          boxShadow: '0 0 20px rgba(99,102,241,0.5)',
          animation: 'fadeIn 0.3s ease'
        }}>
          <CheckCircle2 color="white" size={20} />
          <Typography sx={{ fontWeight: 800, color: 'white', fontSize: '0.8rem' }}>
            REEL UPLOADED ✓
          </Typography>
        </Box>
      )}

      <Box sx={{
        display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 5,
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(20px)',
        p: { xs: 3, md: 6 }, borderRadius: '32px',
        border: '1px solid rgba(255,255,255,0.06)',
        width: '100%', maxWidth: '900px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
      }}>

        {/* ── LEFT: VIDEO PREVIEW ── */}
        <Box sx={{ width: { xs: '100%', md: '280px' }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{
            position: 'relative', aspectRatio: '9/16', width: '240px',
            bgcolor: '#080d18', borderRadius: '36px',
            border: '2px solid rgba(99,102,241,0.2)',
            overflow: 'hidden',
            boxShadow: '0 0 40px rgba(99,102,241,0.08)'
          }}>
            {uploading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 2 }}>
                <CircularProgress size={35} sx={{ color: '#6366f1' }} />
                <Typography sx={{ fontSize: '0.65rem', color: '#6366f1', letterSpacing: '2px' }}>
                  UPLOADING...
                </Typography>
              </Box>
            ) : videoUrl ? (
              <>
                <video
                  src={videoUrl}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  autoPlay muted loop
                />
                <IconButton
                  onClick={() => setVideoUrl("")}
                  sx={{
                    position: 'absolute', top: 12, right: 12,
                    bgcolor: 'rgba(0,0,0,0.6)',
                    color: 'white', p: 0.8,
                    '&:hover': { bgcolor: 'rgba(239,68,68,0.7)' }
                  }}
                >
                  <X size={16} />
                </IconButton>
              </>
            ) : (
              <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12 }}>
                <Box sx={{
                  p: 2.5, bgcolor: 'rgba(99,102,241,0.08)',
                  borderRadius: '50%',
                  border: '1px dashed rgba(99,102,241,0.3)'
                }}>
                  <ImageIcon color="#6366f1" size={28} />
                </Box>
                <Box sx={{ textAlign: 'center', px: 2 }}>
                  <Typography sx={{ fontSize: '0.8rem', color: 'white', fontWeight: 600, mb: 0.5 }}>
                    Select Video
                  </Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>
                    MP4, MOV up to 50MB
                  </Typography>
                </Box>
                <input type="file" accept="video/*" style={{ display: 'none' }} onChange={handleVideoUpload} />
              </label>
            )}
          </Box>

          {/* Video status */}
          {videoUrl && !uploading && (
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle2 color="#22c55e" size={14} />
              <Typography sx={{ fontSize: '0.72rem', color: '#22c55e' }}>
                Video ready
              </Typography>
            </Box>
          )}
        </Box>

        {/* ── RIGHT: FORM ── */}
        <Box sx={{ flex: 1, pt: { xs: 0, md: 2 } }}>

          {/* Title */}
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Sparkles color="#6366f1" size={22} />
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'white', fontSize: '1.3rem' }}>
              Create New Reel
            </Typography>
          </Box>

          {/* Caption + AI Button */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '1.5px' }}>
                CAPTION
              </Typography>

              {/* ✅ AI Generate Button */}
              <Button
                onClick={handleAiGenerate}
                disabled={aiLoading || uploading}
                startIcon={aiLoading
                  ? <CircularProgress size={11} color="inherit" />
                  : <Wand2 size={13} />
                }
                sx={{
                  fontSize: '0.65rem', fontWeight: 800,
                  color: '#818cf8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  borderRadius: '8px',
                  px: 1.5,
                  '&:hover': { bgcolor: 'rgba(99,102,241,0.08)', color: 'white' },
                  '&:disabled': { color: 'rgba(255,255,255,0.15)' }
                }}
              >
                {aiLoading ? "Generating..." : "✨ Write with AI"}
              </Button>
            </Box>

            <textarea
              placeholder="Type keywords like 'sunset beach travel' then click ✨ Write with AI..."
              disabled={aiLoading}
              style={{
                width: '100%', height: '180px',
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '16px',
                padding: '16px 20px',
                color: 'white', fontSize: '0.92rem',
                outline: 'none', resize: 'none',
                lineHeight: 1.6,
                fontFamily: 'inherit',
                opacity: aiLoading ? 0.5 : 1,
                transition: 'all 0.2s',
                boxSizing: 'border-box'
              }}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />

            <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', mt: 0.8 }}>
              {caption.length} characters
            </Typography>
          </Box>

          {/* ── POST BUTTON ── */}
          <Button
            fullWidth
            onClick={handleCreateReel}
            disabled={!videoUrl || uploading || !caption.trim() || aiLoading}
            sx={{
              py: 1.8, borderRadius: '14px', fontWeight: 800,
              fontSize: '0.9rem', letterSpacing: '1px',
              background: (!videoUrl || !caption.trim())
                ? 'rgba(255,255,255,0.04)'
                : 'linear-gradient(135deg, #6366f1, #a855f7)',
              color: (!videoUrl || !caption.trim()) ? 'rgba(255,255,255,0.2)' : 'white',
              boxShadow: (!videoUrl || !caption.trim())
                ? 'none'
                : '0 8px 24px rgba(99,102,241,0.3)',
              transition: 'all 0.3s',
              '&:hover:not(:disabled)': {
                transform: 'translateY(-1px)',
                boxShadow: '0 12px 32px rgba(99,102,241,0.4)'
              },
              '&:disabled': {
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(255,255,255,0.2)',
                boxShadow: 'none'
              }
            }}
          >
            {showSuccess ? "✓ TRANSMITTED" : uploading ? "UPLOADING..." : "POST REEL"}
          </Button>

          {/* Helper text */}
          {(!videoUrl || !caption.trim()) && (
            <Typography sx={{ textAlign: 'center', fontSize: '0.72rem', color: 'rgba(255,255,255,0.2)', mt: 1.5 }}>
              {!videoUrl ? "Upload a video to continue" : "Add a caption to post"}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CreateReelsForm;