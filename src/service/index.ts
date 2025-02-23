import { API_ENDPOINT } from "@/constants/variable";
import axios from "axios";
import Cookies from "js-cookie";

export const instance = axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  function (config) {
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
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await instance.post(
          "/users/refresh-token",
          {},
          { withCredentials: true }
        );
        Cookies.set("accessToken", data.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return instance(originalRequest);
      } catch (err) {
        console.error("Không thể làm mới access token:", err);
        window.location.href = "/login";
        Cookies.remove("user");
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        Cookies.remove("role");
      }
    }
    return Promise.reject(error);
  }
);
