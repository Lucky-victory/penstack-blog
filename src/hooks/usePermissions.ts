import { useCallback, useEffect, useMemo, useState } from "react";
import { TPermissions } from "../types";
import { useAuth } from "./useAuth";
import axios from "axios";

export const usePermissions = (requiredPermission: TPermissions) => {
  const { user } = useAuth();
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);

  const userEmail = useMemo(() => user?.email || "", [user?.email]);

  const checkPermission = useCallback(async () => {
    if (!userEmail) {
      setHasPermission(false);
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post<{
        data: {
          hasPermission: boolean;
          permissions: TPermissions[];
        };
      }>("/api/auth/check-permission", { permission: requiredPermission });
      if (!data.data.hasPermission) {
        setHasPermission(false);
        return;
      }

      setHasPermission(data.data.hasPermission);
    } catch (error) {
      console.error("Permission check failed", error);
      setHasPermission(false);
    } finally {
      setLoading(false);
    }
  }, [userEmail, requiredPermission]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return { hasPermission, loading };
};
