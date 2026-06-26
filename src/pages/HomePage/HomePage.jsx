import { Grid, Box, Typography } from '@mui/material';
import React, { useState, useEffect, createContext } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PsychologyIcon from '@mui/icons-material/Psychology';

// Import Mobile-specific Navigation Bar Icons
import HomeIcon from '@mui/icons-material/Home';
import MovieIcon from '@mui/icons-material/Movie';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import Sidebar from '../../componets/Sideber/Sidebar';
import MiddlePart from '../../componets/MiddlePart/MiddlePart';
import Reels from '../../componets/Reels/Reels';
import CreateReelsFrom from '../../componets/Reels/CreateReelsFrom';
import Profile from '../profile/Profile';
import HomeRight from '../../componets/HomeRight/HomeRight';
import Message from '../Message/Message';
import MoodPage from '../Mood/MoodPage';

export const MoodContext = createContext();

const HomePage = () => {
  const location   = useLocation();
  const navigate   = useNavigate();
  const currentPath = location.pathname;
  
  // High-fidelity mobile path detectors
  const isHomePage    = currentPath === "/";
  const isReels       = currentPath === "/reels";
  const isCreateReels = currentPath === "/create-reels";
  const isMessage     = currentPath.startsWith("/message");

  const { user } = useSelector(store => store.auth);

  const [userMood,     setUserMood]     = useState("NORMAL");
  const [blockFilters, setBlockFilters] = useState([]);

  const BACKEND_URL = 'https://social-app-backend-pogv.onrender.com';

  const refreshMoodStatus = async () => {
    if (!user?.id) return;
    try {
      const res  = await fetch(`${BACKEND_URL}/api/ai/mood/status/${user.id}`);
      const data = await res.json();
      if (data.success) {
        setUserMood(data.mood);
        setBlockFilters(data.blockCategories || []);
      }
    } catch (e) { console.error("Mood sync error:", e); }
  };

  const sendBehaviorData = async (recentComments = "", scrolledCategories = "", postImageUrl = "") => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/ai/mood/analyze`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, recentComments, scrolledCategories, postImageUrl }),
      });
      const data = await res.json();
      if (data.success) refreshMoodStatus();
    } catch (e) { console.error("Behavior tracking fail:", e); }
  };

  useEffect(() => { refreshMoodStatus(); }, [user]);

  const getMoodStyles = () => {
    switch (userMood) {
      case "HAPPY":  return { bg: 'radial-gradient(circle at top right, #241d08 0%, #07090d 100%)', glow: 'rgba(234,179,8,0.15)',  accent: '#eab308', text: '✨ Mood Shield: Vibrant Happy Vibe On!' };
      case "LOVING": return { bg: 'radial-gradient(circle at top right, #240c17 0%, #07090d 100%)', glow: 'rgba(236,72,153,0.15)', accent: '#ec4899', text: '💖 Mood Shield: Warm & Loving Mode Active' };
      case "SAD":    return { bg: 'radial-gradient(circle at top right, #0b132b 0%, #07090d 100%)', glow: 'rgba(56,189,248,0.15)',  accent: '#38bdf8', text: '🌸 Mood Shield: Safe & Comfort Mode' };
      case "ANGRY":  return { bg: 'radial-gradient(circle at top right, #1a0f1a 0%, #07090d 100%)', glow: 'rgba(168,85,247,0.15)', accent: '#a855f7', text: '🧘 Mood Shield: Serene Zen Mode' };
      default:       return { bg: '#07090d', glow: 'rgba(99,102,241,0.1)', accent: '#6366f1', text: null };
    }
  };

  const t = getMoodStyles();

  // Navigation controller for Mobile Bottom Bar
  const handleNav = (path) => {
    navigate(path);
  };

  return (
 <MoodContext.Provider value={{ userMood, blockFilters, refreshMoodStatus, sendBehaviorData }}>
  <Box sx={{
    background:  isReels ? '#000000' : t.bg,
    minHeight:   '100vh',
    height:      (isReels || isCreateReels || isMessage) ? '100vh' : 'auto',
    width:       '100%',
    color:       'white',
    // Bottom padding to clear the persistent mobile bar safely
    pb:          { xs: (isReels || isCreateReels || isMessage) ? 0 : '72px', md: 0 },
    transition:  'background 0.8s ease-in-out',
    overflow:    (isReels || isCreateReels || isMessage) ? 'hidden' : 'auto',
    boxSizing:   'border-box',
    position:    'relative'
  }}>

    {/* Mood banner - Hidden on Reels/Create to match clean immersive profiles */}
    {isHomePage && t.text && (
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
        bgcolor: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(5px)',
        py: 1, borderBottom: `1px solid ${t.glow}`,
        boxShadow: `0 4px 30px ${t.glow}`,
      }}>
        <PsychologyIcon sx={{ color: t.accent, fontSize: '1.2rem' }} />
        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: t.accent, letterSpacing: '0.5px' }}>
          {t.text}
        </Typography>
      </Box>
    )}

    {/* 🛠️ FIXED: Removed mt (margin-top) and added alignItems: 'stretch' to keep columns level */}
    <Grid container sx={{
      width:    '100%',
      maxWidth: '1200px',
      mx:       'auto',
      px:       { xs: 0, sm: 2, md: 3 }, // Edge-to-edge content on mobile
      boxSizing:'border-box',
      alignItems: 'stretch', 
      height:   (isReels || isCreateReels || isMessage) ? { xs: 'calc(100vh - 64px)', md: 'calc(100vh - 56px)' } : 'auto',
    }}>

      {/* LEFT COLUMN — Desktop Sidebar Only */}
      {/* 🛠️ FIXED: Reset md sizing to 3.5 to balance the 280px sidebar seamlessly */}
      <Grid item xs={0} md={3.5} lg={3} sx={{ display: { xs: 'none', md: 'block' } }}>
        <Box sx={{
          position:        'sticky',
          top:             0,
          height:          '100vh',
          overflowY:       'auto',
          overflowX:       'hidden',
          boxSizing:       'border-box',
          borderRight:     '1px solid rgba(255,255,255,0.06)', /* Clean separation line */
          '&::-webkit-scrollbar': { display: 'none' },
          msOverflowStyle: 'none',
          scrollbarWidth:  'none',
        }}>
          <Sidebar />
        </Box>
      </Grid>

      {/* MIDDLE COLUMN — Content Display Grid */}
      <Grid
        item
        xs={12}
        md={isHomePage ? 8.5 : 8.5}
        lg={isHomePage ? 6 : 9}
        sx={{
          height:    (isReels || isCreateReels || isMessage) ? '100%' : 'auto',
          overflowY: (isReels || isCreateReels || isMessage) ? 'hidden' : 'visible',
        }}
      >
        <Box sx={{
          width:     '100%',
          borderRadius: { xs: 0, md: 4 }, // Sharp edges on phone viewport
          bgcolor:   (isReels || isCreateReels) ? 'transparent' : { xs: 'transparent', md: 'rgba(30,41,59,0.15)' },
          p:         (isReels || isCreateReels || isMessage) ? 0 : { xs: 1.5, md: 2 },
          border:    { md: isReels ? 'none' : `1px solid ${userMood !== "NORMAL" ? t.glow : 'transparent'}` },
          transition:'all 0.5s ease',
          boxSizing: 'border-box',
          overflowX: 'hidden',
          height:    (isReels || isCreateReels || isMessage) ? '100%' : 'auto',
        }}>
          <Routes>
            <Route path="/"                 element={<MiddlePart />} />
            <Route path="/reels"            element={<Reels />} />
            <Route path="/create-reels"     element={<CreateReelsFrom />} />
            <Route path="/message/:id"      element={<Message />} />
            <Route path="/profile/:id"      element={<Profile />} />
            <Route path="/moodpage/:userId" element={<MoodPage />} />
          </Routes>
        </Box>
      </Grid>

      {/* RIGHT COLUMN — Desktop Feed Utilities Only */}
      {isHomePage && (
        <Grid item xs={0} lg={3} sx={{ display: { xs: 'none', lg: 'block' }, pl: 1 }}>
          <Box sx={{ position: 'sticky', top: 20, borderRadius: 4 }}>
            <HomeRight />
          </Box>
        </Grid>
      )}

    </Grid>

    {/* INSTAGRAM-STYLE FIXED BOTTOM NAVIGATION BAR */}
    <Box sx={{
      display: { xs: 'flex', md: 'none' },
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '64px',
      bgcolor: isReels ? 'rgba(0, 0, 0, 0.95)' : 'rgba(7, 9, 13, 0.92)',
      backdropFilter: 'blur(20px)',
      borderTop: isReels ? '1px solid rgba(255,255,255,0.08)' : `1px solid ${userMood !== "NORMAL" ? t.glow : 'rgba(255,255,255,0.08)'}`,
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 1300,
      px: 1,
      boxShadow: isReels ? 'none' : `0 -4px 20px ${t.glow}`,
      transition: 'all 0.4s ease'
    }}>
      {/* Mobile nav items go here */}
          {/* Home Tab */}
          <Box onClick={() => handleNav('/')} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: isHomePage ? t.accent : '#94a3b8', transition: 'transform 0.2s' }}>
            <HomeIcon sx={{ fontSize: '1.75rem', transform: isHomePage ? 'scale(1.1)' : 'scale(1)' }} />
          </Box>

                   {/* Reels Tab continuation... */}
          <Box onClick={() => handleNav('/reels')} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: isReels ? '#ffffff' : '#94a3b8' }}>
            <MovieIcon sx={{ fontSize: '1.75rem', transform: isReels ? 'scale(1.1)' : 'scale(1)' }} />
          </Box>

          {/* Create Layout Tab */}
          <Box onClick={() => handleNav('/create-reels')} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: isCreateReels ? t.accent : '#94a3b8' }}>
            <AddCircleOutlineIcon sx={{ fontSize: '1.9rem', transform: isCreateReels ? 'scale(1.1)' : 'scale(1)' }} />
          </Box>

          {/* Direct Messages Tab */}
          <Box onClick={() => handleNav(`/message/active`)} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: isMessage ? t.accent : '#94a3b8' }}>
            <ChatBubbleOutlineIcon sx={{ fontSize: '1.65rem', transform: isMessage ? 'scale(1.1)' : 'scale(1)' }} />
          </Box>

          {/* User Profile Tab */}
          <Box onClick={() => handleNav(`/profile/${user?.id || 'me'}`)} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: currentPath.startsWith('/profile') ? t.accent : '#94a3b8' }}>
            <AccountCircleIcon sx={{ fontSize: '1.75rem', transform: currentPath.startsWith('/profile') ? 'scale(1.1)' : 'scale(1)' }} />
          </Box>
        </Box>

      </Box>
    </MoodContext.Provider>
  );
};

export default HomePage;
