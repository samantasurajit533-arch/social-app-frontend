import { Grid, Box, IconButton, Avatar, Typography } from '@mui/material';
import React, { useState, useEffect, createContext } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Icons
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MessageIcon from '@mui/icons-material/Message';
import PsychologyIcon from '@mui/icons-material/Psychology';

// Components
import Sidebar from '../../componets/Sideber/Sidebar';
import MiddlePart from '../../componets/MiddlePart/MiddlePart';
import Reels from '../../componets/Reels/Reels';
import CreateReelsFrom from '../../componets/Reels/CreateReelsFrom';
import Profile from '../profile/Profile';
import HomeRight from '../../componets/HomeRight/HomeRight';
import Message from '../Message/Message';


   export const MoodContext = createContext();
//
const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const { user } = useSelector(store => store.auth);

  const [userMood, setUserMood] = useState("NORMAL"); 
  const [blockFilters, setBlockFilters] = useState([]); 

  const BACKEND_URL = 'https://social-app-backend-pogv.onrender.com'; 

  const refreshMoodStatus = async () => {
    if (user?.id) {
      try {
        const res = await fetch(`${BACKEND_URL}/api/ai/mood/status/${user.id}`);
        const data = await res.json();
        if (data.success) {
          setUserMood(data.mood);
          setBlockFilters(data.blockCategories || []);
        }
      } catch (error) {
        console.error("Mood sync error:", error);
      }
    }
  };


  const sendBehaviorData = async (recentComments = "", scrolledCategories = "") => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/ai/mood/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.id,
          recentComments: recentComments,
          scrolledCategories: scrolledCategories 
        }),
      });
      const moodData = await res.json();
      if (moodData.success) {
        refreshMoodStatus();
      }
    } catch (e) {
      console.error("Behavior tracking fail:", e);
    }
  };

  useEffect(() => {
    refreshMoodStatus();
  }, [user]);

  const getMoodStyles = () => {
    switch (userMood) {
      case "HAPPY":
        return {
          bg: 'radial-gradient(circle at top right, #241d08 0%, #07090d 100%)',
          glow: 'rgba(234, 179, 8, 0.15)', 
          accent: '#eab308',
          text: '✨ Mood Shield: Vibrant Happy Vibe On!'
        };
      case "LOVING":
        return {
          bg: 'radial-gradient(circle at top right, #240c17 0%, #07090d 100%)', 
          glow: 'rgba(236, 72, 153, 0.15)', 
          accent: '#ec4899',
          text: '💖 Mood Shield: Warm & Loving Mode Active'
        };
      case "SAD":
        return {
          bg: 'radial-gradient(circle at top right, #0b132b 0%, #07090d 100%)', 
          glow: 'rgba(56, 189, 248, 0.15)', 
          accent: '#38bdf8',
          text: '🌸 Mood Shield: Safe & Comfort Mode'
        };
      case "ANGRY":
        return {
          bg: 'radial-gradient(circle at top right, #1a0f1a 0%, #07090d 100%)',
          glow: 'rgba(168, 85, 247, 0.15)', 
          accent: '#a855f7',
          text: '🧘 Mood Shield: Serene Zen Mode'
        };
      default:
        return {
          bg: '#07090d', 
          glow: 'rgba(99, 102, 241, 0.1)', 
          accent: '#6366f1',
          text: null
        };
    }
  };

  const currentTheme = getMoodStyles();

  return (
    <MoodContext.Provider value={{ userMood, blockFilters, refreshMoodStatus, sendBehaviorData }}>
      <Box sx={{ 
        background: currentTheme.bg, 
        minHeight: '100vh', 
        color: 'white', 
        pb: { xs: 8, md: 0 },
        transition: 'background 0.8s ease-in-out' 
      }}>
        
        {isHomePage && currentTheme.text && (
          <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
            bgcolor: 'rgba(255, 255, 255, 0.02)', backdropFilter: 'blur(5px)',
            py: 1, borderBottom: `1px solid ${currentTheme.glow}`,
            boxShadow: `0 4px 30px ${currentTheme.glow}`
          }}>
            <PsychologyIcon sx={{ color: currentTheme.accent, fontSize: '1.2rem' }} />
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: currentTheme.accent, letterSpacing: '0.5px' }}>
              {currentTheme.text}
            </Typography>
          </Box>
        )}

        <Grid container sx={{ px: { lg: 5 } }}>
          
          {/* LEFT NAV: Sidebar */}
          <Grid item md={3} lg={2.5} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ 
              position: 'sticky', top: 20, height: 'calc(100vh - 40px)', mt: 2,
              borderRadius: 4, overflow: 'hidden', 
              bgcolor: 'rgba(30, 41, 59, 0.4)', 
              backdropFilter: 'blur(15px)', 
              border: `1px solid ${userMood !== "NORMAL" ? currentTheme.glow : 'rgba(255,255,255,0.06)'}`,
              boxShadow: `0 4px 20px ${currentTheme.glow}`,
              transition: 'all 0.5s ease'
            }}>
              <Sidebar />
            </Box>
          </Grid>

          {/* MIDDLE CONTENT */}
          <Grid item xs={12} md={9} lg={isHomePage ? 6 : 9.5} sx={{ px: { xs: 0, md: 3 }, mt: 2 }}>
            <Box sx={{ 
              width: 'full', minHeight: '100vh', borderRadius: { md: 4 },
              bgcolor: 'rgba(30, 41, 59, 0.15)', p: { xs: 1, md: 2 },
              border: { md: `1px solid ${userMood !== "NORMAL" ? currentTheme.glow : 'transparent'}` },
              transition: 'all 0.5s ease'
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

        {/* --- MOBILE BOTTOM NAVIGATION --- */}
        <Box sx={{ 
          display: { xs: 'flex', md: 'none' },
          position: 'fixed', bottom: 0, left: 0, right: 0,
          height: '70px', bgcolor: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.1)',
          justifyContent: 'space-around', alignItems: 'center', zIndex: 1000,
          px: 2
        }}>
          <IconButton onClick={() => navigate("/")} sx={{ color: location.pathname === "/" ? currentTheme.accent : "white" }}>
            <HomeIcon fontSize="large" />
          </IconButton>

          <IconButton onClick={() => navigate("/reels")} sx={{ color: location.pathname === "/reels" ? currentTheme.accent : "white" }}>
            <ExploreIcon fontSize="large" />
          </IconButton>

          <IconButton onClick={() => navigate("/create-reels")} sx={{ 
            background: `linear-gradient(45deg, ${currentTheme.accent}, #a855f7)`, 
            color: 'white', borderRadius: '15px', p: 1,
            boxShadow: `0 4px 15px ${currentTheme.glow}`
          }}>
            <AddCircleIcon fontSize="large" />
          </IconButton>

          <IconButton onClick={() => navigate(`/message/${user?.id}`)} sx={{ color: location.pathname.includes("/message") ? currentTheme.accent : "white" }}>
            <MessageIcon fontSize="large" />
          </IconButton>

          <IconButton onClick={() => navigate(`/profile/${user?.id}`)}>
            <Avatar 
              src={user?.profileImage} 
              sx={{ 
                width: 32, height: 32, 
                border: location.pathname.includes("/profile") ? `2px solid ${currentTheme.accent}` : 'none' 
              }} 
            />
          </IconButton>
        </Box>
      </Box>
    </MoodContext.Provider>
  );
};

export default HomePage;
