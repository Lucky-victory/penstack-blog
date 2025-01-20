import { useCallback, useEffect, useMemo, useState } from "react";
import { TPermissions } from "../types";
import { useAuth } from "./useAuth";
import axios from "axios";

const permissionsCache = new Map<
  string,
  {
    permissions: TPermissions[];
    timestamp: number;
  }
>();

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

const checkCachedPermissions = (
  userEmail: string,
  requiredPermission: TPermissions
) => {
  const now = Date.now();
  const cachedPermissions = permissionsCache.get(userEmail);

  if (cachedPermissions && now - cachedPermissions.timestamp < CACHE_DURATION) {
    return {
      isValid: true,
      hasPermission: cachedPermissions.permissions.includes(requiredPermission),
      permissions: cachedPermissions.permissions,
    };
  }

  return { isValid: false };
};

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
      const cachedResult = checkCachedPermissions(
        userEmail,
        requiredPermission
      );

      if (cachedResult.isValid) {
        setHasPermission(cachedResult.hasPermission as boolean);
        setLoading(false);
        return;
      }

      const { data } = await axios.post<{
        data: {
          hasPermission: boolean;
          permissions: TPermissions[];
        };
      }>("/api/auth/check-permission", { permission: requiredPermission });

      permissionsCache.set(userEmail, {
        permissions: data.data.permissions,
        timestamp: Date.now(),
      });

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

  const clearCache = useCallback(() => {
    if (userEmail) {
      permissionsCache.delete(userEmail);
    }
  }, [userEmail]);

  return { hasPermission, loading, clearCache };
};
