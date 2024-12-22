import {
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const medias = mysqlTable("Medias", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  url: text("url").notNull(),
  type: varchar("type", {
    length: 100,
    enum: ["audio", "image", "video", "pdf", "doc"],
  }).notNull(),
  size: int("size").notNull(),
  mime_type: varchar("mime_type", { length: 100 }),
  caption: varchar("caption", { length: 255 }),
  alt_text: varchar("alt_text", { length: 255 }),
  width: int("width"), // For images
  height: int("height"), // For images
  folder: varchar("folder", { length: 255 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow(),
});
