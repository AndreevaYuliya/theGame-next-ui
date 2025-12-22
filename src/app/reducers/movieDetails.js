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

const initialState = {
  loading: true,
  id: "",
  title: "",
  image: "",
  rating: null,
  year: "",
  director: { name: "", country: "" },
  genres: "",
  description: "",
  errors: [],
};

const convertErrors = (errors) =>
  Array.isArray(errors)
    ? errors.map((error) => ({
        code: error.code,
        description: error.description,
      }))
    : [];

export default function movieDetailsReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_MOVIE_DETAILS:
      return {
        ...state,
        loading: true,
        errors: [],
      };

    case RECEIVE_MOVIE_DETAILS:
      const movie = action.payload;
      return {
        ...state,
        loading: false,
        errors: [],
        id: movie.id || initialState.id,
        title: movie.title || initialState.title,
        image: movie.image || initialState.image,
        description: movie.description || initialState.description,
        director: movie.director || initialState.director,
        genres: movie.genres || initialState.genres,
        rating:
          movie.rating !== undefined && movie.rating !== null
            ? movie.rating
            : initialState.rating,
        year: movie.yearReleased || movie.year || initialState.year,
      };

    case ERROR_MOVIE_DETAILS:
      return {
        ...initialState,
        loading: false,
        errors: convertErrors(action.payload),
      };

    case CLEAR_MOVIE_DETAILS:
      return {
        ...state,
        loading: true,
        errors: [],
      };

    case REQUEST_CREATE_MOVIE:
      return {
        ...state,
        loading: true,
        errors: [],
      };

    case SUCCESS_CREATE_MOVIE:
      return {
        ...state,
        loading: false,
        errors: [],
        id: action.payload?.id || initialState.id,
        title: action.payload?.title || initialState.title,
        image: action.payload?.image || initialState.image,
        description: action.payload?.description || initialState.description,
        director: action.payload?.director || initialState.director,
        genres: action.payload?.genres || initialState.genres,
        rating:
          action.payload?.rating !== undefined &&
          action.payload?.rating !== null
            ? action.payload.rating
            : initialState.rating,
        year:
          action.payload?.yearReleased ||
          action.payload?.year ||
          initialState.year,
      };

    case ERROR_CREATE_MOVIE:
      return {
        ...state,
        loading: false,
        errors: convertErrors(action.payload),
      };

    case REQUEST_UPDATE_MOVIE:
      return {
        ...state,
        loading: true,
        errors: [],
      };

    case SUCCESS_UPDATE_MOVIE:
      return {
        ...state,
        loading: false,
        errors: [],
      };

    case ERROR_UPDATE_MOVIE:
      return {
        ...state,
        loading: false,
        errors: convertErrors(action.payload),
      };

    case REQUEST_DIRECTORS:
      return {
        ...state,
        loading: true,
        errors: [],
      };

    case RECEIVE_DIRECTORS:
      return {
        ...state,
        loading: false,
        errors: [],
        directors: action.payload || [],
      };

    case ERROR_DIRECTORS:
      return {
        ...state,
        loading: false,
        errors: convertErrors(action.payload),
      };

    default:
      return state;
  }
}
