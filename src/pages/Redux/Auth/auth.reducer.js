import {
  GET_PROFILE_REQUEST, GET_PROFILE_SUCCESS, GET_PROFILE_FAILURE,
  LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS,
  REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS,
  UPDATE_PROFILE_REQUEST, UPDATE_PROFILE_SUCCESS, UPDATE_PROFILE_FAILURE,
  GET_USER_BY_ID_REQUEST, GET_USER_BY_ID_SUCCESS, GET_USER_BY_ID_FAILURE,
  SEARCH_USER_REQUEST, SEARCH_USER_SUCCESS, SEARCH_USER_FAILURE 
} from "../auth.actionType";

export const LOGOUT = "LOGOUT";

const initialState = {
  jwt: localStorage.getItem("jwt") || null,
  error: null,
  loading: false,
  user: null, 
  reqUser: null,
  searchUser: [] 
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
    case GET_PROFILE_REQUEST:
    case UPDATE_PROFILE_REQUEST:
    case GET_USER_BY_ID_REQUEST:
    case SEARCH_USER_REQUEST: 
      return { ...state, loading: true, error: null };

    case GET_PROFILE_SUCCESS:
    case UPDATE_PROFILE_SUCCESS:
      return { ...state, user: action.payload, loading: false, error: null };

    case SEARCH_USER_SUCCESS: 
      return { ...state, searchUser: action.payload, loading: false, error: null };

    case GET_USER_BY_ID_SUCCESS:
      return { ...state, reqUser: action.payload, loading: false, error: null };

    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
  return { ...state, loading: false };


    case LOGIN_FAILURE:
    case REGISTER_FAILURE:
    case GET_PROFILE_FAILURE:
    case UPDATE_PROFILE_FAILURE:
    case GET_USER_BY_ID_FAILURE:
    case SEARCH_USER_FAILURE: 
      return { ...state, loading: false, error: action.payload };

    case LOGOUT:
      localStorage.removeItem("jwt");
      return { ...initialState, jwt: null };

    default:
      return state;
  }
};
