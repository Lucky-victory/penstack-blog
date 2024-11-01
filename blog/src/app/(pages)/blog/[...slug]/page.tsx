import PostPage from "@/src/app/components/pages/PostPage";

import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/src/db";
import { postViews } from "@/src/db/schemas";
import { sql } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
async function getData(slug: string, fromMetadata: boolean = false) {
  try {
    const headersList = headers();
    const session = await getServerSession();
    const referrer = headersList.get("referer") || "";
    const userAgent = headersList.get("user-agent") || "";

    const post = await db.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.slug, slug),
      with: {
        views: {
          columns: {},
          extras: {
            count: sql<number>`COUNT(*)`.as("count"),
          },
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
    if (!post) return notFound();
    if (!fromMetadata) {
      await db.insert(postViews).values({
        viewed_at: sql`NOW()`,
        user_agent: userAgent,
        post_id: post?.id,
        user_id: session?.user?.id,
        referrer: referrer,
      });
    }

    return { ...post, tags };
  } catch (error) {
    return null;
  }
}

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const postSlug = slug[slug.length - 1];

  const post = await getData(postSlug, true);

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: post?.title,
    description: post?.summary,

    openGraph: {
      images: [
        post?.featured_image?.url || "https://picsum.photos/1200/630",
        ...previousImages,
      ],
    },
  };
}

export default async function Page({ params, searchParams }: Props) {
  const slug = params.slug;
  const postSlug = slug[slug.length - 1];
  const post = await getData(postSlug);

  return <PostPage post={post as any} />;
}
