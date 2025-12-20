import { apiEndpoints } from "@/services/apiEndpoints";
import axiosInstance from "@/services/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface DestinationQuery {
  [key: string]: any;
}

interface CreateDestinationPayload {
  [key: string]: any;
}

const fetchDestinations = (query: DestinationQuery) => (): Promise<AxiosResponse> => {
  return axiosInstance.get(apiEndpoints.destination.fetchPost, {
    params: query,
  });
};

const useFetchDestinations = (query: DestinationQuery) => {
  return useQuery({
    queryKey: [apiEndpoints.destination.fetchPost, query],
    queryFn: fetchDestinations(query),
    select: (data) => data?.data,
  });
};

const createDestination = (payaloads: CreateDestinationPayload): Promise<AxiosResponse> => {
  return axiosInstance.post(apiEndpoints.destination.create, payaloads);
};

const useCreateDestination = () => {
  const clientQuery = useQueryClient();

  return useMutation({
    mutationFn: createDestination,
    onSuccess: () => {
      clientQuery.invalidateQueries({ queryKey: [apiEndpoints.destination.fetchPost] });
    },
  });
};


export { useFetchDestinations, useCreateDestination };
