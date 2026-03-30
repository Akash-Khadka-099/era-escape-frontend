import { AxiosResponse } from "axios";
import axiosInstance from "@/services/axiosInstance";
import { apiEndpoints } from "@/services/apiEndpoints";
import { useQuery } from "@tanstack/react-query";

interface QueryPayload {
  [key: string]: any;
}

interface TrendingBlogsByVisitsQuery {
  periodDays?: number;
  limit?: number;
}

interface TrendingTrekBlog {
  trekBlogId: string;
  totalVisits: number;
  uniqueVisitorCount: number;
  lastVisitedAt: string;
  trekBlog: {
    _id: string;
    title: string;
    slug: string;
    difficulty?: string;
    averageDurationDays?: number;
    maxAltitudeMeter?: number;
  };
  featuredImage?: {
    _id?: string;
    path?: string;
    filename?: string;
    originalName?: string;
  };
}

interface TrendingBlogsByVisitsResponse {
  success: boolean;
  periodDays: number;
  data: TrendingTrekBlog[];
  message: string;
}

const fetchTrendingBlogsCategories =
  (query: QueryPayload) => (): Promise<AxiosResponse> => {
    return axiosInstance.get(apiEndpoints.homepage.fetchTrendingBlogCategories, {
      params: query,
    });
  };

const fetchTrendingBlogsByVisits =
  (query: TrendingBlogsByVisitsQuery) => (): Promise<AxiosResponse> => {
    return axiosInstance.get(apiEndpoints.homepage.fetchTrendingBlogsByVisits, {
      params: query,
    });
  };

const useFetchTrendingBlogsCategories = (query: QueryPayload) => {
  return useQuery({
    queryKey: [apiEndpoints.homepage.fetchTrendingBlogCategories],
    queryFn: fetchTrendingBlogsCategories(query),
    select: (data) => data?.data?.data,
  });
};

const useFetchTrendingTrekBlogsByVisits = (
  query: TrendingBlogsByVisitsQuery = {},
) => {
  const periodDays = query?.periodDays || 30;
  const limit = query?.limit || 8;

  return useQuery({
    queryKey: [apiEndpoints.homepage.fetchTrendingBlogsByVisits, periodDays, limit],
    queryFn: fetchTrendingBlogsByVisits({ periodDays, limit }),
    select: (data) => data?.data as TrendingBlogsByVisitsResponse,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export {
  useFetchTrendingBlogsCategories,
  useFetchTrendingTrekBlogsByVisits,
  type TrendingTrekBlog,
};
