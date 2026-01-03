import {
  REQUEST_MOVIES,
  RECEIVE_MOVIES,
  ERROR_MOVIES,
  REQUEST_DELETE_MOVIE,
  SUCCESS_DELETE_MOVIE,
  ERROR_DELETE_MOVIE,
} from "../constants/actionTypes";

const initialState = {
  loading: true,
  items: [],
  page: 0,
  size: 2,
  totalElements: 0,
  totalPages: 0,
  error: null,
  deletingId: null,
  deleteError: null,
};

export default function moviesReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_MOVIES:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case RECEIVE_MOVIES:
      return {
        ...state,
        loading: false,
        items: action.payload.content,
        page: action.payload.page,
        size: action.payload.size,
        totalElements: action.payload.totalElements,
        totalPages: action.payload.totalPages,
      };

    case ERROR_MOVIES:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case REQUEST_DELETE_MOVIE:
      return {
        ...state,
        deletingId: action.payload.id,
        deleteError: null,
      };

    case SUCCESS_DELETE_MOVIE: {
      const totalElements = Math.max(0, state.totalElements - 1);

      const totalPages = Math.max(1, Math.ceil(totalElements / state.size));

      return {
        ...state,
        deletingId: null,
        deleteError: null,
        items: state.items.filter((m) => m.id !== action.payload.id),
        totalElements,
        totalPages,
      };
    }

    case ERROR_DELETE_MOVIE:
      return {
        ...state,
        deletingId: null,
        deleteError: action.payload,
      };

    default:
      return state;
  }
}
