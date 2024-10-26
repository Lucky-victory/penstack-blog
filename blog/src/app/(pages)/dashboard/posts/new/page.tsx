import NewPostPage from "@/src/app/components/Dashboard/NewPostPage";
import { db } from "@/src/db";
import { posts } from "@/src/db/schemas";
import { PostSelect } from "@/src/types";
import { shortIdGenerator } from "@/src/utils";
import { eq } from "drizzle-orm";

export default async function DashboardNewPostPage() {
  const shortId = shortIdGenerator.bigIntId().substring(6, 12);
  const newPost = {
    title: "Untitled post",
    slug: "untitled-" + shortId,
    author_id: 4,
  };
  let createdPost: PostSelect;
  try {
    createdPost = (await db.transaction(async (tx) => {
      const [insertResponse] = await tx.insert(posts).values(newPost);
      return await tx.query.posts.findFirst({
        where: eq(posts.id, insertResponse.insertId),
        
        with: {
          author: {
            columns: {
              username: true,
              name: true,
              avatar: true,
            },
          },
        },
      });
    })) as PostSelect;
  } catch (error) {}
  return (
    <>
      <NewPostPage post={createdPost!} />
    </>
  );
}
