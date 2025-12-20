import { apiEndpoints } from "@/services/apiEndpoints";
import axiosInstance from "@/services/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
// import { useMutation } from "@tanstack/react-query";

interface SearchPackageQuery {
  [key: string]: any;
}

const searchPackageLists = (query: SearchPackageQuery): Promise<AxiosResponse> => {
  return axiosInstance.get(apiEndpoints.package.searchPackageList, {
    params: query,
  });
};

const useSearchPackageLists = () => {
  return useMutation({
    mutationFn: searchPackageLists,
  });
};

export { useSearchPackageLists };
