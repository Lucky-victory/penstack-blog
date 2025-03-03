import PostPage from "@/src/app/components/pages/PostPage";

import { PostSelect } from "@/src/types";
export default function BlogPage({ post }: { post: PostSelect }) {
  return <PostPage post={post as any} />;
}
