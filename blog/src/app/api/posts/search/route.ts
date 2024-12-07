import { db } from "@/src/db";
import { posts } from "@/src/db/schemas";
import { PostSelect } from "@/src/types";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 3600; // revalidate every hour

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;

  const query = searchParams.get("q");
  const category = Number(searchParams.get("category"));
  const sort = searchParams.get("sort") as "relevant" | "recent" | "popular";
  const status =
    (searchParams.get("status") as NonNullable<PostSelect["status"] | "all">) ||
    "published";
  const offset = (page - 1) * limit;

  // Build where conditions
  const whereConditions = [];

  if (query) {
    whereConditions.push(
      or(ilike(posts.title, `%${query}%`), ilike(posts.content, `%${query}%`))
    );
  }

  if (status && status !== "all") {
    whereConditions.push(eq(posts.status, status));
  }
  if (category) {
    whereConditions.push(
      sql`EXISTS (
          SELECT 1 FROM categories 
          WHERE categories.id = ${posts.category_id} 
          AND categories.name ILIKE ${`%${category}%`}
        )`
    );
  }

  try {
    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(posts)
      .where(and(...whereConditions));
    const total = Number(totalResult[0].count);

    let orderBy;
    switch (sort) {
      case "recent":
        orderBy = [desc(posts.created_at), desc(posts.is_sticky)];
        break;
      case "popular":
        orderBy = [
          desc(
            sql`(SELECT COUNT(*) FROM PostViews WHERE post_id = ${posts.id})`
          ),
          desc(posts.is_sticky),
        ];
        break;
      case "relevant":
      default:
        orderBy = [desc(posts.created_at), desc(posts.is_sticky)];
        break;
    }

    const _posts = await db.query.posts.findMany({
      limit,
      offset,

      orderBy,
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
          columns: { auth_id: true, name: true, avatar: true, username: true },
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
      message: "Search results fetched successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        data: null,
        error: error?.message,
        message: "Something went wrong... could not fetch search results",
      },
      {
        status: 500,
      }
    );
  }
}
