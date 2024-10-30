// app/api/track-view/route.ts
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { parseUserAgent } from "@/src/utils/user-agent-parser";
import { db } from "@/src/db";
import { postViews, postViewAnalytics } from "@/src/db/schemas";
import { trackPostView } from "@/src/utils/views-tracking";

export async function POST(req: NextRequest) {
  try {
    const headersList = headers();
    const body = await req.json();
    const { postId } = body;

    // Get IP address
    const forwardedFor = headersList.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0] : "127.0.0.1";

    // Get user agent and parse it
    const userAgent = headersList.get("user-agent") || "";
    const deviceInfo = parseUserAgent(userAgent);

    // Get referrer
    const referrer = headersList.get("referer") || "";

    // Get session ID (you should implement your session management)
    const sessionId = headersList.get("x-session-id") || "";

    // Get user ID (if authenticated)
    const userId = body.userId; // This should come from your auth system

    // Track the view
    await trackPostView({
      postId,
      userId,
      ipAddress: ip,
      userAgent,
      referrer,
      sessionId,
      deviceInfo,
      location: {},
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking view:", error);
    return NextResponse.json(
      { error: "Failed to track view" },
      { status: 500 }
    );
  }
}
