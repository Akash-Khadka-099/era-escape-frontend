import useAuthStore from "@/store/authStore";
import useAuthModalStore from "@/store/authModalStore";
import { message } from "antd";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const AUTH_ENDPOINTS_TO_SKIP_MODAL = [
  "/api/auth/login",
  "/api/auth/refresh",
];
const AUTH_REQUIRED_MESSAGE_KEY = "auth-required-message";
let lastAuthPromptShownAt = 0;

const isAuthExemptEndpoint = (url?: string) => {
  if (!url) return false;
  return AUTH_ENDPOINTS_TO_SKIP_MODAL.some((endpoint) => url.includes(endpoint));
};

const showAuthRequiredMessage = () => {
  const now = Date.now();
  if (now - lastAuthPromptShownAt < 2500) return;

  lastAuthPromptShownAt = now;
  message.warning({
    key: AUTH_REQUIRED_MESSAGE_KEY,
    content: "Please register or login to access this service.",
    duration: 3,
  });
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Required for cookies
});

// Add request interceptor to attach access token
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = useAuthStore.getState().accessToken; // Use getState() for non-component code
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

// Add response interceptor for token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    const shouldSkipModal = isAuthExemptEndpoint(originalRequest?.url);
    const isUnauthorized = error.response?.status === 401;

    if (!isUnauthorized || !originalRequest) {
      return Promise.reject(error);
    }

    if (!shouldSkipModal && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
          null,
          { withCredentials: true }
        );
        useAuthStore.getState().setAccessToken(data.access_token);
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${data.access_token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearAuth();
        useAuthModalStore.getState().openAuthModal();
        showAuthRequiredMessage();
        return Promise.reject(refreshError);
      }
    }

    if (!shouldSkipModal) {
      useAuthStore.getState().clearAuth();
      useAuthModalStore.getState().openAuthModal();
      showAuthRequiredMessage();
    }

    return Promise.reject(error);
  }
);
export default axiosInstance;
