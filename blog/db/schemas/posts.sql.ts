import { shortIdGenerator } from "@/utils";
import { relations, sql } from "drizzle-orm";
import { mysqlTable,int, bigint, varchar, longtext, datetime, timestamp, mysqlEnum, text} from "drizzle-orm/mysql-core";
import { users } from "./users.sql";

export const posts=mysqlTable('Posts',{
    id:bigint('id',{'mode':'bigint'}).autoincrement().primaryKey(),
    title:varchar('title',{'length':255}).default('No title'),
    content:longtext('content'),
    summary:varchar('summary',{'length':255}),
    post_id:varchar('post_id',{'length':255}).$defaultFn(()=>shortIdGenerator.urlSafeId()),
slug:varchar('slug',{'length':255}).notNull(),
    status:mysqlEnum('status',['draft','published','deleted']).default('draft'),
    author_id:int('author_id').notNull(),
    created_at:timestamp('created_at').defaultNow(),
    updated_at:timestamp('updated_at').onUpdateNow()
})

export const postsRelations=relations(posts,(({one,many})=>({
authors:many(users),
comments:many(comments),
})))

export const comments = mysqlTable('Comments', {
    id: bigint('id', { mode: 'bigint' }).autoincrement().primaryKey(),
    content: text('content'),
    post_id: bigint('post_id', { mode: 'bigint' }).notNull(),
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
    id: bigint('id', { mode: 'bigint' }).autoincrement().primaryKey(),
    content: text('content'),
    comment_id: bigint('comment_id', { mode: 'bigint' }).notNull(),
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
