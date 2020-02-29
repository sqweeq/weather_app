import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL
} from "./types";
import { returnErrors } from "./errorActions";
import axios from "axios";
// check token and load user

export const loadUser = () => (dispatch, getState) => {
  // user loading
  dispatch({ type: USER_LOADING });

  axios
    .get("/api/auth/user", tokenConfig(getState))
    .then(res =>
      dispatch({
        type: USER_LOADED,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({ type: AUTH_ERROR });
    });
};
// register user
export const register = ({ name, email, password }, history) => dispatch => {
  // headers
  const config = {
    headers: {
      "Content-type": "application/json"
    }
  };
  // request body
  const body = JSON.stringify({ name, email, password });
  axios
    .post("/api/users", body, config)

    .then(res =>
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      })
    )
    .then(res => history.push("/login")) // re-direct to login on successful register

    .catch(err => {
      dispatch({
        type: REGISTER_FAIL
      });
      dispatch(
        returnErrors(err.response.data, err.response.status, "REGISTER_FAIL")
      );
    });
};
// login user
export const login = ({ email, password }, history) => dispatch => {
  // headers
  const config = {
    headers: {
      "Content-type": "application/json"
    }
  };
  // request body
  const body = JSON.stringify({ email, password });
  axios
    .post("/api/auth", body, config)

    .then(res =>
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      })
    )
    .then(res => history.push("/"))
    .catch(err => {
      dispatch({
        type: LOGIN_FAIL
      });
      dispatch(
        returnErrors(err.response.data, err.response.status, "LOGIN_FAIL")
      );
    });
};

// logout user
export const logout = () => {
  return {
    type: LOGOUT_SUCCESS
  };
};

// setup config/headers and token
export const tokenConfig = getState => {
  // get token from localstorage
  const token = getState().auth.token;

  // set headers
  const config = {
    headers: {
      "Content-type": "application/json"
    }
  };
  // if there is token , add to headers
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return config;
};
