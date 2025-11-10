import axios from "axios";
import { config } from "../config";

export const axiosInstance = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = {
  get: <T>(url: string, config?: Parameters<typeof axiosInstance.get>[1]) =>
    axiosInstance.get<T>(url, config).then((res) => res.data),

  post: <T>(
    url: string,
    data?: unknown,
    config?: Parameters<typeof axiosInstance.post>[2]
  ) => axiosInstance.post<T>(url, data, config).then((res) => res.data),

  put: <T>(
    url: string,
    data?: unknown,
    config?: Parameters<typeof axiosInstance.put>[2]
  ) => axiosInstance.put<T>(url, data, config).then((res) => res.data),

  delete: <T>(
    url: string,
    config?: Parameters<typeof axiosInstance.delete>[1]
  ) => axiosInstance.delete<T>(url, config).then((res) => res.data),

  patch: <T>(
    url: string,
    data?: unknown,
    config?: Parameters<typeof axiosInstance.patch>[2]
  ) => axiosInstance.patch<T>(url, data, config).then((res) => res.data),
};

/**
 * Example: Adding request interceptor for authentication
 *
 * axiosInstance.interceptors.request.use((config) => {
 *   const token = localStorage.getItem('token');
 *   if (token) {
 *     config.headers.Authorization = `Bearer ${token}`;
 *   }
 *   return config;
 * });
 */

/**
 * Example: Adding response interceptor for error handling
 *
 * axiosInstance.interceptors.response.use(
 *   (response) => response,
 *   (error) => {
 *     if (error.response?.status === 401) {
 *       // Handle unauthorized
 *       window.location.href = '/login';
 *     }
 *     return Promise.reject(error);
 *   }
 * );
 */
