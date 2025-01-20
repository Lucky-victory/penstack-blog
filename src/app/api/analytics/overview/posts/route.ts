import { db } from "@/src/db";
import { posts } from "@/src/db/schemas/posts.sql";
import { NextResponse } from "next/server";
import { and, count, eq, gte } from "drizzle-orm";

export async function GET() {
  try {
    // Get total posts count
    const totalPosts = await db
      .select({ count: count() })
      .from(posts)
      .where(eq(posts.status, "published"));

    // Get posts count for the past week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const newPostsThisWeek = await db
      .select({ count: count() })
      .from(posts)
      .where(
        and(eq(posts.status, "published"), gte(posts.created_at, oneWeekAgo))
      );

    return NextResponse.json({
      total: totalPosts[0].count,
      weeklyGrowth: newPostsThisWeek[0].count,
      isUp: newPostsThisWeek[0].count > 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts analytics" },
      { status: 500 }
    );
  }
}
