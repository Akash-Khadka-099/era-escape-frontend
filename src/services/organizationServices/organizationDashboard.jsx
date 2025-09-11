import { apiEndpoints } from "@/services/apiEndpoints";
import axiosInstance from "@/services/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const fetchOrganizationDashboardCards = () => {
  return axiosInstance.get(apiEndpoints.organization.dashboardCard);
};

const useFetchOrganizationDashboardCards = () => {
  return useQuery({
    queryKey: [apiEndpoints.organization.dashboardCard],
    queryFn: fetchOrganizationDashboardCards,
    select: (data) => data?.data?.data,
  });
};

export { useFetchOrganizationDashboardCards };
