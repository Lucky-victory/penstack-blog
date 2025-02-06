import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { objectToQueryParams } from "../utils";

export const useCategories = ({
  sortBy,
  limit,
  page,
  canFetch,
  hasPosts,
  sortOrder,
}: {
  sortBy?: "name" | "popular";
  page?: number;
  limit?: number;
  canFetch?: boolean;
  hasPosts?: boolean;
  sortOrder?: "asc" | "desc";
} = {}) => {
  return useQuery({
    queryKey: [
      "categories",
      sortBy,
      limit,
      page,
      canFetch,
      hasPosts,
      sortOrder,
    ],
    queryFn: async () => {
      const { data } = await axios.get<{
        data: { id: number; name: string; slug: string; postsCount: number }[];
        meta: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      }>(
        `/api/taxonomies/categories?${objectToQueryParams({ sortBy, limit, page, hasPostsOnly: hasPosts })}`
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
