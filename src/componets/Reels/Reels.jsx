import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllReelsAction } from '../../pages/Redux/Post/post.action';
import { Heart, MessageCircle, Send, Volume2, VolumeX, Radio } from 'lucide-react';
import { Box, Avatar, IconButton, Typography, Button } from '@mui/material';

const ReelItem = ({ item }) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current.play().catch(() => console.log("Autoplay blocked"));
          } else {
            videoRef.current.pause();
          }
        });
      },
      { threshold: 0.8 }
    );
    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Box sx={{ 
      snapAlign: 'center', minHeight: '100vh', width: '100%', 
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      bgcolor: '#07090d' // Global deep midnight
    }}>
      <Box sx={{ 
        position: 'relative', height: '92vh', aspect: '9/16', 
        bgcolor: '#000', borderRadius: '32px', overflow: 'hidden',
        boxShadow: '0 20px 80px rgba(0,0,0,0.8)',
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        {/* VIDEO ENGINE */}
        <video
          ref={videoRef}
          src={item.video}
          style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
          loop
          muted={isMuted}
          playsInline
          onClick={() => setIsMuted(!isMuted)}
        />

        {/* TOP STATUS: Neon Frequency Indicator */}
        <Box sx={{ 
          position: 'absolute', top: 20, left: 20, zIndex: 10,
          display: 'flex', alignItems: 'center', gap: 1,
          bgcolor: 'rgba(0,0,0,0.4)', px: 2, py: 0.5, borderRadius: '20px',
          backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <Radio size={14} color="#6366f1" className="animate-pulse" />
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, color: 'white', letterSpacing: '1px' }}>
            LIVE TRANSMISSION
          </Typography>
        </Box>

        {/* VOLUME CONTROL */}
        <IconButton sx={{ 
          position: 'absolute', top: 20, right: 20, zIndex: 10,
          bgcolor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', color: 'white' 
        }}>
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </IconButton>

        {/* BOTTOM METADATA: Unique Glass Card */}
        <Box sx={{ 
          position: 'absolute', bottom: 20, left: 15, right: 80, zIndex: 10,
          p: 2, borderRadius: '20px',
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
            <Avatar 
              src={item.user?.profileImage} 
              sx={{ width: 40, height: 42, border: '2px solid #6366f1', boxShadow: '0 0 10px rgba(99, 102, 241, 0.3)' }}
            >
              {item.user?.firstName?.charAt(0)}
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 800, color: 'white', fontSize: '0.9rem' }}>
                {item.user?.firstName}
              </Typography>
              <Typography sx={{ fontSize: '0.65rem', color: '#6366f1', fontWeight: 700 }}>
                @frequency_active
              </Typography>
            </Box>
            <Button sx={{ 
              ml: 'auto', borderRadius: '10px', fontSize: '0.6rem', fontWeight: 800, 
              color: 'white', border: '1px solid rgba(255,255,255,0.2)',
              '&:hover': { bgcolor: '#6366f1' }
            }}>
              SYNC
            </Button>
          </Box>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', fontWeight: 500 }}>
            {item.title}
          </Typography>
        </Box>

        {/* RIGHT ACTIONS: Cyber-Vertical Dock */}
        <Box sx={{ 
          position: 'absolute', right: 15, bottom: 20, zIndex: 10,
          display: 'flex', flexDirection: 'column', gap: 3,
          p: 1.5, borderRadius: '30px',
          bgcolor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <IconButton sx={{ color: 'white', '&:hover': { color: '#ef4444' } }}><Heart size={24} /></IconButton>
            <Typography sx={{ fontSize: '0.6rem', color: 'white', fontWeight: 700 }}>LIKE</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <IconButton sx={{ color: 'white', '&:hover': { color: '#6366f1' } }}><MessageCircle size={24} /></IconButton>
            <Typography sx={{ fontSize: '0.6rem', color: 'white', fontWeight: 700 }}>COM</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <IconButton sx={{ color: 'white' }}><Send size={24} /></IconButton>
            <Typography sx={{ fontSize: '0.6rem', color: 'white', fontWeight: 700 }}>SEND</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const Reels = () => {
  const dispatch = useDispatch();
  const { reels = [] } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(getAllReelsAction());
  }, [dispatch]);

  return (
    <Box sx={{ 
      height: '100vh', width: '100%', overflowY: 'scroll', 
      scrollSnapType: 'y mandatory', bgcolor: '#07090d'
    }} className="no-scrollbar">
      {reels.map((item, index) => (
        <ReelItem key={item.id || index} item={item} />
      ))}
    </Box>
  );
};

export default Reels;
