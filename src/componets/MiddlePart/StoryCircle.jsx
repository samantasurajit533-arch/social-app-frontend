import React, { useRef, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Avatar, CircularProgress } from '@mui/material';
import { useDispatch } from 'react-redux';
import { uploadToCloudniry } from '../../utils/uploadToCloudniry';
import { createStoryAction } from '../../pages/Redux/Post/post.action';

const StoryCircle = ({ isCreateNew, image, username, hasStory, onStoryClick }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const handlePlusClick = (e) => {
    e.stopPropagation(); 
    e.preventDefault();
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleSelectStory = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileType = file.type.startsWith("video") ? "video" : "image";
      const uploadedUrl = await uploadToCloudniry(file, fileType);
      if (uploadedUrl) {
        dispatch(createStoryAction({ image: uploadedUrl }));
      }
    } catch (error) {
      console.error("Story Upload Error:", error);
    } finally {
      setUploading(false);
      e.target.value = null; 
    }
  };

  if (isCreateNew) {
    return (
      <div className='flex flex-col items-center shrink-0'>
        <div 
          onClick={handlePlusClick}
          className='w-[4.5rem] h-[4.5rem] rounded-full border-2 border-dashed border-[#1d9bf0] flex items-center justify-center cursor-pointer hover:bg-[#1d9bf0]/10 transition-all relative z-[999]'
        >
          {uploading ? (
            <CircularProgress size={24} sx={{ color: '#1d9bf0' }} />
          ) : (
            <AddIcon sx={{ fontSize: "2.5rem", color: "#1d9bf0" }} />
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*,video/*" 
            onChange={handleSelectStory}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <p className='mt-2 text-[11px] font-semibold text-gray-400'>New</p>
      </div>
    );
  }

  return (
    <div 
      onClick={hasStory ? onStoryClick : undefined}
      className='flex flex-col items-center shrink-0 cursor-pointer group'
    >
      <div className={`p-[2.5px] rounded-full transition-all duration-300 ${hasStory ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 group-hover:scale-105' : 'border border-gray-700'}`}>
        <div className='bg-black rounded-full p-[2px]'>
          <Avatar src={image} sx={{ width: "4rem", height: "4rem", border: "2px solid black" }} />
        </div>
      </div>
      <p className='mt-2 text-[10px] font-medium text-gray-400 w-16 truncate text-center'>{username}</p>
    </div>
  );
};

export default StoryCircle;
