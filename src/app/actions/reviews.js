import axios from "misc/requests";
import config from "config";
import {
  REQUEST_REVIEWS,
  RECEIVE_REVIEWS,
  ERROR_REVIEWS,
  REQUEST_REVIEW_COUNTS,
  RECEIVE_REVIEW_COUNTS,
  ERROR_REVIEW_COUNTS,
} from "../constants/actionTypes";
import toastActions from "./toast";

const requestReviews = () => ({
  type: REQUEST_REVIEWS,
});

const receiveReviews = (payload) => ({
  type: RECEIVE_REVIEWS,
  payload,
});

const errorReviews = (errors) => ({
  type: ERROR_REVIEWS,
  payload: errors,
});

const requestReviewCounts = () => ({
  type: REQUEST_REVIEW_COUNTS,
});

const receiveReviewCounts = (payload) => ({
  type: RECEIVE_REVIEW_COUNTS,
  payload,
});

const errorReviewCounts = (errors) => ({
  type: ERROR_REVIEW_COUNTS,
  payload: errors,
});

const fetchReviews =
  ({ movieId, from = 0, size = 5, errorMessage } = {}) =>
  async (dispatch) => {
    dispatch(requestReviews());

    try {
      const res = await axios.get(`${config.REVIEWS_SERVICE}/reviews`, {
        params: { movieId, from, size },
      });

      const data = res?.data ?? res;

      dispatch(
        receiveReviews({
          movieId,
          items: data,
          from,
        })
      );
      return data;
    } catch (errors) {
      dispatch(errorReviews(errors));

      dispatch(
        toastActions.showToast(errorMessage ?? "Failed to load reviews")
      );

      setTimeout(() => dispatch(toastActions.hideToast()), 2000);

      return null;
    }
  };

const fetchCounts = (movieIds) => async (dispatch) => {
  dispatch(requestReviewCounts());

  try {
    const res = await axios.post(`${config.REVIEWS_SERVICE}/reviews/_counts`, {
      movieIds,
    });

    const data = res?.data ?? res;

    dispatch(receiveReviewCounts(data));

    return data;
  } catch (errors) {
    dispatch(errorReviewCounts(errors));

    return null;
  }
};

const createReview =
  (payload, { successMessage, errorMessage } = {}) =>
  async (dispatch) => {
    try {
      const res = await axios.post(
        `${config.REVIEWS_SERVICE}/reviews`,
        payload
      );

      const data = res?.data ?? res;

      if (successMessage) {
        dispatch(toastActions.showToast(successMessage));

        setTimeout(() => dispatch(toastActions.hideToast()), 2000);
      }

      return data;
    } catch (e) {
      const message =
        e?.response?.data?.message ||
        e?.response?.data ||
        e?.message ||
        errorMessage ||
        "Failed to create review";

      dispatch(toastActions.showToast(message));

      setTimeout(() => dispatch(toastActions.hideToast()), 2000);

      throw e;
    }
  };

const reviewsActions = {
  fetchReviews,
  fetchCounts,
  createReview,
};

export default reviewsActions;
