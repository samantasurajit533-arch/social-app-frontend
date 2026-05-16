import { api } from "../../../componets/config/api";
import {
  GET_PROFILE_FAILURE,
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_USER_BY_ID_FAILURE,
  GET_USER_BY_ID_REQUEST,
  GET_USER_BY_ID_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  SEARCH_USER_FAILURE,
  SEARCH_USER_REQUEST,
  SEARCH_USER_SUCCESS,
  UPDATE_PROFILE_FAILURE,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
} from "../auth.actionType";


// 1. Sign In Action (Switched to api instance for mobile compatibility)
export const loginUserAction = (loginData) => async (dispatch) => {

  dispatch({ type: LOGIN_REQUEST });

  try {

    const { data } = await api.post(
      "/auth/signin",
      loginData.data
    );

    if (data.token) {

      localStorage.setItem("jwt", data.token);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: data.token,
      });

      dispatch(getProfileAction());

      loginData.navigate("/");
    }

  } catch (error) {

    console.error("FULL LOGIN ERROR:", error);

    const errorMsg =
      error.response?.data?.message ||
      error.response?.data ||
      error.message;

    console.error("Login Error:", errorMsg);

    dispatch({
      type: LOGIN_FAILURE,
      payload: errorMsg,
    });
  }
};

export const requestOtpAction = (userData, setStep) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    await api.post("/auth/signup/request", userData);
    
    // STOP LOADING HERE
    dispatch({ type: REGISTER_SUCCESS, payload: null }); 
    
    setStep(2); 
  } catch (error) {
    dispatch({ type: REGISTER_FAILURE, payload: error.response?.data });
  }
};


export const verifyOtpAndRegisterAction = (verificationData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    // We send 'null' as the body because data goes into 'params'
    const { data } = await api.post("/auth/signup/verify", null, {
      params: {
        email: verificationData.email,
        otp: verificationData.otp
      }
    });

    if (data.token) {
      localStorage.setItem("jwt", data.token);
      dispatch({ type: REGISTER_SUCCESS, payload: data.token });
      dispatch(getProfileAction(data.token));
      verificationData.navigate("/");
    }
  } catch (error) {
    const errorMsg = error.response?.data || "Verification Failed";
    dispatch({ type: REGISTER_FAILURE, payload: errorMsg });
    alert(errorMsg);
  }
};



// 4. Fetch Profile Action (Cleaned trailing base URL out of path)
// Cleaned version using your new interceptor
export const getProfileAction = () => async (dispatch) => {
  dispatch({ type: GET_PROFILE_REQUEST });
  try {
    const res = await api.get("/api/users/profile"); // Interceptor adds the token automatically!
    dispatch({ type: GET_PROFILE_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({ type: GET_PROFILE_FAILURE, payload: error.message });
  }
};

// 5. Update Profile Action (Switched to api instance)
export const updateProfileAction = (reqData) => async (dispatch) => {
  dispatch({ type: UPDATE_PROFILE_REQUEST });
  try {
    const res = await api.put("/api/users", reqData);
    console.log("Update Success:", res.data);
    dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: res.data });
  } catch (error) {
    console.log("Detailed Error:", error.response?.data?.message || error.message);
    dispatch({ type: UPDATE_PROFILE_FAILURE, payload: error.message });
  }
};

// 6. Find User Action (Switched to api instance)
export const findUserByIdAction = (userId) => async (dispatch) => {
  dispatch({ type: GET_USER_BY_ID_REQUEST });
  try {
    const { data } = await api.get(`/api/users/${userId}`);
    console.log("FIND USER BY ID SUCCESS:", data);
    dispatch({ type: GET_USER_BY_ID_SUCCESS, payload: data });
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    console.error("Find User Error:", errorMsg);
    dispatch({ type: GET_USER_BY_ID_FAILURE, payload: errorMsg });
  }
};

// 7. Search User Action (Switched to api instance)
export const searchUserAction = (query) => async (dispatch) => {
  dispatch({ type: SEARCH_USER_REQUEST });
  try {
    const { data } = await api.get(`/api/users/search?query=${query}`);
    console.log("SEARCH USER SUCCESS:", data);
    dispatch({ type: SEARCH_USER_SUCCESS, payload: data });
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    dispatch({ type: SEARCH_USER_FAILURE, payload: errorMsg });
  }
};
