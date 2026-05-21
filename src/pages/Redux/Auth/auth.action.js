import { api } from "../../../componets/config/api";
import {
  GET_PROFILE_FAILURE, GET_PROFILE_REQUEST, GET_PROFILE_SUCCESS,
  GET_USER_BY_ID_FAILURE, GET_USER_BY_ID_REQUEST, GET_USER_BY_ID_SUCCESS,
  LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS,
  REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS,
  SEARCH_USER_FAILURE, SEARCH_USER_REQUEST, SEARCH_USER_SUCCESS,
  UPDATE_PROFILE_FAILURE, UPDATE_PROFILE_REQUEST, UPDATE_PROFILE_SUCCESS,
} from "../auth.actionType";


// 1. Sign In Action
export const loginUserAction = (loginData) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const { data } = await api.post("/auth/signin", loginData.data);

    // ✅ signin returns { jwt: "..." }
    if (data && data.jwt) {
      localStorage.setItem("jwt", data.jwt);
      dispatch({ type: LOGIN_SUCCESS, payload: data.jwt });
      dispatch(getProfileAction());
      loginData.navigate("/");
    } else {
      dispatch({ type: LOGIN_FAILURE, payload: "Login failed. No token received." });
      alert("Login failed. Please try again.");
    }

  } catch (error) {
    console.error("FULL LOGIN ERROR:", error);
    const errorMsg =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      "Login Failed";
    dispatch({ type: LOGIN_FAILURE, payload: errorMsg });
    alert(errorMsg);
  }
};


// 2. Request OTP Action
export const requestOtpAction = (userData, setStep) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    await api.post("/auth/signup/request", userData);
    dispatch({ type: REGISTER_SUCCESS, payload: null });
    setStep(2);
  } catch (error) {
    const errorMsg =
      error.response?.data?.message ||
      error.response?.data ||
      "Registration Failed";
    dispatch({ type: REGISTER_FAILURE, payload: errorMsg });
    alert(errorMsg);
  }
};


// 3. Verify OTP And Register
export const verifyOtpAndRegisterAction = (verificationData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const { data } = await api.post("/auth/signup/verify", null, {
      params: {
        email: verificationData.email,
        otp: verificationData.otp
      }
    });

    if (data && data.token) {
      localStorage.setItem("jwt", data.token);
      dispatch({ type: REGISTER_SUCCESS, payload: data.token });
      dispatch(getProfileAction());
      verificationData.navigate("/");
    } else {
      dispatch({ type: REGISTER_FAILURE, payload: "No token received." });
      alert("Verification failed. Please try again.");
    }

  } catch (error) {
    const errorMsg =
      error.response?.data?.message ||
      error.response?.data ||
      "Verification Failed";
    dispatch({ type: REGISTER_FAILURE, payload: errorMsg });
    alert(errorMsg);
  }
};


// 4. Fetch Profile
export const getProfileAction = () => async (dispatch) => {
  dispatch({ type: GET_PROFILE_REQUEST });
  try {
    const res = await api.get("/api/users/profile");
    dispatch({ type: GET_PROFILE_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({ type: GET_PROFILE_FAILURE, payload: error.message });
  }
};


// 5. Update Profile Action
export const updateProfileAction = (reqData) => async (dispatch) => {
  dispatch({ type: UPDATE_PROFILE_REQUEST });
  try {
    const res = await api.put("/api/users", reqData);
    dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({ type: UPDATE_PROFILE_FAILURE, payload: error.message });
  }
};


// 6. Find User By ID Action
export const findUserByIdAction = (userId) => async (dispatch) => {
  dispatch({ type: GET_USER_BY_ID_REQUEST });
  try {
    const { data } = await api.get(`/api/users/${userId}`);
    dispatch({ type: GET_USER_BY_ID_SUCCESS, payload: data });
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    dispatch({ type: GET_USER_BY_ID_FAILURE, payload: errorMsg });
  }
};


// 7. Search User Action
export const searchUserAction = (query) => async (dispatch) => {
  dispatch({ type: SEARCH_USER_REQUEST });
  try {
    const { data } = await api.get(`/api/users/search?query=${query}`);
    dispatch({ type: SEARCH_USER_SUCCESS, payload: data });
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    dispatch({ type: SEARCH_USER_FAILURE, payload: errorMsg });
  }
};