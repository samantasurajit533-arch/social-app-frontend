import { Avatar, Button, CardHeader } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { followUserAction } from '../../pages/Redux/Post/post.action'


const PopularUserCard = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // FIXED: Specifically select the auth slice
  const auth = useSelector(store => store.auth);
  
  // Safe access using optional chaining
  const isFollowing = auth.user?.followings?.includes(user?.id);
  const isSelf = auth.user?.id === user?.id;

  const handleFollow = () => {
    dispatch(followUserAction(user.id));
  };

  return (
    <CardHeader
      sx={{ padding: "8px 0" }}
      avatar={
        <Avatar 
          src={user?.profileImage}
          sx={{ bgcolor: "#2196f3", width: 38, height: 38, cursor: "pointer" }}
          onClick={() => navigate(`/profile/${user?.id}`)}
        >
          {!user?.profileImage && user?.firstName?.[0]}
        </Avatar>
      }
      action={
        !isSelf && (
          <Button 
            size="small" 
            onClick={handleFollow}
            disabled={auth.loading} // Disables button during API call
            sx={{ 
              fontWeight: "bold", 
              fontSize: "0.7rem", 
              textTransform: "none",
              color: isFollowing ? "text.secondary" : "primary.main" 
            }}
          >
            {isFollowing ? "Following" : "Follow"}
          </Button>
        )
      }
      title={
        <span 
          className='font-bold text-sm cursor-pointer hover:text-blue-600'
          onClick={() => navigate(`/profile/${user?.id}`)}
        >
          {user?.firstName} {user?.lastName}
        </span>
      }
      subheader={<span className='text-[10px] text-gray-500'>@{user?.firstName?.toLowerCase()}</span>}
    />
  )
}

export default PopularUserCard;
