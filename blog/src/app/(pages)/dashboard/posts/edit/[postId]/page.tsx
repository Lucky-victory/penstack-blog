import EditPostPage from "@/src/app/components/pages/Dashboard/NewPostPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Editing Post",
};
export default function DashboardNewPostPage() {
  return <EditPostPage />;
}
