import {
  datetime,
  int,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const verificationTokens = mysqlTable("VerificationTokens", {
  id: int("id").autoincrement().primaryKey(),
  user_id: varchar("user_id", { length: 50 }).notNull(),
  token: varchar("token", { length: 255 }).notNull(),
  expires: datetime("expires").notNull(),
});
