import { int, timestamp } from "drizzle-orm/mysql-core";

export const id = int("id").autoincrement().primaryKey();
export const created_at = timestamp("created_at").defaultNow();
export const updated_at = timestamp("updated_at").onUpdateNow();
