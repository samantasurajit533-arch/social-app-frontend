import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Box, Card, ListItem, ListItemAvatar, ListItemText, Typography, InputBase } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { searchUserAction } from '../../pages/Redux/Auth/auth.action';
import { createChatAction } from '../../pages/Redux/Post/post.action';

const SearchUser = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchUser = useSelector(store => store.auth.searchUser);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim()) {
      dispatch(searchUserAction(value));
    }
  };

  const handleSelectUser = async (userId) => {
    const chatResponse = await dispatch(createChatAction(userId));
    if (chatResponse && chatResponse.id) {
      setQuery(""); 
      navigate(`/message/${chatResponse.id}`); 
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', overflow: 'visible' }}>
      {/* 1. Glass Search Input */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        bgcolor: 'rgba(255, 255, 255, 0.05)', 
        borderRadius: '12px', 
        px: 2, 
        py: 0.5,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: '0.3s',
        '&:focus-within': { bgcolor: 'rgba(255, 255, 255, 0.1)', borderColor: '#6366f1' }
      }}>
        <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.4)', mr: 1, fontSize: '1.2rem' }} />
        <InputBase
          placeholder="Explore the network..."
          sx={{ color: 'white', fontSize: '0.85rem', width: '100%' }}
          onChange={handleSearch}
          value={query}
        />
      </Box>

      {/* 2. Floating Glass Results Panel */}
      {query && (
        <Card sx={{ 
          position: 'absolute', 
          top: '50px', 
          left: 0, 
          right: 0, 
          zIndex: 1000, 
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.95)', 
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          maxHeight: '300px', 
          overflowY: 'auto'
        }} className="no-scrollbar">
          {searchUser?.length > 0 ? (
            searchUser.map((item) => (
              <Box 
                key={item.id} 
                onClick={() => handleSelectUser(item.id)}
                sx={{ 
                  cursor: 'pointer', 
                  transition: '0.2s',
                  '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.1)' },
                  borderBottom: '1px solid rgba(255, 255, 255, 0.03)'
                }}
              >
                <ListItem sx={{ py: 1.5 }}>
                  <ListItemAvatar>
                    <Avatar 
                      src={item.image} 
                      sx={{ border: '1px solid #6366f1', width: 36, height: 36 }} 
                    />
                  </ListItemAvatar>
                  <ListItemText 
                    primary={
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>
                        {item.firstName} {item.lastName}
                      </Typography>
                    } 
                    secondary={
                      <Typography sx={{ fontSize: '0.7rem', color: '#6366f1' }}>
                        Open Direct Transmission
                      </Typography>
                    } 
                  />
                </ListItem>
              </Box>
            ))
          ) : (
             <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                  No frequency found.
                </Typography>
             </Box>
          )}
        </Card>
      )}
    </Box>
  );
};

export default SearchUser;
