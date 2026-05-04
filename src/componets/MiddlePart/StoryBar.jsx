import React, { useEffect, useState } from 'react'; // Added useState
import { useDispatch, useSelector } from 'react-redux';
import StoryCircle from './StoryCircle';
import { getAllStoriesAction } from '../../pages/Redux/Post/post.action';

const StoryBar = () => {
  const dispatch = useDispatch();
  const { stories } = useSelector(state => state.post);
  const { user } = useSelector(state => state.auth); // To get current user
  
  // Changed from storing just image to storing the whole story object
  const [selectedStory, setSelectedStory] = useState(null);

  useEffect(() => {
    dispatch(getAllStoriesAction());
  }, [dispatch]);

  return (
    <div className='relative'>
      {/* Scrollable Story Bar */}
      <div className='flex items-center gap-5 p-5 bg-[#191c24] rounded-xl overflow-x-auto scrollbar-hide border border-gray-800 mb-6'>
        
        {/* Create New Story */}
        <StoryCircle 
          isCreateNew={true} 
          image={user?.profileImage} 
        />

        {/* List of active stories */}
        {stories?.map((item) => (
          <div key={item.id} onClick={() => setSelectedStory(item)}>
             <StoryCircle 
                hasStory={true} 
                username={item.user?.firstName} 
                image={item.user?.profileImage || item.image} 
             />
          </div>
        ))}
      </div>

      {/* Full-Screen Modern Story Viewer */}
      {selectedStory && (
        <div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 transition-opacity duration-300"
          onClick={() => setSelectedStory(null)} // Close on background click
        >
          {/* Close Button */}
          <button className="absolute top-10 right-10 text-white text-4xl z-50 hover:text-gray-300">
            &times;
          </button>

          <div 
            className="relative max-w-[400px] w-full aspect-[9/16] bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
          >
            {/* Top Progress Bar */}
            <div className="absolute top-2 left-2 right-2 flex gap-1 z-50">
              <div className="h-[2px] flex-1 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-white animate-story-progress w-full"></div>
              </div>
            </div>

            {/* User Info Overlay */}
            <div className="absolute top-6 left-4 flex items-center gap-2 z-50">
              <div className="w-8 h-8 rounded-full border border-white overflow-hidden">
                <img src={selectedStory.user?.profileImage} alt="user" className="w-full h-full object-cover" />
              </div>
              <span className="text-white text-xs font-bold drop-shadow-lg">
                {selectedStory.user?.firstName}
              </span>
            </div>

            {/* Actual Story Media */}
            <img 
              src={selectedStory.image} 
              alt="story" 
              className="w-full h-full object-contain" 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryBar;
