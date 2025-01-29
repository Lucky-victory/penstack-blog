import { int } from "drizzle-orm/mysql-core";

export const id = int("id").autoincrement().primaryKey();
