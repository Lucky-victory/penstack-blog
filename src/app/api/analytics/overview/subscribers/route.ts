import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { newsletters } from "@/src/db/schemas/newsletter.sql";
import { desc, sql, count, and, eq, gte } from "drizzle-orm";

export async function GET() {
  try {
    const subscribersCount = await db
      .select({
        count: count(),
      })
      .from(newsletters)
      .where(eq(newsletters.status, "subscribed"));
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const subscribersTimeline = await db
      .select({ count: count() })
      .from(newsletters)
      .where(
        and(
          eq(newsletters.status, "subscribed"),
          gte(newsletters.created_at, oneWeekAgo)
        )
      );

    return NextResponse.json({
      total: subscribersCount[0].count,
      weeklyGrowth: subscribersTimeline[0].count,
      isUp: subscribersTimeline[0].count > 0,
    });
  } catch (error) {
    console.error("Error fetching subscribers analytics:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
