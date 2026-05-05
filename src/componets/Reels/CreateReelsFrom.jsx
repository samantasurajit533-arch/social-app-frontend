import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Video, Loader2, Image as ImageIcon, CheckCircle2, X } from 'lucide-react';
import { uploadToCloudniry } from '../../utils/uploadToCloudniry';
import { createReelAction } from '../../pages/Redux/Post/post.action';

const CreateReelsForm = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); 
  const dispatch = useDispatch();

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0]; 
    if (!file) return;

    setUploading(true);
    setShowSuccess(false); 
    try {
      const uploadedUrl = await uploadToCloudniry(file, "video");
      if (uploadedUrl) setVideoUrl(uploadedUrl);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  const handleCreateReel = async () => {
    const reelData = { title: caption, video: videoUrl };
    dispatch(createReelAction(reelData));
    setShowSuccess(true);
    
    setTimeout(() => {
      setCaption("");
      setVideoUrl("");
      setShowSuccess(false);
    }, 2500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 text-white bg-black">
      
      {/* Success Notification - Fixed Top */}
      {showSuccess && (
        <div className="fixed top-5 z-50 flex items-center gap-3 bg-green-600 px-6 py-3 rounded-full shadow-2xl animate-in fade-in zoom-in duration-300">
          <CheckCircle2 size={20} />
          <span className="font-bold text-sm">Reel Shared!</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8 bg-[#16181c] p-6 md:p-10 rounded-3xl border border-gray-800 w-full max-w-5xl shadow-2xl">
        
        {/* Left Side: Video Preview (The "Phone" Frame) */}
        <div className="w-full md:w-[320px] flex-shrink-0 flex flex-col items-center">
          <p className="md:hidden text-lg font-bold mb-4 self-start">New Reel</p>
          <div className="relative aspect-[9/16] w-full max-w-[280px] bg-black rounded-[2rem] border-[6px] border-[#2f3336] flex flex-col items-center justify-center overflow-hidden shadow-inner">
            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="animate-spin text-blue-500" size={40} />
                <p className="text-sm text-gray-400 font-medium">Processing...</p>
              </div>
            ) : videoUrl ? (
              <>
                <video src={videoUrl} className="w-full h-full object-cover" autoPlay muted loop />
                <button 
                  onClick={() => setVideoUrl("")} 
                  className="absolute top-4 right-4 p-1.5 bg-black/50 backdrop-blur-md rounded-full hover:bg-red-500 transition"
                >
                  <X size={18} />
                </button>
              </>
            ) : (
              <label className="cursor-pointer group flex flex-col items-center justify-center w-full h-full hover:bg-white/5 transition-all">
                <div className="p-5 bg-[#1d9bf0]/10 rounded-full mb-4 group-hover:scale-110 transition-transform">
                   <ImageIcon className="text-[#1d9bf0]" size={32} />
                </div>
                <span className="text-sm font-semibold text-gray-300">Select Video</span>
                <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest">MP4 or MOV</p>
                <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
              </label>
            )}
          </div>
        </div>

        {/* Right Side: Details & Action */}
        <div className="flex-1 flex flex-col pt-2">
          <div className="hidden md:block mb-6">
             <h1 className="text-2xl font-black">Create Reel</h1>
             <p className="text-gray-500 text-sm">Share your moments with the world.</p>
          </div>

          <div className="flex-1">
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">Caption</label>
            <textarea
              placeholder="Write a catchy caption... #trending"
              className="w-full bg-[#0d0d0d] border border-gray-800 rounded-2xl p-5 text-base focus:outline-none focus:border-[#1d9bf0] focus:ring-1 focus:ring-[#1d9bf0] h-48 md:h-64 resize-none transition-all"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

          <div className="mt-8">
            <button 
              onClick={handleCreateReel}
              disabled={!videoUrl || uploading || !caption}
              className="w-full md:w-auto float-right bg-white text-black hover:bg-gray-200 disabled:bg-gray-700 disabled:text-gray-500 px-12 py-4 rounded-full font-black transition-all active:scale-95 text-sm"
            >
              {showSuccess ? "POSTED" : "SHARE REEL"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateReelsForm;
