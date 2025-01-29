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
import { created_at, updated_at, id } from "../schema-helper";

export const siteSettings = mysqlTable(
  "SiteSettings",
  {
    id,
    key: varchar("key", {
      length: 255,
    }).notNull(),
    value: text("value"),
    enabled: boolean("enabled").default(false),
    created_at,
    updated_at,
  },
  (table) => ({
    idxKey: uniqueIndex("idx_key").on(table.key),
  })
);
