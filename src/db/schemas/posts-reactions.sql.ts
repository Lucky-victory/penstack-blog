import {
  mysqlTable,
  int,
  timestamp,
  varchar,
  boolean,
  unique,
} from "drizzle-orm/mysql-core";

export const reactionTypes = mysqlTable("ReactionTypes", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  display_name: varchar("display_name", { length: 50 }).notNull(),
  emoji: varchar("emoji", { length: 10 }),
  order: int("order").default(0),
  is_active: boolean("is_active").default(true),
  allow_multiple: boolean("allow_multiple").default(true),
  created_at: timestamp("created_at").defaultNow(),
});

export const postReactions = mysqlTable(
  "PostReactions",
  {
    id: int("id").autoincrement().primaryKey(),
    post_id: int("post_id").notNull(),
    user_id: varchar("user_id", { length: 100 }).notNull(),
    reaction_type_id: int("reaction_type_id").notNull(),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").onUpdateNow(),
  },
  (table) => ({
    // Unique constraint to prevent duplicate reactions of the same type
    // (Optional: remove if you want to allow multiple reactions of the same type)
    uniqReaction: unique().on(
      table.post_id,
      table.user_id,
      table.reaction_type_id
    ),
  })
);

export const postShares = mysqlTable("PostShares", {
  id: int("id").autoincrement().primaryKey(),
  post_id: int("post_id").notNull(),
  user_id: varchar("user_id", { length: 100 }).notNull(),
  share_type: varchar("share_type", {
    length: 50,
    enum: ["facebook", "email", "whatsapp", "twitter", "link"],
  }).notNull(),
  share_url: varchar("share_url", { length: 255 }),
  created_at: timestamp("created_at").defaultNow(),
});
