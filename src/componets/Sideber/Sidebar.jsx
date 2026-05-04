import React, { useState } from 'react'
import { navigationMenu } from './SidebarNavigation'
import { Avatar, Button, Divider, Menu, MenuItem, Drawer, Box } from '@mui/material'
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
    if (item.title === "Message") {
      navigate(`/message/${user?.id}`); 
    } else if (item.title === "Profile") {
      navigate(`/profile/${user?.id}`);
    } else {
      // Ensure this matches your Route path in HomePage.jsx
      navigate(item.path.toLowerCase()); 
    }
    setMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    window.location.reload();
  };

  // Shared UI for both Desktop Sidebar and Mobile Drawer
  const SidebarContent = (
    <div className='flex flex-col justify-between h-full py-5 bg-white'>
      <div className='space-y-6 pl-4'>
        <div className='pb-4 pl-2'>
          <span className='logo font-bold text-2xl text-blue-600 tracking-tight italic'>SnapTalk</span>
        </div>
        <div className="space-y-2">
          {navigationMenu.map((item, index) => (
            <div 
              key={index} 
              onClick={() => handleNavigate(item)}
              className={`cursor-pointer flex space-x-4 items-center p-3 rounded-full transition-all mr-4 ${
                location.pathname === item.path ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <p className='text-lg font-semibold'>{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='px-4'>
        <Divider/>
        <div className='flex items-center justify-between pt-5'>
          <div className='flex items-center space-x-3'>
            <Avatar src={user?.profileImage} sx={{ width: 45, height: 45 }}>
              {user?.firstName?.[0]}
            </Avatar>
            <div>
              <p className='font-bold text-sm leading-tight'>
                {user ? `${user.firstName} ${user.lastName}` : "User"}
              </p>
              <p className='opacity-60 text-xs'>
                {user ? `@${user.firstName.toLowerCase()}` : "@username"}
              </p>
            </div>
          </div>
          <Button onClick={(e) => setAnchorEl(e.currentTarget)}><MoreVertIcon/></Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* --- DESKTOP SIDEBAR (Visible md and up) --- */}
      <div className='hidden md:flex flex-col card h-screen sticky top-0 border-r border-gray-200 w-64'>
        {SidebarContent}
      </div>

      {/* --- MOBILE BOTTOM NAVIGATION --- */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-200 px-2 py-3 flex justify-around items-center z-[100] safe-area-bottom shadow-2xl">
        
        <button onClick={() => navigate("/")} className={`flex flex-col items-center transition-all active:scale-90 ${location.pathname === "/" ? "text-blue-600" : "text-gray-500"}`}>
          <span className="text-3xl">🏠</span>
        </button>

        <button onClick={() => navigate("/reels")} className={`flex flex-col items-center transition-all active:scale-90 ${location.pathname === "/reels" ? "text-blue-600" : "text-gray-500"}`}>
          <span className="text-3xl">🎬</span>
        </button>

        {/* Center Create Button */}
        <button onClick={() => navigate("/create-reels")} className="flex flex-col items-center active:scale-90 transition-transform">
          <div className="bg-blue-600 text-white rounded-2xl p-1.5 shadow-lg shadow-blue-200 flex items-center justify-center">
            <span className="text-3xl">➕</span>
          </div>
        </button>

        <button onClick={() => navigate(`/message/${user?.id}`)} className={`flex flex-col items-center transition-all active:scale-90 ${location.pathname.includes("/message") ? "text-blue-600" : "text-gray-500"}`}>
          <span className="text-3xl">✉️</span>
        </button>

        {/* Profile Avatar - Tapping this opens the Drawer */}
        <button onClick={() => setMobileOpen(true)} className="active:scale-90 transition-transform flex items-center justify-center">
           <Avatar 
             src={user?.profileImage} 
             sx={{ 
               width: 32, 
               height: 32, 
               border: location.pathname.includes("/profile") ? "2px solid #2563eb" : "2px solid transparent" 
             }}
           >
             {user?.firstName?.[0]}
           </Avatar>
        </button>
      </div>

      {/* --- MOBILE DRAWER (Left Slide Menu) --- */}
      <Drawer 
        anchor="left" 
        open={mobileOpen} 
        onClose={() => setMobileOpen(false)} 
        PaperProps={{ sx: { width: "280px" } }}
      >
        <Box sx={{ height: '100%' }}>
          {SidebarContent}
        </Box>
      </Drawer>

      {/* Profile/Logout Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={() => { setAnchorEl(null); navigate(`/profile/${user?.id}`); }}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  )
}

export default Sidebar;
