import { db } from "@/src/db";
import { posts } from "@/src/db/schemas";
import { PostInsert, PostSelect } from "@/src/types";
import { getServerSearchParams } from "@/src/utils";
import { and, asc, desc, eq, ilike, inArray, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // const searchParams = getServerSearchParams<{
  //   status: NonNullable<PostSelect["status"]> | "all";
  //   limit: number;
  //   page: number;
  //   username: string;
  // }>(req);
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;
  const search = searchParams.get("search");
  const status = searchParams.get("status") as NonNullable<
    PostSelect["status"] | "all"
  >;
  const sortBy =
    (searchParams.get("sortBy") as
      | "created_at"
      | "published_at"
      | "updated_at") || "created_at";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  const offset = (page - 1) * limit;

  // Build where conditions
  const whereConditions = [];
  if (search) {
    whereConditions.push(ilike(posts.title, `%${search}%`));
    whereConditions.push(ilike(posts.content, `%${search}%`));
  }
  if (status && status !== "all") {
    whereConditions.push(eq(posts.status, status));
  }

  // Get total count
  const totalResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(posts)
    .where(and(...whereConditions));

  const total = Number(totalResult[0].count);

  try {
    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(posts)
      .where(and(...whereConditions));
    const total = Number(totalResult[0].count);

    const _posts = await db.query.posts.findMany({
      limit,
      offset,
      orderBy: [
        sortOrder === "desc" ? desc(posts[sortBy]) : asc(posts[sortBy]),
      ],
      where: whereConditions?.length > 0 ? and(...whereConditions) : undefined,
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
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      message: "All posts fetched successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        data: null,
        error: error?.message,
        message: "Something went wrong... could not fetch posts",
      },
      {
        status: 500,
      }
    );
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
