import { apiEndpoints } from "@/services/apiEndpoints";
import axiosInstance from "@/services/axiosInstance";
import useAuthStore from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import { AxiosResponse } from "axios";

interface LoginPayload {
  email?: string;
  username?: string;
  password: string;
}

interface LoginResponse {
  message: string;
  access_token: string;
}

interface ForgetPasswordPayload {
  email: string;
}

interface ResetPasswordPayload {
  token: string;
  password: string;
  password_confirmation: string;
}

const loginUser = async (payload: LoginPayload): Promise<AxiosResponse<LoginResponse>> => {
  const response = await axiosInstance.post<LoginResponse>(apiEndpoints.login, payload);
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
    onError: (error: any) => {
      console.error("Login failed:", error.response?.data || error.message);
    },
  });
};

const logoutUser = async (): Promise<any> => {
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
    onError: (error: any) => {
      console.error("Logout failed:", error.response?.data || error.message);
    },
  });
};

const forgetPassword = async (payload: ForgetPasswordPayload): Promise<AxiosResponse> => {
  return await axiosInstance.post(apiEndpoints.forgetPassword, payload);
};

const useForgetPassword = () => {
  return useMutation({
    mutationFn: forgetPassword,
  });
};

const resetPassword = async (payload: ResetPasswordPayload): Promise<AxiosResponse> => {
  return await axiosInstance.post(apiEndpoints.resetPassword, payload);
};

const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
  });
};

export { useLoginUser, useLogoutUser, useForgetPassword, useResetPassword };
