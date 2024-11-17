import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { posts } from "./posts.sql";
import { users } from "./users.sql";
import { relations, sql } from "drizzle-orm";

export const postViews = mysqlTable("PostViews", {
  id: int("id").autoincrement().primaryKey(),
  post_id: int("post_id").notNull(),
  user_id: varchar("user_id", { length: 100 }), // Nullable for anonymous views
  ip_address: varchar("ip_address", { length: 45 }), // IPv6 compatible
  user_agent: varchar("user_agent", { length: 255 }),
  referrer: varchar("referrer", { length: 255 }),
  viewed_at: timestamp("viewed_at").defaultNow(),
});

// Daily aggregated views
export const postViewStats = mysqlTable("PostViewStats", {
  id: int("id").autoincrement().primaryKey(),
  post_id: int("post_id").notNull(),
  view_date: timestamp("view_date").notNull(),
  total_views: int("total_views").notNull().default(0),
  unique_views: int("unique_views").notNull().default(0),
  registered_user_views: int("registered_user_views").default(0),
  anonymous_views: int("anonymous_views").default(0),
});

// Detailed analytics for user behavior
export const postViewAnalytics = mysqlTable("PostViewAnalytics", {
  id: int("id").autoincrement().primaryKey(),
  post_id: int("post_id").notNull(),
  user_id: varchar("user_id", { length: 100 }), // Nullable for anonymous users
  session_id: varchar("session_id", { length: 255 }),
  device_type: varchar("device_type", { length: 50 }), // mobile, tablet, desktop
  browser: varchar("browser", { length: 50 }),
  os: varchar("os", { length: 50 }),
  country: varchar("country", { length: 2 }),
  region: varchar("region", { length: 100 }),
  city: varchar("city", { length: 100 }),
  time_spent: int("time_spent"), // in seconds
  scroll_depth: int("scroll_depth"), // percentage
  entry_point: varchar("entry_point", { length: 255 }), // URL they came from
  exit_point: varchar("exit_point", { length: 255 }), // URL they went to
  created_at: timestamp("created_at").defaultNow(),
});

// Real-time tracking (for active users/current viewers)
export const activePostViewers = mysqlTable("ActivePostViewers", {
  id: int("id").autoincrement().primaryKey(),
  post_id: int("post_id").notNull(),
  user_id: varchar("user_id", { length: 100 }),
  session_id: varchar("session_id", { length: 255 }).notNull(),
  last_active: timestamp("last_active").onUpdateNow(),
  created_at: timestamp("created_at").defaultNow(),
});

// Relations
export const postViewsRelations = relations(postViews, ({ one }) => ({
  post: one(posts, {
    fields: [postViews.post_id],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [postViews.user_id],
    references: [users.auth_id],
  }),
}));

export const postViewStatsRelations = relations(postViewStats, ({ one }) => ({
  post: one(posts, {
    fields: [postViewStats.post_id],
    references: [posts.id],
  }),
}));
