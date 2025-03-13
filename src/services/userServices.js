import { apiEndpoints } from "@/services/apiEndpoints";
import axiosInstance from "@/services/axiosInstance";
import { useMutation } from "@tanstack/react-query";

const createUsers = (payload) => {
  return axiosInstance.post(apiEndpoints.users.create, payload);
};

const useCreateUsers = () => {
  return useMutation({
    mutationFn: createUsers,
  });
};

export { useCreateUsers };
