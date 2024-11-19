import { ClientNewPostRedirect } from "@/src/app/components/pages/Dashboard/NewPostPage/ClientNewPostRedirect";
import { db } from "@/src/db";
import { posts, users } from "@/src/db/schemas";
import { getSession } from "@/src/lib/auth/next-auth";
import { checkPermission } from "@/src/middlewares/check-permission";
import { PostSelect } from "@/src/types";
import { shortIdGenerator } from "@/src/utils";
import { eq } from "drizzle-orm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | New Post",
};
export default async function DashboardNewPostPage() {
  const shortId = shortIdGenerator.bigIntId().substring(6, 12);
  let createdPost: PostSelect | null = null;
  try {
    const session = await getSession();
    if (!session?.user?.email) {
      throw new Error("No user session found");
    }
    const user = await db.query.users.findFirst({
      where: eq(users.email, session?.user?.email as string),
    });
    const newPost = {
      title: "Untitled post",
      slug: "untitled-" + shortId,
      author_id: user?.auth_id as string,
    };

    const createdPost = (await checkPermission(
      "posts:create",
      async () => {
        const [insertResponse] = await db
          .insert(posts)
          .values(newPost)
          .onDuplicateKeyUpdate({
            set: {
              slug: newPost.slug,
              updated_at: new Date(),
            },
          })
          .$returningId();
        return await db.query.posts.findFirst({
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
      },
      true
    )) as PostSelect;

    console.log({ createdPost });

    if (!createdPost) {
      return <div>Failed to create post</div>;
    }

    return <ClientNewPostRedirect postId={createdPost?.post_id as string} />;
  } catch (error) {
    console.error("Error creating post:", error);
    return <div>Failed to create post</div>;
  }
}
