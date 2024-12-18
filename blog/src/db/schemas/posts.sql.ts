import { IdGenerator } from "@/src/utils";
import { relations, sql } from "drizzle-orm";
import {
  mysqlTable,
  int,
  varchar,
  longtext,
  timestamp,
  mysqlEnum,
  text,
  boolean,
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import { users } from "./users.sql";
import { medias } from "./media.sql";
import { postViews } from "./posts-analytics.sql";
import { postReactions } from "./posts-reactions.sql";

export const posts = mysqlTable(
  "Posts",
  {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 255 }),
    content: longtext("content"),
    summary: varchar("summary", { length: 255 }),
    seo_meta_id: int("meta_id"),
    post_id: varchar("post_id", { length: 255 }).$defaultFn(() =>
      IdGenerator.urlSafeId()
    ),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    status: mysqlEnum("status", ["draft", "published", "deleted"]).default(
      "draft"
    ),
    scheduled_at: timestamp("scheduled_at"),
    schedule_id: varchar("schedule_id", { length: 50 }),
    author_id: varchar("author_id", { length: 100 }).notNull(),
    visibility: mysqlEnum("visibility", ["public", "private"]).default(
      "public"
    ),
    category_id: int("category_id"),
    is_sticky: boolean("is_sticky").default(false), // For pinned posts
    reading_time: int("reading_time"),
    allow_comments: boolean("allow_comments").default(true),
    featured_image_id: int("featured_image_id"),
    created_at: timestamp("created_at").defaultNow(),
    published_at: timestamp("published_at").generatedAlwaysAs(
      sql`(
        CASE 
            WHEN status = 'published' THEN updated_at
            ELSE NULL
        END
    )`,
      { mode: "stored" }
    ),
    updated_at: timestamp("updated_at").onUpdateNow().defaultNow(),
  },
  (table) => {
    return {
      uniqueIndex: uniqueIndex("slug_unique_index").on(table.slug),
    };
  }
);

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.author_id],
    references: [users.auth_id],
  }),
  views: many(postViews),
  reactions: many(postReactions),
  seoMeta: one(postSeoMeta, {
    fields: [posts.seo_meta_id],
    references: [postSeoMeta.post_id],
  }),
  featured_image: one(medias, {
    fields: [posts.featured_image_id],
    references: [medias.id],
  }),
  comments: many(comments),
  category: one(categories, {
    fields: [posts.category_id],
    references: [categories.id],
  }),
  tags: many(postTags),
}));
export const postSeoMeta = mysqlTable("PostSeoMeta", {
  id: int("id").primaryKey().autoincrement(),
  post_id: int("post_id").notNull(),
  title: varchar("title", { length: 150 }),
  canonical_url: varchar("canonical_url", { length: 255 }),
  description: varchar("description", { length: 255 }),
});
export const postMetaRelations = relations(postSeoMeta, ({ one }) => ({
  post: one(posts, {
    fields: [postSeoMeta.post_id],
    references: [posts.id],
  }),
}));
export const categories = mysqlTable("Categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow(),
});

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  posts: many(posts),
}));

export const tags = mysqlTable("Tags", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow(),
});

export const tagsRelations = relations(tags, ({ one, many }) => ({
  posts: many(postTags),
}));

export const postTags = mysqlTable("PostTags", {
  post_id: int("post_id").notNull(),
  tag_id: int("tag_id").notNull(),
});

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, {
    fields: [postTags.post_id],
    references: [posts.id],
  }),
  tag: one(tags, {
    fields: [postTags.tag_id],
    references: [tags.id],
  }),
}));

export const comments = mysqlTable("Comments", {
  id: int("id").autoincrement().primaryKey(),
  content: text("content"),
  status: mysqlEnum("status", [
    "approved",
    "pending",
    "disapproved",
    "deleted",
  ]).default("pending"),
  post_id: int("post_id").notNull(),
  author_id: varchar("author_id", { length: 100 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow(),
});

export const commentsRelations = relations(comments, ({ one, many }) => ({
  author: one(users, {
    fields: [comments.author_id],
    references: [users.auth_id],
  }),
  post: one(posts, {
    fields: [comments.post_id],
    references: [posts.id],
  }),
  replies: many(replies),
}));

export const replies = mysqlTable("Replies", {
  id: int("id").autoincrement().primaryKey(),
  content: text("content"),
  status: mysqlEnum("status", [
    "approved",
    "pending",
    "disapproved",
    "deleted",
  ]).default("pending"),

  comment_id: int("comment_id").notNull(),
  author_id: varchar("author_id", { length: 100 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow(),
});

export const repliesRelations = relations(replies, ({ one }) => ({
  author: one(users, {
    fields: [replies.author_id],
    references: [users.auth_id],
  }),
  parentComment: one(comments, {
    fields: [replies.comment_id],
    references: [comments.id],
  }),
}));
