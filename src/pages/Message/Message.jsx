import React, { useState, useEffect, useRef } from 'react';
import { Grid, Avatar, IconButton, Backdrop, CircularProgress, Divider, useMediaQuery, useTheme } from '@mui/material';
import { West, Call as CallIcon, VideoCall as VideoCallIcon, Send, Image as ImageIcon, ArrowBackIosNew } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import UserChatCard from './UserChatCard';
import ChatMEssage from './ChatMEssage';
import SearchUser from '../../componets/SerchUser/SearchUser'; 
import { createMessageAction, getChatMessagesAction, getUsersChatAction } from '../Redux/Post/post.action';

const Message = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); 
  const scrollRef = useRef(null);
  const theme = useTheme();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [inputValue, setInputValue] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const { messages, chats, loading } = useSelector((store) => store.post);
  const auth = useSelector((store) => store.auth);

  useEffect(() => { dispatch(getUsersChatAction()); }, [dispatch]);
  useEffect(() => { if (id) dispatch(getChatMessagesAction(id)); }, [id, dispatch]);
  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const myId = auth?.user?.id || auth?.id;
  const currentChat = chats?.find(chat => String(chat.id) === String(id));
  const partner = currentChat?.users?.find(u => String(u.id) !== String(myId));
  const displayName = partner ? `${partner.firstName} ${partner.lastName || ""}` : "Chat";

  const handleSendMessage = () => {
    if ((inputValue.trim() || selectedImage) && id) {
      dispatch(createMessageAction({ chatId: id, content: inputValue, image: selectedImage }));
      setInputValue("");
      setSelectedImage("");
    }
  };

  return (
    // Height adjusted to account safely for global platform bottom navbars on mobile viewports
    <div className='h-[calc(100vh-70px)] md:h-screen w-full bg-slate-50 flex overflow-hidden font-sans antialiased'>
      <Backdrop sx={{ color: '#fff', zIndex: 1500 }} open={isUploading}><CircularProgress color="inherit" /></Backdrop>

      <Grid container className='h-full'>
        {/* SIDEBAR */}
        <Grid 
          item 
          xs={12} md={3.5} lg={3}
          className={`border-r border-slate-200 h-full flex flex-col bg-white ${isMobile && id ? 'hidden' : 'flex'}`}
        >
          <div className='p-4 space-y-4 bg-white'>
            <div className='flex items-center space-x-3'>
              <West className='cursor-pointer text-slate-600 hover:text-slate-900 transition-colors' onClick={() => navigate("/")} />
              <h1 className='text-xl font-black text-slate-900 tracking-tight'>Messages</h1>
            </div>
            <SearchUser /> 
          </div>
          <Divider sx={{ opacity: 0.6 }} />
          <div className='flex-1 overflow-y-auto px-2 py-1 space-y-1'>
            {chats?.length > 0 ? (
              chats.map((chat) => (
                <UserChatCard key={chat.id} chat={chat} auth={auth} active={String(id) === String(chat.id)} />
              ))
            ) : (
              <div className='flex flex-col items-center justify-center mt-20 text-slate-400'>
                {loading ? <CircularProgress size={20} /> : <p className='text-xs font-medium'>No active streams</p>}
              </div>
            )}
          </div>
        </Grid>

        {/* MODERN CHAT WINDOW */}
        <Grid 
          item 
          xs={12} md={8.5} lg={9}
          className={`h-full flex flex-col bg-slate-50 ${isMobile && !id ? 'hidden' : 'flex'}`}
        >
          {id ? (
            <>
              {/* Header */}
              <div className='p-4 bg-white/80 backdrop-blur-md border-b border-slate-200 flex justify-between items-center z-10 shadow-sm sticky top-0'>
                <div className='flex items-center space-x-3 min-w-0'>
                  {isMobile && (
                    <IconButton onClick={() => navigate('/message')} size="small" className="mr-1">
                      <ArrowBackIosNew sx={{ fontSize: 16, color: '#475569' }} />
                    </IconButton>
                  )}
                  <Avatar src={partner?.profileImage} sx={{ width: 38, height: 38, bgcolor: "#1e293b", fontSize: '0.9rem', fontWeight: 'bold' }}>
                    {!partner?.profileImage && displayName.charAt(0)}
                  </Avatar>
                  <div className='min-w-0'>
                    <p className='font-bold text-slate-900 text-sm truncate'>{displayName}</p>
                    <div className='flex items-center space-x-1.5'>
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                      <p className='text-[10px] text-slate-500 font-semibold tracking-wide uppercase'>Active Now</p>
                    </div>
                  </div>
                </div>
                <div className='flex space-x-1 text-slate-500'>
                  <IconButton size="small"><CallIcon sx={{ fontSize: 18 }} /></IconButton>
                  <IconButton size="small"><VideoCallIcon sx={{ fontSize: 20 }} /></IconButton>
                </div>
              </div>

              {/* Message Streams Frame */}
              <div className='flex-1 overflow-y-auto p-4 space-y-2.5 bg-slate-50/50 custom-scrollbar'>
                {messages?.map((msg, i) => (
                  <ChatMEssage 
                    key={i} 
                    message={msg} 
                    isCurrentUser={String(msg.user?.id) === String(myId)} 
                  />
                ))}
                <div ref={scrollRef} />
              </div>

              {/* Text Area Accessory Box */}
              <div className='p-4 bg-white border-t border-slate-200'>
                <div className='flex items-center space-x-2 bg-slate-100 rounded-2xl px-4 py-1.5 border border-slate-200 focus-within:border-slate-400 focus-within:bg-white transition-all'>
                  <IconButton size="small" className="text-slate-400 hover:text-slate-600">
                    <ImageIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                  <input 
                    className='flex-1 bg-transparent py-2 outline-none text-sm text-slate-800 placeholder-slate-400' 
                    placeholder='Write your message...' 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} 
                  />
                  <IconButton 
                    onClick={handleSendMessage} 
                    disabled={!inputValue.trim() && !selectedImage}
                    size="small"
                    sx={{
                      backgroundColor: inputValue.trim() ? '#1e293b' : 'transparent',
                      color: inputValue.trim() ? 'white' : '#94a3b8',
                      '&:hover': { backgroundColor: inputValue.trim() ? '#334155' : 'transparent' },
                      transition: 'all 0.2s'
                    }}
                  >
                    <Send sx={{ fontSize: 16 }} />
                  </IconButton>
                </div>
              </div>
            </>
          ) : (
            /* Blank Slate Window */
            <div className='h-full flex flex-col items-center justify-center text-slate-400 bg-white p-6 text-center'>
              <div className="p-4 bg-slate-50 rounded-3xl mb-4 border border-slate-100">
                <Send sx={{ fontSize: 42, transform: 'rotate(-20deg)', color: '#64748b' }} />
              </div>
              <h2 className='text-xl font-black text-slate-800 tracking-tight mb-1'>SnapTalk Inbox</h2>
              <p className='text-xs text-slate-500 max-w-xs leading-relaxed'>Select a connection from the left sidebar panel to begin an encrypted session window.</p>
            </div>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Message;
