import * as React from 'react';
import { Box, Modal, Button, IconButton, Typography, TextField, Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfileAction } from '../../pages/Redux/Auth/auth.action';
import { uploadToCloudniry } from '../../utils/uploadToCloudniry';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
  outline: "none",
  borderRadius: 3,
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
      // Use await if your formik version supports it, or check the value in the next render
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
    >
      <Box sx={style}>
        <form onSubmit={formik.handleSubmit}>
          {/* Header */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
              <Typography variant="h6">Edit Profile</Typography>
            </div>
            <Button 
              type="submit" 
              variant="text" 
              sx={{ fontWeight: 'bold' }} 
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "SAVE"}
            </Button>
          </div>

          {/* Cover Photo Section */}
          <div className='h-[15rem] relative mt-2'>
            <div className='w-full h-full relative'>
              <img 
                className='w-full h-full object-cover rounded-md' 
                src={formik.values.coverPhoto || "https://pixabay.com"} 
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
                <IconButton component="span" sx={{ bgcolor: "white", "&:hover": { bgcolor: "#f5f5f5" } }}>
                  <AddPhotoAlternateIcon color="primary" />
                </IconButton>
              </label>
            </div>

            {/* Profile Avatar Section */}
            <div className='absolute -bottom-10 left-5'>
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
                        width: "8rem", 
                        height: "8rem", 
                        border: "4px solid white", 
                        bgcolor: "#2196f3",
                        opacity: uploading ? 0.6 : 1
                    }}
                  >
                    {!formik.values.profileImage && user?.firstName?.[0]}
                  </Avatar>
                </IconButton>
              </label>
            </div>
          </div>

          {/* Form Fields */}
          <div className='mt-14 space-y-5 px-3'>
            <TextField
              fullWidth
              id="firstName"
              name="firstName"
              label="First Name"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              variant="outlined"
            />
            <TextField
              fullWidth
              id="lastName"
              name="lastName"
              label="Last Name"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              variant="outlined"
            />
          </div>
        </form>
      </Box>
    </Modal>
  );
}
