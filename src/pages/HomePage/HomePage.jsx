import { Grid, Box, IconButton, Avatar } from '@mui/material';
import React from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Icons
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MessageIcon from '@mui/icons-material/Message';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// Components
import Sidebar from '../../componets/Sideber/Sidebar';
import MiddlePart from '../../componets/MiddlePart/MiddlePart';
import Reels from '../../componets/Reels/Reels';
import CreateReelsFrom from '../../componets/Reels/CreateReelsFrom';
import Profile from '../profile/Profile';
import HomeRight from '../../componets/HomeRight/HomeRight';
import Message from '../Message/Message';

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const { user } = useSelector(store => store.auth);

  return (
    <Box sx={{ bgcolor: '#07090d', minHeight: '100vh', color: 'white', pb: { xs: 8, md: 0 } }}>
      <Grid container sx={{ px: { lg: 5 } }}>
        
        {/* LEFT NAV: Desktop Sidebar */}
        <Grid item md={3} lg={2.5} sx={{ display: { xs: 'none', md: 'block' } }}>
          <Box sx={{ 
            position: 'sticky', top: 20, height: 'calc(100vh - 40px)', mt: 2,
            borderRadius: 4, overflow: 'hidden', bgcolor: 'rgba(30, 41, 59, 0.7)',
            backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <Sidebar />
          </Box>
        </Grid>

        {/* MIDDLE CONTENT */}
        <Grid item xs={12} md={9} lg={isHomePage ? 6 : 9.5} sx={{ px: { xs: 0, md: 3 }, mt: 2 }}>
          <Box sx={{ 
            width: 'full', minHeight: '100vh', borderRadius: { md: 4 },
            bgcolor: 'rgba(30, 41, 59, 0.3)', p: { xs: 1, md: 2 }
          }}>
            <Routes>
              <Route path="/" element={<MiddlePart />} />
              <Route path="/reels" element={<Reels />} />
              <Route path="/create-reels" element={<CreateReelsFrom />} />
              <Route path="/message/:id" element={<Message />} />
              <Route path="/profile/:id" element={<Profile />} />
            </Routes>
          </Box>
        </Grid>

        {/* RIGHT SIDEBAR */}
        {isHomePage && (
          <Grid item lg={3.5} sx={{ display: { xs: 'none', lg: 'block' } }}>
            <Box sx={{ position: 'sticky', top: 20, mt: 2, borderRadius: 4 }}>
              <HomeRight />
            </Box>
          </Grid>
        )}
      </Grid>

      {/* --- MOBILE BOTTOM NAVIGATION (Instagram/YouTube Style) --- */}
      <Box sx={{ 
        display: { xs: 'flex', md: 'none' },
        position: 'fixed', bottom: 0, left: 0, right: 0,
        height: '70px', bgcolor: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.1)',
        justifyContent: 'space-around', alignItems: 'center', zIndex: 1000,
        px: 2
      }}>
        <IconButton onClick={() => navigate("/")} sx={{ color: location.pathname === "/" ? "#6366f1" : "white" }}>
          <HomeIcon fontSize="large" />
        </IconButton>

        <IconButton onClick={() => navigate("/reels")} sx={{ color: location.pathname === "/reels" ? "#6366f1" : "white" }}>
          <ExploreIcon fontSize="large" />
        </IconButton>

        {/* Add Post Button: Highlighted */}
        <IconButton onClick={() => navigate("/create-reels")} sx={{ 
          background: 'linear-gradient(45deg, #6366f1, #a855f7)', 
          color: 'white', borderRadius: '15px', p: 1,
          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
        }}>
          <AddCircleIcon fontSize="large" />
        </IconButton>

        <IconButton onClick={() => navigate(`/message/${user?.id}`)} sx={{ color: location.pathname.includes("/message") ? "#6366f1" : "white" }}>
          <MessageIcon fontSize="large" />
        </IconButton>

        <IconButton onClick={() => navigate(`/profile/${user?.id}`)}>
          <Avatar 
            src={user?.profileImage} 
            sx={{ 
              width: 32, height: 32, 
              border: location.pathname.includes("/profile") ? '2px solid #6366f1' : 'none' 
            }} 
          />
        </IconButton>
      </Box>
    </Box>
  );
};

export default HomePage;
