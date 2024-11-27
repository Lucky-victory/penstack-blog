"use client";
import { usePermissions } from "@/src/hooks/usePermissions";
import { TPermissions } from "@/src/types";
import { Spinner } from "@chakra-ui/react";
import { redirect } from "next/navigation";

export function PermissionGuard({
  requiredPermission,
  children,
}: {
  requiredPermission: TPermissions;
  children: React.ReactNode;
}) {
  const { hasPermission, loading } = usePermissions(requiredPermission);

  if (loading)
    return (
      <div>
        <Spinner size={"sm"} />
      </div>
    );
  if (!hasPermission) redirect("/");
  return <>{children}</>;
}
