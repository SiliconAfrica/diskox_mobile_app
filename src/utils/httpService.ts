import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import * as SecureStorage from "expo-secure-store";

export const FRONTEND_BASE_URL = "https://test.diskox.com/";
export const BASE_URL = "https://test404.diskox.com/api/v1";
export const IMAGE_BASE = "https://test404.diskox.com/storage/";

const httpService = axios.create({
  baseURL: BASE_URL,
});

httpService.interceptors.request.use(
  async (config: InternalAxiosRequestConfig<any>) => {
    const token = await SecureStorage.getItemAsync("token");
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
      if (token === null) {
        return config;
      }
      config.headers!["authorization"] = `Bearer ${token}`;

      return config;
    } else {
      config.headers!["Content-Type"] = "application/json";
      if (token === null) {
        return config;
      }
      config.headers!["authorization"] = `Bearer ${token}`;
      return config;
    }
  }
);

httpService.interceptors.response.use(
  (response: AxiosResponse<any, any>) => {
    return response;
  },
  async (error: AxiosError<any, any>) => {
    console.log(error.message);
    if (!error.response) {
      return Promise.reject(error.message);
    } else {
      return Promise.reject(error.response.data);
      if (error.response?.data.message instanceof Array) {
        const msg = error.response?.data.message as Array<any>;
        return Promise.reject(JSON.stringify(error.response?.data.message));
      } else {
        if (error.response.status === 401 || error.response.status === 403) {
          localStorage.setItem("token", "");
        }
        return Promise.reject(error.response?.data.message);
      }
    }
  }
);
export default httpService;
