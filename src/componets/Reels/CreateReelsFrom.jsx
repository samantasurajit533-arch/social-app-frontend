import React, { useState, useRef, useContext } from 'react';
import { Box, Button, TextField, Typography, Card, CircularProgress, MenuItem } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDispatch, useSelector } from 'react-redux';
// import { createReelAction } from '../../pages/Redux/Post/post.action'; // Uncomment when active

const CreateReelsForm = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const { user } = useSelector(store => store.auth || {});

  // Form States
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('general');
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');
  const [uploading, setUploading] = useState(false);

  // Predefined Categories matching your global system taxonomy
  const categories = [
    { value: 'general', label: 'General / Lifestyle' },
    { value: 'ai', label: 'AI & Technology' },
    { value: 'temple', label: 'Spirituality & Peace' },
    { value: 'girl', label: 'Fashion & Romance' },
    { value: 'comedy', label: 'Comedy & Memes' }
  ];

  // Handle Video Selection and generate local browser preview URL
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

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      alert('Please upload a video to create a Reel!');
      return;
    }

    setUploading(true);

    try {
      // Step 1: Simulate or integrate your Cloudinary/S3 asset upload pipeline
      // const videoUrl = await uploadToCloudinary(videoFile);

      const reelData = {
        caption: caption.trim(),
        category: category,
        video: "https://sample-videos.com", // Replace with real videoUrl after cloud upload logic
        createdAt: new Date().toISOString()
      };

      console.log("Submitting New Reel Metadata to Network:", reelData);
      
      // Step 2: Dispatch your Redux server persistence pipeline action
      // dispatch(createReelAction(reelData));

      alert("🎉 Transmission Broadcast Successful! Your Reel is live.");
      
      // Clear Form Fields on success
      setCaption('');
      setCategory('general');
      setVideoFile(null);
      setVideoPreview('');

    } catch (error) {
      console.error("Reel deployment failed:", error);
      alert("Network transmission failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '550px', mx: 'auto', py: 2 }}>
      
      {/* Page Title Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
        <VideocamIcon sx={{ color: '#6366f1', fontSize: '2rem' }} />
        <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '0.5px' }}>
          Create New Reel
        </Typography>
      </Box>

      {/* Main Glassmorphic Form Card CONTAINER */}
      <Card sx={{ 
        p: 3, 
        background: 'rgba(30, 41, 59, 0.4)', 
        backdropFilter: 'blur(15px)',
        borderRadius: '24px', 
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }}>
        <form onSubmit={handleSubmit}>
          
          {/* Hidden Core Native File Input */}
          <input 
            type="file" 
            accept="video/*" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            onChange={handleVideoChange} 
          />

          {/* Dynamic Video Dropzone & Preview Box */}
          {!videoPreview ? (
            <Box 
              onClick={triggerFileInput}
              sx={{
                height: '260px',
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
                '&:hover': {
                  bgcolor: 'rgba(99, 102, 241, 0.04)',
                  borderColor: '#6366f1'
                }
              }}
            >
              <CloudUploadIcon sx={{ fontSize: 48, color: 'rgba(255,255,255,0.3)' }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: '0.9rem' }}>
                Click to upload video transmission
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>
                MP4, MOV, or WEBM (Max 30s recommended)
              </Typography>
            </Box>
          ) : (
            <Box sx={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', bgcolor: 'black', height: '320px', mb: 1 }}>
              <video 
                src={videoPreview} 
                controls 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
              <Button 
                onClick={() => { setVideoFile(null); setVideoPreview(''); }}
                variant="contained" 
                size="small"
                sx={{ 
                  position: 'absolute', top: 12, right: 12, 
                  bgcolor: 'rgba(239, 68, 68, 0.8)', color: 'white',
                  borderRadius: '10px', textTransform: 'none',
                  '&:hover': { bgcolor: '#ef4444' }
                }}
              >
                Remove
              </Button>
            </Box>
          )}

          {/* Caption Input Textfield Wrapper Layout */}
          <Box sx={{ mt: 3, mb: 2.5 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600, mb: 1 }}>
              Caption
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Write a viral hook for your reel here..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              InputProps={{
                style: { color: 'white', fontSize: '0.9rem' }
              }}
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

          {/* Dropdown System Category Selector matching your AI Engine specifications */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600, mb: 1 }}>
              Content Classification Category
            </Typography>
            <TextField
              select
              fullWidth
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              InputProps={{
                style: { color: 'white', fontSize: '0.9rem' }
              }}
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
                      '& .MuiMenuItem-root:hover': { bgcolor: 'rgba(99, 102, 241, 0.1)' },
                      '& .Mui-selected': { bgcolor: 'rgba(99, 102, 241, 0.2) !important' }
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

                    {/* Neon Gradient Submission Button Control Layout */}
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
                background: 'linear-gradient(45deg, #4f46e5, #9333ea)', // এখানে কালার কোডটি সম্পূর্ণ ফিক্স করা হয়েছে
                boxShadow: '0 6px 20px rgba(99, 102, 241, 0.5)',
                transform: 'translateY(-1px)'
              },
              '&:disabled': {
                background: 'rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.3)'
              }
            }}
          >
            {uploading ? "Deploying Video Asset..." : "Share Reel"}
          </Button>

        </form>
      </Card>
    </Box>
  );
};

export default CreateReelsForm;

