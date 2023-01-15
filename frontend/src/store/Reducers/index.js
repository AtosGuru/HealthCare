import { combineReducers,createStore } from "redux";
import BasicReducer from "./BasicReducer";

const reducers = combineReducers({
  BasicData: BasicReducer,
});

export const store = createStore(
  reducers,
  {
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default reducers;