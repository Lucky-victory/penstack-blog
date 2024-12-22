
import { db } from "@/src/db";
import { users } from "@/src/db/schemas/users.sql";
import { NextResponse } from "next/server";
import { and, count, eq, gte } from "drizzle-orm";

export async function GET() {
  try {
    // Get total users count
    const totalUsers = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.account_status, "active"));

    // Get users count for the past week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const newUsersThisWeek = await db
      .select({ count: count() })
      .from(users)
      .where(
        and(
          eq(users.account_status, "active"),
          gte(users.created_at, oneWeekAgo)
        )
      );

    return NextResponse.json({
      total: totalUsers[0].count,
      weeklyGrowth: newUsersThisWeek[0].count,
      isUp: newUsersThisWeek[0].count > 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users analytics" },
      { status: 500 }
    );
  }
}
