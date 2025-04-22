import {
  boolean,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { relations, sql } from "drizzle-orm";

import { posts } from "./posts.sql";
import { IdGenerator } from "@/src/utils";
import {
  created_at,
  updated_at,
  id,
  permissionsEnum,
  rolesEnum,
} from "../schema-helper";

export const users = mysqlTable("Users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  bio: varchar("bio", { length: 255 }),
  title: varchar("title", { length: 100 }),
  avatar: varchar("avatar", { length: 255 }),
  social_id: varchar("social_id",{length:36}),
  meta_id: varchar("meta_id",{length:36}),

  account_status: varchar("account_status", {
    length: 30,
    enum: ["active", "deleted", "banned", "inactive"],
  }).default("active"),
  auth_id: varchar("auth_id", { length: 100 }).$defaultFn(() =>
    IdGenerator.bigIntId()
  ),
  email_verified: boolean("email_verified").default(false),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  image: text("image"),
  username: varchar("username", { length: 255 }).unique(),
  display_username: text("display_username"),
  role_id: int("role_id")
    .notNull()
    .references(() => roles.id, { onDelete: "cascade" }),
  created_at,
  updated_at,
});

export const roles = mysqlTable(
  "Roles",
  {
    id:int("id").autoincrement().primaryKey(),
    name: mysqlEnum("name", rolesEnum)
      .notNull()
      .unique()
      .$type<(typeof rolesEnum)[number]>(),
    description: varchar("description", { length: 255 }),
  },
  (table) => ({
    idxName: index("roles_idx_name").on(table.name),
  })
);

export const permissions = mysqlTable(
  "Permissions",
  {
    id:int("id").autoincrement().primaryKey(),
    name: mysqlEnum(
      "name",

      permissionsEnum
    )
      .notNull()
      .unique()
      .$type<(typeof permissionsEnum)[number]>(),
    description: varchar("description", { length: 255 }),
  },
  (table) => ({
    idxName: index("permissions_idx_name").on(table.name),
  })
);

const userMeta = mysqlTable("UserMeta", {
  id,
  user_id: varchar("user_id", { length: 36 }).notNull(),
  isProMember: boolean("is_pro_member").default(false),
  lastLogin: timestamp("last_login").default(sql`CURRENT_TIMESTAMP`),
  lastLoginIP: varchar("last_login_ip", { length: 50 }),
  lastLoginLocation: varchar("last_login_location", { length: 255 }),
  lastLoginDevice: varchar("last_login_device", { length: 255 }),

  created_at,
  updated_at,
});
export const userMetaRelations = relations(userMeta, ({ one }) => ({
  user: one(users, {
    fields: [userMeta.user_id],
    references: [users.id],
  }),
}));
export const userRoles = mysqlTable("UserRoles", {
  id,
  user_id: varchar("user_id", { length: 36 }).notNull(),
  role_id: int("role_id").notNull(),
});
export const userRoleRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.user_id],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [userRoles.role_id],
    references: [roles.id],
  }),
}));

export const rolePermissions = mysqlTable("RolePermissions", {
  id,
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

export const sessions = mysqlTable("sessions", {
  id: varchar("id", { length: 36 }).primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = mysqlTable("accounts", {
  id: varchar("id", { length: 36 }).primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verifications = mysqlTable("verifications", {
  id: varchar("id", { length: 36 }).primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const userSocials = mysqlTable("UserSocials", {
  id,
  user_id: varchar("user_id", { length: 100 }).notNull(),
  github: varchar("github", { length: 100 }),
  facebook: varchar("facebook", { length: 100 }),
  email: varchar("email", { length: 100 }),
  website: varchar("website", { length: 100 }),
  twitter: varchar("twitter", { length: 100 }),
  instagram: varchar("instagram", { length: 100 }),
  linkedin: varchar("linkedin", { length: 100 }),
  youtube: varchar("youtube", { length: 100 }),
  created_at,
  updated_at,
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
  roles: many(userRoles),
  meta: one(userMeta, {
    fields: [users.meta_id],
    references: [userMeta.id],
  }),
}));
