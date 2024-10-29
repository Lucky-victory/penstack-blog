"use client";

import { TPermissions } from "@/src/types";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

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
      if (session?.user?.id) {
        const { data } = await axios.post<{ data: { hasPermission: boolean } }>(
          "/api/auth/check-permission",
          { permission: requiredPermission }
        );

        const { hasPermission } = data?.data;
        setHasPermission(hasPermission);
      }
    }

    checkPermission();
  }, [session, requiredPermission]);

  if (!hasPermission) return null;

  return <>{children}</>;
}
