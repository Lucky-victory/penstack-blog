import { db } from "@/src/db";
import { posts } from "@/src/db/schemas";
import { PostInsert, PostSelect } from "@/src/types";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const params = Object.fromEntries(searchParams) as unknown as {
    status: NonNullable<PostSelect["status"]> | "all";
    limit: number;
    page: number;
  };

  try {
    const { status = "published", limit = 10, page = 1 } = params;
    const offset = limit * (page - 1);
    const _posts = await db.query.posts.findMany({
      where: status === "all" ? undefined : eq(posts.status, status),
      offset: offset,
      limit: limit,
      orderBy: [desc(posts.created_at)],
      with: {
        category: {
          columns: {
            name: true,
            slug: true,
            id: true,
          },
        },
        author: {
          columns: {
            name: true,
            avatar: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json({ posts: _posts });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message });
  }
}
export async function POST(req: NextRequest) {
  const {
    title,
    content,
    summary,
    slug,
    featured_image,
    status,
    author_id,
    visibility,
    category_id,
    post_id,
  } = await req.json();

  const post = await db.transaction(async (tx) => {
    const [insertResponse] = await tx.insert(posts).values({
      title,
      content,
      summary,
      slug,
      featured_image,
      author_id,
      status,
      visibility,
      category_id,
    });
    return await tx.query.posts.findFirst({
      where: eq(posts.id, insertResponse.insertId),
    });
  });

  return NextResponse.json(post);
}
