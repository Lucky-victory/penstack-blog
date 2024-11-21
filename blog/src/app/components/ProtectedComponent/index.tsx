"use client";
import { TPermissions } from "@/src/types";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo } from "react";

// Create a client-side permissions cache
const permissionsCache: Record<
  string,
  {
    permissions: string[];
    timestamp: number;
  }
> = {};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function ProtectedComponent({
  requiredPermission,
  children,
}: {
  requiredPermission: TPermissions;
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    async function checkPermission() {
      if (!session?.user?.email) return;

      const userEmail = session.user.email;
      const now = Date.now();

      // Check cache first
      const cachedPermissions = permissionsCache[userEmail];
      if (
        cachedPermissions &&
        now - cachedPermissions.timestamp < CACHE_DURATION
      ) {
        setHasPermission(
          cachedPermissions.permissions.includes(requiredPermission)
        );
        return;
      }

      try {
        const { data } = await axios.post<{
          data: {
            hasPermission: boolean;
            permissions: string[];
          };
        }>("/api/auth/check-permission", { permission: requiredPermission });

        // Update cache
        permissionsCache[userEmail] = {
          permissions: data.data.permissions,
          timestamp: now,
        };

        setHasPermission(data.data.hasPermission);
      } catch (error) {
        console.error("Permission check failed", error);
        setHasPermission(false);
      }
    }

    checkPermission();
  }, [session, requiredPermission]);

  if (!hasPermission) return null;
  return <>{children}</>;
}
