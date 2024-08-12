import { shortIdGenerator } from "@/src/utils";
import { relations, sql } from "drizzle-orm";
import { mysqlTable, int, bigint, varchar, longtext, timestamp, mysqlEnum, text, json } from "drizzle-orm/mysql-core";
import { users } from "./users.sql";

export const posts = mysqlTable('Posts', {
    id: int('id').autoincrement().primaryKey(),
    title: varchar('title', { 'length': 255 }).default('No title'),
    content: longtext('content'),
    summary: varchar('summary', { 'length': 255 }),
    post_id: varchar('post_id', { 'length': 255 }).$defaultFn(() => shortIdGenerator.urlSafeId()),
    slug: varchar('slug', { 'length': 255 }).notNull(),
    status: mysqlEnum('status', ['draft', 'published', 'deleted']).default('draft'),
    author_id: int('author_id').notNull(),
    visibility: mysqlEnum('visibility', ['public', 'private']).default('public'),
    category_id: int('category_id'),
    views:int('views').default(0),
    featured_image: json('featured_image').$type<{src:string,alt_text?:string}>(),
    created_at: timestamp('created_at').defaultNow(),
    published_at: timestamp('published_at').generatedAlwaysAs(sql`(
        CASE 
            WHEN status = 'published' THEN updated_at
            ELSE NULL
        END
    )`,{'mode':'stored'}),
    updated_at: timestamp('updated_at').onUpdateNow().defaultNow()
})

export const postsRelations = relations(posts, (({ one, many }) => ({
     author: one(users, {
        fields: [posts.author_id],
        references: [users.id]
    }),
    comments: many(comments),
    category: one(categories, {
        fields: [posts.category_id],
        references: [categories.id]
    }),
    tags: many(postTags)
})))


export const categories = mysqlTable('Categories', {
    id: int('id').autoincrement().primaryKey(),
    name: varchar('name', { 'length': 100 }).notNull(),
    slug: varchar('slug', { 'length': 255 }).notNull().unique(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').onUpdateNow()
})

export const categoriesRelations = relations(categories, (({ one, many }) => ({
    posts: many(posts)
})))

export const tags = mysqlTable('Tags', {
    id: int('id').autoincrement().primaryKey(),
    name: varchar('name', { 'length': 100 }).notNull(),
    slug: varchar('slug', { 'length': 255 }).notNull().unique(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').onUpdateNow()
})

export const tagsRelations = relations(tags, (({ one, many }) => ({
    posts: many(postTags)
})))

export const postTags = mysqlTable('PostTags', {
    post_id: int('post_id').notNull(),
    tag_id: int('tag_id').notNull()
})

export const postTagsRelations = relations(postTags, (({ one }) => ({
    post: one(posts, {
        fields: [postTags.post_id],
        references: [posts.id]
    }),
    tag: one(tags, {
        fields: [postTags.tag_id],
        references: [tags.id]
    })
})))

export const comments = mysqlTable('Comments', {
    id: int('id').autoincrement().primaryKey(),
    content: text('content'),
    post_id: int('post_id').notNull(),
    author_id: int('author_id').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').onUpdateNow()
})

export const commentsRelations = relations(comments, (({ one, many }) => ({
    author: one(users, {
        fields: [comments.author_id],
        references: [users.id]
    }),
    post: one(posts, {
        fields: [comments.post_id],
        references: [posts.id]
    }),
    replies: many(replies)
})))

export const replies = mysqlTable('Replies', {
    id: int('id').autoincrement().primaryKey(),
    content: text('content'),
    comment_id: int('comment_id').notNull(),
    author_id: int('author_id').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').onUpdateNow()
})

export const repliesRelations = relations(replies, (({ one }) => ({
    author: one(users, {
        fields: [replies.author_id],
        references: [users.id]
    }),
    parentComment: one(comments, {
        fields: [replies.comment_id],
        references: [comments.id]
    })
})))