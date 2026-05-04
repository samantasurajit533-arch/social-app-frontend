import { api, API_BASE_URL } from "../../../componets/config/api";
import { 
  CREATE_COMMENT_FAILURE,
  CREATE_COMMENT_REQUEST,
  CREATE_COMMENT_SUCCESS,
  CREATE_POST_FAILURE, 
  CREATE_POST_REQUEST, 
  CREATE_POST_SUCCESS, 
  CREATE_REELS_FAILURE, 
  CREATE_REELS_REQUEST, 
  CREATE_REELS_SUCCESS, 
  GET_ALL_POST_FAILURE, 
  GET_ALL_POST_REQUEST, 
  GET_ALL_POST_SUCCESS, 
  GET_ALL_STORY_FAILURE, 
  GET_ALL_STORY_REQUEST, 
  GET_ALL_STORY_SUCCESS, 
  GET_USERS_POST_FAILURE, 
  GET_USERS_POST_REQUEST, 
  GET_USERS_POST_SUCCESS, 
  LIKE_POST_FAILURE, 
  LIKE_POST_REQUEST, 
  LIKE_POST_SUCCESS,
  CREATE_MESSAGE_REQUEST,
  CREATE_MESSAGE_SUCCESS,
  CREATE_MESSAGE_FAILURE,
  GET_MESSAGES_REQUEST,
  GET_MESSAGES_SUCCESS,
  GET_MESSAGES_FAILURE,
  GET_ALL_REELS_REQUEST,
  GET_ALL_REELS_SUCCESS,
  GET_ALL_REELS_FAILURE,
  CREATE_STORY_REQUEST,
  CREATE_STORY_SUCCESS,
  CREATE_STORY_FAILURE,
  GET_USER_CHAT_REQUEST,
  GET_USER_CHAT_SUCCESS,
  GET_USER_CHAT_FAILURE,
  CREATE_CHAT_REQUEST,
  CREATE_CHAT_SUCCESS,
  CREATE_CHAT_FAILURE,
  FOLLOW_USER_FAILURE,
  FOLLOW_USER_SUCCESS,
  FOLLOW_USER_REQUEST,
  FEED_LOADING,
  SET_FEED,
  FEED_ERROR,
  SET_MOOD
} from "./post.actionType";

// --- POST ACTIONS ---
export const createPostAction = (postData) => async (dispatch) => {
  dispatch({ type: CREATE_POST_REQUEST });
  try {
    const { data } = await api.post('/api/posts', postData);
    dispatch({ type: CREATE_POST_SUCCESS, payload: data }); 
  } catch (error) {
    dispatch({ type: CREATE_POST_FAILURE, payload: error.message });
  }
};

export const getAllPostAction = () => async (dispatch) => {
  dispatch({ type: GET_ALL_POST_REQUEST });
  try {
    const { data } = await api.get('/api/posts'); 
    dispatch({ type: GET_ALL_POST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_ALL_POST_FAILURE, payload: error.message });
  }
};

export const getUserPostAction = (userId) => async (dispatch) => {
  dispatch({ type: GET_USERS_POST_REQUEST });
  try {
    const { data } = await api.get(`/api/posts/user/${userId}`);
    dispatch({ type: GET_USERS_POST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_USERS_POST_FAILURE, payload: error.message });
  }
};

export const likePostAction = (postId) => async (dispatch) => {
  dispatch({ type: LIKE_POST_REQUEST });
  try {
    const { data } = await api.put(`/api/posts/like/${postId}`); 
    dispatch({ type: LIKE_POST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: LIKE_POST_FAILURE, payload: error.message });
  }
};

// --- COMMENT ACTIONS ---
export const createCommentAction = (reqData) => async (dispatch) => {
  dispatch({ type: CREATE_COMMENT_REQUEST });
  try {
    const { data } = await api.post(`/api/comments/post/${reqData.postId}`, reqData.data);
    dispatch({ 
      type: CREATE_COMMENT_SUCCESS, 
      payload: data,
      postId: reqData.postId 
    });
  } catch (error) {
    dispatch({ type: CREATE_COMMENT_FAILURE, payload: error.message });
  }
};

// --- REEL ACTIONS ---
export const createReelAction = (reelData) => async (dispatch) => {
  dispatch({ type: CREATE_REELS_REQUEST });
  try {
    const { data } = await api.post(`/api/reels`, reelData);
    dispatch({ type: CREATE_REELS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: CREATE_REELS_FAILURE, payload: error.message });
  }
};

