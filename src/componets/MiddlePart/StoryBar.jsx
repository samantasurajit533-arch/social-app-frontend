import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StoryCircle from './StoryCircle';
import { getAllStoriesAction } from '../../pages/Redux/Post/post.action';

const StoryBar = () => {
  const dispatch = useDispatch();
  const { stories = [] } = useSelector(state => state.post);
  const { user: currentUser } = useSelector(state => state.auth);
  
  const [activeUserIndex, setActiveUserIndex] = useState(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const progressTimerRef = useRef(null);

  useEffect(() => {
    dispatch(getAllStoriesAction());
  }, [dispatch]);

  // Group multiple user actions out of your Redux array response
  const groupedStories = stories.reduce((acc, story) => {
    if (!story?.user?.id) return acc;
    const userId = story.user.id;
    
    let existingUser = acc.find(item => item.userId === userId);
    if (!existingUser) {
      existingUser = {
        userId: userId,
        firstName: story.user.firstName,
        profileImage: story.user.profileImage || story.image,
        userStories: []
      };
      acc.push(existingUser);
    }
    existingUser.userStories.push(story);
    return acc;
  }, []);

  const currentGroup = activeUserIndex !== null ? groupedStories[activeUserIndex] : null;
  const currentStoryItem = currentGroup ? currentGroup.userStories[activeStoryIndex] : null;

  // Active Progress Frame Clock Engine Loop
  useEffect(() => {
    if (activeUserIndex === null || !currentGroup) return;

    setProgress(0);
    const duration = 5000; 
    const stepTime = 50; 
    const totalSteps = duration / stepTime;
    const increment = 100 / totalSteps;

    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimerRef.current);
          handleNextStory();
          return 100;
        }
        return prev + increment;
      });
    }, stepTime);

    return () => clearInterval(progressTimerRef.current);
  }, [activeUserIndex, activeStoryIndex]);

  const handleNextStory = () => {
    if (!currentGroup) return;
    if (activeStoryIndex < currentGroup.userStories.length - 1) {
      setActiveStoryIndex((prev) => prev + 1);
    } else if (activeUserIndex < groupedStories.length - 1) {
      setActiveUserIndex((prev) => prev + 1);
      setActiveStoryIndex(0);
    } else {
      handleCloseViewer();
    }
  };

  const handlePrevStory = () => {
    if (!currentGroup) return;
    if (activeStoryIndex > 0) {
      setActiveStoryIndex((prev) => prev - 1);
    } else if (activeUserIndex > 0) {
      const prevUserIdx = activeUserIndex - 1;
      setActiveUserIndex(prevUserIdx);
      setActiveStoryIndex(groupedStories[prevUserIdx].userStories.length - 1);
    } else {
      setProgress(0);
    }
  };

  const handleCloseViewer = () => {
    setActiveUserIndex(null);
    setActiveStoryIndex(0);
    setProgress(0);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
  };

  const handleCircleClick = (targetUserId) => {
    const matchIndex = groupedStories.findIndex(group => group.userId === targetUserId);
    if (matchIndex !== -1) {
      setActiveUserIndex(matchIndex);
      setActiveStoryIndex(0);
    }
  };

  return (
    <div className='relative'>
      <div className='flex items-center gap-5 p-5 bg-[#191c24] rounded-xl overflow-x-auto scrollbar-hide border border-gray-800 mb-6'>
        <StoryCircle isCreateNew={true} image={currentUser?.profileImage} />
        {groupedStories.map((group) => (
          <div key={group.userId} onClick={() => handleCircleClick(group.userId)}>
             <StoryCircle hasStory={true} username={group.firstName} image={group.profileImage} />
          </div>
        ))}
      </div>

      {currentGroup && currentStoryItem && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95" onClick={handleCloseViewer}>
          <button className="absolute top-6 right-6 text-white text-4xl z-50 hover:text-gray-300" onClick={(e) => { e.stopPropagation(); handleCloseViewer(); }}>
            &times;
          </button>
          <div className="relative max-w-[400px] w-full aspect-[9/16] bg-zinc-900 md:rounded-2xl overflow-hidden shadow-2xl border border-gray-800" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-3 left-3 right-3 flex gap-1 z-50">
              {currentGroup.userStories.map((_, idx) => (
                <div key={idx} className="h-[3px] flex-1 bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-white transition-all linear" style={{ width: idx === activeStoryIndex ? `${progress}%` : idx < activeStoryIndex ? '100%' : '0%', transitionDuration: idx === activeStoryIndex ? '50ms' : '0s' }}></div>
                </div>
              ))}
            </div>
            <div className="absolute top-8 left-4 flex items-center gap-2 z-50">
              <div className="w-8 h-8 rounded-full border border-white overflow-hidden"><img src={currentGroup.profileImage} alt="profile" className="w-full h-full object-cover" /></div>
              <span className="text-white text-xs font-bold drop-shadow-md">{currentGroup.firstName}</span>
            </div>
            <div className="absolute inset-0 flex z-40">
              <div className="w-1/3 h-full cursor-w-resize" onClick={handlePrevStory}></div>
              <div className="w-2/3 h-full cursor-e-resize" onClick={handleNextStory}></div>
            </div>
            <div className="w-full h-full flex items-center justify-center">
              {currentStoryItem.image?.match(/\.(mp4|mov|webm)$/) ? (
                <video src={currentStoryItem.image} autoPlay muted playsInline className="w-full h-full object-contain" />
              ) : (
                <img src={currentStoryItem.image} alt="story content" className="w-full h-full object-contain" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryBar;
