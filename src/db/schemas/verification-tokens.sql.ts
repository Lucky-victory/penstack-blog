import {
  datetime,
  int,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { id } from "../schema-helper";

export const verificationTokens = mysqlTable("VerificationTokens", {
  id,
  user_id: varchar("user_id", { length: 50 }).notNull(),
  token: varchar("token", { length: 255 }).notNull(),
  expires: datetime("expires").notNull(),
});
