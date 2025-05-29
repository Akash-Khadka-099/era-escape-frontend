import { apiEndpoints } from "@/services/apiEndpoints";
import axiosInstance from "@/services/axiosInstance";
import { useMutation } from "@tanstack/react-query";

const deleteFileMutation = (id) => {
  return axiosInstance.delete(apiEndpoints.file.deleteFile.replace("{id}", id));
};

const useDeleteFileMutation = () => {
  return useMutation({
    mutationFn: deleteFileMutation,
  });
};

export { useDeleteFileMutation };
