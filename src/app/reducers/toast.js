import { SHOW_TOAST, HIDE_TOAST } from "../constants/actionTypes";

const initialState = { message: "", visible: false };

export default function toastReducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_TOAST:
      return { message: action.payload.message, visible: true };

    case HIDE_TOAST:
      return initialState;

    default:
      return state;
  }
}
