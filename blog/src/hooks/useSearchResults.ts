import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PostSelect } from "../types";
import { objectToQueryParams } from "../utils";

export const useSearchResults = ({
  queryParams,
}: {
  queryParams: {
    query: string;
    category?: string;
    sort?: "relevant" | "recent" | "popular";
    page?: number;
  };
}) => {
  return useQuery({
    queryKey: [
      "search",
      queryParams?.query,
      queryParams?.category,
      queryParams?.sort,
      queryParams?.page,
    ],
    queryFn: async () => {
      const { data } = await axios.get<{
        data: PostSelect[];
        meta: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      }>(`/api/posts/search?${objectToQueryParams(queryParams)}`);
      return {
        results: data.data,
        meta: data.meta,
      };
    },
    enabled: !!queryParams?.query,
  });
};
