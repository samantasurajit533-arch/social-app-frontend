import * as React from 'react';
import { Box, Modal, Button, IconButton, Typography, TextField, Avatar, Backdrop } from '@mui/material';
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
  width: { xs: '95vw', sm: 580 },
  maxHeight: '90vh',
  overflowY: 'auto',
  // Glassmorphism logic
  background: 'rgba(15, 23, 42, 0.95)', 
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 24px 50px rgba(0, 0, 0, 0.6)',
  p: { xs: 2, sm: 4 },
  outline: "none",
  borderRadius: "28px",
  color: 'white'
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
      dispatch(updateProfileAction(values));
      handleClose();
    }
  });

  const handleImageChange = async (event, fieldName) => {
    setUploading(true);
    try {
      const file = event.target.files;
      const imageUrl = await uploadToCloudniry(file, "image");
      if (imageUrl) await formik.setFieldValue(fieldName, imageUrl);
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
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { sx: { backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.4)' } } }}
    >
      <Box sx={style} className="no-scrollbar">
        <form onSubmit={formik.handleSubmit}>
          
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton onClick={handleClose} sx={{ color: 'white' }}><CloseIcon /></IconButton>
              <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: '-0.5px' }}>
                Identity Editor
              </Typography>
            </Box>
            <Button 
              type="submit" 
              disabled={uploading}
              sx={{ 
                background: 'linear-gradient(45deg, #6366f1, #a855f7)',
                color: 'white', fontWeight: 800, px: 3, borderRadius: '10px',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                '&:hover': { background: 'linear-gradient(45deg, #4f46e5, #9333ea)' }
              }} 
            >
              {uploading ? "SYNCING..." : "UPDATE"}
            </Button>
          </Box>

          {/* Media Section */}
          <Box sx={{ position: 'relative', mb: 10 }}>
            {/* Cover Photo */}
            <Box sx={{ height: { xs: '120px', sm: '180px' }, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={formik.values.coverPhoto || "https://unsplash.com"} alt="cover" />
              <input accept="image/*" id="cover-input" type="file" style={{ display: 'none' }} onChange={(e) => handleImageChange(e, "coverPhoto")} />
              <label htmlFor="cover-input">
                <IconButton component="span" sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(0,0,0,0.6)', color: 'white', backdropFilter: 'blur(5px)', '&:hover': { bgcolor: '#6366f1' } }}>
                  <AddPhotoAlternateIcon fontSize="small" />
                </IconButton>
              </label>
            </Box>

            {/* Profile Picture */}
            <Box sx={{ position: 'absolute', bottom: -50, left: 24 }}>
              <input accept="image/*" id="avatar-input" type="file" style={{ display: 'none' }} onChange={(e) => handleImageChange(e, "profileImage")} />
              <label htmlFor="avatar-input">
                <IconButton component="span" sx={{ p: 0 }}>
                  <Avatar 
                    src={formik.values.profileImage}
                    sx={{ 
                        width: { xs: 90, sm: 120 }, height: { xs: 90, sm: 120 }, 
                        border: "6px solid #0f172a", bgcolor: "#6366f1",
                        boxShadow: '0 0 25px rgba(99, 102, 241, 0.5)',
                        opacity: uploading ? 0.5 : 1
                    }}
                  >
                    {user?.firstName?.[0]}
                  </Avatar>
                  <Box sx={{ position: 'absolute', bottom: 5, right: 5, bgcolor: '#6366f1', borderRadius: '50%', p: 0.5, border: '2px solid #0f172a' }}>
                    <AddPhotoAlternateIcon sx={{ fontSize: 16, color: 'white' }} />
                  </Box>
                </IconButton>
              </label>
            </Box>
          </Box>

          {/* Form Fields */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 4 }}>
            <TextField
              fullWidth
              name="firstName"
              label="First Name"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              sx={textFieldStyle}
            />
            <TextField
              fullWidth
              name="lastName"
              label="Last Name"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              sx={textFieldStyle}
            />
          </Box>
        </form>
      </Box>
    </Modal>
  );
}

// Custom Glass-style for TextFields
const textFieldStyle = {
  '& label': { color: 'rgba(255,255,255,0.4)', fontWeight: 600 },
  '& label.Mui-focused': { color: '#6366f1' },
  '& .MuiOutlinedInput-root': {
    color: 'white',
    bgcolor: 'rgba(255,255,255,0.03)',
    borderRadius: '14px',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
    '&.Mui-focused fieldset': { borderColor: '#6366f1' },
  },
};
