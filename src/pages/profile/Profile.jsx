import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Avatar, Box, Tabs, Tab, Card, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import PostCard from '../../componets/Post/PostCard';
import ProfileModel from './ProfileModel';
import { findUserByIdAction } from '../Redux/Auth/auth.action';
import { followUserAction } from '../Redux/Post/post.action';

const tabs = [
  { value: "post", name: "Archives" }, // Renamed for unique feel
  { value: "reels", name: "Transmissions" },
  { value: "saved", name: "Bookmarks" },
  { value: "repost", name: "Shared" }
];

const Profile = () => {
  const { id } = useParams(); 
  const dispatch = useDispatch();
  const [value, setValue] = useState('post');
  const [open, setOpen] = useState(false);
  
  const { user, reqUser, loading } = useSelector(state => state.auth);
  const { posts } = useSelector(state => state.post);

  useEffect(() => {
    if (id) dispatch(findUserByIdAction(id));
  }, [id, dispatch]);

  const displayUser = (id === user?.id?.toString()) ? user : reqUser;
  const isFollowing = user?.followings?.some(fId => String(fId) === String(displayUser?.id));

  const handleFollow = () => dispatch(followUserAction(displayUser?.id));
  const userPosts = posts?.filter((item) => item.user?.id === displayUser?.id) || [];

  return (
    <Box sx={{ width: '100%', py: 2, color: 'white' }}> 
      {/* 1. PROFILE HUB: Deep Glass Card */}
      <Card sx={{ 
        borderRadius: '32px', 
        background: 'rgba(30, 41, 59, 0.4)', 
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        overflow: 'hidden'
      }}>
        {/* Cover Photo with Overlay */}
        <Box sx={{ height: '18rem', width: '100%', position: 'relative' }}>
          <img 
            src={displayUser?.coverPhoto || "https://unsplash.com"} 
            alt="cover" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, rgba(7, 9, 13, 0.8))' }} />
        </Box>

        <Box sx={{ px: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: '-5rem', position: 'relative', zIndex: 2 }}>
          <Avatar 
            src={displayUser?.profileImage}
            sx={{ 
                width: "10rem", height: "10rem", 
                border: "6px solid #07090d", 
                boxShadow: '0 0 30px rgba(99, 102, 241, 0.4)',
                bgcolor: "#6366f1" 
            }}
          >
            {displayUser?.firstName?.charAt(0)}
          </Avatar>
          
          <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
            {id === user?.id?.toString() ? (
              <Button 
                onClick={() => setOpen(true)} 
                sx={{ borderRadius: "12px", px: 4, py: 1, border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontWeight: 700 }}
              >
                Edit Identity
              </Button>
            ) : (
              <Button 
                onClick={handleFollow}
                disabled={loading} 
                sx={{ 
                    borderRadius: "12px", px: 4, py: 1, fontWeight: 800,
                    background: isFollowing ? 'transparent' : 'linear-gradient(45deg, #6366f1, #a855f7)',
                    border: isFollowing ? '1px solid #6366f1' : 'none',
                    color: 'white',
                    boxShadow: isFollowing ? 'none' : '0 4px 15px rgba(99, 102, 241, 0.4)'
                }}
              >
                {isFollowing ? "Linked" : "Connect"}
              </Button>
            )}
          </Box>
        </Box>

        <Box sx={{ p: 5, pt: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-1px' }}>
            {displayUser?.firstName} {displayUser?.lastName}
          </Typography>
          <Typography sx={{ color: '#6366f1', fontWeight: 600, mb: 3 }}>
            @{displayUser?.firstName?.toLowerCase()}_vortex
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 6 }}>
            <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 900, fontSize: '1.2rem' }}>{userPosts.length}</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>LOGS</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 900, fontSize: '1.2rem' }}>{displayUser?.followers?.length || 0}</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>NODES</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 900, fontSize: '1.2rem' }}>{displayUser?.followings?.length || 0}</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>SIGNALS</Typography>
            </Box>
          </Box>
        </Box>
      </Card>

      {/* 2. CONTENT TABS: Glass Seamless Integration */}
      <Box sx={{ mt: 4, background: 'rgba(30, 41, 59, 0.2)', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
        <Box sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)', px: 2 }}>
          <Tabs 
            value={value} 
            onChange={(e, val) => setValue(val)}
            TabIndicatorProps={{ style: { background: '#6366f1', height: '3px', borderRadius: '3px' } }}
            sx={{ '& .MuiTab-root': { color: 'rgba(255,255,255,0.4)', fontWeight: 700, fontSize: '0.8rem' }, '& .Mui-selected': { color: 'white !important' } }}
          >
            {tabs.map((item) => (
              <Tab key={item.value} value={item.value} label={item.name} />
            ))}
          </Tabs>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          {value === "post" && (
            <Box sx={{ width: '100%', maxW: '650px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {userPosts.length > 0 ? (
                userPosts.map((item) => <PostCard key={item.id} item={item} />)
              ) : (
                <Typography sx={{ py: 10, color: 'rgba(255,255,255,0.2)', textAlign: 'center', fontWeight: 600 }}>
                  NO DATA TRANSMISSIONS FOUND.
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Box>

      <ProfileModel open={open} handleClose={() => setOpen(false)} />
    </Box>
  );
};

export default Profile;
