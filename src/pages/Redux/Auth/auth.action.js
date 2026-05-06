import axios from "axios";
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
import { api, API_BASE_URL } from "../../../componets/config/api";

export const loginUserAction = (loginData) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/auth/signin`,
      loginData.data,
    );

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

export const registerUserAction = (loginData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/auth/signup`,
      loginData.data,
    );

    if (data.token) {
      localStorage.setItem("jwt", data.token);
      dispatch({ type: REGISTER_SUCCESS, payload: data.token });
      dispatch(getProfileAction(data.token));
      loginData.navigate("/");
    }
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    console.error("Register Error Details:", error.response?.data);
    dispatch({ type: REGISTER_FAILURE, payload: errorMsg });
  }
};

// auth.action.j
export const getProfileAction = (jwt) => async (dispatch) => {
  dispatch({ type: GET_PROFILE_REQUEST });
  try {
    const res = await axios.get(`${API_BASE_URL}/api/users/profile`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    // If this shows {} in the console, your Java method above is returning null
    console.log("DEBUG DATA FROM BACKEND:", res.data);

    dispatch({
      type: GET_PROFILE_SUCCESS,
      payload: res.data, // Use the data directly
    });
  } catch (error) {
    dispatch({ type: GET_PROFILE_FAILURE, payload: error.message });
  }
};

export const updateProfileAction = (reqData) => async (dispatch) => {
  dispatch({ type: UPDATE_PROFILE_REQUEST });
  try {
    const jwt = localStorage.getItem("jwt");

    const res = await axios.put(`${API_BASE_URL}/api/users`, reqData, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Update Success:", res.data);
    dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: res.data });
  } catch (error) {
    // This will now show the UserException message from your Java code
    console.log(
      "Detailed Error:",
      error.response?.data?.message || error.message,
    );
    dispatch({ type: UPDATE_PROFILE_FAILURE, payload: error.message });
  } //loolo
};

export const findUserByIdAction = (userId) => async (dispatch) => {
  dispatch({ type: GET_USER_BY_ID_REQUEST });
  try {
    const jwt = localStorage.getItem("jwt");
    // Ensure the URL matches your Spring Boot @GetMapping("/api/users/{userId}")
    const { data } = await axios.get(`${API_BASE_URL}/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    console.log("FIND USER BY ID SUCCESS:", data);
    dispatch({ type: GET_USER_BY_ID_SUCCESS, payload: data });
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    console.error("Find User Error:", errorMsg);
    dispatch({ type: GET_USER_BY_ID_FAILURE, payload: errorMsg });
  }
};

// Action to Search Users (Used for Search Bar)
export const searchUserAction = (query) => async (dispatch) => {
  dispatch({ type: SEARCH_USER_REQUEST });
  try {
    const jwt = localStorage.getItem("jwt");
    const { data } = await axios.get(
      `${API_BASE_URL}/api/users/search?query=${query}`,
      {
        headers: { Authorization: `Bearer ${jwt}` },
      },
    );

    console.log("SEARCH USER SUCCESS:", data);
    dispatch({ type: SEARCH_USER_SUCCESS, payload: data });
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    dispatch({ type: SEARCH_USER_FAILURE, payload: errorMsg });
  }
};
