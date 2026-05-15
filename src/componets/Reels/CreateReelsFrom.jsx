import { Box, Button, CircularProgress, Typography, IconButton } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Video, Loader2, Image as ImageIcon, CheckCircle2, X, Sparkles } from 'lucide-react';
import { uploadToCloudniry } from '../../utils/uploadToCloudniry';
import { createReelAction } from '../../pages/Redux/Post/post.action';

const CreateReelsForm = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); 
  const dispatch = useDispatch();

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0]; 
    if (!file) return;
    setUploading(true);
    setShowSuccess(false); 
    try {
      const uploadedUrl = await uploadToCloudniry(file, "video");
      if (uploadedUrl) setVideoUrl(uploadedUrl);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  const handleCreateReel = async () => {
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
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      p: { xs: 2, md: 4 },
      bgcolor: '#07090d' // Match global deep midnight
    }}>
      
      {/* 1. Success Toast: Neon Indigo */}
      {showSuccess && (
        <Box sx={{ 
          position: 'fixed', top: 30, zIndex: 1000, 
          display: 'flex', alignItems: 'center', gap: 2,
          background: 'linear-gradient(45deg, #6366f1, #a855f7)', 
          px: 4, py: 2, borderRadius: '50px',
          boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)',
          animation: 'fadeInUp 0.5s ease'
        }}>
          <CheckCircle2 color="white" size={20} />
          <Typography sx={{ fontWeight: 800, color: 'white', fontSize: '0.8rem' }}>REEL UPLOADED TO NETWORK</Typography>
        </Box>
      )}

      {/* 2. Main Container: Glassmorphism */}
      <Box sx={{ 
        display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 5,
        background: 'rgba(30, 41, 59, 0.4)',
        backdropFilter: 'blur(20px)',
        p: { xs: 3, md: 6 }, 
        borderRadius: '32px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        width: '100%', maxW: '900px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
      }}>
        
        {/* Left: Phone Preview with Indigo Frame */}
        <Box sx={{ width: { xs: '100%', md: '300px' }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ 
            position: 'relative', aspect: '9/16', width: '260px', 
            bgcolor: 'black', borderRadius: '40px',
            border: '6px solid rgba(99, 102, 241, 0.2)', // Indigo Frame
            overflow: 'hidden', boxShadow: '0 0 40px rgba(99, 102, 241, 0.1)'
          }}>
            {uploading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 2 }}>
                <CircularProgress size={35} sx={{ color: '#6366f1' }} />
                <Typography sx={{ fontSize: '0.7rem', color: '#6366f1', letterSpacing: '2px' }}>UPLOADING...</Typography>
              </Box>
            ) : videoUrl ? (
              <>
                <video src={videoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} autoPlay muted loop />
                <IconButton 
                  onClick={() => setVideoUrl("")} 
                  sx={{ position: 'absolute', top: 15, right: 15, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: '#ef4444' } }}
                >
                  <X size={18} />
                </IconButton>
              </>
            ) : (
              <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Box sx={{ p: 3, bgcolor: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', mb: 2 }}>
                  <ImageIcon color="#6366f1" size={32} />
                </Box>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>Select Transmission</Typography>
                <input type="file" accept="video/*" style={{ display: 'none' }} onChange={handleVideoUpload} />
              </label>
            )}
          </Box>
        </Box>

        {/* Right Side: Details */}
        <Box sx={{ flex: 1, pt: 2 }}>
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Sparkles color="#6366f1" size={24} />
            <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.5px' }}>Create New Reel</Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px', mb: 1, display: 'block' }}>CAPTION</Typography>
            <textarea
              placeholder="What's the frequency? #modern #snaptalk"
              style={{
                width: '100%', height: '200px', backgroundColor: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px',
                padding: '20px', color: 'white', fontSize: '1rem', outline: 'none',
                resize: 'none', transition: '0.3s'
              }}
              className="focus-indigo"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </Box>

          <Button 
            fullWidth 
            onClick={handleCreateReel}
            disabled={!videoUrl || uploading || !caption}
            sx={{ 
              py: 2, borderRadius: '16px', fontWeight: 800,
              background: 'linear-gradient(45deg, #6366f1, #a855f7)',
              color: 'white', fontSize: '0.9rem',
              boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)',
              '&:disabled': { bgcolor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.2)' },
              '&:hover': { background: 'linear-gradient(45deg, #4f46e5, #9333ea)' }
            }}
          >
            {showSuccess ? "TRANSMITTED" : "POST TO FEED"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateReelsForm;
