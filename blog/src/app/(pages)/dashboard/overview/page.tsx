import Overview from "@/src/app/components/Dashboard/Overview";
import { PermissionGuard } from "@/src/app/components/PermissionGuard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Overview",
};
export default function OverviewPage() {
  return (
    <PermissionGuard requiredPermission={"dashboard:view"} shouldRedirect>
      <Overview />
    </PermissionGuard>
  );
}
