import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Avatar, Box, Tabs, Tab, Card } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import PostCard from '../../componets/Post/PostCard';
import ProfileModel from './ProfileModel';
import { findUserByIdAction } from '../Redux/Auth/auth.action';
import { followUserAction } from '../Redux/Post/post.action';


const tabs = [
  { value: "post", name: "Post" },
  { value: "reels", name: "Reels" },
  { value: "saved", name: "Saved" },
  { value: "repost", name: "Repost" }
];

const Profile = () => {
  const { id } = useParams(); 
  const dispatch = useDispatch();
  const [value, setValue] = useState('post');
  const [open, setOpen] = useState(false);
  
  // Get both logged-in user (user) and the searched profile user (reqUser)
  const { user, reqUser, loading } = useSelector(state => state.auth);
  const { posts } = useSelector(state => state.post);

  useEffect(() => {
    if (id) {
      dispatch(findUserByIdAction(id));
    }
  }, [id, dispatch]);

  const displayUser = (id === user?.id?.toString()) ? user : reqUser;

  // LOGIC: Check if the logged-in user is following the profile being viewed
 const isFollowing = user?.followings?.some(fId => String(fId) === String(displayUser?.id));


  const handleFollow = () => {
    dispatch(followUserAction(displayUser?.id));
  };

  const userPosts = posts?.filter((item) => item.user?.id === displayUser?.id) || [];

  return (
    <div className='w-full py-5'> 
      <Card className='rounded-md bg-white border'>
        <div className='h-[15rem] w-full bg-gray-200'>
          <img 
            src={displayUser?.coverPhoto || "https://pixabay.com"} 
            alt="cover" 
            className='w-full h-full object-cover rounded-t-md'
          />
        </div>

        <div className='px-5 flex justify-between items-start'>
          <Avatar 
            src={displayUser?.profileImage}
            sx={{ width: "9rem", height: "9rem", mt: "-4.5rem", border: "4px solid white", bgcolor: "#1d4ed8" }}
          >
            {!displayUser?.profileImage && displayUser?.firstName?.charAt(0)}
          </Avatar>
          
          <div className='flex gap-3 mt-4'>
            {id === user?.id?.toString() ? (
              <Button onClick={() => setOpen(true)} variant="outlined" sx={{ borderRadius: "20px" }}>
                Edit Profile
              </Button>
            ) : (
              // UPDATED: Dynamic Follow/Unfollow Button
              <Button 
                onClick={handleFollow}
                disabled={loading} 
                variant={isFollowing ? "outlined" : "contained"} 
                sx={{ borderRadius: "20px" }}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            )}
          </div>
        </div>

        <div className='p-8 text-black'>
          <h1 className='text-2xl font-bold'>
            {displayUser?.firstName} {displayUser?.lastName}
          </h1>
          <p className='text-gray-500 text-sm'>
            @{displayUser?.firstName?.toLowerCase()}_{displayUser?.lastName?.toLowerCase()}
          </p>
          
          <div className='flex gap-8 mt-4 text-md'>
            <span><b>{userPosts.length}</b> Posts</span>
            {/* These counts will update when followUserAction returns the updated user */}
            <span><b>{displayUser?.followers?.length || 0}</b> Followers</span>
            <span><b>{displayUser?.followings?.length || 0}</b> Following</span>
          </div>
        </div>
      </Card>

      <section className='mt-5 bg-white border rounded-md'>
        <Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={(e, val) => setValue(val)}>
            {tabs.map((item) => (
              <Tab key={item.value} value={item.value} label={item.name} />
            ))}
          </Tabs>
        </Box>
        
        <div className='flex justify-center p-5'>
          {value === "post" && (
            <div className='space-y-5 w-full max-w-[620px]'>
              {userPosts.length > 0 ? (
                userPosts.map((item) => <PostCard key={item.id} item={item} />)
              ) : (
                <div className='py-10 text-gray-400 text-center'>No posts found for this user.</div>
              )}
            </div>
          )}
        </div>
      </section>

      <ProfileModel open={open} handleClose={() => setOpen(false)} />
    </div>
  );
};

export default Profile;
