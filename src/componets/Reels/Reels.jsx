import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllReelsAction } from '../../pages/Redux/Post/post.action';
import { Heart, MessageCircle, Send, Volume2, VolumeX } from 'lucide-react'; // Icons for better UI

const ReelItem = ({ item }) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current.play().catch(err => console.log("Autoplay blocked"));
          } else {
            videoRef.current.pause();
          }
        });
      },
      { threshold: 0.8 } // Trigger when 80% visible
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="snap-center min-h-screen w-full flex items-center justify-center border-b border-gray-900 bg-black">
      <div className="relative h-[95vh] aspect-[9/16] bg-zinc-900 rounded-xl overflow-hidden shadow-2xl">
        {/* Video Player */}
        <video
          ref={videoRef}
          src={item.video}
          className="w-full h-full object-cover cursor-pointer"
          loop
          muted={isMuted}
          playsInline
          onClick={() => setIsMuted(!isMuted)} // Tap video to mute/unmute
        />

        {/* Volume Toggle Indicator */}
        <div className="absolute top-5 right-5 z-20 bg-black/40 p-2 rounded-full pointer-events-none">
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </div>

        {/* Bottom Overlay: User Info */}
        <div className="absolute bottom-0 w-full p-5 bg-gradient-to-t from-black/80 to-transparent text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-yellow-400 to-purple-600 rounded-full p-[2px]">
              <div className="w-full h-full bg-black rounded-full flex items-center justify-center border-2 border-black font-bold">
                {item.user?.firstName?.charAt(0)}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm">@{item.user?.firstName?.toLowerCase()}</span>
              <span className="text-[10px] text-gray-300">Original Audio</span>
            </div>
            <button className="ml-2 border border-gray-400 px-3 py-1 rounded-md text-[10px] font-semibold hover:bg-white hover:text-black transition">
              Follow
            </button>
          </div>
          <p className="text-sm font-light line-clamp-2">{item.title}</p>
        </div>

        {/* Sidebar Actions */}
        <div className="absolute right-2 bottom-24 flex flex-col gap-6 text-white drop-shadow-lg">
          <div className="flex flex-col items-center gap-1 group cursor-pointer">
            <Heart size={28} className="group-hover:text-red-500 transition-colors" />
            <span className="text-[10px] font-semibold">Like</span>
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer">
            <MessageCircle size={28} />
            <span className="text-[10px] font-semibold">24</span>
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer">
            <Send size={26} />
            <span className="text-[10px] font-semibold">Share</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Reels = () => {
  const dispatch = useDispatch();
  const { reels } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(getAllReelsAction());
  }, [dispatch]);

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide bg-black">
      {reels?.map((item, index) => (
        <ReelItem key={item.id || index} item={item} />
      ))}
    </div>
  );
};

export default Reels;
