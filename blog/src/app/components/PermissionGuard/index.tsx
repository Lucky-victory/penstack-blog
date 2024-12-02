"use client";
import { usePermissions } from "@/src/hooks/usePermissions";
import { TPermissions } from "@/src/types";
import { Spinner } from "@chakra-ui/react";
import { redirect } from "next/navigation";

export function PermissionGuard({
  requiredPermission,
  children,
  shouldRedirect,
  isOwner,
}: {
  requiredPermission: TPermissions;
  children: React.ReactNode;
  shouldRedirect?: boolean;
  isOwner?: boolean;
}) {
  const { hasPermission, loading } = usePermissions(requiredPermission);

  if (loading) {
    return (
      <div>
        <Spinner size={"sm"} />
      </div>
    );
  }

  if (isOwner) {
    return <>{children}</>;
  }

  if (!hasPermission && shouldRedirect) {
    redirect("/");
  }

  if (!hasPermission) {
    return null;
  }

  return <>{children}</>;
}
