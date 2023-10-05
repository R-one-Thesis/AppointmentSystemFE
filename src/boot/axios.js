import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { auth } from "../stores/auth";
// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

const api = axios.create({ baseURL: process.env.VUE_APP_API_URL })

export default boot(({ app }) => {
  const store = auth();

  // for use inside Vue files (Options API) through this.$axios and this.$api
  const setAuthToken = (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  };

  // Check if the user is authenticated and set the default headers accordingly
  const token = store.token;
  setAuthToken(token);

  // Intercept requests to modify the configuration (e.g., add headers)
  api.interceptors.request.use(
    (config) => {
      // You can add more modifications to the request config here if needed
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }
