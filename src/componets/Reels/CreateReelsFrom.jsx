import React, { useState, useRef } from 'react';
import { Box, Button, TextField, Typography, Card, CircularProgress, MenuItem, InputAdornment } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDispatch, useSelector } from 'react-redux';

const CreateReelsForm = () => {
  const fileInputRef = useRef(null);
  const { user } = useSelector(store => store.auth || {});

  // Form States
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('general');
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  
  // 🌟 AI Caption Loading State
  const [generatingCaption, setGeneratingCaption] = useState(false);

  const BACKEND_URL = 'https://social-app-backend-pogv.onrender.com';

  const categories = [
    { value: 'general', label: 'General / Lifestyle' },
    { value: 'ai', label: 'AI & Technology' },
    { value: 'temple', label: 'Spirituality & Peace' },
    { value: 'girl', label: 'Fashion & Romance' },
    { value: 'comedy', label: 'Comedy & Memes' }
  ];

  // 🌟 AI এর মাধ্যমে ক্যাপশন জেনারেট করার ফাংশন
  const generateAiCaption = async () => {
    setGeneratingCaption(true);
    try {
      // আপনার ব্যাকএন্ডের '/api/ai/generate-caption' এন্ডপয়েন্টে ক্যাটাগরি রিকোয়েস্ট পাঠানো হচ্ছে
      const response = await fetch(`${BACKEND_URL}/api/ai/generate-caption?keywords=${category}`);
      const data = await response.json();

      if (data.caption) {
        setCaption(data.caption); // এআই জেনারেটেড ক্যাপশনটি বক্সে সেট হবে
      } else {
        alert("Could not generate caption. Try again.");
      }
    } catch (error) {
      console.error("AI Caption generation failed:", error);
      alert("AI Service temporary unavailable.");
    } finally {
      setGeneratingCaption(false);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
        setVideoPreview(URL.createObjectURL(file));
      } else {
        alert('Please select a valid video file (MP4, MOV, etc.)');
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      alert('Please upload a video to create a Reel!');
      return;
    }

    setUploading(true);
    try {
      const reelData = {
        caption: caption.trim(),
        category: category,
        video: "https://sample-videos.com", 
        createdAt: new Date().toISOString()
      };

      console.log("Submitting New Reel:", reelData);
      alert("🎉 Reel Uploaded Successfully!");
      
      // Clear fields
      setCaption('');
      setCategory('general');
      setVideoFile(null);
      setVideoPreview('');
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '550px', mx: 'auto', py: 2 }}>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
        <VideocamIcon sx={{ color: '#6366f1', fontSize: '2rem' }} />
        <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '0.5px' }}>
          Create New Reel
        </Typography>
      </Box>

      <Card sx={{ 
        p: 3, 
        background: 'rgba(30, 41, 59, 0.4)', 
        backdropFilter: 'blur(15px)',
        borderRadius: '24px', 
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }}>
        <form onSubmit={handleSubmit}>
          
          <input 
            type="file" 
            accept="video/*" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            onChange={handleVideoChange} 
          />

          {!videoPreview ? (
            <Box 
              onClick={triggerFileInput}
              sx={{
                height: '200px',
                border: '2px dashed rgba(99, 102, 241, 0.4)',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                gap: 1.5,
                bgcolor: 'rgba(255,255,255,0.01)',
                transition: 'all 0.3s ease',
                '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.04)', borderColor: '#6366f1' }
              }}
            >
              <CloudUploadIcon sx={{ fontSize: 48, color: 'rgba(255,255,255,0.3)' }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: '0.9rem' }}>
                Click to upload video transmission
              </Typography>
            </Box>
          ) : (
            <Box sx={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', bgcolor: 'black', height: '250px', mb: 1 }}>
              <video src={videoPreview} controls style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              <Button 
                onClick={() => { setVideoFile(null); setVideoPreview(''); }}
                variant="contained" size="small"
                sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(239, 68, 68, 0.8)', color: 'white', borderRadius: '10px', '&:hover': { bgcolor: '#ef4444' } }}
              >
                Remove
              </Button>
            </Box>
          )}

          {/* Category Dropdown */}
          <Box sx={{ mt: 3, mb: 2.5 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600, mb: 1 }}>
              Content Category
            </Typography>
            <TextField
              select
              fullWidth
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              InputProps={{ style: { color: 'white', fontSize: '0.9rem' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(255,255,255,0.03)',
                  borderRadius: '12px',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&.Mui-focused fieldset': { borderColor: '#6366f1' },
                },
                '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' }
              }}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      bgcolor: '#0f1724',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'white',
                      '& .MuiMenuItem-root:hover': { bgcolor: 'rgba(99, 102, 241, 0.1)' }
                    }
                  }
                }
              }}
            >
              {categories.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Caption Input with 🌟 AI Magic Button Inside */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                Caption
              </Typography>
              
              {/* 🌟 AI Magic Caption Button */}
              <Button
                type="button"
                size="small"
                disabled={generatingCaption}
                onClick={generateAiCaption}
                startIcon={generatingCaption ? <CircularProgress size={14} color="inherit" /> : <AutoAwesomeIcon />}
                sx={{
                  background: 'linear-gradient(45deg, #eab308, #f97316)',
                  color: 'black',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  px: 1.5,
                  borderRadius: '8px',
                  textTransform: 'none',
                  '&:hover': { background: 'linear-gradient(45deg, #ca8a04, #ea580c)' }
                }}
              >
                {generatingCaption ? "Generating..." : "Generate AI Caption"}
              </Button>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Select a category above and click 'Generate AI Caption' or write your own..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              InputProps={{ style: { color: 'white', fontSize: '0.9rem' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(255,255,255,0.03)',
                  borderRadius: '12px',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&.Mui-focused fieldset': { borderColor: '#6366f1' },
                }
              }}
            />
          </Box>

                    {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            disabled={uploading}
            variant="contained"
            startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />}
            sx={{
              background: 'linear-gradient(45deg, #6366f1, #a855f7)',
              color: 'white',
              fontWeight: 700,
              py: 1.5,
              borderRadius: '14px',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
              textTransform: 'none',
              fontSize: '1rem',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: 'linear-gradient(45deg, #4f46e5, #9333ea)',
                boxShadow: '0 6px 20px rgba(99, 102, 241, 0.5)',
                transform: 'translateY(-1px)'
              },
              '&:disabled': {
                background: 'rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.3)'
              }
            }}
          >
            {uploading ? "Deploying Asset..." : "Share Reel"}
          </Button>

        </form>
      </Card>
    </Box>
  );
};

export default CreateReelsForm;

