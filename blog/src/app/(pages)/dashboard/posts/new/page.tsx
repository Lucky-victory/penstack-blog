import { ClientNewPostRedirect } from "@/src/app/components/Dashboard/ClientNewPostRedirect";
import { db } from "@/src/db";
import { posts, users } from "@/src/db/schemas";
import { PostSelect } from "@/src/types";
import { shortIdGenerator } from "@/src/utils";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

export default async function DashboardNewPostPage() {
  const shortId = shortIdGenerator.bigIntId().substring(6, 12);
  let createdPost: PostSelect | null = null;
  try {
    await getServerSession().then(async (session) => {
      console.log(session);
      const user = await db.query.users.findFirst({
        where: eq(users.email, session?.user?.email as string),
      });
      const newPost = {
        title: "Untitled post",
        slug: "untitled-" + shortId,
        author_id: user?.id as number,
      };

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
