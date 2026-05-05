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
  
  // Dynamic Unread Context Evaluation (Falls back to mockup data if missing from backend model)
  const unreadCount = chat?.unreadCount || 0; 
  const hasUnread = unreadCount > 0;

  if (!chat) return null;

  return (
    <div 
      onClick={() => navigate(`/message/${chat.id}`)}
      className={`flex items-center space-x-3 px-4 py-3.5 mx-1 my-0.5 rounded-xl cursor-pointer transition-all duration-200 select-none ${
        active 
          ? 'bg-slate-100/90 border-l-[3px] border-slate-800 shadow-sm' 
          : 'bg-white hover:bg-slate-50 border-l-[3px] border-transparent'
      }`}
    >
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
        sx={{ 
          '& .MuiBadge-badge': { 
            backgroundColor: '#10b981', 
            boxShadow: '0 0 0 2px white',
            width: 10,
            height: 10,
            borderRadius: '50%'
          } 
        }}
      >
        <Avatar 
          src={displayImage} 
          sx={{ 
            width: 44, 
            height: 44, 
            bgcolor: "#1e293b", 
            fontSize: '0.95rem',
            fontWeight: 600
          }}
        >
          {!displayImage && displayName.charAt(0).toUpperCase()}
        </Avatar>
      </Badge>
      
      <div className='flex-1 min-w-0 pl-1'>
        <div className='flex justify-between items-baseline mb-0.5'>
          <p className={`text-sm truncate tracking-tight ${
            hasUnread ? 'font-black text-slate-950' : 'font-bold text-slate-800'
          }`}>
            {displayName}
          </p>
          
          {/* Dynamic Badge / Timestamp Indicator */}
          {hasUnread ? (
            <span className="flex items-center justify-center bg-[#1e293b] text-white text-[10px] font-bold h-5 min-w-5 px-1.5 rounded-full animate-pulse shadow-sm">
              {unreadCount}
            </span>
          ) : (
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active
            </span>
          )}
        </div>
        
        <p className={`text-xs truncate tracking-wide ${
          hasUnread 
            ? 'text-slate-900 font-bold' 
            : active ? 'text-slate-600 font-medium' : 'text-slate-400'
        }`}>
          {chat.chat_name || "Click to chat..."}
        </p>
      </div>
    </div>
  );
};

export default UserChatCard;
