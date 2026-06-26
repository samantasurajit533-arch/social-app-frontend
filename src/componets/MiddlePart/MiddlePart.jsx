import React, { useEffect, useState, useContext } from 'react';
import { Card, Avatar, Box, Typography } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import VideocamIcon from '@mui/icons-material/Videocam';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useDispatch, useSelector } from 'react-redux';
import StoryCircle from './StoryCircle';
import PostCard from '../Post/PostCard';
import CreatePostModel1 from '../CreatePostModel/CreatePostModel1';
import { getAllPostAction, getAllStoriesAction } from '../../pages/Redux/Post/post.action';
import { MoodContext } from '../../pages/HomePage/HomePage';

const MiddlePart = () => {
  const dispatch = useDispatch();
  
  // Select safely with precise fallback structures
  const posts = useSelector(store => store.post?.posts);
  const stories = useSelector(store => store.post?.stories);
  const user = useSelector(store => store.auth?.user);
  const context = useContext(MoodContext);
  const blockFilters = context?.blockFilters || [];

  const [openCreatePostModal, setOpenCreatePostModal] = useState(false);
  const [displayedPosts, setDisplayedPosts] = useState([]);

  useEffect(() => {
    dispatch(getAllPostAction());
    dispatch(getAllStoriesAction());
  }, [dispatch]);

  useEffect(() => {
    if (posts && posts.length > 0) {
      setDisplayedPosts(
        blockFilters.length > 0 
          ? posts.filter(post => !blockFilters.includes(post.category)) 
          : posts
      );
    } else {
      setDisplayedPosts([]);
    }
  }, [blockFilters, posts]);

  return (
    <Box sx={{ width: '100%', py: 2 }}>
      
      {/* Story Tray Container */}
      <section 
        style={{ 
          display: 'block', // Changed to block to let internal flex wrapper manage dimensions safely
          padding: '16px', 
          background: 'rgba(255,255,255,0.03)', 
          borderRadius: '24px', 
          backdropFilter: 'blur(10px)', 
          border: '1px solid rgba(255,255,255,0.1)', 
          overflowX: 'auto', 
          marginBottom: '24px',
        }} 
        className="no-scrollbar"
      >
        {/* Added min-w-max to ensure elements never compress or overlap horizontally */}
        <div className="flex space-x-5 min-w-max items-center">
          <StoryCircle isCreateNew={true} image={user?.profileImage} />
          {stories && stories.length > 0 && stories.map((item, index) => (
            <StoryCircle 
              key={item.id || `story-${index}`} 
              hasStory={true} 
              image={item.image} 
              username={item.user?.firstName || "User"} 
            />
          ))}
        </div>
      </section>

      {/* Create Post Card */}
      <Card sx={{ p: 3, background: 'rgba(30,41,59,0.4)', borderRadius: '24px', boxShadow: 'none', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center space-x-4">
          <Avatar src={user?.profileImage} sx={{ width: 48, height: 48, border: '2px solid #6366f1', flexShrink: 0 }}>
            {user?.firstName?.charAt(0) || "U"}
          </Avatar>
          <Box 
            onClick={() => setOpenCreatePostModal(true)} 
            sx={{ 
              flex: 1, 
              bgcolor: 'rgba(255,255,255,0.05)', 
              borderRadius: '12px', 
              px: 3, 
              py: 1.5, 
              cursor: 'pointer', 
              color: 'rgba(255,255,255,0.6)', 
              transition: '0.3s', 
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
            }}
          >
            What's the news, {user?.firstName || 'User'}?
          </Box>
        </div>
        <div className="flex justify-between mt-5 pt-3 border-t border-white/5">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setOpenCreatePostModal(true)}>
            <ImageIcon sx={{ color: '#38bdf8' }} />
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>Photos</Typography>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setOpenCreatePostModal(true)}>
            <VideocamIcon sx={{ color: '#f472b6' }} />
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>Videos</Typography>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setOpenCreatePostModal(true)}>
            <AutoAwesomeIcon sx={{ color: '#fbbf24' }} />
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>Ideas</Typography>
          </div>
        </div>
      </Card>

      {/* Posts Feed */}
      <div className="mt-8 space-y-8 pb-4">
        {displayedPosts && displayedPosts.length > 0 ? (
          displayedPosts.map((item, index) => (
            <PostCard key={item.id || `post-${index}`} item={item} />
          ))
        ) : (
          <Box sx={{ textAlign: 'center', py: 10, opacity: 0.3 }}>
            <AutoAwesomeIcon sx={{ fontSize: 40, mb: 2 }} />
            <Typography>No transmissions found in the network.</Typography>
          </Box>
        )}
      </div>

      <CreatePostModel1 handleClose={() => setOpenCreatePostModal(false)} open={openCreatePostModal} />
    </Box>
  );
};

export default MiddlePart;
