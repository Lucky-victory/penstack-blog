import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/db";
import { posts } from "@/src/db/schemas/posts.sql";
import { and, eq, gte, sql } from "drizzle-orm";
import { postViews } from "@/src/db/schemas/posts-analytics.sql";
import { getAggregatedPostViews } from "@/src/lib/queries/aggregated-post-views";
import { AggregatedPostViews } from "@/src/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const timeRange = searchParams.get("timeRange") || "all";
    const postId = searchParams.get("postId");

    // if (!postId) {
    //   return NextResponse.json(
    //     { error: "Post ID is required" },
    //     { status: 400 }
    //   );
    // }

    // Calculate date range
    const endDate = new Date();
    let startDate = new Date();

    switch (timeRange) {
      case "7days":
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "30days":
        startDate.setDate(endDate.getDate() - 30);
        break;
      case "all":
        // For "all time", we'll fetch from the beginning
        startDate = new Date(0);
        break;
      default:
        startDate.setDate(endDate.getDate() - 7); // Default to 7 days
    }

    // Query for daily views
    const viewsData = await getAggregatedPostViews(startDate, endDate);

    return NextResponse.json(
      {
        data: fillMissingDates(viewsData,startDate,endDate),

        timeRange,
        message: "Post views fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching post views:", error);
    return NextResponse.json(
      {
        error: "Failed to retrieve post views",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}

// Helper function to fill in missing dates with zero views
function fillMissingDates(
  data: AggregatedPostViews[],
  startDate: Date,
  endDate: Date
) {
  const filledData: AggregatedPostViews[] = [];
  const currentDate = new Date(startDate);
  const dateMap = new Map(
    data.map((item) => [
      item.viewed_date,
      {
        total_views: item.total_views,
        unique_views: item.unique_views,
        registered_user_views: item.registered_user_views,
        anonymous_views: item.anonymous_views,
      },
    ])
  );

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().slice(0, 10);
    filledData.push({
      viewed_date: dateStr,

      total_views: dateMap.get(dateStr)?.total_views || 0,
      unique_views: dateMap.get(dateStr)?.unique_views || 0,
      registered_user_views: dateMap.get(dateStr)?.registered_user_views || 0,
      anonymous_views: dateMap.get(dateStr)?.anonymous_views || 0,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return filledData;
}
