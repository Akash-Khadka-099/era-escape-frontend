import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { apiEndpoints } from "../apiEndpoints";
import axiosInstance from "../axiosInstance";
import {
  HikeBlogDetailResponse,
  HikeBlogListingResponse,
} from "@/types/hike";

export interface SearchHikeBlogQuery {
  q?: string;
  page?: number;
  pageSize?: number;
  minAltitude?: number;
  maxAltitude?: number;
  [key: string]: string | number | undefined;
}

const searchHikeBlogLists = (
  query: SearchHikeBlogQuery,
): Promise<AxiosResponse<HikeBlogListingResponse>> => {
  return axiosInstance.get(apiEndpoints.hikeBlogs.searchHikeBlogs, {
    params: query,
  });
};

const useSearchHikeBlogLists = () => {
  return useMutation({
    mutationFn: searchHikeBlogLists,
  });
};

const getHikeBlogDetail =
  (slug: string, query?: Record<string, string | number | boolean>) =>
  (): Promise<AxiosResponse<HikeBlogDetailResponse>> => {
    return axiosInstance.get(
      apiEndpoints.hikeBlogs.getHikeBlogDetail.replace("{slug}", slug),
      {
        params: query,
      },
    );
  };

const useGetHikeBlogDetail = (
  slug: string,
  query?: Record<string, string | number | boolean>,
) => {
  return useQuery({
    queryKey: [apiEndpoints.hikeBlogs.getHikeBlogDetail, slug, query],
    queryFn: getHikeBlogDetail(slug, query),
    select: (data) => data?.data,
    enabled: Boolean(slug),
  });
};

export { useSearchHikeBlogLists, useGetHikeBlogDetail };
