import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/db";
import { categories, posts } from "@/src/db/schemas/posts.sql";
import { and, eq, sql } from "drizzle-orm";
import { checkPermission } from "@/src/lib/auth/check-permission";

async function queryCategoriesWithFilters({
  page = 1,
  limit = 20,
  sortBy = "name",
  hasPostsOnly = true,
  sortOrder = "desc",
}: {
  page?: number;
  limit?: number;
  sortBy?: string;
  hasPostsOnly?: boolean;
  sortOrder?: "asc" | "desc";
}) {
  // Ensure valid pagination
  const validatedPage = Math.max(Number(page), 1);
  const validatedLimit = Math.min(Number(limit), 100);
  const offset = (validatedPage - 1) * validatedLimit;

  // Validate sortBy and sortOrder
  const validSort = ["name", "popular"].includes(sortBy) ? sortBy : "name";
  const validSortOrder = ["asc", "desc"].includes(sortOrder)
    ? sortOrder
    : "desc";

  try {
    // Total count query with optional post filtering
    const totalQuery = db
      .select({ count: sql<number>`count(distinct ${categories.id})` })
      .from(categories)
      .leftJoin(posts, eq(posts.category_id, categories.id))
      .where(hasPostsOnly ? sql`count(${posts.id}) > 0` : undefined);
    // .groupBy(categories.id);

    const totalResult = await totalQuery;
    const total = Number(totalResult?.[0]?.count || 0);

    // Category query with different sorting strategies
    let allCategories;
    if (validSort === "popular") {
      const categoriesWithCount = db.$with("categoriesWithCount").as(
        db
          .select({
            id: categories.id,
            name: categories.name,
            slug: categories.slug,
            postCount: sql<number>`count(${posts.id})`.as("post_count"),
          })
          .from(categories)
          .leftJoin(posts, eq(posts.category_id, categories.id))
          .groupBy(categories.id)
          .having(hasPostsOnly ? sql`count(${posts.id}) > 0` : undefined)
          .orderBy(
            validSort === "popular"
              ? validSortOrder === "desc"
                ? sql`post_count DESC`
                : sql`post_count ASC`
              : categories.name
          )
          .limit(validatedLimit)
          .offset(offset)
      );

      allCategories = await db
        .with(categoriesWithCount)
        .select()
        .from(categoriesWithCount);
    } else {
      // Default sorting by name
      allCategories = await db.query.categories.findMany({
        limit: validatedLimit,
        offset,
        orderBy:
          validSortOrder === "desc"
            ? (categories, { desc }) => desc(categories.name)
            : (categories, { asc }) => asc(categories.name),
        with: {
          posts: {
            columns: {
              id: true,
            },
          },
        },
        where: hasPostsOnly
          ? sql`(SELECT COUNT(*) FROM Posts WHERE Posts.category_id = Categories.id) > 0`
          : undefined,
      });
    }

    return {
      data: allCategories,
      meta: {
        total,
        page: validatedPage,
        limit: validatedLimit,
        totalPages: Math.ceil(total / validatedLimit),
      },
    };
  } catch (error) {
    console.error("Category query error:", error);
    throw error;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  try {
    const categories = await queryCategoriesWithFilters({
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 20,
      sortBy: searchParams.get("sortBy") || "name",
      hasPostsOnly: searchParams.get("hasPostsOnly") === "true",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
    });

    return NextResponse.json(
      {
        ...categories,
        message: "Categories fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { data: null, error: "Failed to retrieve categories" },
      { status: 500 }
    );
  }
}
export async function POST(request: NextRequest) {
  return await checkPermission(
    { requiredPermission: "posts:create" },
    async () => {
      try {
        const { name, slug } = await request.json();

        if (!name || !slug) {
          return NextResponse.json(
            { error: "Name and slug are required" },
            { status: 400 }
          );
        }

        const newCategory = await db
          .insert(categories)
          .values({ name, slug })
          .onDuplicateKeyUpdate({ set: { name: sql`name`, slug: sql`slug` } });
        return NextResponse.json(
          { data: newCategory, message: "Category created successfully" },
          { status: 201 }
        );
      } catch (error) {
        return NextResponse.json(
          { data: null, error: "Failed to create category" },
          { status: 500 }
        );
      }
    }
  );
}
