import axios from "axios";
import Cookies from "js-cookie";

export const instance = axios.create({
  baseURL: "http://localhost:8888/v1/api",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent

    const token = Cookies.get("accessToken");
    config.headers = config.headers || {};
    config.headers.Authorization = token ? `Bearer ${token}` : "123123";

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);
