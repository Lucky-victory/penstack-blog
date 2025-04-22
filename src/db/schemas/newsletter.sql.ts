import {
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import { id, created_at, updated_at, emailEventsEnum } from "../schema-helper";
import { IdGenerator } from "@/src/utils";

export const newsletterSubscribers = mysqlTable(
  "NewsLetterSubscribers",
  {
    id,
    email: varchar("email", { length: 255 }).notNull().unique(),
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
    referrer: varchar("referrer", { length: 500 }),
    created_at,
    updated_at,
  },
  (table) => ({
    emailIndex: uniqueIndex("email_index").on(table.email),
    verificationTokenIndex: uniqueIndex("verification_token_index").on(
      table.verification_token
    ),
    statusIndex: uniqueIndex("status_index").on(table.status),
    verificationStatusIndex: uniqueIndex("verification_status_index").on(
      table.verification_status
    ),
  })
);

export const newsletters = mysqlTable("NewsLetters", {
  id,
  content_id: varchar("content_id", { length: 36 })
    .notNull()
    .$defaultFn(() => IdGenerator.uuid()),
  title: varchar("title", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  preview_text: varchar("preview_text", { length: 255 }),
  content: text("content").notNull(),
  status: mysqlEnum("status", ["draft", "scheduled", "sent", "failed"])
    .notNull()
    .default("draft"),
  scheduled_for: timestamp("scheduled_for"),
  sent_at: timestamp("sent_at"),
  resend_email_id: varchar("resend_email_id", { length: 255 }),
  created_at,
  updated_at,
});

// Optional: If you want to track which subscribers received which newsletters
export const newsletterRecipients = mysqlTable("NewsLetterRecipients", {
  id,
  newsletter_id: varchar("newsletter_id",{length:36}).notNull(),
  subscriber_id: varchar("subscriber_id",{length:36}).notNull(),
  sent_at: timestamp("sent_at"),
  created_at,
});

export const emailEvents = mysqlTable("EmailEvents", {
  id,
  email_id: varchar("email_id", { length: 255 }).notNull(),
  newsletter_id: varchar("newsletter_id",{length:36}),
  subscriber_id: varchar("subscriber_id",{length:36}),
  event_type: varchar("event_type", {
    length: 50,
    enum: emailEventsEnum,
  }).notNull(),
  event_data: json("event_data"), // Store full webhook payload
  created_at,
});
