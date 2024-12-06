import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

import { posts } from "./posts.sql";
import { shortIdGenerator } from "@/src/utils";

export const users = mysqlTable("Users", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }),
  bio: varchar("bio", { length: 255 }),
  title: varchar("title", { length: 100 }),
  username: varchar("username", { length: 255 }),
  avatar: varchar("avatar", { length: 255 }),
  social_id: int("social_id"),
  account_status: varchar("account_status", {
    length: 30,
    enum: ["active", "deleted", "banned", "inactive"],
  }).default("active"),
  auth_id: varchar("auth_id", { length: 100 }).$defaultFn(() =>
    shortIdGenerator.bigIntId()
  ),
  email_verified: boolean("email_verified").default(false),
  auth_type: mysqlEnum("auth_type", [
    "local",
    "google",
    "github",
    "facebook",
  ]).default("local"),
  role_id: int("role_id").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow(),
});

export const roles = mysqlTable("Roles", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  description: varchar("description", { length: 255 }),
});

export const permissions = mysqlTable("Permissions", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", {
    length: 50,
    enum: [
      "dashboard:access",
      "dashboard:view",
      "posts:create",
      "posts:edit",
      "posts:delete",
      "posts:publish",
      "posts:read",
      "users:read",
      "users:write",
      "users:delete",
      "roles:read",
      "roles:write",
      "roles:delete",
      "media:upload",
      "media:read",
      "media:delete",
      "settings:read",
      "settings:write",
      "comments:create",
      "comments:moderate",
      "auth:register",
      "auth:login",
    ],
  })
    .notNull()
    .unique(),
  description: varchar("description", { length: 255 }),
});

export const rolePermissions = mysqlTable("RolePermissions", {
  id: int("id").autoincrement().primaryKey(),
  role_id: int("role_id").notNull(),
  permission_id: int("permission_id").notNull(),
});

export const RoleRelations = relations(roles, ({ many }) => ({
  users: many(users),
  permissions: many(rolePermissions),
}));

export const PermissionRelations = relations(permissions, ({ many }) => ({
  roles: many(rolePermissions),
}));

export const RolePermissionRelations = relations(
  rolePermissions,
  ({ one }) => ({
    role: one(roles, {
      fields: [rolePermissions.role_id],
      references: [roles.id],
    }),
    permission: one(permissions, {
      fields: [rolePermissions.permission_id],
      references: [permissions.id],
    }),
  })
);
export const userSocials = mysqlTable("UserSocials", {
  id: int("id").primaryKey().autoincrement(),
  user_id: varchar("user_id", { length: 100 }).notNull(),
  github: varchar("github", { length: 100 }),
  facebook: varchar("facebook", { length: 100 }),
  email: varchar("email", { length: 100 }),
  website: varchar("website", { length: 100 }),
});
export const UserRelations = relations(users, ({ many, one }) => ({
  posts: many(posts),
  socials: one(userSocials, {
    fields: [users.social_id],
    references: [userSocials.id],
  }),
  role: one(roles, {
    fields: [users.role_id],
    references: [roles.id],
  }),
}));
