import {
  SET_DANIS,
  LOADING_DATA,
  LIKE_DANI,
  UNLIKE_DANI,
  POST_DANI,
  SET_DANI,
  POST_COMMENT,
} from "../types";

const initialState = {
  danis: [],
  dani: {},
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true,
      };
    case SET_DANIS:
      return {
        ...state,
        danis: action.payload,
        loading: false,
      };
    case SET_DANI:
      return {
        ...state,
        dani: action.payload,
        loading: false,
      };

    case LIKE_DANI:
    case UNLIKE_DANI:
      let index = state.danis.findIndex(
        (dani) => dani.daniId === action.payload.daniId
      );
      state.danis[index] = action.payload;
      return {
        ...state,
      };

    case POST_DANI:
      return {
        ...state,
        danis: [action.payload, ...state.danis],
      };

    case POST_COMMENT:
      return {
        ...state,
        dani: {
          ...state.dani,
          comments: [action.payload, ...state.dani.comments],
        },
      };
    default:
      return state;
  }
}
