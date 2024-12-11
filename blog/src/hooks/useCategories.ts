import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { objectToQueryParams } from "../utils";

export const useCategories = (
  params: {
    sort?: "name" | "popular";
    page?: number;
    limit?: number;
  } = {}
) => {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: async () => {
      const { data } = await axios.get<{
        data: { id: number; name: string; slug: string }[];
        meta: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      }>(`/api/categories?${objectToQueryParams(params)}`);
      return {
        results: data.data,
        meta: data?.meta,
      };
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
};
