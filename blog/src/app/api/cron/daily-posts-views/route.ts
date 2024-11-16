import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { aggregatePostViews } from "@/src/lib/queries/aggregated-post-views";
import { db } from "@/src/db";

export async function POST(request: Request) {
  try {
    // 1. Verify the request is from Vercel Cron
    const headersList = headers();
    const cronSecret = headersList.get("x-vercel-cron-secret");

    // Must match the value in your Vercel environment variables
    // if (cronSecret !== process.env.CRON_SECRET) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }
    try {
      await aggregatePostViews(db);
    } catch (error) {
      console.log(error);
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
