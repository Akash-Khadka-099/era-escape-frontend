import { apiEndpoints } from "@/services/apiEndpoints";
import axiosInstance from "@/services/axiosInstance";
import { useMutation } from "@tanstack/react-query";

const loginUser = (payload) => {
  return axiosInstance.post(apiEndpoints.login, payload);
};

const useLoginUser = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};

export { useLoginUser };
