import { db } from "@/src/db";
import { posts } from "@/src/db/schemas";
import { PostInsert, PostSelect } from "@/src/types";
import { getServerSearchParams } from "@/src/utils";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = getServerSearchParams<{
    status: NonNullable<PostSelect["status"]> | "all";
    limit: number;
    page: number;
    username: string;
  }>(req);

  try {
    const { status = "published", limit = 10, page = 1 } = searchParams;
    const offset = limit * (page - 1);
    const _posts = await db.query.posts.findMany({
      where: status === "all" ? undefined : eq(posts.status, status),
      offset: offset,
      limit: limit,
      orderBy: [desc(posts.updated_at), desc(posts?.published_at)],
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
    const transformedPosts = _posts.map((post) => {
      const { views, ...postWithoutViews } = post;
      const viewsCount = views.length;
      return {
        ...postWithoutViews,
        views: { count: viewsCount },
      };
    });
    return NextResponse.json({
      data: transformedPosts,
      message: "All posts fetched successfully",
    });
  } catch (error: any) {
    return NextResponse.json({
      data: null,
      error: error?.message,
      message: "Something went wrong... could not fetch posts",
    });
  }
}
export async function POST(req: NextRequest) {
  const {
    title,
    content,
    summary,
    slug,
    featured_image_id,
    status,
    author_id,
    visibility,
    category_id,
    post_id,
  } = await req.json();

  try {
    const post = await db.transaction(async (tx) => {
      const [insertResponse] = await tx.insert(posts).values({
        title,
        content,
        summary,
        slug,
        featured_image_id,
        author_id,
        status,
        visibility,
        category_id,
      });
      return await tx.query.posts.findFirst({
        where: eq(posts.id, insertResponse.insertId),
      });
    });

    return NextResponse.json({
      data: post,
      message: "Post created successfully",
    });
  } catch (error: any) {
    return NextResponse.json({
      data: null,
      error: error?.message,
      message: "Error creating post",
    });
  }
}
