import UsersDashboard from "@/src/app/components/pages/Dashboard/Users";
import { PermissionGuard } from "@/src/app/components/PermissionGuard";

export default function Users() {
  return (
    <PermissionGuard requiredPermission={"users:read"}>
      <UsersDashboard />
    </PermissionGuard>
  );
}
