import { Avatar, Card, Typography, Box, IconButton } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useDispatch, useSelector } from 'react-redux';
import { createCommentAction, likePostAction } from '../../pages/Redux/Post/post.action';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Avatar, Typography, Card } from '@mui/material'; // Adjust imports based on your structure

const PostCard = ({ item }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const [saved, setSaved] = useState(false);
  const { user: currentUser } = useSelector((store) => store.auth);
  
  // Added a state variable to manage input field safely
  const [commentInput, setCommentInput] = useState("");

  const handleLikePost = () => dispatch(likePostAction(item.id));
  const isLiked = item.liked?.some((user) => user.id === currentUser?.id);
  const handleShowComment = () => setShowComments(!showComments);
  
  const handleCreateComment = (content) => {
    dispatch(createCommentAction({ postId: item.id, data: { content } }));
  };

  // Asynchronous wrapper to intercept submission and check toxicity
  const handleCommentSubmit = async () => {
    const trimmedComment = commentInput.trim();
    if (!trimmedComment) return;

    // Clear input instantly for a snappy UI feeling
    setCommentInput("");

    try {
      const response = await fetch('/check-toxic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment: trimmedComment }),
      });

      const data = await response.json();

      if (data.toxic) {
        alert(data.message); // Replace with your UI snackbar/toast notice
        setCommentInput(trimmedComment); 
        return;
      }

      //
      handleCreateComment(trimmedComment);

    } catch (error) {
      console.error("Toxicity check failed:", error);
  
      handleCreateComment(trimmedComment);
    }
  };

  const handleUserProfileClick = () => {
    if (item?.user?.id) {
      navigate(`/profile/${item.user.id}`);
    }
  };

  const getSecureUrl = (url) => url?.replace("http://", "https://");
  const isVideo = (url) => url?.includes("/video/") || url?.match(/\.(mp4|mov|avi|wmv|webm)\$/) !== null;

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 60000);
    if (diff < 1) return "just now";
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  if (!item) return null;
  return (
    <Card sx={{
      borderRadius: '20px',
      background: '#0f1724',
      border: '1px solid rgba(255,255,255,0.06)',
      boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
      mb: 3,
      overflow: 'hidden',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
      }
    }}>

      {/* ── HEADER ── */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, pt: 2.5, pb: 1.5 }}>
        
        {/* Wrap Avatar and Name together to make them clickable */}
        <Box 
          onClick={handleUserProfileClick}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5, 
            cursor: 'pointer', // Show pointer cursor on hover
            '&:hover .user-name': { color: '#6366f1' } // Subtle color change on hover
          }}
        >
          <Avatar
            src={item.user?.profileImage}
            sx={{
              width: 42, height: 42,
              border: '2px solid rgba(99,102,241,0.6)',
              fontSize: '0.9rem',
              transition: 'opacity 0.2s',
              '&:hover': { opacity: 0.85 }
            }}
          >
            {!item.user?.profileImage && item.user?.firstName?.[0]}
          </Avatar>
          <Box>
            <Typography 
              className="user-name"
              sx={{
                fontWeight: 700,
                fontSize: '0.95rem',
                color: 'white',
                lineHeight: 1.2,
                transition: 'color 0.2s'
              }}
            >
              {item.user ? `${item.user.firstName} ${item.user.lastName}` : "User"}
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
              @{item.user?.firstName?.toLowerCase()} · {formatTime(item.createdAt)}
            </Typography>
          </Box>
        </Box>
        
        <IconButton sx={{ color: 'rgba(255,255,255,0.3)', '&:hover': { color: 'white' } }}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* ── CAPTION ── */}
      {item.caption && (
        <Box sx={{ px: 2.5, pb: 1.5 }}>
          <Typography sx={{
            color: 'rgba(255,255,255,0.75)',
            fontSize: '0.92rem',
            lineHeight: 1.6,
            fontWeight: 400
          }}>
            {item.caption}
          </Typography>
        </Box>
      )}

      {/* ── MEDIA ── */}
      {item.image && (
        <Box sx={{ px: 2, pb: 1 }}>
          <Box sx={{
            borderRadius: '14px',
            overflow: 'hidden',
            bgcolor: 'rgba(0,0,0,0.3)',
          }}>
            {isVideo(item.image) ? (
              <video
                controls muted loop playsInline
                style={{ width: '100%', maxHeight: '480px', objectFit: 'cover', display: 'block' }}
                src={getSecureUrl(item.image)}
              />
            ) : (
              <img
                src={getSecureUrl(item.image)}
                alt="post"
                style={{ width: '100%', maxHeight: '480px', objectFit: 'cover', display: 'block' }}
              />
            )}
          </Box>
        </Box>
      )}

      {/* ── ACTIONS ── */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2, py: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>

          {/* Like */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={handleLikePost}
              sx={{
                color: isLiked ? '#ef4444' : 'rgba(255,255,255,0.4)',
                '&:hover': { color: '#ef4444', bgcolor: 'rgba(239,68,68,0.08)' },
                transition: '0.2s'
              }}
            >
              {isLiked ? <FavoriteIcon sx={{ fontSize: '1.3rem' }} /> : <FavoriteBorderIcon sx={{ fontSize: '1.3rem' }} />}
            </IconButton>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', ml: -0.5 }}>
              {item.liked?.length || 0}
            </Typography>
          </Box>

          {/* Comment */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={handleShowComment}
              sx={{
                color: showComments ? '#6366f1' : 'rgba(255,255,255,0.4)',
                '&:hover': { color: '#6366f1', bgcolor: 'rgba(99,102,241,0.08)' },
                transition: '0.2s'
              }}
            >
              <ChatBubbleOutlineIcon sx={{ fontSize: '1.2rem' }} />
            </IconButton>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', ml: -0.5 }}>
              {item.comments?.length || 0}
            </Typography>
          </Box>

          {/* Share */}
          <IconButton sx={{
            color: 'rgba(255,255,255,0.4)',
            '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.05)' },
            transition: '0.2s'
          }}>
            <ShareIcon sx={{ fontSize: '1.2rem' }} />
          </IconButton>
        </Box>

        {/* Bookmark */}
        <IconButton
          onClick={() => setSaved(!saved)}
          sx={{
            color: saved ? '#6366f1' : 'rgba(255,255,255,0.4)',
            '&:hover': { color: '#6366f1', bgcolor: 'rgba(99,102,241,0.08)' },
            transition: '0.2s'
          }}
        >
          {saved ? <BookmarkIcon sx={{ fontSize: '1.2rem' }} /> : <BookmarkBorderIcon sx={{ fontSize: '1.2rem' }} />}
        </IconButton>
      </Box>
       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pt: 2, pb: 1.5 }}>
            <Avatar
              src={currentUser?.profileImage}
              sx={{ width: 32, height: 32, border: '1px solid rgba(99,102,241,0.5)' }}
            />
            <input
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCommentSubmit();
                }
              }}
              placeholder="Write a comment..."
              style={{
                flex: 1,
                backgroundColor: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                padding: '8px 16px',
                color: 'white',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </Box>
          
         
      {/* ── COMMENTS SECTION ── */}
      {showComments && (
        <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.05)', mx: 2, pb: 2 }}>

          {/* Comment Input */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pt: 2, pb: 1.5 }}>
            <Avatar
              src={currentUser?.profileImage}
              sx={{ width: 32, height: 32, border: '1px solid rgba(99,102,241,0.5)' }}
            />
            <input
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCommentSubmit();
                }
              }}
              placeholder="Write a comment..."
              style={{
                flex: 1,
                backgroundColor: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                padding: '8px 16px',
                color: 'white',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </Box>
          
          {/* Render Existing Comments */}
          {item.comments && item.comments.length > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxHeight: '250px', overflowY: 'auto', mt: 1 }}>
              {item.comments.map((comment, index) => (
                <Box key={comment.id || index} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                  <Avatar 
                    onClick={() => comment.user?.id && navigate(`/profile/${comment.user.id}`)}
                    src={comment.user?.profileImage} 
                    sx={{ width: 28, height: 28, fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    {!comment.user?.profileImage && comment.user?.firstName?.[0]}
                  </Avatar>
                  <Box sx={{ backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', p: 1, flex: 1 }}>
                    <Typography
                      onClick={() => comment.user?.id && navigate(`/profile/${comment.user.id}`)}
                      sx={{ color: 'white', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                    >
                      {comment.user ? `${comment.user.firstName} ${comment.user.lastName}` : "User"}
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', mt: 0.5 }}>
                      {comment.content}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Card>
  );
};

export default PostCard;