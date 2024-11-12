import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PostSelect } from "../types";
import { objectToQueryParams } from "../utils";

export const useCategories = (
  params: {
    sort?: "relevant" | "recent" | "popular";
    page?: number;
  } = {}
) => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await axios.get<{
        data: PostSelect[];
        meta: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      }>(`/api/posts/category?${objectToQueryParams(params)}`);
      return {
        results: data.data,
        meta: data?.meta,
      };
    },
  });
};
