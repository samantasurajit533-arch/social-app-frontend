import { 
  CREATE_COMMENT_SUCCESS,
  CREATE_POST_FAILURE, CREATE_POST_REQUEST, CREATE_POST_SUCCESS, 
  GET_ALL_POST_FAILURE, GET_ALL_POST_REQUEST, GET_ALL_POST_SUCCESS, 
  LIKE_POST_FAILURE, LIKE_POST_REQUEST, LIKE_POST_SUCCESS,
  CREATE_REELS_REQUEST, CREATE_REELS_SUCCESS, CREATE_REELS_FAILURE,
  GET_ALL_REELS_REQUEST, GET_ALL_REELS_SUCCESS,
  CREATE_STORY_REQUEST, CREATE_STORY_SUCCESS, CREATE_STORY_FAILURE,
  GET_ALL_STORY_SUCCESS, GET_ALL_STORY_REQUEST,
  CREATE_MESSAGE_REQUEST, CREATE_MESSAGE_SUCCESS, CREATE_MESSAGE_FAILURE,
  GET_MESSAGES_REQUEST, GET_MESSAGES_SUCCESS, GET_MESSAGES_FAILURE,
  GET_USER_CHAT_REQUEST, GET_USER_CHAT_SUCCESS, GET_USER_CHAT_FAILURE,
  CREATE_CHAT_REQUEST, CREATE_CHAT_SUCCESS, CREATE_CHAT_FAILURE,
  FOLLOW_USER_REQUEST, FOLLOW_USER_SUCCESS, FOLLOW_USER_FAILURE,

  // 🔥 NEW
  SET_MOOD,
  SET_FEED,
  FEED_LOADING,
  FEED_ERROR

} from "./post.actionType";

const initialState = {
  posts: [],
  loading: false,
  error: null,
  like: null,
  reels: [],
  stories: [],
  messages: [],
  chats: [],
  user: null,

  // 🔥 NEW
  mood: ""
};

export const postReducer = (state = initialState, action) => {
  switch (action.type) {

    // 🔥 LOADING
    case CREATE_POST_REQUEST:
    case GET_ALL_POST_REQUEST:
    case LIKE_POST_REQUEST:
    case CREATE_REELS_REQUEST:
    case GET_ALL_REELS_REQUEST:
    case CREATE_STORY_REQUEST:
    case GET_ALL_STORY_REQUEST:
    case CREATE_MESSAGE_REQUEST:
    case GET_MESSAGES_REQUEST:
    case GET_USER_CHAT_REQUEST:
    case CREATE_CHAT_REQUEST:
    case FOLLOW_USER_REQUEST:
    case FEED_LOADING: // 🔥 added
      return { ...state, loading: true, error: null };

    // 🔥 CREATE POST
    case CREATE_POST_SUCCESS:
      return {
        ...state,
        posts: [action.payload, ...state.posts],
        loading: false,
      };

    // 🔥 REELS
    case CREATE_REELS_SUCCESS:
      return { ...state, reels: [action.payload, ...state.reels], loading: false };

    case GET_ALL_REELS_SUCCESS:
      return { ...state, reels: action.payload, loading: false };

    // 🔥 STORY
    case CREATE_STORY_SUCCESS:
      return { ...state, stories: [action.payload, ...state.stories], loading: false };

    case GET_ALL_STORY_SUCCESS:
      return { ...state, stories: action.payload, loading: false };

    // 🔥 POSTS
    case GET_ALL_POST_SUCCESS:
      return { ...state, posts: action.payload, loading: false };

    // 🔥 CHAT
    case GET_USER_CHAT_SUCCESS:
      return { ...state, chats: action.payload, loading: false };

    case CREATE_CHAT_SUCCESS:
      const existingChat = state.chats.find(c => c.id === action.payload.id);
      if (existingChat) return { ...state, loading: false };
      return { 
        ...state, 
        chats: [action.payload, ...state.chats], 
        loading: false 
      };

    // 🔥 MESSAGES
    case GET_MESSAGES_SUCCESS:
      return { ...state, messages: action.payload, loading: false };

    case CREATE_MESSAGE_SUCCESS:
      return { 
        ...state, 
        messages: [...state.messages, action.payload], 
        loading: false 
      };

    // 🔥 FOLLOW
    case FOLLOW_USER_SUCCESS:
      const updatedFollowings = action.payload.followings || [];
      const isNowFollowing = updatedFollowings.includes(state.reqUser?.id);

      return { 
        ...state, 
        user: action.payload,
        reqUser: state.reqUser ? {
          ...state.reqUser,
          followers: isNowFollowing 
            ? [...state.reqUser.followers, state.user.id] 
            : state.reqUser.followers.filter(id => id !== state.user.id)
        } : null,
        loading: false,
        error: null
      };

    // 🔥 COMMENT
    case CREATE_COMMENT_SUCCESS:
      return {
        ...state,
        posts: state.posts.map((item) => 
          item.id === action.payload.post?.id || item.id === action.postId
            ? { ...item, comments: [action.payload, ...(item.comments || [])] }
            : item
        ),
        loading: false,
      };

    // 🔥 LIKE
    case LIKE_POST_SUCCESS:
      return {
        ...state,
        posts: state.posts.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
        loading: false,
      };

    // 🔥 NEW: MOOD FEATURE
    case SET_MOOD:
      return {
        ...state,
        mood: action.payload
      };

    case SET_FEED:
      return {
        ...state,
        posts: action.payload, // reuse posts as feed
        loading: false,
        error: null
      };

    // 🔥 ERROR
    case CREATE_POST_FAILURE:
    case GET_ALL_POST_FAILURE:
    case LIKE_POST_FAILURE:
    case CREATE_REELS_FAILURE:
    case CREATE_STORY_FAILURE:
    case CREATE_MESSAGE_FAILURE:
    case GET_MESSAGES_FAILURE:
    case GET_USER_CHAT_FAILURE:
    case CREATE_CHAT_FAILURE:
    case FOLLOW_USER_FAILURE:
    case FEED_ERROR: // 🔥 added
      return { ...state, error: action.payload, loading: false };

    default:
      return state;
  }
};