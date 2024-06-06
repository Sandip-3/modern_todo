import axios from "axios";

export const appAxios = axios.create({
  baseURL: "http://localhost:8080/api/v1/",
});

appAxios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    const token = accessToken ? JSON.parse(accessToken) : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
