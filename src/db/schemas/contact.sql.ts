import { mysqlTable, varchar, text, timestamp } from "drizzle-orm/mysql-core";
import { created_at, id } from "../schema-helper";

export const contactMessages = mysqlTable("ContactMessages", {
  id,
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  message: text("message").notNull(),
  created_at,
});
