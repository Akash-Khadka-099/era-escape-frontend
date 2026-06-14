import axiosInstance from "@/services/axiosInstance";
import { apiEndpoints } from "@/services/apiEndpoints";
import { useQuery } from "@tanstack/react-query";

const fetchOutingBlogsList = (query?: Record<string, string | number | boolean>) => () => {
    return axiosInstance.get(apiEndpoints.outings.listOutings, {
        params: query
    });
};

const useFetchOutingBlogsList = (query?: Record<string, string | number | boolean>) => {
    return useQuery({
        queryFn: fetchOutingBlogsList(query),
        queryKey: [apiEndpoints.outings.listOutings, query],
        select: data => data?.data
    })
}

const fetchOutingBlogDetail = (slug: string, query?: Record<string, string | number | boolean>,
) => () => {
    return axiosInstance.get(apiEndpoints.outings.getOutingDetail.replace("{slug}", slug), {
        params: query
    });
};

const useFetchOutingBlogDetail = (slug: string, query?: Record<string, string | number | boolean>) => {
    return useQuery({
        queryFn: fetchOutingBlogDetail(slug, query),
        queryKey: [apiEndpoints.outings.getOutingDetail, slug, query],
        select: data => data?.data
    })
}

export { useFetchOutingBlogsList, useFetchOutingBlogDetail };