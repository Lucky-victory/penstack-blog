import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/db";
import { posts } from "@/src/db/schemas/posts.sql";
import { and, eq, gte, sql } from "drizzle-orm";
import { postViews, postViewStats } from "@/src/db/schemas/posts-analytics.sql";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get("timeRange") || "7days";
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

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

    // Format dates for MySQL
    const startDateStr = startDate.toISOString().slice(0, 10);
    const endDateStr = endDate.toISOString().slice(0, 10);

    // Query for daily views
    const viewsData = await db
      .select({
        date: sql<string>`DATE(${postViewStats.view_date})`.as("date"),
        views: sql<number>`SUM(${postViewStats.total_views})`.as("views"),
      })
      .from(postViewStats)
      .where(
        and(
          eq(postViewStats.post_id, parseInt(postId)),
          gte(postViewStats.view_date, new Date(startDateStr))
        )
      )
      .groupBy(sql`DATE(${postViewStats.view_date})`)
      .orderBy(sql`DATE(${postViewStats.view_date})`);

    // Get total views for the period
    const totalViews = await db
      .select({
        total:
          sql<number>`COUNT(${postViews.id}) WHERE ${postViews.post_id} IS NOT NULL`.as(
            "total"
          ),
        uniqueViews: sql<number>`SUM(${postViewStats.unique_views})`.as(
          "unique_views"
        ),
        registeredViews:
          sql<number>`SUM(${postViewStats.registered_user_views})`.as(
            "registered_views"
          ),
        anonymousViews: sql<number>`SUM(${postViewStats.anonymous_views})`.as(
          "anonymous_views"
        ),
      })
      .from(postViewStats)
      .where(
        and(
          eq(postViewStats.post_id, parseInt(postId)),
          gte(postViewStats.view_date, new Date(startDateStr))
        )
      );

    // Fill in missing dates with zero views
    const filledData = fillMissingDates(viewsData, startDate, endDate);

    return NextResponse.json(
      {
        data: filledData,
        summary: totalViews[0],
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
  data: { date: string; views: number }[],
  startDate: Date,
  endDate: Date
) {
  const filledData: { date: string; views: number }[] = [];
  const currentDate = new Date(startDate);
  const dateMap = new Map(data.map((item) => [item.date, item.views]));

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().slice(0, 10);
    filledData.push({
      date: dateStr,
      views: dateMap.get(dateStr) || 0,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return filledData;
}
