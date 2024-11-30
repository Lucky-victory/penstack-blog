import EditPostPage from "@/src/app/components/pages/Dashboard/NewPostPage";
import { PermissionGuard } from "@/src/app/components/PermissionGuard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Editing Post",
};
export default function DashboardNewPostPage() {
  return (
    <PermissionGuard requiredPermission={"posts:edit"}>
      <EditPostPage />
    </PermissionGuard>
  );
}
