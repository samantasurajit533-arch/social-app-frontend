import { Grid } from '@mui/material';
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
    <div className="bg-[#f9f9f9] min-h-screen">
      <Grid container spacing={0} className="justify-center">
        
        {/* SIDEBAR (Now handles both Desktop & Mobile) */}
        <Grid item md={3} lg={2.5} className="relative">
          {/* Note: md:block is removed here because Sidebar handles its own visibility internally */}
          <div className="md:sticky md:top-0 md:h-screen bg-white">
            <Sidebar />
          </div>
        </Grid>

        {/* MIDDLE CONTENT */}
        <Grid
          item
          xs={12}
          md={9}
          lg={isHomePage ? 6 : 9.5}
          // Added padding-bottom on mobile (pb-20) to clear the bottom nav
          className="flex justify-center pb-20 md:pb-0" 
        >
          <div className={`w-full bg-white min-h-screen ${
              isHomePage ? 'max-w-[650px] border-x border-gray-100' : 'w-full'
            }`}
          >
            <Routes>
              <Route path="/" element={<MiddlePart />} />
              <Route path="/reels" element={<Reels />} />
              <Route path="/create-reels" element={<CreateReelsFrom />} />
              <Route path="/message/:id" element={<Message />} />
              <Route path="/profile/:id" element={<Profile />} />
            </Routes>
          </div>
        </Grid>

        {/* RIGHT SIDEBAR (HOME ONLY) */}
        {isHomePage && (
          <Grid item lg={3.5} className="hidden lg:block">
            <div className="sticky top-0 h-screen p-5">
              <HomeRight />
            </div>
          </Grid>
        )}

      </Grid>
    </div>
  );
};

export default HomePage;
