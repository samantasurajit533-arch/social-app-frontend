import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Video, Loader2, Image as ImageIcon, CheckCircle2 } from 'lucide-react'; // Added CheckCircle2
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
    const reelData = { 
      title: caption,
      video: videoUrl
    };
    
    dispatch(createReelAction(reelData));

    setShowSuccess(true);
    
    setTimeout(() => {
      setCaption("");
      setVideoUrl("");
      setShowSuccess(false);
    },2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-white">
      
      {/* Success Message Banner */}
      {showSuccess && (
        <div className="mb-4 flex items-center gap-2 bg-green-500/20 border border-green-500 text-green-400 px-6 py-3 rounded-lg animate-bounce">
          <CheckCircle2 size={20} />
          <span className="font-medium text-sm">Reel created successfully!</span>
        </div>
      )}

      <div className="flex flex-row gap-6 bg-[#191c24] p-8 rounded-lg shadow-lg w-full max-w-4xl">
        
        {/* Left Side: Video Preview */}
        <div className="w-[280px] shrink-0">
          <div className="relative aspect-[9/16] w-full bg-[#0d0d0d] rounded-md border border-gray-700 flex flex-col items-center justify-center overflow-hidden">
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="animate-spin text-blue-500" size={32} />
                <p className="text-xs text-gray-500">Uploading Video...</p>
              </div>
            ) : videoUrl ? (
              <video src={videoUrl} className="w-full h-full object-cover" controls />
            ) : (
              <label className="cursor-pointer flex flex-col items-center hover:opacity-80 transition">
                <div className="p-4 bg-gray-800 rounded-full mb-2">
                   <ImageIcon className="text-blue-400" size={24} />
                </div>
                <span className="text-sm font-medium">Select Video</span>
                <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
              </label>
            )}
          </div>
        </div>

        {/* Right Side: Caption & Submit */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <label className="block text-gray-400 text-sm mb-2">Title / Caption</label>
            <textarea
              placeholder="What's your reel about?"
              className="w-full bg-transparent border border-gray-700 rounded-md p-4 text-sm focus:outline-none focus:border-blue-500 h-64 resize-none"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

          <div className="flex justify-end mt-6">
            <button 
              onClick={handleCreateReel}
              disabled={!videoUrl || uploading || !caption}
              className="bg-[#1d9bf0] hover:bg-blue-600 disabled:bg-gray-700 text-white px-10 py-2.5 rounded-full font-bold transition-all uppercase text-xs tracking-widest"
            >
              {showSuccess ? "Posted!" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateReelsForm;
