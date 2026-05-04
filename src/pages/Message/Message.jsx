import React, { useState, useEffect, useRef } from 'react';
import { Grid, Avatar, IconButton, Backdrop, CircularProgress, Divider } from '@mui/material';
import { West, Call as CallIcon, VideoCall as VideoCallIcon, Send, Image as ImageIcon, Close } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import UserChatCard from './UserChatCard';
import ChatMEssage from './ChatMEssage';
import SearchUser from '../../componets/SerchUser/SearchUser'; 
import { uploadToCloudniry } from '../../utils/uploadToCloudniry';
import { createMessageAction, getChatMessagesAction, getUsersChatAction } from '../Redux/Post/post.action';
import { CREATE_MESSAGE_SUCCESS } from '../Redux/Post/post.actionType';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const Message = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); 
  const scrollRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const { messages, chats, loading } = useSelector((store) => store.post);
  const auth = useSelector((store) => store.auth);

  useEffect(() => { dispatch(getUsersChatAction()); }, [dispatch]);
  useEffect(() => { if (id) dispatch(getChatMessagesAction(id)); }, [id, dispatch]);
  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Robust Partner Logic for Header
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
    <div className='h-screen w-full bg-white flex overflow-hidden'>
      <Backdrop sx={{ color: '#fff', zIndex: 1500 }} open={isUploading}><CircularProgress color="inherit" /></Backdrop>

      <Grid container className='h-full'>
        {/* SIDEBAR */}
        <Grid item xs={3} className='border-r border-gray-200 h-full flex flex-col'>
          <div className='p-4 space-y-4 bg-white'>
            <div className='flex items-center space-x-3'>
              <West className='cursor-pointer text-gray-600' onClick={() => navigate("/")} />
              <h1 className='text-xl font-bold'>Messages</h1>
            </div>
            <SearchUser /> 
          </div>
          <Divider />
          <div className='flex-1 overflow-y-auto custom-scrollbar'>
            {chats && chats.length > 0 ? (
              chats.map((chat) => (
                <UserChatCard key={chat.id} chat={chat} auth={auth} active={String(id) === String(chat.id)} />
              ))
            ) : (
              <div className='flex flex-col items-center justify-center mt-20 text-gray-400'>
                {loading ? <CircularProgress size={24} /> : <p className='text-sm'>No conversations yet</p>}
              </div>
            )}
          </div>
        </Grid>

        {/* CHAT WINDOW */}
        <Grid item xs={9} className='h-full flex flex-col bg-[#f0f2f5]'>
          {id ? (
            <>
              <div className='p-3 bg-white border-b flex justify-between items-center z-10 shadow-sm'>
                <div className='flex items-center space-x-3'>
                  <Avatar src={partner?.profileImage} sx={{ width: 42, height: 42, bgcolor: "#1976d2" }}>
                    {!partner?.profileImage && displayName.charAt(0)}
                  </Avatar>
                  <div>
                    <p className='font-bold text-gray-800 text-sm'>{displayName}</p>
                    <p className='text-[10px] text-green-500 font-bold'>online</p>
                  </div>
                </div>
                <div className='flex space-x-4 text-gray-400'>
                  <IconButton size="small"><CallIcon fontSize="small"/></IconButton>
                  <IconButton size="small"><VideoCallIcon fontSize="small"/></IconButton>
                </div>
              </div>

              <div className='flex-1 overflow-y-auto p-4 space-y-3 bg-[#e5ddd5]'>
                {messages?.map((msg, i) => (
                  <ChatMEssage 
                    key={i} 
                    message={msg} 
                    isCurrentUser={String(msg.user?.id) === String(myId)} 
                  />
                ))}
                <div ref={scrollRef} />
              </div>

              <div className='p-3 bg-white border-t'>
                <div className='flex items-center space-x-2 bg-gray-100 rounded-full px-4 border border-gray-200'>
                  <input 
                    className='flex-1 bg-transparent py-2.5 outline-none text-sm' 
                    placeholder='Type a message...' 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} 
                  />
                  <IconButton onClick={handleSendMessage} disabled={!inputValue.trim()}><Send sx={{ color: "#1976d2" }} /></IconButton>
                </div>
              </div>
            </>
          ) : (
            <div className='h-full flex flex-col items-center justify-center text-gray-400 bg-white'>
              <Send sx={{ fontSize: 100, opacity: 0.1, mb: 2 }} />
              <h2 className='text-3xl font-bold text-gray-800'>SnapTalk Web</h2>
            </div>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Message;
