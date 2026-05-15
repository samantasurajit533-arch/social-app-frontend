import React, { useState } from 'react'
import { navigationMenu } from './SidebarNavigation'
import { Avatar, Button, Divider, Menu, MenuItem, Drawer, Box, Typography, IconButton } from '@mui/material'
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
      h: '100%', 
      py: 3, 
      px: 2,
      bgcolor: 'transparent',
      color: 'white'
    }}>
      <Box>
        {/* SNAP TALK LOGO: Unique Gradient Style */}
        <Box sx={{ pb: 6, px: 2 }}>
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

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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
                  p: 1.5, 
                  borderRadius: '16px',
                  transition: '0.3s',
                  bgcolor: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  color: isActive ? '#818cf8' : 'rgba(255,255,255,0.7)',
                  border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', color: 'white' }
                }}
              >
                <Box sx={{ fontSize: '1.5rem', opacity: isActive ? 1 : 0.7 }}>{item.icon}</Box>
                <Typography sx={{ fontWeight: isActive ? 700 : 500, fontSize: '1.1rem' }}>{item.title}</Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* USER PROFILE SECTION */}
      <Box sx={{ pt: 2, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar src={user?.profileImage} sx={{ width: 42, height: 42, border: '2px solid #6366f1' }}>
              {user?.firstName?.[0]}
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', lineHeight: 1 }}>
                {user ? `${user.firstName}` : "User"}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                {user ? `@${user.firstName.toLowerCase()}` : "@active"}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ color: 'white' }}>
            <MoreVertIcon/>
          </IconButton>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <Box sx={{ 
        display: { xs: 'none', md: 'flex' }, 
        flexDirection: 'column', 
        height: '100vh', 
        position: 'sticky', 
        top: 0, 
        width: '260px',
        bgcolor: 'transparent'
      }}>
        {SidebarContent}
      </Box>

      {/* MOBILE BOTTOM NAV: Glassmorphism Floating Style */}
      <Box sx={{ 
        display: { xs: 'flex', md: 'none' }, 
        fixed: 'bottom', 
        bottom: 15, 
        left: '5%', 
        width: '90%', 
        position: 'fixed',
        background: 'rgba(15, 23, 42, 0.8)', 
        backdropFilter: 'blur(15px)', 
        borderRadius: '24px', 
        border: '1px solid rgba(255,255,255,0.1)',
        px: 1, 
        py: 1, 
        justifyContent: 'space-around', 
        alignItems: 'center', 
        zIndex: 1000,
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        <IconButton onClick={() => navigate("/")} sx={{ color: location.pathname === "/" ? "#6366f1" : "white" }}>🏠</IconButton>
        <IconButton onClick={() => navigate("/reels")} sx={{ color: location.pathname === "/reels" ? "#6366f1" : "white" }}>🎬</IconButton>
        
        {/* CENTER ACTION BUTTON */}
        <Box onClick={() => navigate("/create-reels")} sx={{ 
          background: 'linear-gradient(45deg, #6366f1, #a855f7)', 
          borderRadius: '16px', 
          p: 1, 
          display: 'flex', 
          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)' 
        }}>
          <Typography sx={{ fontSize: '1.5rem', color: 'white' }}>➕</Typography>
        </Box>

        <IconButton onClick={() => navigate(`/message/${user?.id}`)} sx={{ color: location.pathname.includes("/message") ? "#6366f1" : "white" }}>✉️</IconButton>
        <Avatar 
          onClick={() => setMobileOpen(true)} 
          src={user?.profileImage} 
          sx={{ width: 30, height: 30, cursor: 'pointer', border: '2px solid #6366f1' }}
        />
      </Box>

      {/* MOBILE DRAWER */}
      <Drawer 
        anchor="left" 
        open={mobileOpen} 
        onClose={() => setMobileOpen(false)} 
        PaperProps={{ sx: { width: "280px", bgcolor: '#0f172a', backgroundImage: 'none' } }}
      >
        {SidebarContent}
      </Drawer>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} PaperProps={{ sx: { bgcolor: '#1e293b', color: 'white' } }}>
        <MenuItem onClick={() => { setAnchorEl(null); navigate(`/profile/${user?.id}`); }}>Profile</MenuItem>
        <MenuItem onClick={handleLogout} sx={{ color: '#ef4444' }}>Logout</MenuItem>
      </Menu>
    </>
  )
}

export default Sidebar;
