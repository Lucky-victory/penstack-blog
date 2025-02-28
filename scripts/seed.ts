import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { db } from "../src/db";
import {
  categories,
  tags,
  roles,
  permissions,
  rolePermissions,
  users,
  posts,
} from "../src/db/schemas";
import { eq } from "drizzle-orm";

async function main() {
  try {
    console.log("🌱 Starting seed...");

    console.log("Creating categories...");
    await db
      .insert(categories)
      .values({
        id: 1,
        name: "Uncategorized",
        slug: "uncategorized",
      })
      .onDuplicateKeyUpdate({
        set: { name: "Uncategorized", slug: "uncategorized" },
      });

    console.log("✅Categories created");

    console.log("Creating tags...");
    const seedTags = [
      { name: "Technology", slug: "technology" },
      { name: "Next.JS", slug: "next-js" },
      { name: "Beginner", slug: "beginner" },
      { name: "Programming", slug: "programming" },
    ];

    await Promise.all(
      seedTags.map((tag) =>
        db
          .insert(tags)
          .values(tag)
          .onDuplicateKeyUpdate({
            set: { name: tag.name, slug: tag.slug },
          })
      )
    );
    console.log("✅Tags created");

    const seedRoles = [
      { name: "admin", description: "Full access to all features" },
      { name: "editor", description: "Can edit and publish content" },
      { name: "author", description: "Can create and edit own content" },
      {
        name: "contributor",
        description: "Can create content but not publish",
      },
      {
        name: "moderator",
        description: "Can moderate comments and manage user-generated content",
      },
      {
        name: "seo_manager",
        description: "Focuses on SEO optimization and analytics",
      },
      {
        name: "newsletter_manager",
        description: "Manages newsletter content and subscriptions",
      },
      {
        name: "subscriber",
        description: "Can access premium content and comment",
      },
      {
        name: "public",
        description: "Default role for non-authenticated users",
      },
    ] as const;

    console.log("Creating roles...");
    const [createdRoles] = await Promise.all(
      seedRoles.map((role) =>
        db
          .insert(roles)
          .values(role)
          .onDuplicateKeyUpdate({
            set: { name: role.name },
          })
          .$returningId()
      )
    );

    const [
      adminRole,
      editorRole,
      authorRole,
      contributorRole,
      moderatorRole,
      seoManagerRole,
      newsletterManagerRole,
      subscriberRole,
      publicRole,
    ] = createdRoles;

    console.log("✅ Roles created:");

    console.log("Creating permissions...");
    const blogPermissions = [
      { name: "dashboard:access", description: "Can access the dashboard" },
      {
        name: "posts:view",
        description: "Can view posts contents in dashboard",
      },
      // ... rest of the permissions array stays the same
    ] as const;

    const createdPermissions = await Promise.all(
      blogPermissions.map((permission) =>
        db.transaction(async (tx) => {
          await tx
            .insert(permissions)
            .values(permission)
            .onDuplicateKeyUpdate({
              set: { name: permission.name },
            });
          return tx.query.permissions.findFirst({
            where: eq(permissions.name, permission.name),
          });
        })
      )
    );

    console.log("✅ Permissions created");

    console.log("Assigning permissions to roles...");

    const assignPermissionsToRole = async (
      roleId: number,
      permissionNames: string[]
    ) => {
      const rolePerms = createdPermissions.filter((p) =>
        permissionNames.includes(p?.name as string)
      );

      await Promise.all(
        rolePerms.map((perm) =>
          db
            .insert(rolePermissions)
            .values({
              role_id: roleId,
              permission_id: perm?.id as number,
            })
            .onDuplicateKeyUpdate({
              set: { role_id: roleId, permission_id: perm?.id },
            })
        )
      );
    };

    // Admin gets all permissions
    await assignPermissionsToRole(
      adminRole.id,
      createdPermissions.map((p) => p?.name as string)
    );

    // Editor permissions
    await assignPermissionsToRole(editorRole.id, [
      "dashboard:access",
      "posts:create",
      "posts:edit",
      "posts:delete",
      "posts:publish",
      "posts:read",
      "posts:schedule",
      "posts:review",
      "media:upload",
      "media:read",
      "media:edit",
      "comments:read",
      "comments:create",
      "comments:moderate",
      "comments:delete",
      "categories:read",
      "categories:create",
      "tags:read",
      "tags:create",
      "auth:login",
      "posts:view",
    ]);

    // Author permissions
    await assignPermissionsToRole(authorRole.id, [
      "dashboard:access",
      "posts:create",
      "posts:read",
      "media:upload",
      "media:read",
      "posts:view",
      "comments:create",
      "comments:read",
      "comments:reply",
      "categories:read",
      "tags:read",
      "auth:login",
    ]);

    // Contributor permissions
    await assignPermissionsToRole(contributorRole.id, [
      "dashboard:access",
      "posts:create",
      "posts:read",
      "media:upload",
      "media:read",
      "comments:read",
      "comments:reply",
      "categories:read",
      "tags:read",
      "auth:login",
    ]);
    await assignPermissionsToRole(moderatorRole.id, [
      "dashboard:access",
      "comments:read",
      "comments:moderate",
      "comments:delete",
      "comments:approve",
      "posts:read",
      "auth:login",
    ]);
    await assignPermissionsToRole(seoManagerRole.id, [
      "dashboard:access",
      "seo:edit",
      "seo:view",

      "analytics:view",
      "analytics:export",
      "posts:read",
      "auth:login",
    ]);
    // Subscriber permissions
    await assignPermissionsToRole(subscriberRole.id, [
      "posts:read",
      "comments:create",
      "comments:reply",
      "media:upload",

      "comments:read",
      "auth:login",
    ]);
    await assignPermissionsToRole(newsletterManagerRole.id, [
      "dashboard:access",
      "newsletters:read",
      "newsletters:write",
      "media:upload",
      "media:read",
      "newsletters:delete",
      "posts:read",
      "auth:login",
    ]);
    // Public permissions
    await assignPermissionsToRole(publicRole.id, [
      "posts:read",
      "comments:read",
      "auth:register",
      "auth:login",
    ]);

    console.log("Creating admin user...");
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminPassword || !adminEmail) {
      throw new Error("Admin password or email not provided");
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.email, adminEmail))
      .limit(1);

    if (!existingAdmin.length) {
      await db.insert(users).values({
        auth_id: "131872340407637508096",
        name: "Super Admin",
        email: adminEmail,
        password: hashedPassword,
        username: "admin",
        role_id: adminRole.id,
        auth_type: "local",
        title: "Chief Editor",
        bio: "I am the Chief Editor of this blog. I am responsible for overseeing the editorial content and ensuring the quality and accuracy of the articles.",
      });
      const adminUser = await db.query.users.findFirst({
        where: eq(users.email, adminEmail),
      });
      try {
        await db.insert(posts).values({
          title: "Welcome to my blog",
          content: "This is your first post, edit or delete it",
          slug: "welcome-to-my-blog",
          author_id: adminUser?.auth_id as string,
          status: "published",
          category_id: 1,
          post_id: uuidv4(),
        });
        console.log("✅ Post created successfully");
      } catch (error) {
        console.log("Error creating post:", error);
      }
    } else {
      console.log("Admin user already exists");
    }

    console.log("✅ Seed completed successfully");
  } catch (error) {
    console.error("❌ Error during seed:", error);
    throw error;
  }
}

main();
