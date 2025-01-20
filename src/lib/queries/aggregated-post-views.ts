import { and, between, count, desc, eq, sql } from "drizzle-orm";
import { postViews, postViewStats } from "@/src/db/schemas/posts-analytics.sql";
import { MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "@/src/db/schemas";

export async function aggregatePostViews(
  db: MySql2Database<typeof schema>,
  date?: Date
) {
  try {
    const _date = date && date instanceof Date ? new Date(date) : Date.now();
    const startDate = new Date(_date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(_date);
    endDate.setHours(23, 59, 59, 999);

    const aggregatedStats = await db
      .select({
        post_id: postViews.post_id,
        total_views: sql<number>`count(*)`,
        unique_views: sql<number>`count(distinct case 
          when ${postViews.user_id} is not null then ${postViews.user_id}
          else concat(${postViews.ip_address}, ${postViews.user_agent})
        end)`,
        registered_user_views: sql<number>`count(distinct ${postViews.user_id})`,
        anonymous_views: sql<number>`sum(case when ${postViews.user_id} is null then 1 else 0 end)`,
      })
      .from(postViews)
      .where(and(between(postViews.viewed_at, startDate, endDate)))
      .groupBy(postViews.post_id);

    console.log("agg", aggregatedStats);

    // Insert or update the stats
    for (const stats of aggregatedStats) {
      await db
        .insert(postViewStats)
        .values({
          post_id: stats.post_id,
          view_date: startDate,
          total_views: stats.total_views,
          unique_views: stats.unique_views,
          registered_user_views: stats.registered_user_views,
          anonymous_views: stats.anonymous_views,
        })
        .onDuplicateKeyUpdate({
          set: {
            total_views: stats.total_views,
            unique_views: stats.unique_views,
            registered_user_views: stats.registered_user_views,
            anonymous_views: stats.anonymous_views,
          },
        });
    }
  } catch (error) {}
}
