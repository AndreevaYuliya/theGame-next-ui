import { combineReducers } from "redux";

import user from "./user";
import movies from "./movies";
import movieDetails from "./movieDetails";
import toast from "./toast";
import reviews from "./reviews";

export default combineReducers({
  user,
  movies,
  movieDetails,
  reviews,
  toast,
});
