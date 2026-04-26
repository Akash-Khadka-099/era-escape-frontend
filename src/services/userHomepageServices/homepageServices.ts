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

export interface GlobalSearchResultItem {
  title: string;
  slug: string;
  featuredImage?: {
    _id: string;
    path: string;
    originalName: string;
    filename: string;
  } | null;
  shortSlogan?: string | null;
  shortNotes?: string | null;
  summary?: string | null;
  contentType: string;
}

export interface GlobalSearchResponse {
  success: boolean;
  data: GlobalSearchResultItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  searchKey: string;
}

export interface GlobalSearchQuery {
  searchKey: string;
  page?: number;
  pageSize?: number;
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

const fetchGlobalTravelSearch =
  (query: GlobalSearchQuery) => (): Promise<AxiosResponse> => {
    return axiosInstance.get(apiEndpoints.homepage.globalTravelSearch, {
      params: query,
    });
  };

const useFetchGlobalTravelSearch = (
  query: GlobalSearchQuery,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: [apiEndpoints.homepage.globalTravelSearch, query.searchKey, query.page, query.pageSize],
    queryFn: fetchGlobalTravelSearch(query),
    select: (data) => data?.data as GlobalSearchResponse,
    enabled: options?.enabled !== false && query.searchKey.trim().length > 0,
    staleTime: 2 * 60 * 1000,
  });
};

export {
  useFetchTrendingBlogsCategories,
  useFetchTrendingTrekBlogsByVisits,
  useFetchGlobalTravelSearch,
  type TrendingTrekBlog,
};
