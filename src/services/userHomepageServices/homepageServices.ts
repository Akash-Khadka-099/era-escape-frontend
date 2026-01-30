import { AxiosResponse } from "axios";
import axiosInstance from "@/services/axiosInstance";
import { apiEndpoints } from "@/services/apiEndpoints";
import { useQuery } from "@tanstack/react-query";

interface SearchPackageQuery {
    [key: string]: any;
}

const fetchTrendingBlogsCategories = (query: SearchPackageQuery) => (): Promise<AxiosResponse> => {
    return axiosInstance.get(apiEndpoints.homepage.fetchTrendingBlogCategories,
        {
            params: query
        })
}

const useFetchTrendingBlogsCategories = (query: SearchPackageQuery) => {
    return useQuery({
        queryKey: [apiEndpoints.homepage.fetchTrendingBlogCategories],
        queryFn: fetchTrendingBlogsCategories(query),
        select: data => data?.data?.data,
    })
}

export { useFetchTrendingBlogsCategories }