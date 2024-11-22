import { useCallback, useState } from "react";
import { TPermissions } from "../types";
import { useAuth } from "./useAuth";
import axios from "axios";
const permissionsCache = new Map<
  string,
  {
    permissions: string[];
    timestamp: number;
  }
>();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const userPermissions = () => {
  const { user } = useAuth();
  const [hasPermission, setHasPermission] = useState(false);

  const checkPermission = useCallback(
    async (requiredPermission: TPermissions) => {
      if (!user?.email) return false;

      const userEmail = user.email;
      const now = Date.now();

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

      try {
        const { data } = await axios.post<{
          data: {
            hasPermission: boolean;
            permissions: string[];
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
      }
    },
    [user]
  );

  return { hasPermission, checkPermission };
};
