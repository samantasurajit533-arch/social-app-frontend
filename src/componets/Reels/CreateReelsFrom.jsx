import { Box, Button, CircularProgress, Typography, IconButton } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Video, Loader2, Image as ImageIcon, CheckCircle2, X, Sparkles, Wand2 } from 'lucide-react';
import axios from 'axios';
import { uploadToCloudniry } from '../../utils/uploadToCloudniry';
import { createReelAction } from '../../pages/Redux/Post/post.action';

const API_BASE_URL = "https://social-app-backend-production-c81c.up.railway.app";

const CreateReelsForm = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false); 
  const [showSuccess, setShowSuccess] = useState(false); 
  const dispatch = useDispatch();

  // Secure AI Caption Retrieval 
  const handleAiGenerate = async () => {
    if (!caption.trim()) {
      alert("Please type a few keywords first (e.g., beach, sunset)!");
      return;
    }
    
    setAiLoading(true);
    try {
      // Pulling active user token from storage to pass backend filter gates
      const token = localStorage.getItem("jwt"); 
      
      const response = await axios.get(`${API_BASE_URL}/api/ai/generate-caption`, {
        params: { keywords: caption },
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (response.data) {
        setCaption(response.data);
      }
    } catch (error) {
      console.error("AI Generation failed:", error);
      alert("The AI pipeline is currently re-authenticating. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

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
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyWContent: 'center', 
      minHeight: '100vh', p: { xs: 2, md: 4 }, bgcolor: '#07090d' 
    }}>
      
      {showSuccess && (
        <Box sx={{ 
          position: 'fixed', top: 30, zIndex: 1000, display: 'flex', alignItems: 'center', gap: 2,
          background: 'linear-gradient(45deg, #6366f1, #a855f7)', px: 4, py: 2, borderRadius: '50px',
          boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)',
        }}>
          <CheckCircle2 color="white" size={20} />
          <Typography sx={{ fontWeight: 800, color: 'white', fontSize: '0.8rem' }}>REEL UPLOADED</Typography>
        </Box>
      )}

      <Box sx={{ 
        display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 5,
        background: 'rgba(30, 41, 59, 0.4)', backdropFilter: 'blur(20px)',
        p: { xs: 3, md: 6 }, borderRadius: '32px', border: '1px solid rgba(255, 255, 255, 0.08)',
        width: '100%', maxWidth: '900px', boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
      }}>
        
        {/* Left: Preview Frame */}
        <Box sx={{ width: { xs: '100%', md: '300px' }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ 
            position: 'relative', aspectRatio: '9/16', width: '260px', 
            bgcolor: 'black', borderRadius: '40px', border: '6px solid rgba(99, 102, 241, 0.2)',
            overflow: 'hidden', boxShadow: '0 0 40px rgba(99, 102, 241, 0.1)'
          }}>
            {uploading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 2 }}>
                <CircularProgress size={35} sx={{ color: '#6366f1' }} />
                <Typography sx={{ fontSize: '0.7rem', color: '#6366f1' }}>UPLOADING...</Typography>
              </Box>
            ) : videoUrl ? (
              <>
                <video src={videoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} autoPlay muted loop />
                <IconButton onClick={() => setVideoUrl("")} sx={{ position: 'absolute', top: 15, right: 15, bgcolor: 'rgba(0,0,0,0.5)', color: 'white' }}>
                  <X size={18} />
                </IconButton>
              </>
            ) : (
              <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Box sx={{ p: 3, bgcolor: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', mb: 2 }}>
                  <ImageIcon color="#6366f1" size={32} />
                </Box>
                <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Select Transmission</Typography>
                <input type="file" accept="video/*" style={{ display: 'none' }} onChange={handleVideoUpload} />
              </label>
            )}
          </Box>
        </Box>

        {/* Right Side: Inputs */}
        <Box sx={{ flex: 1, pt: 2 }}>
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Sparkles color="#6366f1" size={24} />
            <Typography variant="h5" sx={{ fontWeight: 900, color: 'white' }}>Create New Reel</Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>CAPTION</Typography>
              
              <Button 
                onClick={handleAiGenerate}
                disabled={aiLoading || uploading}
                startIcon={aiLoading ? <CircularProgress size={12} color="inherit" /> : <Wand2 size={14} />}
                sx={{ 
                  fontSize: '0.65rem', fontWeight: 900, color: '#6366f1', 
                  textTransform: 'uppercase', '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.1)' },
                  '&:disabled': { color: 'rgba(255,255,255,0.2)' }
                }}
              >
                {aiLoading ? "AI Processing..." : "Write with AI"}
              </Button>
            </Box>

            <textarea
              placeholder="Enter keywords and click 'Write with AI'..."
              disabled={aiLoading}
              style={{
                width: '100%', height: '180px', backgroundColor: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px',
                padding: '20px', color: 'white', fontSize: '1rem', outline: 'none', resize: 'none',
                opacity: aiLoading ? 0.5 : 1, transition: 'all 0.3s'
              }}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </Box>

          <Button 
            fullWidth onClick={handleCreateReel}
            disabled={!videoUrl || uploading || !caption || aiLoading}
            sx={{ 
              py: 2, borderRadius: '16px', fontWeight: 800,
              background: 'linear-gradient(45deg, #6366f1, #a855f7)', color: 'white',
              boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)',
              '&:disabled': { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.2)', boxShadow: 'none' }
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
