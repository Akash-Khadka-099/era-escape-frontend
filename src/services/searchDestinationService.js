import { apiEndpoints } from "@/services/apiEndpoints";
import axiosInstance from "@/services/axiosInstance";
import { useQuery } from "@tanstack/react-query";
// import { useMutation } from "@tanstack/react-query";

const searchDashboardDestination = (query) => () => {
  return axiosInstance.get(apiEndpoints.destination.searchFromDashboard, {
    params: query,
  });
};

const useSearchDashboardDestination = (query) => {
  return useQuery({
    queryFn: searchDashboardDestination(query),
    queryKey: [apiEndpoints.destination.searchFromDashboard, query],
    select: (data) => data?.data,
  });
};

export { useSearchDashboardDestination };
