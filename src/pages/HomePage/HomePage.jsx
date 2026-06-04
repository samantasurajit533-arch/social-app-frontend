import { Grid, Box, IconButton, Avatar, Typography } from '@mui/material';
import React, { useState, useEffect, createContext } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PsychologyIcon from '@mui/icons-material/Psychology';

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
  const isHomePage = location.pathname === "/";
  const { user }   = useSelector(store => store.auth);

  const [userMood,     setUserMood]     = useState("NORMAL");
  const [blockFilters, setBlockFilters] = useState([]);

  const BACKEND_URL = 'https://social-app-backend-pogv.onrender.com';

  // ── fetch current mood from backend ───────────────────────
  const refreshMoodStatus = async () => {
    if (!user?.id) return;
    try {
      const res  = await fetch(`${BACKEND_URL}/api/ai/mood/status/${user.id}`);
      const data = await res.json();
      if (data.success) {
        setUserMood(data.mood);
        setBlockFilters(data.blockCategories || []);
      }
    } catch (error) {
      console.error("Mood sync error:", error);
    }
  };

  // ── send behavior data for AI mood analysis ───────────────
  const sendBehaviorData = async (
    recentComments    = "",
    scrolledCategories = "",
    postImageUrl      = ""
  ) => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/ai/mood/analyze`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId:             user.id,
          recentComments,
          scrolledCategories,
          postImageUrl,
        }),
      });
      const moodData = await res.json();
      if (moodData.success) refreshMoodStatus();
    } catch (e) {
      console.error("Behavior tracking fail:", e);
    }
  };

  useEffect(() => { refreshMoodStatus(); }, [user]);

  // ── mood-based background themes ──────────────────────────
  const getMoodStyles = () => {
    switch (userMood) {
      case "HAPPY":  return { bg: 'radial-gradient(circle at top right, #241d08 0%, #07090d 100%)', glow: 'rgba(234,179,8,0.15)',    accent: '#eab308', text: '✨ Mood Shield: Vibrant Happy Vibe On!' };
      case "LOVING": return { bg: 'radial-gradient(circle at top right, #240c17 0%, #07090d 100%)', glow: 'rgba(236,72,153,0.15)',   accent: '#ec4899', text: '💖 Mood Shield: Warm & Loving Mode Active' };
      case "SAD":    return { bg: 'radial-gradient(circle at top right, #0b132b 0%, #07090d 100%)', glow: 'rgba(56,189,248,0.15)',   accent: '#38bdf8', text: '🌸 Mood Shield: Safe & Comfort Mode' };
      case "ANGRY":  return { bg: 'radial-gradient(circle at top right, #1a0f1a 0%, #07090d 100%)', glow: 'rgba(168,85,247,0.15)',   accent: '#a855f7', text: '🧘 Mood Shield: Serene Zen Mode' };
      default:       return { bg: '#07090d',                                                         glow: 'rgba(99,102,241,0.1)',    accent: '#6366f1', text: null };
    }
  };

  const currentTheme = getMoodStyles();

  return (
    <MoodContext.Provider value={{ userMood, blockFilters, refreshMoodStatus, sendBehaviorData }}>
      <Box sx={{
        background:   currentTheme.bg,
        minHeight:    '100vh',
        width:        '100%',
        color:        'white',
        // FIX 1 ─ increased bottom padding so mobile nav never overlaps content
        pb:           { xs: 14, md: 0 },
        transition:   'background 0.8s ease-in-out',
        overflowX:    'hidden',
        boxSizing:    'border-box',
      }}>

        {/* mood banner — only on home */}
        {isHomePage && currentTheme.text && (
          <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
            bgcolor: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(5px)',
            py: 1, borderBottom: `1px solid ${currentTheme.glow}`,
            boxShadow: `0 4px 30px ${currentTheme.glow}`,
          }}>
            <PsychologyIcon sx={{ color: currentTheme.accent, fontSize: '1.2rem' }} />
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: currentTheme.accent, letterSpacing: '0.5px' }}>
              {currentTheme.text}
            </Typography>
          </Box>
        )}

        {/* main grid */}
        <Grid
          container
          spacing={2}
          sx={{
            width:    '100%',
            maxWidth: '1200px',
            mx:       'auto',
            px:       { xs: 1, sm: 2, md: 3 },
            boxSizing:'border-box',
            mt:       1,
          }}
        >

          {/* LEFT ─ sidebar */}
          <Grid item xs={0} md={3.5} lg={3} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box sx={{
              position:       'sticky',
              top:            24,
              // FIX 2 ─ sidebar scrolls independently, never bleeds into content column
              height:         'calc(100vh - 48px)',
              overflowY:      'auto',
              overflowX:      'hidden',
              borderRadius:   4,
              bgcolor:        'rgba(30,41,59,0.4)',
              backdropFilter: 'blur(15px)',
              border:         `1px solid ${userMood !== "NORMAL" ? currentTheme.glow : 'rgba(255,255,255,0.06)'}`,
              boxShadow:      `0 4px 20px ${currentTheme.glow}`,
              transition:     'all 0.5s ease',
              p:              0.5,
              boxSizing:      'border-box',
              // hide scrollbar visually but keep it functional
              '&::-webkit-scrollbar': { display: 'none' },
              msOverflowStyle: 'none',
              scrollbarWidth:  'none',
            }}>
              <Sidebar />
            </Box>
          </Grid>

          {/* MIDDLE ─ main content + routes */}
          <Grid
            item
            xs={12}
            md={isHomePage ? 8.5 : 8.5}
            lg={isHomePage ? 6   : 9}
            sx={{ mt: 0 }}
          >
            <Box sx={{
              width:     '100%',
              // FIX 3 ─ removed minHeight 100vh; content grows naturally, no overlap
              borderRadius: { md: 4 },
              bgcolor:   'rgba(30,41,59,0.15)',
              p:         { xs: 1, md: 2 },
              border:    { md: `1px solid ${userMood !== "NORMAL" ? currentTheme.glow : 'transparent'}` },
              transition:'all 0.5s ease',
              boxSizing: 'border-box',
              // FIX 4 ─ content area scrolls correctly, no bleed into mobile nav
              overflowX: 'hidden',
            }}>
              <Routes>
                <Route path="/"                  element={<MiddlePart />} />
                <Route path="/reels"             element={<Reels />} />
                <Route path="/create-reels"      element={<CreateReelsFrom />} />
                <Route path="/message/:id"       element={<Message />} />
                <Route path="/profile/:id"       element={<Profile />} />
                <Route path="/moodpage/:userId"  element={<MoodPage />} />
              </Routes>
            </Box>
          </Grid>

          {/* RIGHT ─ discover people etc (home only) */}
          {isHomePage && (
            <Grid item xs={0} lg={3} sx={{ display: { xs: 'none', lg: 'block' }, pl: 1 }}>
              <Box sx={{ position: 'sticky', top: 20, borderRadius: 4 }}>
                <HomeRight />
              </Box>
            </Grid>
          )}

        </Grid>
      </Box>
    </MoodContext.Provider>
  );
};

export default HomePage;
