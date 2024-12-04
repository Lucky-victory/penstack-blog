import Medias from "@/src/app/components/Dashboard/Medias";
import { PermissionGuard } from "@/src/app/components/PermissionGuard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Media",
};
export default function DashboardMediaPage() {
  return (
    <PermissionGuard requiredPermission={"media:read"} shouldRedirect>
      <Medias />
    </PermissionGuard>
  );
}
