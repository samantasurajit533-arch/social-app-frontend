import { Avatar, Card, CardActions, CardContent, CardHeader, CardMedia, Divider, IconButton, Typography, Box } from '@mui/material';
import React, { useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { useDispatch, useSelector } from 'react-redux';
import { createCommentAction, likePostAction } from '../../pages/Redux/Post/post.action';

const PostCard = ({ item }) => {
  const dispatch = useDispatch();
  const [showComments, setShowComments] = useState(false);
  const { user: currentUser } = useSelector((store) => store.auth);

  const handleLikePost = () => dispatch(likePostAction(item.id));
  const isLiked = item.liked?.some((user) => user.id === currentUser?.id);
  const handleShowComment = () => setShowComments(!showComments);

  const handleCreateComment = (content) => {
    dispatch(createCommentAction({ postId: item.id, data: { content } }));
  };

  const getSecureUrl = (url) => url?.replace("http://", "https://");
  const isVideo = (url) => url?.includes("/video/") || url?.match(/\.(mp4|mov|avi|wmv|webm)$/) !== null;

  if (!item) return null;

  return (
    <Card sx={{ 
      borderRadius: '24px', 
      background: 'rgba(30, 41, 59, 0.6)', 
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
      mb: 4,
      overflow: 'hidden'
    }}>
      <CardHeader
        avatar={
          <Avatar src={item.user?.profileImage} sx={{ border: '2px solid #6366f1' }}>
            {!item.user?.profileImage && item.user?.firstName?.[0]}
          </Avatar>
        }
        action={<IconButton sx={{ color: 'white' }}><MoreVertIcon /></IconButton>}
        title={<Typography sx={{ fontWeight: 700, color: 'white' }}>{item.user ? `${item.user.firstName} ${item.user.lastName}` : "User"}</Typography>}
        subheader={<Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>{`@${item.user?.firstName?.toLowerCase()}`}</Typography>}
      />
      
      {/* MEDIA: Rounded with Padding for "Bento" look */}
      <Box sx={{ px: 2 }}>
        <Box sx={{ 
          width: '100%', 
          borderRadius: '16px', 
          overflow: 'hidden', 
          bgcolor: 'rgba(0,0,0,0.2)',
          display: 'flex',
          justifyContent: 'center'
        }}>
          {item.image && (
            isVideo(item.image) ? (
              <video controls muted loop playsInline className="w-full max-h-[500px] object-contain" src={getSecureUrl(item.image)} />
            ) : (
              <CardMedia component="img" image={getSecureUrl(item.image)} alt="content" sx={{ maxHeight: '500px', width: "100%", objectFit: 'cover' }} />
            )
          )}
        </Box>
      </Box>

      <CardContent>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: "0.95rem", lineHeight: 1.6 }}>
          {item.caption}
        </Typography>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={handleLikePost} sx={{ color: isLiked ? '#ef4444' : 'white' }}>
            {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <Typography variant="subtitle2" sx={{ color: 'white' }}>{item.liked?.length || 0}</Typography>

          <IconButton onClick={handleShowComment} sx={{ color: 'white' }}>
            <ChatBubbleIcon sx={{ fontSize: '1.2rem' }} />
          </IconButton>
          
          <IconButton sx={{ color: 'white' }}><ShareIcon sx={{ fontSize: '1.2rem' }} /></IconButton>
        </Box>
        <IconButton sx={{ color: 'white' }}><BookmarkBorderIcon /></IconButton>
      </CardActions>

      {/* COMMENTS: Neon/Dark Theme */}
      {showComments && (
        <Box sx={{ bgcolor: 'rgba(0,0,0,0.2)', pt: 1, pb: 2 }}>
          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 3, my: 2 }}>
            <Avatar src={currentUser?.profileImage} sx={{ width: 32, height: 32, border: '1px solid #6366f1' }} />
            <input
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim() !== "") {
                  handleCreateComment(e.target.value);
                  e.target.value = ""; 
                }
              }}
              style={{ 
                width: '100%', 
                backgroundColor: 'rgba(255,255,255,0.05)', 
                border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '12px', 
                padding: '10px 15px', 
                color: 'white', 
                outline: 'none' 
              }}
              placeholder='Add a transmission...'
            />
          </Box>

          <Box sx={{ px: 3, spaceY: 2, maxHeight: '250px', overflowY: 'auto' }} className="no-scrollbar">
            {item.comments?.length > 0 ? (
              [...item.comments].reverse().map((comment, index) => (
                <Box key={comment.id || index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Avatar src={comment.user?.profileImage} sx={{ height: 28, width: 28 }} />
                  <Box sx={{ bgcolor: 'rgba(255,255,255,0.05)', px: 2, py: 1, borderRadius: '14px', border: '1px solid rgba(255,255,255,0.03)' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#6366f1', display: 'block' }}>{comment.user?.firstName}</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>{comment.content}</Typography>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>Silence in the thread.</Typography>
            )}
          </Box>
        </Box>
      )}
    </Card>
  );
};

export default PostCard;
