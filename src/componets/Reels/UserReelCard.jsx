import React, { useRef, useState } from 'react';
import { Play, Eye } from 'lucide-react';

const UserReelCard = ({ videoSrc, views = "1.2K" }) => {
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    videoRef.current?.play().catch(() => {}); 
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div className='w-full sm:w-[16rem] px-2 mb-6'>
      <div 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative group aspect-[9/16] w-full bg-[#16181c] rounded-2xl overflow-hidden cursor-pointer shadow-2xl border border-white/5 transition-transform duration-300 hover:scale-[1.02] hover:z-10"
      >
        
        {/* Video Element */}
        <video 
          ref={videoRef}
          className={`w-full h-full object-cover transition-all duration-500 ${
            isHovered ? 'scale-105' : 'grayscale-[30%]'
          }`} 
          src={videoSrc}
          muted
          loop
          playsInline // Crucial for mobile
        />

        {/* Top Gradient (Subtle) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 opacity-80" />

        {/* Center Play Button (Modern Glassmorphism) */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}>
          <div className="bg-white/10 p-4 rounded-full backdrop-blur-md border border-white/20 shadow-xl">
            <Play fill="white" className="text-white w-6 h-6 ml-0.5" />
          </div>
        </div>

        {/* View Count & Bottom Info */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-white bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
             <Play size={12} fill="white" className="text-white" />
             <span className="text-[11px] font-bold tracking-wide">{views}</span>
          </div>
          
          {/* Heart/Like Indicator (Optional visual flair) */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </div>
        </div>

        {/* Interaction Overlay for Mobile (Tap to Play) */}
        <div className="absolute inset-0 md:hidden bg-transparent" onClick={handleMouseEnter} />
      </div>
    </div>
  );
};

export default UserReelCard;
