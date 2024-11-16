import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { aggregatePostViews } from "@/src/lib/queries/aggregated-post-views";
import { db } from "@/src/db";

export async function POST(request: Request) {
  try {
    try {
      await aggregatePostViews(db);
    } catch (error) {
      throw error;
    }
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cron job failed:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
