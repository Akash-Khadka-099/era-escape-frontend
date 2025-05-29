import { apiEndpoints } from "@/services/apiEndpoints";
import axiosInstance from "@/services/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const fetchDestinations = (query) => () => {
  return axiosInstance.get(apiEndpoints.destination.fetchPost, {
    params: query,
  });
};

const useFetchDestinations = (query) => {
  return useQuery({
    queryKey: [apiEndpoints.destination.fetchPost, query],
    queryFn: fetchDestinations(query),
    select: (data) => data?.data,
  });
};

const createDestination = (payaloads) => {
  return axiosInstance.post(apiEndpoints.destination.create, payaloads);
};

const useCreateDestination = () => {
  const clientQuery = useQueryClient();

  return useMutation({
    mutationFn: createDestination,
    onSuccess: () => {
      clientQuery.invalidateQueries(apiEndpoints.destination.fetchPost);
    },
  });
};


export { useFetchDestinations, useCreateDestination };
