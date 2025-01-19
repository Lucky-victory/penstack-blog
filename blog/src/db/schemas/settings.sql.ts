import { sql } from "drizzle-orm";
import {
  boolean,
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
  uniqueIndex,
} from "drizzle-orm/mysql-core";

export const siteSettings = mysqlTable(
  "SiteSettings",
  {
    id: int("id").primaryKey().autoincrement(),
    key: varchar("key", {
      length: 255,
    }).notNull(),
    value: text("value"),
    enabled: boolean("enabled").default(false),
    created_at: timestamp("created_at").default(new Date()),
    updated_at: timestamp("updated_at")
      .onUpdateNow()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    idxKey: uniqueIndex("idx_key").on(table.key),
  })
);
