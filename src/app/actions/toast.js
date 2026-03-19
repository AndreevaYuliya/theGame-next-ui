import { SHOW_TOAST, HIDE_TOAST } from "../constants/actionTypes";

const showToast = (message) => ({
  type: SHOW_TOAST,
  payload: { message },
});

const hideToast = () => ({ type: HIDE_TOAST });

const toastActions = {
  showToast,
  hideToast,
};

export default toastActions;
