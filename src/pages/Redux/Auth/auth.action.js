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
    const { data } = await api.post("/auth/signin", loginData.data);

    if (data.token) {
      localStorage.setItem("jwt", data.token);
      dispatch({ type: LOGIN_SUCCESS, payload: data.token });
      dispatch(getProfileAction(data.token));
      loginData.navigate("/");
    }
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    console.error("Login Error:", errorMsg);
    dispatch({ type: LOGIN_FAILURE, payload: errorMsg });
  }
};

// 2. STEP 1 OTP: Request Verification Email
export const requestOtpAction = (userData, setStep) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST }); // Uses standard register loading state
  try {
    const { data } = await api.post("/auth/signup/request", userData);
    console.log("OTP Sent:", data);
    
    // Switch the UI form panel to display the 6-digit OTP input step
    setStep(2); 
  } catch (error) {
    const errorMsg = error.response?.data || error.message;
    console.error("OTP Request Error:", errorMsg);
    dispatch({ type: REGISTER_FAILURE, payload: errorMsg });
    alert(errorMsg); // Inform user if email already exists
  }
};

// 3. STEP 2 OTP: Verify Code and Finalize Registration
export const verifyOtpAndRegisterAction = (verificationData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    // Send query parameters matching your Spring Boot @RequestParam setup
    const { data } = await api.post(
      `/auth/signup/verify?email=${verificationData.email}&otp=${verificationData.otp}`
    );

    if (data.token) {
      localStorage.setItem("jwt", data.token);
      dispatch({ type: REGISTER_SUCCESS, payload: data.token });
      dispatch(getProfileAction(data.token));
      verificationData.navigate("/");
    }
  } catch (error) {
    const errorMsg = error.response?.data || error.message;
    console.error("Verification Error:", errorMsg);
    dispatch({ type: REGISTER_FAILURE, payload: errorMsg });
    alert(errorMsg); // Inform user if code is incorrect/expired
  }
};

// 4. Fetch Profile Action (Cleaned trailing base URL out of path)
export const getProfileAction = (jwt) => async (dispatch) => {
  dispatch({ type: GET_PROFILE_REQUEST });
  try {
    const res = await api.get("/api/users/profile", {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    console.log("DEBUG DATA FROM BACKEND:", res.data);
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
