import { getFeaturedPost } from "../lib/queries/featured";
import { getPosts } from "../lib/queries/posts";
import FrontPage from "./components/pages/FrontPage";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const category = searchParams?.category as string;

  const posts = await getPosts({ category });
  const featuredPost = await getFeaturedPost();
  return <FrontPage posts={posts.data} featuredPost={featuredPost} />;
}
