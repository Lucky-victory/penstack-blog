import { db } from "@/src/db";
import { comments } from "@/src/db/schemas/posts.sql";
import { NextResponse } from "next/server";
import { and, count, eq, gte } from "drizzle-orm";

export async function GET() {
  try {
    // Get total comments count
    const totalComments = await db
      .select({ count: count() })
      .from(comments)
      .where(eq(comments.status, "approved"));

    // Get comments count for the past week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const newCommentsThisWeek = await db
      .select({ count: count() })
      .from(comments)
      .where(
        and(
          eq(comments.status, "approved"),
          gte(comments.created_at, oneWeekAgo)
        )
      );

    return NextResponse.json({
      total: totalComments[0].count,
      weeklyGrowth: newCommentsThisWeek[0].count,
      isUp: newCommentsThisWeek[0].count > 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch comments analytics" },
      { status: 500 }
    );
  }
}
