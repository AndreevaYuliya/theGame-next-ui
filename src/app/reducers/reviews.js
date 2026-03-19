import {
  REQUEST_REVIEWS,
  RECEIVE_REVIEWS,
  ERROR_REVIEWS,
  REQUEST_REVIEW_COUNTS,
  RECEIVE_REVIEW_COUNTS,
  ERROR_REVIEW_COUNTS,
} from "../constants/actionTypes";

const initialState = {
  items: [],
  loading: false,
  error: null,
  counts: {},
  countsLoading: false,
};

export default function reviews(state = initialState, action) {
  switch (action.type) {
    case REQUEST_REVIEWS:
      return { ...state, loading: true, error: null };

    case RECEIVE_REVIEWS:
      return {
        ...state,
        loading: false,
        items:
          action.payload.from && action.payload.from > 0
            ? [...state.items, ...(action.payload.items || [])]
            : action.payload.items || [],
      };

    case ERROR_REVIEWS:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case REQUEST_REVIEW_COUNTS:
      return {
        ...state,
        countsLoading: true,
      };

    case RECEIVE_REVIEW_COUNTS:
      return {
        ...state,
        countsLoading: false,
        counts: action.payload || {},
      };

    case ERROR_REVIEW_COUNTS:
      return {
        ...state,
        countsLoading: false,
      };

    default:
      return state;
  }
}
