import {
  SET_USER,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  LIKE_DANI,
  UNLIKE_DANI,
  GET_NOTIFICATIONS,
} from "../types";

const initialState = {
  authenticated: false,
  loading: false,
  usrData: {},
  likes: [],
  notifications: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true,
      };

    case SET_UNAUTHENTICATED:
      return initialState;
    case SET_USER:
      return {
        authenticated: true,
        loading: false,
        ...action.payload,
      };
    case LOADING_USER:
      return {
        ...state,
        loading: true,
      };

    case LIKE_DANI:
      return {
        ...state,
        likes: [
          ...state.likes,
          {
            userHandle: state.usrData.handle,
            daniId: action.payload.daniId,
          },
        ],
      };
    case UNLIKE_DANI:
      return {
        ...state,
        likes: state.likes.filter(
          (like) => like.daniId !== action.payload.daniId
        ),
      };
    case GET_NOTIFICATIONS:
      state.notifications.forEach((notification) => (notification.read = true));
      return {
        ...state,
      };
    default:
      return state;
  }
}
