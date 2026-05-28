import React, { useState } from 'react'
import { navigationMenu } from './SidebarNavigation'
import { Avatar, Divider, Menu, MenuItem, Drawer, Box, Typography, IconButton } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const { user } = useSelector(state => state.auth); 
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 

  const handleNavigate = (item) => {
    const path = item.title === "Message" ? `/message/${user?.id}` : 
                 item.title === "Profile" ? `/profile/${user?.id}` : 
                 item.path.toLowerCase();
    navigate(path);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    window.location.reload();
  };

  const SidebarContent = (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'space-between', 
      height: '100%', // 🌟 ফিক্সড: এটি এখন হোমপেজ গ্রিডের ভেতরেই সীমাবদ্ধ থাকবে
      py: 2, 
      px: 2,
      bgcolor: 'transparent',
      color: 'white',
      overflow: 'hidden',
      boxSizing: 'border-box'
    }}>
      {/* TOP SECTION: Logo and Nav Links */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        overflowY: 'auto', 
        flexGrow: 1,
        pr: 0.5
      }} className="no-scrollbar">
        
        {/* LOGO */}
        <Box sx={{ pb: 4, px: 1 }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 900, 
            fontStyle: 'italic', 
            background: 'linear-gradient(45deg, #6366f1, #a855f7)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-1px'
          }}>
            SnapTalk
          </Typography>
        </Box>

        {/* NAVIGATION LINKS */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {navigationMenu.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Box 
                key={index} 
                onClick={() => handleNavigate(item)}
                sx={{ 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2, 
                  p: 1.2, 
                  borderRadius: '14px',
                  transition: '0.3s',
                  bgcolor: isActive ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                  color: isActive ? '#818cf8' : 'rgba(255,255,255,0.65)',
                  border: isActive ? '1px solid rgba(99, 102, 241, 0.25)' : '1px solid transparent',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.04)', color: 'white' }
                }}
              >
                <Box sx={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', opacity: isActive ? 1 : 0.65 }}>
                  {item.icon}
                </Box>
                <Typography sx={{ fontWeight: isActive ? 700 : 500, fontSize: '1rem' }}>
                  {item.title}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* BOTTOM SECTION: USER PROFILE */}
      <Box sx={{ 
        pt: 2, 
        mt: 1, 
        borderTop: '1px solid rgba(255,255,255,0.08)',
        px: 0.5
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <Avatar 
                src={user?.profileImage} 
                sx={{ 
                    width: 38, 
                    height: 38, 
                    border: '2px solid #6366f1',
                    bgcolor: '#6366f1',
                    fontSize: '0.9rem'
                }}
            >
              {user?.firstName?.[0]}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ pigeon: 'hidden', fontWeight: 700, fontSize: '0.88rem', lineHeight: 1.2, noWrap: true, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user ? `${user.firstName} ${user.lastName || ''}` : "User"}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)', display: 'block' }}>
                {user ? `@${user.firstName.toLowerCase()}` : "@active"}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small" sx={{ color: 'white', p: 0.5 }}>
            <MoreVertIcon fontSize="small"/>
          </IconButton>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      {/* 🌟 DESKTOP SIDEBAR BOX FIX (260px ফিক্সড উইথ এবং স্টিকি সম্পূর্ণ রিমুভ করা হয়েছে) */}
      <Box sx={{ 
        display: { xs: 'none', md: 'flex' }, 
        flexDirection: 'column', 
        height: '100%', 
        width: '100%', // 🌟 ফিক্সড: এটি এখন মেইন গ্রিডের সাইজ অনুযায়ী ফ্লেক্সিবল থাকবে, ওভারফ্লো করবে না
        bgcolor: 'transparent',
        boxSizing: 'border-box'
      }}>
        {SidebarContent}
      </Box>

      {/* MOBILE BOTTOM NAV */}
      <Box sx={{ 
        display: { xs: 'flex', md: 'none' }, 
        bottom: 20, 
        left: '5%', 
        width: '90%', 
        position: 'fixed',
        background: 'rgba(15, 23, 42, 0.9)', 
        backdropFilter: 'blur(20px)', 
        borderRadius: '24px', 
        border: '1px solid rgba(255,255,255,0.15)',
        px: 1, 
        py: 1, 
        justifyContent: 'space-around', 
        alignItems: 'center', 
        zIndex: 1100,
        boxShadow: '0 10px 40px rgba(0,0,0,0.6)'
      }}>
        <IconButton onClick={() => navigate("/")} sx={{ color: location.pathname === "/" ? "#6366f1" : "white" }}>🏠</IconButton>
        <IconButton onClick={() => navigate("/reels")} sx={{ color: location.pathname === "/reels" ? "#6366f1" : "white" }}>🎬</IconButton>
        
        <Box onClick={() => navigate("/create-reels")} sx={{ 
          background: 'linear-gradient(45deg, #6366f1, #a855f7)', 
          borderRadius: '16px', 
          p: 1, 
          display: 'flex', 
          cursor: 'pointer'
        }}>
          <Typography sx={{ fontSize: '1.5rem', color: 'white' }}>➕</Typography>
        </Box>

        <IconButton onClick={() => navigate(`/message/${user?.id}`)} sx={{ color: location.pathname.includes("/message") ? "#6366f1" : "white" }}>✉️</IconButton>
        
        <Avatar 
          onClick={() => setMobileOpen(true)} 
          src={user?.profileImage} 
          sx={{ 
              width: 32, 
              height: 32, 
              cursor: 'pointer', 
              border: location.pathname.includes("/profile") ? '2px solid #6366f1' : '2px solid transparent' 
          }}
        >
            {user?.firstName?.[0]}
        </Avatar>
      </Box>

      {/* MOBILE DRAWER */}
      <Drawer 
        anchor="left" 
        open={mobileOpen} 
        onClose={() => setMobileOpen(false)} 
        PaperProps={{ 
            sx: { 
                width: "280px", 
                bgcolor: '#0f172a', 
                backgroundImage: 'none',
                borderRight: '1px solid rgba(255,255,255,0.1)' 
            } 
        }}
      >
        {SidebarContent}
      </Drawer>

      <Menu 
        anchorEl={anchorEl} 
        open={Boolean(anchorEl)} 
        onClose={() => setAnchorEl(null)} 
        PaperProps={{ 
            sx: { 
                bgcolor: '#1e293b', 
                color: 'white',
                minWidth: '150px',
                mt: -2
            } 
        }}
      >
        <MenuItem onClick={() => { setAnchorEl(null); navigate(`/profile/${user?.id}`); }}>View Profile</MenuItem>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
        <MenuItem onClick={handleLogout} sx={{ color: '#ef4444' }}>Sign Out</MenuItem>
      </Menu>
    </>
  )
}

export default Sidebar;
