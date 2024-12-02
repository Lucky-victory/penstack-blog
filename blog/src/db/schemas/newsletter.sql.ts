import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

export const newsletters = mysqlTable("NewsLetters", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  status: varchar("status", {
    length: 255,
    enum: ["subscribed", "unsubscribed"],
  })
    .notNull()
    .default("subscribed"),
  verification_status: varchar("verification_status", {
    length: 255,
    enum: ["verified", "unverified"],
  })
    .notNull()
    .default("unverified"),
  verification_token: varchar("verification_token", { length: 255 }),
  verification_token_expires: timestamp("verification_token_expires"),
  unsubscribed_at: timestamp("unsubscribed_at"),
  referrer: varchar("referrer", { length: 255 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow(),
});
