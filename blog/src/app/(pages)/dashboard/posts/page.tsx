import PostsDashboard from "@/src/app/components/pages/Dashboard/AllPosts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | All Posts",
};
export default function DashPostsPage() {
  return <PostsDashboard />;
}
