import {
  SET_DANIS,
  LOADING_DATA,
  LIKE_DANI,
  UNLIKE_DANI,
  SET_ERRORS,
  LOADING_UI,
  CLEAR_ERRORS,
  POST_DANI,
  SET_DANI,
  STOP_LOADING_UI,
  POST_COMMENT,
} from "../types";
import daniProxy from "../../patterns/proxy";
const proxyurl = "https://cors-anywhere.herokuapp.com/";
const apiurl = "https://us-central1-danibook-983c2.cloudfunctions.net/api";
const prox = new daniProxy();

export const getDanisS = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  prox
    .getDanis("/getDanis")
    .then((res) => {
      dispatch({
        type: SET_DANIS,
        payload: res,
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_DANIS,
        payload: err,
      });
    });
};

export const PostDani = (daniData) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  prox
    .postDani("/postDanis", daniData)
    .then((res) => {
      dispatch({
        type: POST_DANI,
        payload: res,
      });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const likeDani = (daniId) => (dispatch) => {
  prox
    .likeDani(`/dani/${daniId}/like`)
    .then((res) => {
      dispatch({
        type: LIKE_DANI,
        payload: res,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const unlikeDani = (daniId) => (dispatch) => {
  prox
    .unlikeDani(`/dani/${daniId}/unlike`)
    .then((res) => {
      dispatch({
        type: UNLIKE_DANI,
        payload: res,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

export const getDani = (daniId) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  prox
    .getComments(`/dani/${daniId}`)
    .then((res) => {
      dispatch({
        type: SET_DANI,
        payload: res,
      });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const postComments = (daniId, comment) => (dispatch) => {
  prox
    .postComment(`/dani/${daniId}/comment`, comment)
    .then((res) => {
      dispatch({ type: POST_COMMENT, payload: res });
    })
    .catch((err) => {
      dispatch({ type: SET_ERRORS, payload: err.response.data });
    });
};
