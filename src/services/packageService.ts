import { apiEndpoints } from "@/services/apiEndpoints";
import axiosInstance from "@/services/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface PackageQuery {
  [key: string]: any;
}

interface CreatePackagePayload {
  [key: string]: any;
}

interface UpdatePackageParams {
  payloads: any;
  slug: string;
}

interface UpdatePackageActiveStatusParams {
  payloads: any;
  id: string | number;
}

interface FetchTrendingPackagesParams {
  period: string;
}

const fetchOrganizationPackage = (query: PackageQuery) => (): Promise<AxiosResponse> => {
  return axiosInstance.get(apiEndpoints.package.fetchPost, {
    params: query,
  });
};

const useFetchOrganizationPackage = (query: PackageQuery) => {
  return useQuery({
    queryKey: [apiEndpoints.package.fetchPost, query],
    queryFn: fetchOrganizationPackage(query),
    select: (data) => data?.data,
  });
};

const fetchPackageBySlug = (slug: string) => (): Promise<AxiosResponse> => {
  return axiosInstance.get(
    apiEndpoints.package.crudBySlug.replace("{slug}", slug)
  );
};

const useFetchPackageBySlug = (slug: string) => {
  return useQuery({
    queryKey: [apiEndpoints.package.crudBySlug, slug],
    queryFn: fetchPackageBySlug(slug),
    enabled: !!slug,
    select: (data) => data?.data?.data,
  });
};

const createPackage = (payloads: CreatePackagePayload): Promise<AxiosResponse> => {
  return axiosInstance.post(apiEndpoints.package.fetchPost, payloads);
};

const useCreatePackage = () => {
  const clientQuery = useQueryClient();

  return useMutation({
    mutationFn: createPackage,
    onSuccess: () => {
      clientQuery.invalidateQueries({ queryKey: [apiEndpoints.package.fetchPost] });
    },
  });
};

const updatePackage = ({ payloads, slug }: UpdatePackageParams): Promise<AxiosResponse> => {
  return axiosInstance.put(
    apiEndpoints.package.crudBySlug.replace("{slug}", slug),
    payloads
  );
};

const useUpdatePackage = () => {
  const clientQuery = useQueryClient();

  return useMutation({
    mutationFn: updatePackage,
    onSuccess: () => {
      clientQuery.invalidateQueries({ queryKey: [apiEndpoints.package.fetchPost] });
    },
  });
};

const updatepackageActiveStatus = ({ payloads, id }: UpdatePackageActiveStatusParams): Promise<AxiosResponse> => {
  return axiosInstance.post(
    apiEndpoints.package.updateActiveStatus?.replace("{id}", String(id)),
    payloads
  );
};

const useUpdatepackageActiveStatus = () => {
  const clientQuery = useQueryClient();

  return useMutation({
    mutationFn: updatepackageActiveStatus,
    onSuccess: () => {
      clientQuery.invalidateQueries({ queryKey: [apiEndpoints.package.fetchPost] });
    },
  });
};

const fetchTrendingPackages = ({ period }: FetchTrendingPackagesParams): Promise<AxiosResponse> => {
  return axiosInstance.get(apiEndpoints.package.trending, {
    params: { period },
  });
};

const useFetchTrendingPackages = ({ period }: FetchTrendingPackagesParams) => {
  return useQuery({
    queryKey: [apiEndpoints.package.trending, period],
    queryFn: () => fetchTrendingPackages({ period }),
    select: (data) => data.data,
  });
};

export {
  useFetchOrganizationPackage,
  useFetchPackageBySlug,
  useFetchTrendingPackages,
  useCreatePackage,
  useUpdatePackage,
  useUpdatepackageActiveStatus,
};
