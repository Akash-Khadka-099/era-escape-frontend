import { useMutation, useQuery } from "@tanstack/react-query";
import { apiEndpoints } from "../apiEndpoints";
import axiosInstance from "../axiosInstance";
import { AxiosResponse } from "axios";

interface SearchPackageQuery {
  [key: string]: any;
}

const searchTrekBlogLists = (query: SearchPackageQuery): Promise<AxiosResponse> => {
  return axiosInstance.get(apiEndpoints.trekBlogs.searchTrekBlogs, {
    params: query,
  });
};

const useSearchTrekBlogLists = () => {
  return useMutation({
    mutationFn: searchTrekBlogLists,
  });
};

const getTrekBlogDetail = (slug: string) => (): Promise<AxiosResponse> => {
  return axiosInstance.get(apiEndpoints.trekBlogs.getTrekBlogDetail.replace("{slug}", slug));
};

const useGetTrekBlogDetail = (slug: string) => {
  return useQuery({
    queryKey: [apiEndpoints.trekBlogs.getTrekBlogDetail, slug],
    queryFn: getTrekBlogDetail(slug),
    select: data => data?.data,
    enabled: !!slug,

  });
};


const fetchDestinationHotels = ({ trekBlogSlug, destinationSlug }:
  { trekBlogSlug: string, destinationSlug: string }) => (): Promise<AxiosResponse> => {
    return axiosInstance.get(apiEndpoints.trekBlogs.fetchDestinationHotels.replace("{trekBlogSlug}",
      trekBlogSlug).replace("{destinationSlug}", destinationSlug));
  };

const useFetchDestinationHotels = ({ trekBlogSlug, destinationSlug }:
  { trekBlogSlug: string, destinationSlug: string }) => {
  return useQuery({
    queryKey: [apiEndpoints.trekBlogs.fetchDestinationHotels, trekBlogSlug, destinationSlug],
    queryFn: fetchDestinationHotels({ trekBlogSlug, destinationSlug }),
    select: data => data?.data?.data,
    enabled: !!trekBlogSlug && !!destinationSlug,
  });
};

export { useSearchTrekBlogLists, useGetTrekBlogDetail, useFetchDestinationHotels };
