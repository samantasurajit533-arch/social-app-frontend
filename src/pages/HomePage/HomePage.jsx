import { Grid, Box } from '@mui/material';
import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from '../../componets/Sideber/Sidebar';
import MiddlePart from '../../componets/MiddlePart/MiddlePart';
import Reels from '../../componets/Reels/Reels';
import CreateReelsFrom from '../../componets/Reels/CreateReelsFrom';
import Profile from '../profile/Profile';
import HomeRight from '../../componets/HomeRight/HomeRight';
import Message from '../Message/Message';

const HomePage = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    // Unique Background: Deep Slate instead of plain gray
    <Box sx={{ bgcolor: '#0f172a', minHeight: '100vh', color: 'white' }}>
      <Grid container sx={{ px: { lg: 5 } }}>
        
        {/* LEFT NAV: Floating Sidebar style */}
        <Grid item md={3} lg={2.5} sx={{ display: { xs: 'none', md: 'block' } }}>
          <Box sx={{ 
            position: 'sticky', 
            top: 20, 
            height: 'calc(100vh - 40px)', 
            mt: 2,
            borderRadius: 4,
            overflow: 'hidden',
            bgcolor: 'rgba(30, 41, 59, 0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <Sidebar />
          </Box>
        </Grid>

        {/* MIDDLE CONTENT: Focused Bento Box */}
        <Grid
          item
          xs={12}
          md={9}
          lg={isHomePage ? 6 : 9.5}
          sx={{ 
            px: { xs: 0, md: 3 }, 
            pb: { xs: 10, md: 0 },
            mt: 2
          }}
        >
          <Box sx={{ 
            width: 'full', 
            minHeight: '100vh',
            borderRadius: { md: 4 },
            bgcolor: 'rgba(30, 41, 59, 0.5)', // Semi-transparent for "Layered" look
            p: { xs: 1, md: 2 }
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

        {/* RIGHT SIDEBAR: Widgets Style */}
        {isHomePage && (
          <Grid item lg={3.5} sx={{ display: { xs: 'none', lg: 'block' } }}>
            <Box sx={{ 
              position: 'sticky', 
              top: 20, 
              mt: 2,
              borderRadius: 4,
              bgcolor: 'transparent' // Content inside HomeRight will provide the cards
            }}>
              <HomeRight />
            </Box>
          </Grid>
        )}

      </Grid>
    </Box>
  );
};

export default HomePage;
