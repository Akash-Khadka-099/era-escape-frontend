import { apiEndpoints } from "@/services/apiEndpoints";
import axiosInstance from "@/services/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
// import { useMutation } from "@tanstack/react-query";

interface SearchDestinationQuery {
  [key: string]: any;
}

const searchDashboardDestination = (query: SearchDestinationQuery) => (): Promise<AxiosResponse> => {
  return axiosInstance.get(apiEndpoints.destination.searchFromDashboard, {
    params: query,
  });
};

const useSearchDashboardDestination = (query: SearchDestinationQuery) => {
  return useQuery({
    queryFn: searchDashboardDestination(query),
    queryKey: [apiEndpoints.destination.searchFromDashboard, query],
    select: (data) => data?.data,
  });
};

export { useSearchDashboardDestination };
