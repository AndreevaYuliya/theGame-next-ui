import axios from "misc/requests";
import config from "config";
import {
  RECEIVE_MOVIE_DETAILS,
  REQUEST_MOVIE_DETAILS,
  ERROR_MOVIE_DETAILS,
  CLEAR_MOVIE_DETAILS,
  REQUEST_CREATE_MOVIE,
  SUCCESS_CREATE_MOVIE,
  ERROR_CREATE_MOVIE,
  REQUEST_UPDATE_MOVIE,
  SUCCESS_UPDATE_MOVIE,
  ERROR_UPDATE_MOVIE,
  REQUEST_DIRECTORS,
  RECEIVE_DIRECTORS,
  ERROR_DIRECTORS,
} from "../constants/actionTypes";
import toastActions from "./toast";

const requestMovieDetails = () => ({
  type: REQUEST_MOVIE_DETAILS,
});

const receiveMovieDetails = (payload) => ({
  type: RECEIVE_MOVIE_DETAILS,
  payload,
});

const errorMovieDetails = (errors) => ({
  type: ERROR_MOVIE_DETAILS,
  payload: errors,
});

const clearMovieDetails = () => ({
  type: CLEAR_MOVIE_DETAILS,
});

const createMovieRequest = () => ({
  type: REQUEST_CREATE_MOVIE,
});

const createMovieSuccess = (payload) => ({
  type: SUCCESS_CREATE_MOVIE,
  payload,
});

const createMovieError = (errors) => ({
  type: ERROR_CREATE_MOVIE,
  payload: errors,
});

const updateMovieRequest = (id) => ({
  type: REQUEST_UPDATE_MOVIE,
  payload: { id },
});

const updateMovieSuccess = (id) => ({
  type: SUCCESS_UPDATE_MOVIE,
  payload: { id },
});

const updateMovieError = (errors) => ({
  type: ERROR_UPDATE_MOVIE,
  payload: errors,
});

const requestDirectors = () => ({
  type: REQUEST_DIRECTORS,
});

const receiveDirectors = (payload) => ({
  type: RECEIVE_DIRECTORS,
  payload,
});

const errorDirectors = (errors) => ({
  type: ERROR_DIRECTORS,
  payload: errors,
});

const getMovieDetails = (id) => {
  const { MOVIES_SERVICE } = config;

  return axios.get(`${MOVIES_SERVICE}/movies/${id}`);
};

const createMovie = (data) => {
  const { MOVIES_SERVICE } = config;

  return axios.post(`${MOVIES_SERVICE}/movies`, data);
};

const updateMovie = (id, data) => {
  const { MOVIES_SERVICE } = config;

  return axios.put(`${MOVIES_SERVICE}/movies/${id}`, data);
};

const getDirectors = () => {
  const { MOVIES_SERVICE } = config;

  return axios.get(`${MOVIES_SERVICE}/directors`);
};

const fetchMovieDetails = (id) => async (dispatch) => {
  dispatch(requestMovieDetails());

  try {
    let data;

    const response = await getMovieDetails(id);

    data = response?.data ?? response;

    dispatch(receiveMovieDetails(data));

    return data;
  } catch (errors) {
    dispatch(errorMovieDetails(errors));
  }
};

const fetchDirectors = () => async (dispatch) => {
  dispatch(requestDirectors());

  try {
    let data;

    const response = await getDirectors();

    data = response?.data ?? response;

    dispatch(receiveDirectors(data));

    return data;
  } catch (errors) {
    dispatch(errorDirectors(errors));
  }
};

const fetchCreateMovie = (movieData) => async (dispatch) => {
  dispatch(createMovieRequest());

  try {
    const response = await createMovie(movieData);
    const data = response?.data ?? response;

    dispatch(createMovieSuccess(data));
    dispatch(toastActions.showToast("Movie created successfully"));

    setTimeout(() => dispatch(toastActions.hideToast()), 2500);

    return data;
  } catch (errors) {
    const message =
      errors?.response?.data?.message ||
      errors?.response?.data ||
      errors?.message ||
      "Creation failed";

    dispatch(createMovieError({ message }));
    dispatch(toastActions.showToast(message));

    setTimeout(() => dispatch(toastActions.hideToast()), 2500);

    return false;
  }
};

const fetchUpdateMovie = (id, movieData) => async (dispatch) => {
  dispatch(updateMovieRequest(id));

  try {
    const response = await updateMovie(id, movieData);
    const data = response?.data ?? response;

    dispatch(updateMovieSuccess(id));
    dispatch(receiveMovieDetails(data));
    dispatch(toastActions.showToast("Movie updated successfully"));

    setTimeout(() => dispatch(toastActions.hideToast()), 2500);

    return data;
  } catch (errors) {
    const message =
      errors?.response?.data?.message ||
      errors?.response?.data ||
      errors?.message ||
      "Update failed";

    dispatch(updateMovieError({ message }));
    dispatch(toastActions.showToast(message));

    setTimeout(() => dispatch(toastActions.hideToast()), 2500);

    return false;
  }
};

const movieDetailsActions = {
  fetchMovieDetails,
  fetchCreateMovie,
  fetchUpdateMovie,
  receiveMovieDetails,
  clearMovieDetails,
  fetchDirectors,
};

export default movieDetailsActions;
