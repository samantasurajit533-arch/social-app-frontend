import React from 'react';

const UserReelCard = ({ videoSrc }) => {
  return (
    <div className='w-[15rem] px-2 mb-4'>
      <div className="relative group aspect-[9/16] w-full bg-black rounded-lg overflow-hidden cursor-pointer shadow-lg border border-gray-800">
        
        {/* Video - Loop on hover or simple preview */}
        <video 
          className='w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-300' 
          src={videoSrc || 'https://www.pexels.com/download/video/36118670/'}
          muted
          loop
          onMouseOver={(e) => e.target.play()}
          onMouseOut={(e) => {
            e.target.pause();
            e.target.currentTime = 0;
          }}
        />

        {/* Play Icon Overlay (Shows on hover) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
          <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
            <svg xmlns="http://w3.org" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347c-.75.412-1.667-.13-1.667-.986V5.653z" />
            </svg>
          </div>
        </div>

        {/* View Count (Optional Mockup) */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs font-semibold drop-shadow-md">
           <span>▶</span> 1.2K
        </div>
      </div>
    </div>
  );
};

export default UserReelCard;
