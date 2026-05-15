import React, { useEffect } from 'react';
import SearchUser from '../SerchUser/SearchUser';
import PopularUserCard from './PopularUserCard';
import { Card, CircularProgress, Box, Typography, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { searchUserAction } from '../../pages/Redux/Auth/auth.action';

const HomeRight = () => {
  const dispatch = useDispatch();
  
  // Get search results and current user from Redux
  const { searchUser, loading, user: currentUser } = useSelector(store => store.auth);

  useEffect(() => {
    // Initial search for suggestions
    dispatch(searchUserAction("a")); 
  }, [dispatch]);

  // Filter out the current logged-in user from the suggestions list
  const suggestions = searchUser?.filter(user => user.id !== currentUser?.id) || [];

  return (
    <Box sx={{ display: { xs: 'none', lg: 'block' }, width: '100%', px: 2 }}> 
      {/* 1. STICKY WRAPPER: Ensures the sidebar stays in view during scroll */}
      <Box sx={{ position: 'sticky', top: 20, display: 'flex', flexDirection: 'column', gap: 3 }}>
        
        {/* SEARCH BAR SECTION */}
        <Box sx={{ 
          bgcolor: 'rgba(30, 41, 59, 0.5)', 
          borderRadius: '16px', 
          p: 1,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <SearchUser />
        </Box>
        
        {/* SUGGESTIONS CARD */}
        <Card sx={{ 
          p: 3, 
          background: 'rgba(30, 41, 59, 0.5)', 
          borderRadius: '24px', 
          boxShadow: 'none',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography sx={{ 
              fontSize: '0.75rem', 
              fontWeight: 800, 
              color: 'rgba(255,255,255,0.5)', 
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Discover People
            </Typography>
            <Button size="small" sx={{ fontWeight: 700, color: '#6366f1', textTransform: 'none' }}>
              View All
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}> 
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={20} thickness={5} sx={{ color: '#6366f1' }} />
              </Box>
            ) : suggestions.length > 0 ? (
              suggestions.slice(0, 5).map((item) => (
                <Box key={item.id} sx={{ 
                  borderRadius: '12px', 
                  transition: '0.3s',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                }}> 
                  <PopularUserCard user={item} />
                </Box>
              ))
            ) : (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>
                  No one new to follow
                </Typography>
              </Box>
            )}
          </Box>
        </Card>

        {/* OPTIONAL: Small Footer Links */}
        <Box sx={{ px: 2, display: 'flex', flexWrap: 'wrap', gap: 2, opacity: 0.3 }}>
           <Typography variant="caption" sx={{ color: 'white', cursor: 'pointer' }}>Privacy</Typography>
           <Typography variant="caption" sx={{ color: 'white', cursor: 'pointer' }}>Terms</Typography>
           <Typography variant="caption" sx={{ color: 'white', cursor: 'pointer' }}>SnapTalk © 2026</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default HomeRight;
