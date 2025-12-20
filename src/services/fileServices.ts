import { apiEndpoints } from "@/services/apiEndpoints";
import axiosInstance from "@/services/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

const deleteFileMutation = (id: string | number): Promise<AxiosResponse> => {
  return axiosInstance.delete(apiEndpoints.file.deleteFile.replace("{id}", String(id)));
};

const useDeleteFileMutation = () => {
  return useMutation({
    mutationFn: deleteFileMutation,
  });
};

export { useDeleteFileMutation };
