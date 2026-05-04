import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Card, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { searchUserAction } from '../../pages/Redux/Auth/auth.action';
import { createChatAction } from '../../pages/Redux/Post/post.action';

const SearchUser = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // FIXED: Looking in store.auth.searchUser
  const searchUser = useSelector(store => store.auth.searchUser);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim()) {
      dispatch(searchUserAction(value));
    }
  };

  const handleSelectUser = async (userId) => {
    // 1. Get the Chat Room ID from backend
    const chatResponse = await dispatch(createChatAction(userId));

    if (chatResponse && chatResponse.id) {
      setQuery(""); 
      // 2. Navigate to ROOM ID (e.g. /message/10) to fix 400 error
      navigate(`/message/${chatResponse.id}`); 
    }
  };

  return (
    <div className='relative w-full overflow-visible'>
      <input
        type="text"
        placeholder="search user..."
        className='bg-gray-50 border border-gray-200 outline-none px-10 py-2 rounded-full w-full focus:border-blue-500 text-sm text-black'
        onChange={handleSearch}
        value={query}
      />

      {query && (
        <Card className='absolute top-11 left-0 right-0 z-[100] shadow-2xl border border-gray-100 max-h-60 overflow-y-auto bg-white'>
          {searchUser?.length > 0 ? (
            searchUser.map((item) => (
              <div 
                key={item.id} 
                className='hover:bg-gray-100 cursor-pointer border-b border-gray-50 last:border-0'
                onClick={() => handleSelectUser(item.id)}
              >
                <ListItem>
                  <ListItemAvatar>
                    <Avatar src={item.image} />
                  </ListItemAvatar>
                  <ListItemText 
                    primary={<span className='text-sm font-bold text-black'>{item.firstName} {item.lastName}</span>} 
                    secondary={<span className='text-xs text-gray-500'>Click to message</span>} 
                  />
                </ListItem>
              </div>
            ))
          ) : (
             <div className='p-4 text-center text-xs text-gray-400'>No results found</div>
          )}
        </Card>
      )}
    </div>
  );
};

export default SearchUser;
