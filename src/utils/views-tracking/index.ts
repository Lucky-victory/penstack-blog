import { and, eq, sql, gte } from "drizzle-orm";
import { db } from "../../db";
import {
  postViewAnalytics,
  postViews,
  activePostViewers,
} from "../../db/schemas";

export const trackPostView = async ({
  postId,
  userId,
  ipAddress,
  userAgent,
  referrer,
  sessionId,
  deviceInfo,
  location,

  entryPoint,
}: {
  postId: number;
  userId?: string;
  ipAddress: string;
  userAgent: string;
  referrer: string;
  sessionId: string;

  entryPoint?: string;
  deviceInfo: {
    type: string;
    browser?: string;
    os?: string;
  };
  location: {
    country: string;
    region: string;
    city: string;
  };
}) => {
  const now = new Date();
  await db.transaction(async (tx) => {
    await tx.insert(postViews).values({
      post_id: postId,
      user_id: userId,
      ip_address: ipAddress,
      user_agent: userAgent,
      referrer: referrer,
    });

    // Always update analytics for the session
    const existingAnalytics = await tx.query.postViewAnalytics.findFirst({
      where: and(
        eq(postViewAnalytics.post_id, postId),
        eq(postViewAnalytics.session_id, sessionId)
      ),
    });

    if (existingAnalytics) {
      // Update existing analytics with max values
    } else {
      // Insert new analytics record
      await tx.insert(postViewAnalytics).values({
        post_id: postId,
        user_id: userId,
        session_id: sessionId,
        entry_point: entryPoint,

        device_type: deviceInfo.type,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        country: location.country,
        region: location.region,
        city: location.city,
      });
    }
  });
};

export const updateDailyStats = async (postId: number) => {
  const today = new Date().toISOString().split("T")[0];

  const stats = (await db
    .select({
      totalViews: sql`COUNT(*)`,
      uniqueViews: sql`COUNT(DISTINCT user_id, ip_address)`,
      registeredViews: sql`COUNT(DISTINCT user_id) WHERE user_id IS NOT NULL`,
      anonymousViews: sql`COUNT(*) WHERE user_id IS NULL`,
    })
    .from(postViews)
    .where(
      and(eq(postViews.post_id, postId), sql`DATE(viewed_at) = ${today}`)
    )) as unknown as {
    totalViews: number;
    uniqueViews: number;
    registeredViews: number;
    anonymousViews: number;
  };

  // await db
  //   .insert(postViewStats)
  //   .values({
  //     post_id: postId,
  //     view_date: new Date(today),
  //     total_views: stats.totalViews,
  //     unique_views: stats.uniqueViews,
  //     registered_user_views: stats.registeredViews,
  //     anonymous_views: stats.anonymousViews,
  //   })
  //   .onDuplicateKeyUpdate({
  //     set: {
  //       total_views: stats.totalViews,
  //       unique_views: stats.uniqueViews,
  //       registered_user_views: stats.registeredViews,
  //       anonymous_views: stats.anonymousViews,
  //     },
  //   });
};
