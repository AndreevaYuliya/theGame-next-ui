import axios from "misc/requests";
import config from "config";
import {
  REQUEST_MOVIES,
  RECEIVE_MOVIES,
  ERROR_MOVIES,
  REQUEST_DELETE_MOVIE,
  SUCCESS_DELETE_MOVIE,
  ERROR_DELETE_MOVIE,
} from "../constants/actionTypes";
import toastActions from "./toast";

const requestMovies = () => ({
  type: REQUEST_MOVIES,
});

const receiveMovies = (payload) => ({
  type: RECEIVE_MOVIES,
  payload,
});

const errorMovies = (errors) => ({
  type: ERROR_MOVIES,
  payload: errors,
});

const requestDelete = (id) => ({
  type: REQUEST_DELETE_MOVIE,
  payload: { id },
});

const successDelete = (id) => ({
  type: SUCCESS_DELETE_MOVIE,
  payload: { id },
});

const errorDelete = (payload) => ({
  type: ERROR_DELETE_MOVIE,
  payload,
});

const getMovies = ({ page, size, filters = {} }) => {
  const { MOVIES_SERVICE } = config;

  return axios.post(`${MOVIES_SERVICE}/movies/_list`, {
    page,
    size,
    ...filters,
  });
};

const deleteMovie = (id) => {
  const { MOVIES_SERVICE } = config;

  return axios.delete(`${MOVIES_SERVICE}/movies/${id}`);
};

const fetchMovies =
  ({ page = 0, size = 2, filters = {} } = {}) =>
  async (dispatch) => {
    dispatch(requestMovies());

    try {
      let data;

      const response = await getMovies({ page, size, filters });

      data = response?.data ?? response;

      const content =
        data?.content ?? data?.list ?? (Array.isArray(data) ? data : []);

      const normalized = {
        content,
        page: data?.page ?? page,
        size: data?.size ?? size,
        totalElements: data?.totalElements ?? content.length,
        totalPages: data?.totalPages ?? 1,
      };

      dispatch(receiveMovies(normalized));
    } catch (errors) {
      dispatch(errorMovies(errors));
    }
  };

const fetchDeleteMovie =
  (id, { successMessage, errorMessage } = {}) =>
  async (dispatch) => {
    dispatch(requestDelete(id));

    try {
      await deleteMovie(id);

      dispatch(successDelete(id));

      dispatch(
        toastActions.showToast(successMessage ?? "Movie deleted successfully")
      );

      setTimeout(() => dispatch(toastActions.hideToast()), 2500);

      return true;
    } catch (e) {
      const message =
        e?.response?.data?.message ||
        e?.response?.data ||
        e?.message ||
        errorMessage ||
        "Delete failed";

      dispatch(errorDelete({ message }));

      dispatch(toastActions.showToast(message));

      setTimeout(() => dispatch(toastActions.hideToast()), 2500);

      return false;
    }
  };

const moviesActions = {
  fetchMovies,
  fetchDeleteMovie,
};

export default moviesActions;
