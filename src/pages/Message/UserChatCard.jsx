import React from 'react';
import { Avatar, Badge } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UserChatCard = ({ chat, auth, active }) => {
  const navigate = useNavigate();
  const myId = auth?.user?.id || auth?.id;

  
  const partner = chat?.users?.find(u => String(u.id) !== String(myId));

  // Determine name and image from the partner object
  const displayName = partner 
    ? `${partner.firstName} ${partner.lastName || ""}` 
    : "Chat User";

  const displayImage = partner?.profileImage || "";

  if (!chat) return null;

  return (
    <div 
      onClick={() => navigate(`/message/${chat.id}`)}
      className={`flex items-center space-x-3 p-4 cursor-pointer hover:bg-gray-100 transition-all border-b border-gray-100 ${
        active ? 'bg-blue-50 border-l-4 border-blue-600' : 'bg-white'
      }`}
    >
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
        sx={{ '& .MuiBadge-badge': { backgroundColor: '#44b700', boxShadow: '0 0 0 2px white' } }}
      >
        <Avatar src={displayImage} sx={{ width: 48, height: 48, bgcolor: "#1976d2" }}>
          {!displayImage && displayName.charAt(0)}
        </Avatar>
      </Badge>
      
      <div className='flex-1 min-w-0'>
        <div className='flex justify-between items-center mb-0.5'>
          <p className={`text-sm font-bold truncate ${active ? 'text-blue-700' : 'text-gray-900'}`}>
            {displayName}
          </p>
          <span className='text-[10px] text-gray-400 font-medium'>Active</span>
        </div>
        <p className='text-xs text-gray-500 truncate'>
          {chat.chat_name || "Click to chat..."}
        </p>
      </div>
    </div>
  );
};

export default UserChatCard;
