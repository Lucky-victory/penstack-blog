import { useCallback, useEffect, useState } from "react";
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

export const usePermissions = (requiredPermission: TPermissions) => {
  const { user } = useAuth();
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function checkPermission() {
      if (!user?.email) return false;

      const userEmail = user.email;
      const now = Date.now();
      try {
        // Check cache first
        const cachedPermissions = permissionsCache.get(userEmail);
        if (
          cachedPermissions &&
          now - cachedPermissions.timestamp < CACHE_DURATION
        ) {
          setHasPermission(
            cachedPermissions.permissions.includes(requiredPermission)
          );
          return cachedPermissions.permissions.includes(requiredPermission);
        }

        const { data } = await axios.post<{
          data: {
            hasPermission: boolean;
            permissions: TPermissions[];
          };
        }>("/api/auth/check-permission", { permission: requiredPermission });

        // Update cache
        permissionsCache.set(userEmail, {
          permissions: data.data.permissions,
          timestamp: now,
        });

        setHasPermission(data.data.hasPermission);
        return data.data.hasPermission;
      } catch (error) {
        console.error("Permission check failed", error);
        setHasPermission(false);
        return false;
      } finally {
        setLoading(false);
      }
    }
    if (user) {
      checkPermission();
    }
  }, [user, requiredPermission]);

  return { hasPermission, loading };
};
