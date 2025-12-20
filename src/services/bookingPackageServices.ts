import { apiEndpoints } from "@/services/apiEndpoints";
import axiosInstance from "@/services/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface CreateBookingPackagePayload {
  [key: string]: any;
}

const createBookingPackage = (payloads: CreateBookingPackagePayload): Promise<AxiosResponse> => {
  return axiosInstance.post(apiEndpoints.bookPackage.fetchPost, payloads);
};

const useCreateBookingPackage = () => {
  const clientQuery = useQueryClient();

  return useMutation({
    mutationFn: createBookingPackage,
    onSuccess: () => {
      clientQuery.invalidateQueries({ queryKey: [apiEndpoints.bookPackage.fetchPost] });
    },
  });
};

export { useCreateBookingPackage };
