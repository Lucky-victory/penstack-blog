import { and, eq, sql } from "drizzle-orm";
import { db } from "../db";
import {
  activePostViewers,
  postViewAnalytics,
  postViews,
  postViewStats,
} from "../db/schemas";

export const trackPostView = async ({
  postId,
  userId,
  ipAddress,
  userAgent,
  referrer,
  sessionId,
  deviceInfo,
  location,
}: {
  postId: number;
  userId?: number;
  ipAddress: string;
  userAgent: string;
  referrer: string;
  sessionId: string;
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
  await db.insert(postViews).values({
    post_id: postId,
    user_id: userId,
    ip_address: ipAddress,
    user_agent: userAgent,
    referrer: referrer,
  });

  await db.insert(postViewAnalytics).values({
    post_id: postId,
    user_id: userId,
    session_id: sessionId,
    device_type: deviceInfo.type,
    browser: deviceInfo.browser,
    os: deviceInfo.os,
    country: location.country,
    region: location.region,
    city: location.city,
  });

  await db
    .insert(activePostViewers)
    .values({
      post_id: postId,
      user_id: userId,
      session_id: sessionId,
    })
    .onDuplicateKeyUpdate({
      set: { last_active: sql`CURRENT_TIMESTAMP` },
    });

  // 4. Update daily stats (you might want to do this in a background job)
  await updateDailyStats(postId);
};
const updateDailyStats = async (postId: number) => {
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

  await db
    .insert(postViewStats)
    .values({
      post_id: postId,
      view_date: new Date(today),
      total_views: stats.totalViews,
      unique_views: stats.uniqueViews,
      registered_user_views: stats.registeredViews,
      anonymous_views: stats.anonymousViews,
    })
    .onDuplicateKeyUpdate({
      set: {
        total_views: stats.totalViews,
        unique_views: stats.uniqueViews,
        registered_user_views: stats.registeredViews,
        anonymous_views: stats.anonymousViews,
      },
    });
};
