import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import user_reducer from "./Reducers/user_reducers";
import data_reducer from "./Reducers/data_reducers";
import ui_reducer from "./Reducers/ui_reducers";
import { reducer as formReducer } from "redux-form";
const initialState = {};
const middleWare = [thunk];

const reducers = combineReducers({
  form: formReducer,
  user: user_reducer,
  data: data_reducer,
  UI: ui_reducer,
});

const store = createStore(
  reducers,
  initialState,
  compose( 
    applyMiddleware(...middleWare),
    window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : (f) => f
  )
);

export default store;
