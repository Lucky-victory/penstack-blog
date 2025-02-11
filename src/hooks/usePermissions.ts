import { useMemo, useState } from "react";
import { TPermissions } from "../types";
import { useAuth } from "./useAuth";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { objectToQueryParams } from "../utils";
import { usePermissionsStore } from "../state/permissions";

export const usePermissions = (requiredPermission: TPermissions) => {
  // const { user } = useAuth();

  // const userEmail = useMemo(() => user?.email || "", [user?.email]);
  const permissions = usePermissionsStore((state) => state.permissions);
  const isLoading = usePermissionsStore((state) => state.isLoading);
  let hasPermission: boolean = false;
  if (permissions?.length) {
    const found = permissions.find(
      (permission) => permission === requiredPermission
    );
    hasPermission = !!found;
    console.log({
      hasPermission,
      requiredPermission,
      found,
      permissions,
      isLoading,
    });
  }
  return { hasPermission, loading: isLoading };
};
