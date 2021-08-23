import {
  SET_USER,
  LOADING_UI,
  CLEAR_ERRORS,
  SET_ERRORS,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  SET_AUTHENTICATED,
  GET_NOTIFICATIONS,
} from "../types";
import daniProxy from "../../patterns/proxy";
import axios from "axios";
const proxyurl = "https://cors-anywhere.herokuapp.com/";
const apiurl = "https://us-central1-danibook-983c2.cloudfunctions.net/api";
const prox = new daniProxy(proxyurl, apiurl);

export const loginUser = (userData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  prox
    .loginUser("/login", userData)
    .then((token) => {
      const userToken = `Bearer ${token.token}`;
      localStorage.setItem("IdToken", userToken);
      axios.defaults.headers.common["Authorization"] = userToken;
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push("/");
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("IdToken");
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: SET_UNAUTHENTICATED });
};

export const setAuthenticated = () => (dispatch) => {
  dispatch({ type: SET_AUTHENTICATED });
};

export const SignUpuser = (NuserData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  prox
    .signupUser("/signup", NuserData)
    .then((token) => {
      const userToken = `Bearer ${token.token}`;
      localStorage.setItem("IdToken", userToken);
      axios.defaults.headers.common["Authorization"] = userToken;
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push("/");
    })
    .catch((err) => {
      console.log(err.response.data);
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};
export const updateUinfo = (userD) => (dispatch) => {
  dispatch({ type: LOADING_USER });
  prox
    .updateUserInfo("/user", userD)
    .then(() => {
      dispatch(getUserData());
    })
    .catch((err) => {
      console.log(err);
    });
};
export const getUserData = () => (dispatch) => {
  dispatch({ type: LOADING_USER });
  prox
    .getUdata("/user")
    .then((res) => {
      dispatch({
        type: SET_USER,
        payload: res,
      });
    })
    .catch((err) => {
      console.log(err.response);
    });
};

export const UploadImage = (formData) => (dispatch) => {
  dispatch({ type: LOADING_USER });
  prox
    .UploadImage("/user/image", formData)
    .then(() => {
      dispatch(getUserData());
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getNotifications = (notificationId) => (dispatch) => {
  prox
    .getNotification("/notifications", notificationId)
    .then((res) => {
      dispatch({ type: GET_NOTIFICATIONS });
    })
    .catch((err) => {
      console.log(err);
    });
};
