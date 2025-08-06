import { apiEndpoints } from "@/services/apiEndpoints";
import axiosInstance from "@/services/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const createBookingPackage = (payloads) => {
  return axiosInstance.post(apiEndpoints.bookPackage.fetchPost, payloads);
};

const useCreateBookingPackage = () => {
  const clientQuery = useQueryClient();

  return useMutation({
    mutationFn: createBookingPackage,
    onSuccess: () => {
      clientQuery.invalidateQueries(apiEndpoints.bookPackage.fetchPost);
    },
  });
};

export { useCreateBookingPackage };
