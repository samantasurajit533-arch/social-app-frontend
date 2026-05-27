import { Avatar, Backdrop, Box, Button, CircularProgress, IconButton, Modal, Typography } from '@mui/material';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import ImageIcon from '@mui/icons-material/Image';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { uploadToCloudniry } from '../../utils/uploadToCloudniry';
import { useDispatch, useSelector } from 'react-redux';
import { createPostAction } from '../../pages/Redux/Post/post.action';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 550 },
  background: 'rgba(15, 23, 42, 0.9)', 
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 24px 50px rgba(0, 0, 0, 0.5)',
  p: 4,
  borderRadius: "24px",
  outline: "none",
  color: 'white'
};

const CreatePostModel1 = ({ handleClose, open }) => {
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedVideo, setSelectedVideo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector(store => store.auth);

  const handleSelectImage = async (event) => {
    setIsLoading(true);
    const file = event.target.files[0];
    const imageUrl = await uploadToCloudniry(file, "image");
    setSelectedVideo(""); 
    formik.setFieldValue("video", "");
    setSelectedImage(imageUrl);
    formik.setFieldValue("image", imageUrl);
    setIsLoading(false);
  };

  const handleSelectVideo = async (event) => {
    setIsLoading(true);
    const file = event.target.files[0];
    const videoUrl = await uploadToCloudniry(file, "video");
    setSelectedImage("");
    formik.setFieldValue("image", "");
    setSelectedVideo(videoUrl);
    formik.setFieldValue("video", videoUrl);
    setIsLoading(false);
  };

  const formik = useFormik({
    initialValues: { caption: "", image: "", video: "" },
    onSubmit: (values) => {
      const postData = {
        caption: values.caption,
        image: values.video || values.image, 
      };
      dispatch(createPostAction(postData));
      formik.resetForm();
      setSelectedImage("");
      setSelectedVideo("");
      handleClose();
    }
  });

  return (
    <Modal open={open} onClose={handleClose} closeAfterTransition>
      <Box sx={style}>
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Avatar src={user?.profileImage} sx={{ border: '2px solid #6366f1' }} />
              <Box>
                <Typography sx={{ fontWeight: 800 }}>{user?.firstName} {user?.lastName}</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Public Broadcast</Typography>
              </Box>
            </Box>
            <IconButton onClick={handleClose} sx={{ color: 'white' }}><CloseIcon /></IconButton>
          </Box>

          <textarea
            className='no-scrollbar'
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'white',
              fontSize: '1.2rem',
              resize: 'none',
              minHeight: '120px'
            }}
            placeholder="Share something unique..."
            name='caption'
            onChange={formik.handleChange}
            value={formik.values.caption}
          />

          {/* Media Preview Bento Box */}
          <Box sx={{ position: 'relative' }}>
            {selectedImage && (
              <Box sx={{ mt: 2, position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                <img style={{ height: '300px', width: '100%', objectFit: 'cover' }} src={selectedImage} alt="Preview" />
                <IconButton onClick={() => setSelectedImage("")} sx={{ position: "absolute", top: 10, right: 10, bgcolor: "rgba(0,0,0,0.6)", color: "white" }}>
                  <CloseIcon />
                </IconButton>
              </Box>
            )}

            {selectedVideo && (
              <Box sx={{ mt: 2, position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                <video style={{ height: '300px', width: '100%', objectFit: 'cover' }} src={selectedVideo} controls />
                <IconButton onClick={() => setSelectedVideo("")} sx={{ position: "absolute", top: 10, right: 10, bgcolor: "rgba(0,0,0,0.6)", color: "white" }}>
                  <CloseIcon />
                </IconButton>
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, pt: 2, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <input type='file' accept="image/*" onChange={handleSelectImage} style={{ display: "none" }} id="image-input" />
              <label htmlFor='image-input'>
                <IconButton component="span" sx={{ color: '#38bdf8', bgcolor: 'rgba(56, 189, 248, 0.1)' }}><ImageIcon /></IconButton>
              </label>

              <input type='file' accept="video/*" onChange={handleSelectVideo} style={{ display: "none" }} id="video-input" />
              <label htmlFor='video-input'>
                <IconButton component="span" sx={{ color: '#f472b6', bgcolor: 'rgba(244, 114, 182, 0.1)' }}><VideoCallIcon /></IconButton>
              </label>
            </Box>

            <Button 
              type="submit" 
              disabled={isLoading || (!formik.values.caption && !selectedImage && !selectedVideo)}
              sx={{ 
                borderRadius: "12px", 
                px: 4, 
                py: 1,
                background: 'linear-gradient(45deg, #6366f1, #a855f7)',
                color: 'white',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                '&:hover': { background: 'linear-gradient(45deg, #4f46e5, #9333ea)' }
              }}
            >
              Post Now
            </Button>
          </Box>
        </form>

        <Backdrop sx={{ color: '#fff', zIndex: 9999, backdropFilter: 'blur(5px)' }} open={isLoading}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress color="inherit" />
            <Typography sx={{ mt: 2, fontWeight: 700, letterSpacing: '1px' }}>UPLOADING DATA...</Typography>
          </Box>
        </Backdrop>
      </Box>
    </Modal>
  );
};

export default CreatePostModel1;
