import Medias from "@/src/app/components/Dashboard/Medias";
import { PermissionGuard } from "@/src/app/components/PermissionGuard";

export default function MediaPage() {
  return (
    <PermissionGuard requiredPermission={"media:read"}>
      <Medias />
    </PermissionGuard>
  );
}
