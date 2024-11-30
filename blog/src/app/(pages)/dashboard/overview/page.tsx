import Overview from "@/src/app/components/Dashboard/Overview";
import { PermissionGuard } from "@/src/app/components/PermissionGuard";

export default function OverviewPage() {
  return (
    <PermissionGuard requiredPermission={"dashboard:view"}>
      <Overview />
    </PermissionGuard>
  );
}
