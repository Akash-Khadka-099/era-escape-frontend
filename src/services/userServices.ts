import { apiEndpoints } from "@/services/apiEndpoints";
import axiosInstance from "@/services/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface CreateUserPayload {
  [key: string]: any; // You can make this more specific based on your user creation requirements
}

const createUsers = (payload: CreateUserPayload): Promise<AxiosResponse> => {
  return axiosInstance.post(apiEndpoints.users.create, payload);
};

const useCreateUsers = () => {
  return useMutation({
    mutationFn: createUsers,
  });
};

export { useCreateUsers };
