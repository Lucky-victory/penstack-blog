import { useMemo, useState } from "react";
import { TPermissions } from "../types";
import { useAuth } from "./useAuth";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { objectToQueryParams } from "../utils";

export const usePermissions = (requiredPermission: TPermissions) => {
  const { user } = useAuth();

  const userEmail = useMemo(() => user?.email || "", [user?.email]);

  const { data, isPending } = useQuery({
    queryKey: [userEmail, requiredPermission],
    refetchOnMount: false,
    queryFn: async () => {
      if (!userEmail) {
        return {
          hasPermission: false,
          permissions: [],
        };
      }

      try {
        const { data } = await axios.get<{
          data: {
            hasPermission: boolean;
            permissions: TPermissions[];
          };
        }>(
          `/api/auth/check-permission?${objectToQueryParams({ permission: requiredPermission })}`
        );

        return data?.data;
      } catch (error) {
        console.error("Permission check failed", error);
        return {
          hasPermission: false,
          permissions: [],
        };
      }
    },
  });

  return { hasPermission: data?.hasPermission, loading: isPending };
};
