import axios from "misc/requests";
import config from "config";
import storage, { keys } from "misc/storage";
import {
  ERROR_SIGN_IN,
  ERROR_SIGN_UP,
  RECEIVE_USER,
  REQUEST_SIGN_IN,
  REQUEST_SIGN_OUT,
  REQUEST_SIGN_UP,
  REQUEST_USER,
  ERROR_RECEIVE_USER,
  SUCCESS_SIGN_IN,
  SUCCESS_SIGN_UP,
} from "../constants/actionTypes";

const receiveUser = (user) => ({
  payload: user,
  type: RECEIVE_USER,
});

const errorReceiveUser = () => ({
  type: ERROR_RECEIVE_USER,
});

const requestUser = () => ({
  type: REQUEST_USER,
});

const errorSignIn = (errors) => ({
  payload: errors,
  type: ERROR_SIGN_IN,
});

const requestSignIn = () => ({
  type: REQUEST_SIGN_IN,
});

const successSignIn = (user) => ({
  payload: user,
  type: SUCCESS_SIGN_IN,
});

const errorSignUp = (errors) => ({
  payload: errors,
  type: ERROR_SIGN_UP,
});

const requestSignUp = () => ({
  type: REQUEST_SIGN_UP,
});

const successSignUp = () => ({
  type: SUCCESS_SIGN_UP,
});

const requestSignOut = () => ({
  type: REQUEST_SIGN_OUT,
});

const getLoginUrl = (baseUrl) => `${baseUrl}/oauth2/authorization/auth`;
const getLogoutUrl = (baseUrl) => `${baseUrl}/logout`;

const redirectToLogin = () => {
  const { USERS_SERVICE } = config;
  window.location.href = getLoginUrl(USERS_SERVICE);
};

const getUser = () => {
  const { USERS_SERVICE } = config;

  return axios.get(`${USERS_SERVICE}/profile`);
};

const signIn = ({ email, login, password }) => {
  const { USERS_SERVICE } = config;

  sessionStorage.setItem("loginRedirect", "1");
  return Promise.resolve((window.location.href = getLoginUrl(USERS_SERVICE)));
};

const signUp = ({ email, firstName, lastName, login, password }) => {
  const { USERS_SERVICE } = config;

  return axios.post(`${USERS_SERVICE}/user/signUp`, {
    email,
    firstName,
    lastName,
    login,
    password,
  });
};

const fetchRefreshToken = () => (dispatch) => {};

const fetchSignIn =
  ({ email, login, password }) =>
  async (dispatch) => {
    dispatch(requestSignIn());

    try {
      await signIn({ email, login, password });
      return null;
    } catch (errors) {
      dispatch(errorSignIn(errors));
      return null;
    }
  };

const fetchSignOut = () => (dispatch) => {
  storage.removeItem(keys.TOKEN);

  storage.removeItem(keys.TOKEN_EXPIRATION);

  storage.removeItem("USER"); // TODO: Mocked code

  dispatch(requestSignOut());

  const { USERS_SERVICE } = config;
  window.location.href = getLogoutUrl(USERS_SERVICE);
};

const fetchSignUp =
  ({ email, firstName, lastName, login, password }) =>
  (dispatch) => {
    dispatch(requestSignUp());

    return signUp({
      email,
      firstName,
      lastName,
      login,
      password,
    })
      .then(() => dispatch(successSignUp()))
      .catch((errors) => dispatch(errorSignUp(errors)));
  };

let fetchUserInFlight = null;

const fetchUser = () => (dispatch) => {
  if (fetchUserInFlight) {
    return fetchUserInFlight;
  }

  fetchUserInFlight = (async () => {
    dispatch(requestUser());

    try {
      const responce = await getUser();
      const user = responce?.data ?? responce;
      return dispatch(receiveUser(user));
    } catch (error) {
      const status = error?.response?.status;

      if (status === 401 || status === 302 || !status) {
        dispatch(errorReceiveUser());
        return null;
      }

      return dispatch(fetchSignOut());
    } finally {
      fetchUserInFlight = null;
    }
  })();

  return fetchUserInFlight;
};

const exportFunctions = {
  fetchRefreshToken,
  fetchSignIn,
  fetchSignOut,
  fetchSignUp,
  fetchUser,
};

export default exportFunctions;
