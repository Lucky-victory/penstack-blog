import { ClientNewPostRedirect } from "@/src/app/components/Dashboard/NewPostPage/ClientNewPostRedirect";
import { db } from "@/src/db";
import { posts, users } from "@/src/db/schemas";
import { PostSelect } from "@/src/types";
import { shortIdGenerator } from "@/src/utils";
import { eq } from "drizzle-orm";
import { Metadata } from "next";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: "Dashboard | New Post",
};
export default async function DashboardNewPostPage() {
  const shortId = shortIdGenerator.bigIntId().substring(6, 12);
  let createdPost: PostSelect | null = null;
  try {
    createdPost = await getServerSession().then(async (session) => {
      if (!session?.user?.email) {
        throw new Error("No user session found");
      }
      const user = await db.query.users.findFirst({
        where: eq(users.email, session?.user?.email as string),
      });
      const newPost = {
        title: "Untitled post",
        slug: "untitled-" + shortId,
        author_id: user?.id as number,
      };

      createdPost = (await db.transaction(async (tx) => {
        const [insertResponse] = await tx
          .insert(posts)
          .values(newPost)
          .onDuplicateKeyUpdate({
            set: {
              slug: newPost.slug,
              updated_at: new Date(),
            },
          })
          .$returningId();
        return await tx.query.posts.findFirst({
          where: eq(posts.id, insertResponse.id),
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
      return createdPost;
    });
  } catch (error) {
    console.error("Failed to create post:", error);
  }
  console.log({ createdPost });

  if (!createdPost) {
    return <div>Failed to create post</div>;
  }

  return <ClientNewPostRedirect postId={createdPost?.post_id as string} />;
}
