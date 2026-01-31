import axios from "axios";
import storage, { keys } from "../storage";

axios.defaults.withCredentials = true;

axios.interceptors.request.use((params) => {
  const token = storage.getItem(keys.TOKEN);
  if (token) {
    params.headers.setAuthorization(`Bearer ${token}`);
  }
  return params;
});

const addAxiosInterceptors = ({ onSignOut }) => {
  axios.interceptors.response.use(
    (response) => response.data,
    (error) => {
      const data = error?.response?.data;

      if (
        Array.isArray(data) &&
        data.some((beError) => beError?.code === "INVALID_TOKEN")
      ) {
        onSignOut();
      }

      return Promise.reject(data ?? error);
    }
  );
};

export { addAxiosInterceptors };

export default axios;
