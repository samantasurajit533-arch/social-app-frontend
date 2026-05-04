import { Avatar, Card, CardActions, CardContent, CardHeader, CardMedia, Divider, IconButton, Typography } from '@mui/material';
import React, { useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { red } from '@mui/material/colors';
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

  const handleLikePost = () => {
    dispatch(likePostAction(item.id));
  };

  const isLiked = item.liked?.some((user) => user.id === currentUser?.id);
  const handleShowComment = () => setShowComments(!showComments);

  const handleCreateComment = (content) => {
    const reqData = {
      postId: item.id,
      data: { content }
    };
    dispatch(createCommentAction(reqData));
  };

  // Helper to ensure media URLs use HTTPS to prevent browser blocks
  const getSecureUrl = (url) => url?.replace("http://", "https://");

  const isVideo = (url) => {
    if (!url) return false;
    // Updated to catch all Cloudinary video patterns
    return url.includes("/video/") || url.match(/\.(mp4|mov|avi|wmv|webm)$/) !== null;
  };

  if (!item) return null;

  return (
    <Card className='!rounded-xl border border-gray-100 shadow-sm mb-5'>
      <CardHeader
        avatar={
          <Avatar 
            src={item.user?.profileImage} 
            sx={{ bgcolor: red[500] }}
          >
            {!item.user?.profileImage && item.user?.firstName?.[0]}
          </Avatar>
        }
        action={<IconButton><MoreVertIcon /></IconButton>}
        title={item.user ? `${item.user.firstName} ${item.user.lastName}` : "Unknown User"}
        subheader={`@${item.user?.firstName?.toLowerCase() || "user"}`}
      />
      
      {/* MEDIA SECTION */}
      <div className="w-full bg-[#f9f9f9] flex justify-center overflow-hidden border-y border-gray-50">
        {item.image ? (
          isVideo(item.image) ? (
            <div className="w-full bg-black flex justify-center">
              <video 
                controls 
                autoPlay // Optional: starts playing when loaded
                muted // CRITICAL: Required for browsers to allow autoplay/loading
                loop
                playsInline 
                className="w-full max-h-[500px] object-contain cursor-pointer" 
                src={getSecureUrl(item.image)}
              />
            </div>
          ) : (
            <CardMedia
              component="img"
              image={getSecureUrl(item.image)}
              alt="post content"
              sx={{ maxHeight: '500px', width: "100%", objectFit: 'contain' }}
            />
          )
        ) : null}
      </div>

      <CardContent>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: "1rem" }}>
          {item.caption}
        </Typography>
      </CardContent>

      <CardActions className='flex justify-between' disableSpacing>
        <div className='flex items-center'>
          <IconButton onClick={handleLikePost}>
            {isLiked ? <FavoriteIcon sx={{ color: "red" }} /> : <FavoriteBorderIcon />}
          </IconButton>
          
          <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, ml: -0.5, mr: 1.5 }}>
            {item.liked?.length || 0}
          </Typography>

          <IconButton onClick={handleShowComment}>
            <ChatBubbleIcon sx={{ fontSize: "1.4rem" }} />
          </IconButton>
          
          <IconButton><ShareIcon sx={{ fontSize: "1.4rem" }} /></IconButton>
        </div>
        <div>
          <IconButton><BookmarkBorderIcon sx={{ fontSize: "1.4rem" }} /></IconButton>
        </div>
      </CardActions>

      {/* COMMENTS SECTION */}
      {showComments && (
        <section className="bg-gray-50/50 pb-2">
          <Divider />
          <div className='flex items-center space-x-5 mx-4 my-4'>
            <Avatar 
                src={currentUser?.profileImage} 
                sx={{ width: "1.8rem", height: "1.8rem", bgcolor: "#1d4ed8", fontSize: "0.7rem" }}
            >
                {currentUser?.firstName?.[0]}
            </Avatar>
            <input
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim() !== "") {
                  handleCreateComment(e.target.value);
                  e.target.value = ""; 
                }
              }}
              className='w-full outline-none bg-white border border-gray-200 rounded-full px-5 py-2 text-sm focus:border-blue-400'
              type="text"
              placeholder='Write a comment...'
            />
          </div>

          <div className='px-4 space-y-3 max-h-[300px] overflow-y-auto no-scrollbar'>
            {item.comments && item.comments.length > 0 ? (
              [...item.comments].reverse().map((comment, index) => (
                <div key={comment.id || index} className='flex items-start space-x-3'>
                  <Avatar 
                    src={comment.user?.profileImage} 
                    sx={{ height: "1.7rem", width: "1.7rem", fontSize: "0.7rem" }}
                  >
                    {comment.user?.firstName?.[0]}
                  </Avatar>
                  <div className='bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm max-w-[85%]'>
                    <p className='text-[11px] font-bold text-gray-700'>{comment.user?.firstName}</p>
                    <p className='text-sm text-gray-800'>{comment.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-gray-400 text-center py-2 text-xs'>No comments yet.</p>
            )}
          </div>
        </section>
      )}
    </Card>
  );
};

export default PostCard;
