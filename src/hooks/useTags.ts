import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { objectToQueryParams } from "../utils";

export const useCategories = (
  params: {
    sort?: "relevant" | "recent" | "popular";
    postId?: number;
    page?: number;
  } = {}
) => {
  return useQuery({
    queryKey: ["tags", params],
    queryFn: async () => {
      const { data } = await axios.get<{
        data: { id: number; name: string; slug: string }[];
        meta: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      }>(`/api/tags?${objectToQueryParams(params)}`);
      return {
        results: data.data,
        meta: data?.meta,
      };
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
};
