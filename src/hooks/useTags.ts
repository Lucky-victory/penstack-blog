import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { objectToQueryParams } from "../utils";
import { TaxonomyItem } from "../types";

export const useTags = ({
  sortBy,
  postId,
  page,
  limit,
  hasPostsOnly,
}: {
  sortBy?: "name" | "recent" | "popular";
  postId?: number;
  page?: number;
  limit?: number;
  hasPostsOnly?: boolean;
} = {}) => {
  return useQuery({
    queryKey: ["tags", sortBy, postId, page, limit, hasPostsOnly],
    queryFn: async () => {
      const { data } = await axios.get<{
        data: TaxonomyItem[];
        meta: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      }>(
        `/api/tags?${objectToQueryParams({ sortBy, postId, page, limit, hasPostsOnly })}`
      );
      return {
        results: data.data,
        meta: data?.meta,
      };
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
};
