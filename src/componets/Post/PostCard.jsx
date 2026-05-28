
import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useMemo
} from "react";

import {
  Avatar,
  Card,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  Tooltip
} from "@mui/material";

import {
  Favorite,
  FavoriteBorder,
  Share,
  ChatBubbleOutline,
  BookmarkBorder,
  Bookmark,
  MoreVert
} from "@mui/icons-material";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  createCommentAction,
  likePostAction
} from "../../pages/Redux/Post/post.action";

import { MoodContext } from "../../pages/HomePage/HomePage";
import { api } from "../../componets/config/api";

const PostCard = ({ item }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user: currentUser } =
    useSelector((store) => store.auth);

  const {
    refreshMoodStatus,
    sendBehaviorData
  } = useContext(MoodContext) || {};

  // =========================
  // STATES
  // =========================

  const [showComments, setShowComments] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [commentInput, setCommentInput] =
    useState("");

  const [commentLoading, setCommentLoading] =
    useState(false);

  const [watchTime, setWatchTime] =
    useState(0);

  const [repeatViews, setRepeatViews] =
    useState(0);

  // =========================
  // REFS
  // =========================

  const cardRef = useRef(null);

  const watchStartRef = useRef(null);

  const repeatRef = useRef({});

  // =========================
  // HELPERS
  // =========================

  const isLiked = useMemo(() => {
    return item?.liked?.some(
      (user) => user.id === currentUser?.id
    );
  }, [item, currentUser]);

  const formatTime = (dateStr) => {

    if (!dateStr) return "";

    const date = new Date(dateStr);

    const now = new Date();

    const diff =
      Math.floor((now - date) / 60000);

    if (diff < 1) return "Just now";

    if (diff < 60) return `${diff}m ago`;

    if (diff < 1440)
      return `${Math.floor(diff / 60)}h ago`;

    return `${Math.floor(diff / 1440)}d ago`;
  };

  const isVideo = (url) => {
    return (
      url?.includes("/video/") ||
      url?.match(/\.(mp4|mov|avi|wmv|webm)$/)
    );
  };

  const secureUrl = (url) => {
    return url?.replace("http://", "https://");
  };

  // =========================
  // AI BEHAVIOR TRACKING
  // =========================

  useEffect(() => {

    const observer = new IntersectionObserver(
      (entries) => {

        entries.forEach(async (entry) => {

          if (entry.isIntersecting) {

            watchStartRef.current = Date.now();

            repeatRef.current[item.id] =
              (repeatRef.current[item.id] || 0) + 1;

            setRepeatViews(
              repeatRef.current[item.id]
            );

          } else {

            if (!watchStartRef.current) return;

            const duration =
              Math.floor(
                (Date.now() - watchStartRef.current) / 1000
              );

            setWatchTime(duration);

            // =========================
            // AI SIGNAL
            // =========================

            if (
              duration >= 35 ||
              repeatRef.current[item.id] >= 2
            ) {

              const interactionType =
                duration >= 35
                  ? "deep_focus"
                  : "repeat_interest";

              try {

                await sendBehaviorData?.({
                  postId: item.id,
                  category: item.category || "general",
                  caption: item.caption || "",
                  watchTime: duration,
                  repeatViews:
                    repeatRef.current[item.id],
                  liked: isLiked,
                  interactionType
                });

              } catch (err) {
                console.log("Behavior tracking failed");
              }
            }
          }
        });

      },
      {
        threshold: 0.75
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
    };

  }, [item, isLiked, sendBehaviorData]);

  // =========================
  // LIKE
  // =========================

  const handleLike = () => {
    dispatch(likePostAction(item.id));
  };

  // =========================
  // COMMENT
  // =========================

  const handleCommentSubmit = async () => {

    const trimmed =
      commentInput.trim();

    if (!trimmed || commentLoading) return;

    setCommentLoading(true);

    try {

      // =========================
      // TOXIC CHECK
      // =========================

      const toxicResponse =
        await api.post(
          "/api/ai/check-toxic",
          {
            comment: trimmed
          }
        );

      if (toxicResponse.data.toxic) {

        alert(
          "⚠️ " + toxicResponse.data.message
        );

        setCommentLoading(false);

        return;
      }

      // =========================
      // CREATE COMMENT
      // =========================

      dispatch(
        createCommentAction({
          postId: item.id,
          data: {
            content: trimmed
          }
        })
      );

      setCommentInput("");

      // =========================
      // MOOD ANALYSIS
      // =========================

      try {

        await api.post(
          "/api/ai/mood/analyze",
          {
            userId: currentUser?.id,
            recentComments: trimmed,
            scrolledCategories:
              item.category || "general",
            watchTime,
            repeatViews
          }
        );

        refreshMoodStatus?.();

      } catch (err) {
        console.log("Mood analysis failed");
      }

    } catch (err) {

      console.log(err);

    } finally {

      setCommentLoading(false);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <Card
      ref={cardRef}
      sx={{
        width: "100%",
        borderRadius: "22px",
        background:
          "linear-gradient(180deg,#111827,#0f172a)",
        border:
          "1px solid rgba(255,255,255,0.06)",
        overflow: "hidden",
        mb: 3,
        transition: "0.3s",
        boxShadow:
          "0 8px 30px rgba(0,0,0,0.25)",

        "&:hover": {
          transform: "translateY(-3px)"
        }
      }}
    >

      {/* HEADER */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2
        }}
      >

        <Box
          onClick={() =>
            navigate(`/profile/${item.user?.id}`)
          }
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            cursor: "pointer"
          }}
        >

          <Avatar
            src={item.user?.profileImage}
            sx={{
              width: 44,
              height: 44,
              border:
                "2px solid rgba(99,102,241,0.5)"
            }}
          />

          <Box>

            <Typography
              sx={{
                color: "white",
                fontWeight: 700,
                fontSize: "0.95rem"
              }}
            >
              {item.user?.firstName}{" "}
              {item.user?.lastName}
            </Typography>

            <Typography
              sx={{
                color:
                  "rgba(255,255,255,0.4)",
                fontSize: "0.75rem"
              }}
            >
              {formatTime(item.createdAt)}
            </Typography>

          </Box>
        </Box>

        <IconButton
          sx={{
            color:
              "rgba(255,255,255,0.5)"
          }}
        >
          <MoreVert />
        </IconButton>

      </Box>

      {/* CAPTION */}

      {item.caption && (

        <Typography
          sx={{
            px: 2.5,
            pb: 2,
            color:
              "rgba(255,255,255,0.8)",
            lineHeight: 1.7,
            fontSize: {
              xs: "0.9rem",
              sm: "0.95rem"
            }
          }}
        >
          {item.caption}
        </Typography>

      )}

      {/* MEDIA */}

      {item.image && (

        <Box
          sx={{
            px: 1.5
          }}
        >

          <Box
            sx={{
              overflow: "hidden",
              borderRadius: "16px",
              bgcolor: "#000"
            }}
          >

            {isVideo(item.image) ? (

              <video
                controls
                muted
                loop
                playsInline
                src={secureUrl(item.image)}
                style={{
                  width: "100%",
                  maxHeight: "600px",
                  objectFit: "cover"
                }}
              />

            ) : (

              <img
                src={secureUrl(item.image)}
                alt="post"
                style={{
                  width: "100%",
                  maxHeight: "600px",
                  objectFit: "cover"
                }}
              />

            )}

          </Box>

        </Box>

      )}

      {/* ACTIONS */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 1,
          py: 1.2
        }}
      >

        <Box
          sx={{
            display: "flex",
            alignItems: "center"
          }}
        >

          {/* LIKE */}

          <Tooltip title="Like">

            <IconButton
              onClick={handleLike}
              sx={{
                color: isLiked
                  ? "#ef4444"
                  : "rgba(255,255,255,0.6)"
              }}
            >

              {isLiked
                ? <Favorite />
                : <FavoriteBorder />}

            </IconButton>

          </Tooltip>

          <Typography
            sx={{
              color:
                "rgba(255,255,255,0.5)",
              mr: 1
            }}
          >
            {item.liked?.length || 0}
          </Typography>

          {/* COMMENT */}

          <Tooltip title="Comments">

            <IconButton
              onClick={() =>
                setShowComments(!showComments)
              }
              sx={{
                color:
                  "rgba(255,255,255,0.6)"
              }}
            >
              <ChatBubbleOutline />
            </IconButton>

          </Tooltip>

          <Typography
            sx={{
              color:
                "rgba(255,255,255,0.5)"
            }}
          >
            {item.comments?.length || 0}
          </Typography>

          {/* SHARE */}

          <Tooltip title="Share">

            <IconButton
              sx={{
                color:
                  "rgba(255,255,255,0.6)"
              }}
            >
              <Share />
            </IconButton>

          </Tooltip>

        </Box>

        {/* BOOKMARK */}

        <Tooltip title="Save">

          <IconButton
            onClick={() =>
              setSaved(!saved)
            }
            sx={{
              color: saved
                ? "#6366f1"
                : "rgba(255,255,255,0.6)"
            }}
          >

            {saved
              ? <Bookmark />
              : <BookmarkBorder />}

          </IconButton>

        </Tooltip>

      </Box>

      {/* COMMENTS */}

      {showComments && (

        <Box
          sx={{
            px: 2,
            pb: 2
          }}
        >

          {/* INPUT */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1
            }}
          >

            <Avatar
              src={currentUser?.profileImage}
              sx={{
                width: 34,
                height: 34
              }}
            />

            <input
              value={commentInput}
              onChange={(e) =>
                setCommentInput(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCommentSubmit();
                }
              }}
              placeholder="Write a comment..."
              style={{
                flex: 1,
                background:
                  "rgba(255,255,255,0.05)",
                border:
                  "1px solid rgba(255,255,255,0.08)",
                borderRadius: "20px",
                padding: "10px 16px",
                color: "white",
                outline: "none"
              }}
            />

            {commentLoading ? (

              <CircularProgress size={20} />

            ) : (

              <Typography
                onClick={handleCommentSubmit}
                sx={{
                  color: "#6366f1",
                  cursor: "pointer",
                  fontWeight: 700
                }}
              >
                Post
              </Typography>

            )}

          </Box>

          {/* COMMENT LIST */}

          <Box
            sx={{
              mt: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1.5
            }}
          >

            {item.comments?.map((comment) => (

              <Box
                key={comment.id}
                sx={{
                  display: "flex",
                  gap: 1
                }}
              >

                <Avatar
                  src={comment.user?.profileImage}
                  sx={{
                    width: 30,
                    height: 30
                  }}
                />

                <Box
                  sx={{
                    background:
                      "rgba(255,255,255,0.04)",
                    p: 1,
                    borderRadius: "12px",
                    flex: 1
                  }}
                >

                  <Typography
                    sx={{
                      color: "#818cf8",
                      fontWeight: 600,
                      fontSize: "0.8rem"
                    }}
                  >
                    {comment.user?.firstName}
                  </Typography>

                  <Typography
                    sx={{
                      color:
                        "rgba(255,255,255,0.85)",
                      fontSize: "0.82rem",
                      mt: 0.4
                    }}
                  >
                    {comment.content}
                  </Typography>

                </Box>

              </Box>

            ))}

          </Box>

        </Box>

      )}

    </Card>
  );
};

export default PostCard
