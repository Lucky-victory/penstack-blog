import { NextRequest, NextResponse } from "next/server";

import { queryTagsWithFilters } from "@/src/lib/queries/tags";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  try {
    const tagsResult = await queryTagsWithFilters({
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 20,
      sort: searchParams.get("sort") || "name",
      hasPostsOnly: searchParams.get("hasPostsOnly") === "true",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
    });

    return NextResponse.json(
      {
        ...tagsResult,
        message: "Tags fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { data: null, error: "Failed to retrieve tags" },
      { status: 500 }
    );
  }
}
