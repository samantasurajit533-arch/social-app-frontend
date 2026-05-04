import { Avatar, Backdrop, Box, Button, CircularProgress, IconButton, Modal } from '@mui/material';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import ImageIcon from '@mui/icons-material/Image';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import CloseIcon from '@mui/icons-material/Close';
import { uploadToCloudniry } from '../../utils/uploadToCloudniry';
import { useDispatch, useSelector } from 'react-redux';
import { createPostAction } from '../../pages/Redux/Post/post.action';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: ".6rem",
  outline: "none"
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
    
    // Clear video if image is selected
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
    
    // Clear image if video is selected
    setSelectedImage("");
    formik.setFieldValue("image", "");

    setSelectedVideo(videoUrl);
    formik.setFieldValue("video", videoUrl);
    setIsLoading(false);
  };

  const formik = useFormik({
    initialValues: {
      caption: "",
      image: "",
      video: ""
    },
    onSubmit: (values) => {
      // Logic to ensure the backend receives the correct media field
      const postData = {
        caption: values.caption,
        // If a video exists, we send it in the 'image' field because 
        // your PostCard looks at 'item.image' to detect video.
        image: values.video || values.image, 
      };

      dispatch(createPostAction(postData));
      
      // Cleanup
      formik.resetForm();
      setSelectedImage("");
      setSelectedVideo("");
      handleClose();
    }
  });

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <form onSubmit={formik.handleSubmit}>
          <div>
            <div className='flex space-x-4 items-center'>
              <Avatar src={user?.profileImage} />
              <div>
                <p className='font-bold text-lg'>{user?.firstName} {user?.lastName}</p>
                <p className='text-sm text-gray-500'>@{user?.firstName?.toLowerCase()}</p>
              </div>
            </div>

            <textarea
              className='outline-none w-full mt-5 p-3 bg-transparent border border-gray-300 rounded-md focus:border-blue-500'
              placeholder="What's on your mind?"
              name='caption'
              onChange={formik.handleChange}
              value={formik.values.caption}
              rows='4'
            ></textarea>

            <div className='flex space-x-5 items-center mt-5'>
              <div className='flex items-center'>
                <input
                  type='file'
                  accept="image/*"
                  onChange={handleSelectImage}
                  style={{ display: "none" }}
                  id="image-input"
                />
                <label htmlFor='image-input' className='flex items-center cursor-pointer'>
                  <IconButton color='primary' component="span">
                    <ImageIcon />
                  </IconButton>
                  <span className='text-sm font-semibold'>Image</span>
                </label>
              </div>

              <div className='flex items-center'>
                <input
                  type='file'
                  accept="video/*"
                  onChange={handleSelectVideo}
                  style={{ display: "none" }}
                  id="video-input"
                />
                <label htmlFor='video-input' className='flex items-center cursor-pointer'>
                  <IconButton color='secondary' component="span">
                    <VideoCallIcon />
                  </IconButton>
                  <span className='text-sm font-semibold'>Video</span>
                </label>
              </div>
            </div>

            {/* Media Previews */}
            <div className='relative'>
                {selectedImage && (
                <div className="mt-5 relative">
                    <img className="h-[15rem] w-full object-cover rounded-md" src={selectedImage} alt="Preview" />
                    <IconButton onClick={() => setSelectedImage("")} sx={{position:"absolute", top:5, right:5, bgcolor:"rgba(0,0,0,0.5)", color:"white", "&:hover":{bgcolor:"black"}}}>
                        <CloseIcon/>
                    </IconButton>
                </div>
                )}

                {selectedVideo && (
                <div className="mt-5 relative">
                    <video className="h-[15rem] w-full object-cover rounded-md" src={selectedVideo} controls />
                    <IconButton onClick={() => setSelectedVideo("")} sx={{position:"absolute", top:5, right:5, bgcolor:"rgba(0,0,0,0.5)", color:"white", "&:hover":{bgcolor:"black"}}}>
                        <CloseIcon/>
                    </IconButton>
                </div>
                )}
            </div>

            <div className='flex w-full justify-end mt-5'>
              <Button 
                variant='contained' 
                type="submit" 
                disabled={isLoading || (!formik.values.caption && !selectedImage && !selectedVideo)}
                sx={{ borderRadius: "1.5rem", px: 4 }}
              >
                Post
              </Button>
            </div>
          </div>
        </form>

        <Backdrop
          sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
          open={isLoading}
        >
          <div className='flex flex-col items-center gap-3'>
            <CircularProgress color="inherit" />
            <p>Uploading to Cloudinary...</p>
          </div>
        </Backdrop>
      </Box>
    </Modal>
  );
};

export default CreatePostModel1;
