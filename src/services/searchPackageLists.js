import { apiEndpoints } from "@/services/apiEndpoints";
import axiosInstance from "@/services/axiosInstance";
import { useMutation } from "@tanstack/react-query";
// import { useMutation } from "@tanstack/react-query";

const searchPackageLists = (query) => {
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
