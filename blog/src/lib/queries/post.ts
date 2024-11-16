import { db } from "@/src/db";

export async function getPost(slug: string) {
  const post = await db.query.posts.findFirst({
    where: (posts, { eq }) => eq(posts.slug, slug),
    with: {
      views: {
        columns: { id: true },
      },
      featured_image: {
        columns: {
          url: true,
          alt_text: true,
          caption: true,
        },
      },
      author: {
        columns: {
          username: true,
          name: true,
          avatar: true,
        },
      },
      category: {
        columns: {
          id: true,
          name: true,
          slug: true,
        },
      },
      tags: {
        with: {
          tag: {
            columns: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  });
  const tags = post?.tags?.length ? post?.tags.map((t) => t.tag) : [];

  const viewsCount = post?.views?.length;

  if (!post) return null;

  const transformedPost = { ...post, tags, views: { count: viewsCount } };
  return transformedPost;
}
