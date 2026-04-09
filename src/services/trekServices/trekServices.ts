import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiEndpoints } from "../apiEndpoints";
import axiosInstance from "../axiosInstance";
import { AxiosResponse } from "axios";

interface SearchPackageQuery {
  [key: string]: any;
}

interface SavedTrekBlogPayload {
  trekBlogId: string;
}

interface SavedTrekBlogQuery {
  page?: number;
  pageSize?: number;
}

const searchTrekBlogLists = (
  query: SearchPackageQuery,
): Promise<AxiosResponse> => {
  return axiosInstance.get(apiEndpoints.trekBlogs.searchTrekBlogs, {
    params: query,
  });
};

const useSearchTrekBlogLists = () => {
  return useMutation({
    mutationFn: searchTrekBlogLists,
  });
};

const getTrekBlogDetail =
  (slug: string, query?: any) => (): Promise<AxiosResponse> => {
    return axiosInstance.get(
      apiEndpoints.trekBlogs.getTrekBlogDetail.replace("{slug}", slug),
      {
        params: query,
      },
    );
  };

const useGetTrekBlogDetail = (slug: string, query?: any) => {
  return useQuery({
    queryKey: [apiEndpoints.trekBlogs.getTrekBlogDetail, slug, query],
    queryFn: getTrekBlogDetail(slug, query),
    select: (data) => data?.data,
    enabled: !!slug,
  });
};

const fetchDestinationHotels = ({
  trekBlogSlug,
  destinationSlug,
}: {
  trekBlogSlug: string;
  destinationSlug: string;
}): Promise<AxiosResponse> => {
  return axiosInstance.get(
    apiEndpoints.trekBlogs.fetchDestinationHotels
      .replace("{trekBlogSlug}", trekBlogSlug)
      .replace("{destinationSlug}", destinationSlug),
  );
};

const useFetchDestinationHotels = ({
  trekBlogSlug,
  destinationSlug,
}: {
  trekBlogSlug: string;
  destinationSlug: string;
}) => {
  return useQuery({
    queryKey: [
      apiEndpoints.trekBlogs.fetchDestinationHotels,
      trekBlogSlug,
      destinationSlug,
    ],
    queryFn: () => fetchDestinationHotels({ trekBlogSlug, destinationSlug }),
    select: (data) => data?.data?.data,
    enabled: !!trekBlogSlug && !!destinationSlug,
    retry: false,
    staleTime: 60 * 1000,
  });
};

const fetchTrekBlogItineraryPlans =
  ({ trekBlogSlug }: { trekBlogSlug: string }) =>
  (): Promise<AxiosResponse> => {
    return axiosInstance.get(
      apiEndpoints.trekBlogs.fetchTrekBlogItineraryPlans.replace(
        "{trekBlogSlug}",
        trekBlogSlug,
      ),
    );
  };

const useFetchTrekBlogItineraryPlans = ({
  trekBlogSlug,
}: {
  trekBlogSlug: string;
}) => {
  return useQuery({
    queryKey: [
      apiEndpoints.trekBlogs.fetchTrekBlogItineraryPlans,
      trekBlogSlug,
    ],
    queryFn: fetchTrekBlogItineraryPlans({ trekBlogSlug }),
    select: (data) => data?.data?.data,
    enabled: !!trekBlogSlug,
  });
};

const createSavedTrekBlog = (
  payload: SavedTrekBlogPayload,
): Promise<AxiosResponse> => {
  return axiosInstance.post(apiEndpoints.savedTrekBlogs.fetchPost, payload);
};

const useCreateSavedTrekBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSavedTrekBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [apiEndpoints.savedTrekBlogs.fetchPost],
      });
    },
  });
};

const fetchSavedTrekBlogs = (
  query: SavedTrekBlogQuery,
): Promise<AxiosResponse> => {
  return axiosInstance.get(apiEndpoints.savedTrekBlogs.fetchPost, {
    params: query,
  });
};

const useFetchSavedTrekBlogs = (
  query: SavedTrekBlogQuery,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: [apiEndpoints.savedTrekBlogs.fetchPost, query],
    queryFn: () => fetchSavedTrekBlogs(query),
    select: (data) => data?.data,
    enabled,
  });
};

const deleteSavedTrekBlog = (id: string): Promise<AxiosResponse> => {
  return axiosInstance.delete(
    apiEndpoints.savedTrekBlogs.byId.replace("{id}", id),
  );
};

const useDeleteSavedTrekBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSavedTrekBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [apiEndpoints.savedTrekBlogs.fetchPost],
      });
    },
  });
};

export {
  useSearchTrekBlogLists,
  useGetTrekBlogDetail,
  fetchDestinationHotels,
  useFetchDestinationHotels,
  useFetchTrekBlogItineraryPlans,
  useCreateSavedTrekBlog,
  useFetchSavedTrekBlogs,
  useDeleteSavedTrekBlog,
};
