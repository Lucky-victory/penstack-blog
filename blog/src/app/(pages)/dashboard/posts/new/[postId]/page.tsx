import NewPostPage from "@/src/app/components/Dashboard/NewPostPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Create Post",
};
export default function DashboardNewPostPage() {
  return <NewPostPage />;
}
