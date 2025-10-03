import { apiEndpoints } from "@/services/apiEndpoints";
import axiosInstance from "@/services/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const fetchOrganizationPackage = (query) => () => {
  return axiosInstance.get(apiEndpoints.package.fetchPost, {
    params: query,
  });
};

const useFetchOrganizationPackage = (query) => {
  return useQuery({
    queryKey: [apiEndpoints.package.fetchPost, query],
    queryFn: fetchOrganizationPackage(query),
    select: (data) => data?.data,
  });
};

const fetchPackageBySlug = (slug) => () => {
  return axiosInstance.get(
    apiEndpoints.package.crudBySlug.replace("{slug}", slug)
  );
};

const useFetchPackageBySlug = (slug) => {
  return useQuery({
    queryKey: [apiEndpoints.package.crudBySlug, slug],
    queryFn: fetchPackageBySlug(slug),
    enabled: !!slug,
    select: (data) => data?.data?.data,
  });
};
const createPackage = (payloads) => {
  return axiosInstance.post(apiEndpoints.package.fetchPost, payloads);
};

const useCreatePackage = () => {
  const clientQuery = useQueryClient();

  return useMutation({
    mutationFn: createPackage,
    onSuccess: () => {
      clientQuery.invalidateQueries(apiEndpoints.package.fetchPost);
    },
  });
};

const updatePackage = ({ payloads, slug }) => {
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
      clientQuery.invalidateQueries(apiEndpoints.package.fetchPost);
    },
  });
};

const updatepackageActiveStatus = ({ payloads, id }) => {
  return axiosInstance.post(
    apiEndpoints.package.updateActiveStatus?.replace("{id}", id),
    payloads
  );
};

const useUpdatepackageActiveStatus = () => {
  const clientQuery = useQueryClient();

  return useMutation({
    mutationFn: updatepackageActiveStatus,
    onSuccess: () => {
      clientQuery.invalidateQueries(apiEndpoints.package.fetchPost);
    },
  });
};

const fetchTrendingPackages = ({ period }) => {
  return axiosInstance.get(apiEndpoints.package.trending, {
    params: { period },
  });
};

const useFetchTrendingPackages = ({ period }) => {
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
