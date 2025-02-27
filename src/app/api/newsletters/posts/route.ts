import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/db";
import { newsletterSubscribers } from "@/src/db/schemas";
import { sendEmail } from "@/src/lib/send-email"; // You'll need to implement this
import { eq } from "drizzle-orm";
import BlogPostNewsletter from "@/src/app/components/Emails/BlogPostNewsletter";
import { getSettings } from "@/src/lib/queries/settings";
import { getPost } from "@/src/lib/queries/post";

export async function POST(request: NextRequest) {
  try {
    const { postId, subject } = await request.json();
    const siteSettings = await getSettings();
    // Get all newsletter subscribers
    const subscribers = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.status, "subscribed"));

    const post = await getPost(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Send email to each subscriber
    const emailPromises = subscribers.map(async (subscriber) => {
      return await sendEmail({
        to: subscriber.email,
        subject: subject || post.title,
        from: ``,
        react: BlogPostNewsletter({
          post: post as any,
          siteDescription: siteSettings.siteDescription.value,
          siteName: siteSettings.siteName.value,
        }),
      });
    });

    await Promise.all(emailPromises);

    return NextResponse.json({
      success: true,
      message: `Email sent to ${subscribers.length} subscribers`,
    });
  } catch (error) {
    console.error("Newsletter sending failed:", error);
    return NextResponse.json(
      { error: "Failed to send newsletter" },
      { status: 500 }
    );
  }
}
