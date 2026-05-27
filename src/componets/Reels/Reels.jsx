import React, { useEffect, useRef, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllReelsAction, likePostAction, createCommentAction } from '../../pages/Redux/Post/post.action';
import { Heart, MessageCircle, Send, Volume2, VolumeX, Radio, X } from 'lucide-react';
import { Box, Avatar, IconButton, Typography, Button, Drawer, TextField, InputAdornment, CircularProgress } from '@mui/material';
import { MoodContext } from '../../pages/HomePage/HomePage';
import { api } from '../../componets/config/api';

let reelViewHistory = {};

const ReelItem = ({ item }) => {
  const dispatch = useDispatch();
  const videoRef = useRef(null);
  const cardRef = useRef(null);
  const timerRef = useRef(null);

  const [isMuted, setIsMuted] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const { user: currentUser } = useSelector((store) => store.auth);

  const { refreshMoodStatus, sendBehaviorData } = useContext(MoodContext) || {
    refreshMoodStatus: () => {},
    sendBehaviorData: () => {}
  };

  const isLiked = item.liked?.some((user) => user.id === currentUser?.id);

  const handleLikeReel = () => {
    dispatch(likePostAction(item.id));
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play().catch(() => console.log("Autoplay blocked"));
            timerRef.current = setTimeout(() => {
              const currentCategory = item.category || "reels_general";
              reelViewHistory[currentCategory] = (reelViewHistory[currentCategory] || 0) + 1;
              if (reelViewHistory[currentCategory] >= 1) {
                const reportString = `${currentCategory}: focused deeply on reel for 35 seconds`;
                if (sendBehaviorData) sendBehaviorData("", reportString);
                reelViewHistory = {};
              }
            }, 35000);
          } else {
            videoRef.current?.pause();
            if (timerRef.current) clearTimeout(timerRef.current);
          }
        });
      },
      { threshold: 0.8 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [item, sendBehaviorData]);

  const handleCommentSubmit = async () => {
    const trimmedComment = commentInput.trim();
    if (!trimmedComment || commentLoading) return;

    setCommentLoading(true);
    setCommentInput("");

    try {
      const response = await api.post('/api/ai/check-toxic', {
        comment: trimmedComment
      });

      if (response.data.toxic) {
        alert("⚠️ " + response.data.message);
        setCommentInput(trimmedComment);
        setCommentLoading(false);
        return;
      }

      dispatch(createCommentAction({ postId: item.id, data: { content: trimmedComment } }));

      try {
        const moodResponse = await api.post('/api/ai/mood/analyze', {
          userId: currentUser?.id,
          recentComments: trimmedComment,
          scrolledCategories: `${item.category || "reels"}: interacted`
        });
        if (moodResponse.data.success && refreshMoodStatus) {
          refreshMoodStatus();
        }
      } catch (moodError) {
        // silent catch
      }

    } catch (error) {
      console.error("Process failed:", error);
      dispatch(createCommentAction({ postId: item.id, data: { content: trimmedComment } }));
    } finally {
      setCommentLoading(false);
    }
  };

  return (
    <Box ref={cardRef} sx={{
      snapAlign: 'center', minHeight: '100vh', width: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      bgcolor: '#07090d'
    }}>
      <Box sx={{
        position: 'relative', height: '92vh', aspect: '9/16',
        bgcolor: '#000', borderRadius: '32px', overflow: 'hidden',
        boxShadow: '0 20px 80px rgba(0,0,0,0.8)',
        border: '1px solid rgba(255,255,255,0.05)'
      }}>

        {/* ── VIDEO ── */}
        <video
          ref={videoRef}
          src={item.video}
          style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
          loop
          muted={isMuted}
          playsInline
          onClick={() => setIsMuted(!isMuted)}
        />

        {/* ── TOP STATUS ── */}
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

        {/* ── VOLUME ── */}
        <IconButton
          onClick={() => setIsMuted(!isMuted)}
          sx={{
            position: 'absolute', top: 20, right: 20, zIndex: 10,
            bgcolor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', color: 'white'
          }}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </IconButton>

        {/* ── BOTTOM METADATA ── */}
        <Box sx={{
          position: 'absolute', bottom: 20, left: 15, right: 80, zIndex: 10,
          p: 2, borderRadius: '20px',
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255,255,255,0.1)',
          maxWidth: 'calc(100% - 95px)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Avatar
              src={item.user?.profileImage}
              sx={{ width: 40, height: 40, border: '2px solid #6366f1', boxShadow: '0 0 10px rgba(99,102,241,0.3)' }}
            >
              {item.user?.firstName?.charAt(0)}
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography noWrap sx={{ fontWeight: 800, color: 'white', fontSize: '0.9rem' }}>
                {item.user ? `${item.user.firstName} ${item.user.lastName}` : "User"}
              </Typography>
              <Typography noWrap sx={{ fontSize: '0.65rem', color: '#6366f1', fontWeight: 700 }}>
                @{item.user?.firstName?.toLowerCase() || 'user'}
              </Typography>
            </Box>
            <Button sx={{
              ml: 'auto', flexShrink: 0, borderRadius: '10px', fontSize: '0.6rem', fontWeight: 800,
              color: 'white', border: '1px solid rgba(255,255,255,0.2)',
              '&:hover': { bgcolor: '#6366f1' }
            }}>
              SYNC
            </Button>
          </Box>
          <Typography sx={{
            color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', fontWeight: 500,
            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
          }}>
            {item.title}
          </Typography>
        </Box>

        {/* ── RIGHT ACTIONS ── */}
        <Box sx={{
          position: 'absolute', right: 15, bottom: 20, zIndex: 10,
          display: 'flex', flexDirection: 'column', gap: 3,
          p: 1.5, borderRadius: '30px',
          bgcolor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          {/* Like */}
          <Box sx={{ textAlign: 'center' }}>
            <IconButton
              onClick={handleLikeReel}
              sx={{ color: isLiked ? '#ef4444' : 'white', '&:hover': { color: '#ef4444' } }}
            >
              <Heart size={24} fill={isLiked ? "#ef4444" : "none"} />
            </IconButton>
            <Typography sx={{ fontSize: '0.6rem', color: 'white', fontWeight: 700 }}>
              {item.liked?.length || 0}
            </Typography>
          </Box>

          {/* Comment */}
          <Box sx={{ textAlign: 'center' }}>
            <IconButton
              onClick={() => setShowComments(true)}
              sx={{ color: 'white', '&:hover': { color: '#6366f1' } }}
            >
              <MessageCircle size={24} />
            </IconButton>
            <Typography sx={{ fontSize: '0.6rem', color: 'white', fontWeight: 700 }}>
              {item.comments?.length || 0}
            </Typography>
          </Box>

          {/* Share */}
          <Box sx={{ textAlign: 'center' }}>
            <IconButton sx={{ color: 'white' }}><Send size={24} /></IconButton>
            <Typography sx={{ fontSize: '0.6rem', color: 'white', fontWeight: 700 }}>SEND</Typography>
          </Box>
        </Box>
      </Box>

      {/* ── COMMENTS DRAWER ── */}
      <Drawer
        anchor="bottom"
        open={showComments}
        onClose={() => setShowComments(false)}
        PaperProps={{
          sx: {
            height: '50vh',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            background: 'rgba(15, 23, 36, 0.95)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            color: 'white',
            px: 3, pt: 2, pb: 4,
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        {/* ── DRAWER HEADER ── */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography sx={{ fontWeight: 800, fontSize: '1.1rem' }}>
            Comments ({item.comments?.length || 0})
          </Typography>
          {/* ✅ FIXED: IconButton properly closed */}
          <IconButton onClick={() => setShowComments(false)} sx={{ color: 'rgba(255,255,255,0.5)' }}>
            <X size={20} />
          </IconButton>
        </Box>

        {/* ── COMMENTS LIST ── */}
        {/* ✅ FIXED: Moved inside Drawer */}
        <Box sx={{ flex: 1, overflowY: 'auto', mb: 2, pr: 1 }}>
          {item.comments && item.comments.length > 0 ? (
            item.comments.map((comment, idx) => (
              <Box key={comment.id || idx} sx={{ display: 'flex', gap: 1.5, mb: 2, alignItems: 'flex-start' }}>
                <Avatar
                  src={comment.user?.profileImage}
                  sx={{ width: 32, height: 32, border: '1px solid #6366f1' }}
                >
                  {!comment.user?.profileImage && comment.user?.firstName?.charAt(0)}
                </Avatar>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.04)', p: 1.5, borderRadius: '14px', flex: 1 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366f1', mb: 0.5 }}>
                    {comment.user ? `${comment.user.firstName} ${comment.user.lastName}` : "User"}
                  </Typography>
                  <Typography sx={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.85)' }}>
                    {comment.content}
                  </Typography>
                </Box>
              </Box>
            ))
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.4 }}>
              <Typography sx={{ fontSize: '0.85rem' }}>No comments yet.</Typography>
            </Box>
          )}
        </Box>

        {/* ── COMMENT INPUT ── */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={commentLoading ? "🔍 Checking..." : "Add a comment..."}
            value={commentInput}
            disabled={commentLoading}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Avatar src={currentUser?.profileImage} sx={{ width: 24, height: 24, mr: 0.5 }}>
                    {!currentUser?.profileImage && currentUser?.firstName?.charAt(0)}
                  </Avatar>
                </InputAdornment>
              ),
              sx: {
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&.Mui-focused fieldset': { borderColor: '#6366f1' }
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleCommentSubmit}
            disabled={!commentInput.trim() || commentLoading}
            sx={{
              bgcolor: '#6366f1',
              height: '48px',
              px: 3,
              borderRadius: '12px',
              fontWeight: 700,
              '&:disabled': { bgcolor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }
            }}
          >
            {commentLoading ? <CircularProgress size={20} color="inherit" /> : 'Post'}
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
};

// ── REELS CONTAINER ──
const Reels = () => {
  const dispatch = useDispatch();
  const { reels = [] } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(getAllReelsAction());
  }, []);

  return (
    <Box sx={{
      height: '100vh',
      width: '100%',
      overflowY: 'scroll',
      scrollSnapType: 'y mandatory',
      bgcolor: '#07090d'
    }} className="no-scrollbar">
      {reels.length > 0 ? (
        reels.map((item, index) => (
          <ReelItem key={item.id || index} item={item} />
        ))
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}>
            No reels yet. Be the first to post!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Reels;