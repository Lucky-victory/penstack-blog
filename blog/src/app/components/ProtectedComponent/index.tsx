"use client";
import { useAuth } from "@/src/hooks/useAuth";
import { userPermissions } from "@/src/hooks/usePermissions";
import { TPermissions } from "@/src/types";
import { useEffect, useState } from "react";

export function ProtectedComponent({
  requiredPermission,
  children,
}: {
  requiredPermission: TPermissions;
  children: React.ReactNode;
}) {
  const [hasPermission, setHasPermission] = useState(false);
  const { user } = useAuth();
  const { checkPermission } = userPermissions();
  useEffect(() => {
    checkPermission(requiredPermission).then((res) => {
      setHasPermission(res);
    });
  }, [user, requiredPermission]);
  if (!hasPermission) return null;
  return <>{children}</>;
}
