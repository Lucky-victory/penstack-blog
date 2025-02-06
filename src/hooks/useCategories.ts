import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { objectToQueryParams } from "../utils";

export const useCategories = ({
  sort,
  limit,
  page,
  canFetch,
  hasPosts,
}: {
  sort?: "name" | "popular";
  page?: number;
  limit?: number;
  canFetch?: boolean;
  hasPosts?: boolean;
} = {}) => {
  return useQuery({
    queryKey: ["categories", sort, limit, page, canFetch, hasPosts],
    queryFn: async () => {
      const { data } = await axios.get<{
        data: { id: number; name: string; slug: string }[];
        meta: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      }>(
        `/api/categories?${objectToQueryParams({ sort, limit, page, hasPostsOnly: hasPosts })}`
      );
      return {
        results: data.data,
        meta: data?.meta,
      };
    },
    enabled: canFetch,
    staleTime: 1000 * 60 * 60 * 24,
  });
};
