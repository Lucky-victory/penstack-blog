import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { objectToQueryParams } from "../utils";

export const useCategories = ({
  sort,
  limit,
  page,
  canFetch,
}: {
  sort?: "name" | "popular";
  page?: number;
  limit?: number;
  canFetch?: boolean;
} = {}) => {
  return useQuery({
    queryKey: ["categories", { sort, limit, page, canFetch }],
    queryFn: async () => {
      const { data } = await axios.get<{
        data: { id: number; name: string; slug: string }[];
        meta: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      }>(`/api/categories?${objectToQueryParams({ sort, limit, page })}`);
      return {
        results: data.data,
        meta: data?.meta,
      };
    },
    enabled: canFetch,
    staleTime: 1000 * 60 * 60 * 24,
  });
};