export const getAllReelsAction = () => async (dispatch) => {
  dispatch({ type: GET_ALL_REELS_REQUEST });
  try {
    const { data } = await api.get("/api/reels");
    dispatch({ type: GET_ALL_REELS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_ALL_REELS_FAILURE, payload: error.message });
  }
};

// --- STORY ACTIONS ---
export const createStoryAction = (storyData) => async (dispatch) => {
  dispatch({ type: CREATE_STORY_REQUEST });
  try {
    const { data } = await api.post(`/api/story`, storyData);
    dispatch({ type: CREATE_STORY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: CREATE_STORY_FAILURE, payload: error.message });
  }
};

export const getAllStoriesAction = () => async (dispatch) => {
  dispatch({ type: GET_ALL_STORY_REQUEST });
  try {
    const { data } = await api.get("/api/story"); 
    dispatch({ type: GET_ALL_STORY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_ALL_STORY_FAILURE, payload: error.message });
  }
};

// --- CHAT ACTIONS ---
export const getUsersChatAction = () => async (dispatch) => {
  dispatch({ type: GET_USER_CHAT_REQUEST });
  try {
    const { data } = await api.get(`/api/chats`);
    dispatch({ type: GET_USER_CHAT_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_USER_CHAT_FAILURE, payload: error.message });
  }
};

export const createChatAction = (userId) => async (dispatch) => {
  dispatch({ type: CREATE_CHAT_REQUEST });
  try {
    const { data } = await api.post(`/api/chats`, { userId });
    dispatch({ type: CREATE_CHAT_SUCCESS, payload: data });
    return data; // Required for navigating to the new chat ID
  } catch (error) {
    dispatch({ type: CREATE_CHAT_FAILURE, payload: error.message });
  }
};

// --- MESSAGE ACTIONS ---
export const createMessageAction = (reqData) => async (dispatch) => {
  dispatch({ type: CREATE_MESSAGE_REQUEST });
  try {
    // Backend expects chatId in URL and {content, image} in body
    const { data } = await api.post(`/api/messages/chat/${reqData.chatId}`, {
        content: reqData.content,
        image: reqData.image || ""
    });
    dispatch({ type: CREATE_MESSAGE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: CREATE_MESSAGE_FAILURE, payload: error.message });
  }
};

// post.action.js
export const getChatMessagesAction = (chatId) => async (dispatch) => {
  dispatch({ type: GET_MESSAGES_REQUEST });
  try {
    const jwt = localStorage.getItem("jwt");
    const { data } = await api.get(`/api/messages/chat/${chatId}`, {
      headers: { "Authorization": `Bearer ${jwt}` }
    });
    dispatch({ type: GET_MESSAGES_SUCCESS, payload: data });
  } catch (error) {
    console.error("Fetch Messages Error:", error.response?.data || error.message);
    dispatch({ type: GET_MESSAGES_FAILURE, payload: error.message });
  }
};

export const followUserAction = (userId2) => async (dispatch) => {
  dispatch({ type: FOLLOW_USER_REQUEST });
  
  const jwt = localStorage.getItem("jwt");
  if (!jwt) {
    console.error("No JWT found!");
    return;
  }

  try {
    const { data } = await api.put(
      `${API_BASE_URL}/api/users/follow/${userId2}`,
      {}, // 2nd param: Empty body (REQUIRED)
      {
        headers: {
          // Ensure there is a space after Bearer
          "Authorization": `Bearer ${jwt}`, 
        },
      }
    );
    dispatch({ type: FOLLOW_USER_SUCCESS, payload: data });
    console.log("Follow Success:", data);
  } catch (error) {
    console.error("Follow Error:", error.response?.data || error.message);
    dispatch({ type: FOLLOW_USER_FAILURE, payload: error.message });
  }
};
export const setMoodAction = (mood, userId) => async (dispatch) => {
  try {
    dispatch({ type: FEED_LOADING });

    // update mood
    await API.put(`/users/${userId}/mood?mood=${mood}`);

    dispatch({
      type: SET_MOOD,
      payload: mood
    });

    // fetch feed
    const res = await API.get(`/feed/${userId}`);

    dispatch({
      type: SET_FEED,
      payload: res.data
    });

  } catch (error) {
    dispatch({
      type: FEED_ERROR,
      payload: error.message
    });
  }
};

