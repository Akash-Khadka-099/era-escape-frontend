import { apiEndpoints } from "@/services/apiEndpoints";
import axiosInstance from "@/services/axiosInstance";
import useAuthStore from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";

const loginUser = async (payload) => {
  const response = await axiosInstance.post(apiEndpoints.login, payload);
  return response; // Assuming response.data contains { message, access_token }
};

const useLoginUser = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setAccessToken(data?.data?.access_token);
      // console.log("Login successful, access token stored:", data.access_token);
    },
    onError: (error) => {
      console.error("Login failed:", error.response?.data || error.message);
    },
  });
};

const logoutUser = async () => {
  const response = await axiosInstance.post(apiEndpoints.logout);
  return response.data;
};

const useLogoutUser = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // Clear access token from Zustand
      clearAuth();
      message.success("Logged out successfully");
    },
    onError: (error) => {
      console.error("Logout failed:", error.response?.data || error.message);
    },
  });
};
export { useLoginUser, useLogoutUser };
