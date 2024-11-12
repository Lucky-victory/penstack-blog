import { db } from "@/src/db";
import { posts } from "@/src/db/schemas";
import { PostInsert, PostSelect } from "@/src/types";
import { getServerSearchParams } from "@/src/utils";
import { and, asc, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;

  const query = searchParams.get("query");
  const category = Number(searchParams.get("category"));
  const sort = searchParams.get("sort") as "relevant" | "recent" | "popular";

  const offset = (page - 1) * limit;

  // Build where conditions
  const whereConditions = [];

  if (query) {
    whereConditions.push(
      or(ilike(posts.title, `%${query}%`), ilike(posts.content, `%${query}%`))
    );
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
        orderBy = [desc(posts.created_at)];
        break;
      case "popular":
        orderBy = [
          desc(
            sql`(SELECT COUNT(*) FROM PostViews WHERE post_id = ${posts.id})`
          ),
        ];
        break;
      case "relevant":
      default:
        orderBy = [desc(posts.created_at)];
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
