import React, { useEffect, useState } from 'react';
import { Card, IconButton, Avatar } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import VideocamIcon from '@mui/icons-material/Videocam';
import { useDispatch, useSelector } from 'react-redux';

// Components
import StoryCircle from './StoryCircle';
import PostCard from '../Post/PostCard';
import CreatePostModel1 from '../CreatePostModel/CreatePostModel1';

// Actions
import { getAllPostAction, getAllStoriesAction } from '../../pages/Redux/Post/post.action';

const MiddlePart = () => {
  const dispatch = useDispatch();
  
  // 1. Selector Fix: Providing a fallback to empty arrays [] 
  // This prevents "Cannot read properties of undefined (reading 'map')"
  const { posts = [], stories = [] } = useSelector(store => store.post || {});
  const { user } = useSelector(store => store.auth || {});

  const [openCreatePostModal, setOpenCreatePostModal] = useState(false);

  const handleCloseCreatePostModal = () => setOpenCreatePostModal(false);
  const handleOpenCreatePostModal = () => setOpenCreatePostModal(true);

  useEffect(() => {
    // 2. Refresh both feeds on component mount
    dispatch(getAllPostAction());
    dispatch(getAllStoriesAction());
  }, [dispatch]);

  return (
    <div className='w-full py-5'>
      
      {/* Stories Section */}
      <section className='flex items-center p-4 bg-white rounded-xl border border-gray-100 overflow-x-auto no-scrollbar shadow-sm mb-6'>
        <div className="flex space-x-4">
           
           {/* 3. "New Story" Trigger Component */}
           <StoryCircle 
             isCreateNew={true} 
             image={user?.profileImage} 
           />

           {/* 4. Mapping Stories safely */}
           {stories && stories.length > 0 && stories.map((item, index) => (
             <StoryCircle 
                key={item.id || index} 
                hasStory={true} 
                image={item.image} 
                username={item.user?.firstName || "User"} 
             />
           ))}
        </div>
      </section>

      {/* Create Post Trigger Card */}
      <Card className="p-5 shadow-sm border border-gray-100 !rounded-xl">
        <div className='flex items-center space-x-4'>
          <Avatar 
            src={user?.profileImage} 
            sx={{ bgcolor: "#1d4ed8" }}
          >
            {user?.firstName?.charAt(0) || "U"}
          </Avatar>
          <input 
            readOnly 
            onClick={handleOpenCreatePostModal}
            placeholder={`What's on your mind, ${user?.firstName || 'User'}?`}
            className='outline-none w-full rounded-full bg-gray-50 border border-gray-200 px-5 py-3 cursor-pointer hover:bg-gray-100 transition-all' 
            type='text'
          />
        </div>
        <div className='flex justify-around mt-5 border-t pt-3'>
          <div className='flex items-center space-x-2 cursor-pointer group' onClick={handleOpenCreatePostModal}>
            <IconButton color='primary'><ImageIcon /></IconButton>
            <span className='text-sm font-bold text-gray-500 group-hover:text-blue-500'>Media</span>
          </div>
          <div className='flex items-center space-x-2 cursor-pointer group' onClick={handleOpenCreatePostModal}>
            <IconButton color='secondary'><VideocamIcon /></IconButton>
            <span className='text-sm font-bold text-gray-500 group-hover:text-purple-500'>Video</span>
          </div>
        </div>
      </Card>

      {/* The Post Feed */}
      <div className='mt-6 space-y-6 pb-20'>
        {/* We use [...posts] to create a shallow copy if we need to sort or reverse */}
        {posts && posts.length > 0 ? (
          posts.map((item, index) => (
            <PostCard key={item.id || `post-${index}`} item={item} />
          ))
        ) : (
          <div className='flex flex-col items-center justify-center py-10 opacity-50'>
             <p className='text-gray-500 font-medium'>No posts found.</p>
          </div>
        )}
      </div>

      {/* Modal for creating a Post */}
      <CreatePostModel1 
        handleClose={handleCloseCreatePostModal} 
        open={openCreatePostModal} 
      />
    </div>
  );
};

export default MiddlePart;
