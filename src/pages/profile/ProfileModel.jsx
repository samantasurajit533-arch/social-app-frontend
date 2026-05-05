import * as React from 'react';
import { Box, Modal, Button, IconButton, Typography, TextField, Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfileAction } from '../../pages/Redux/Auth/auth.action';
import { uploadToCloudniry } from '../../utils/uploadToCloudniry';

// Responsive Material-UI sx Style Object
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  // Takes up full viewport width/height on mobile, regular container size on desktop
  width: { xs: '100vw', sm: 600 },
  height: { xs: '100vh', sm: 'auto' },
  maxHeight: { xs: '100vh', sm: '90vh' },
  overflowY: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: { xs: 2, sm: 3 },
  outline: "none",
  borderRadius: { xs: 0, sm: 3 }, // Full-bleed screen style on mobile
};

export default function ProfileModel({ open, handleClose }) {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [uploading, setUploading] = React.useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      profileImage: user?.profileImage || "",
      coverPhoto: user?.coverPhoto || ""
    },
    onSubmit: (values) => {
      console.log("Submitting Profile Update:", values);
      dispatch(updateProfileAction(values));
      handleClose();
    }
  });

  const handleImageChange = async (event, fieldName) => {
    setUploading(true);
    try {
      const file = event.target.files;
      const imageUrl = await uploadToCloudniry(file, "image");

      if (imageUrl) {
        await formik.setFieldValue(fieldName, imageUrl);
        console.log(`${fieldName} uploaded:`, imageUrl);
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Box sx={style}>
        <form onSubmit={formik.handleSubmit} className="flex flex-col h-full">
          
          {/* Top Navigation / Header */}
          <div className='flex items-center justify-between pb-2'>
            <div className='flex items-center space-x-2'>
              <IconButton onClick={handleClose} size="medium">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className="font-bold text-gray-900" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                Edit Profile
              </Typography>
            </div>
            <Button 
              type="submit" 
              variant="text" 
              sx={{ fontWeight: 'bold', fontSize: { xs: '0.85rem', sm: '1rem' } }} 
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "SAVE"}
            </Button>
          </div>

          {/* Media Header Area */}
          <div className='h-[10rem] sm:h-[15rem] relative mt-2 flex-shrink-0'>
            <div className='w-full h-full relative bg-gray-100 rounded-md overflow-hidden'>
              <img 
                className='w-full h-full object-cover' 
                src={formik.values.coverPhoto || "https://unsplash.com"} 
                alt="cover" 
              />
              <input
                accept="image/*"
                id="cover-input"
                type="file"
                style={{ display: 'none' }}
                onChange={(e) => handleImageChange(e, "coverPhoto")}
              />
              <label htmlFor="cover-input" className="absolute top-2 right-2">
                <IconButton component="span" size="small" sx={{ bgcolor: "white", "&:hover": { bgcolor: "#f5f5f5" }, boxShadow: 2 }}>
                  <AddPhotoAlternateIcon color="primary" fontSize="small" />
                </IconButton>
              </label>
            </div>

            {/* Profile Avatar Frame */}
            <div className='absolute -bottom-8 sm:-bottom-10 left-4 sm:left-5'>
              <input
                accept="image/*"
                id="avatar-input"
                type="file"
                style={{ display: 'none' }}
                onChange={(e) => handleImageChange(e, "profileImage")}
              />
              <label htmlFor="avatar-input">
                <IconButton component="span" sx={{ p: 0 }}>
                  <Avatar 
                    src={formik.values.profileImage}
                    sx={{ 
                        width: { xs: "5.5rem", sm: "8rem" }, 
                        height: { xs: "5.5rem", sm: "8rem" }, 
                        border: "4px solid white", 
                        bgcolor: "#2196f3",
                        boxShadow: 3,
                        opacity: uploading ? 0.6 : 1
                    }}
                  >
                    {!formik.values.profileImage && user?.firstName?.[0]}
                  </Avatar>
                </IconButton>
              </label>
            </div>
          </div>

          {/* Input Form Fields */}
          <div className='mt-12 sm:mt-14 space-y-5 px-1 sm:px-3 pb-6 flex-1'>
            <TextField
              fullWidth
              id="firstName"
              name="firstName"
              label="First Name"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              variant="outlined"
              size="medium"
            />
            <TextField
              fullWidth
              id="lastName"
              name="lastName"
              label="Last Name"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              variant="outlined"
              size="medium"
            />
          </div>
        </form>
      </Box>
    </Modal>
  );
}
