import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import { v4 as uuidv4 } from "uuid";

async function main() {
  const { DB_PORT, DB_USER_NAME, DB_USER_PASS, DB_HOST, DB_NAME } = process.env;
  const dbConfig = {
    port: +DB_PORT,
    user: DB_USER_NAME,
    password: DB_USER_PASS,
    host: DB_HOST,
    database: DB_NAME,
    ssl: { rejectUnauthorized: true },
  };

  const db = await mysql.createConnection(dbConfig);

  try {
    console.log("🌱 Starting seed...");

    console.log("Creating categories...");
    await db.query(
      "INSERT INTO Categories (id,name,slug) VALUES (?,?,?) ON DUPLICATE KEY UPDATE name = VALUES(name), slug = VALUES(slug)",
      [1, "Uncategorized", "uncategorized"]
    );

    console.log("✅Categories created");

    console.log("Creating tags...");
    const seedTags = [
      {
        name: "Technology",
        slug: "technology",
      },
      {
        name: "Next.JS",
        slug: "next-js",
      },

      {
        name: "Beginner",
        slug: "beginner",
      },
      {
        name: "Programming",
        slug: "programming",
      },
    ];
    await Promise.all(
      seedTags.map(async (tag) => {
        const [result] = await db.query(
          "INSERT INTO Tags (name,slug) VALUES (?,?) ON DUPLICATE KEY UPDATE name = VALUES(name), slug = VALUES(slug)",
          [tag.name, tag.slug]
        );
        return {
          id: result.insertId,
          name: tag.name,
          slug: tag.slug,
        };
      })
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
    ];
    console.log("Creating roles...");
    const createdRolesIds = await Promise.all(
      seedRoles.map(async (role) => {
        const [result] = await db.query(
          "INSERT INTO Roles (description, name) VALUES (?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name)",
          [role.description, role.name]
        );
        return result.insertId;
      })
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
    ] = createdRolesIds;
    console.log("✅ Roles created:");

    // 2. Create blog-specific permissions
    console.log("Creating permissions...");
    const blogPermissions = [
      {
        name: "dashboard:access",
        description: "Can access the dashboard",
      },
      {
        name: "posts:view",
        description: "Can view posts contents in dashboard",
      },
      {
        name: "posts:create",
        description: "Can create new posts",
      },
      {
        name: "posts:edit",
        description: "Can edit existing posts",
      },
      {
        name: "posts:delete",
        description: "Can delete posts",
      },
      {
        name: "posts:publish",
        description: "Can publish posts",
      },
      {
        name: "posts:read",
        description: "Can read posts",
      },
      {
        name: "posts:schedule",
        description: "Can schedule posts for future publication",
      },
      {
        name: "posts:review",
        description: "Can review and approve pending posts",
      },

      {
        name: "users:read",
        description: "Can view users",
      },
      {
        name: "users:edit",
        description: "Can edit users",
      },
      {
        name: "users:write",
        description: "Can create/edit users",
      },
      {
        name: "users:delete",
        description: "Can delete users",
      },
      {
        name: "roles:read",
        description: "Can view roles",
      },
      {
        name: "roles:write",
        description: "Can create/edit roles",
      },
      {
        name: "roles:delete",
        description: "Can delete roles",
      },
      {
        name: "media:upload",
        description: "Can upload media files",
      },
      {
        name: "media:read",
        description: "Can view media files",
      },
      {
        name: "media:delete",
        description: "Can delete media files",
      },
      {
        name: "media:edit",
        description: "Can edit media file properties",
      },
      {
        name: "settings:read",
        description: "Can view system settings",
      },
      {
        name: "settings:write",
        description: "Can modify system settings",
      },
      {
        name: "comments:create",
        description: "Can create comments",
      },
      {
        name: "comments:moderate",
        description: "Can moderate comments",
      },
      {
        name: "comments:delete",
        description: "Can delete comments",
      },
      {
        name: "comments:read",
        description: "Can view comments",
      },
      {
        name: "comments:reply",
        description: "Can reply to comments",
      },

      {
        name: "newsletters:read",
        description: "Can view newsletter settings and subscribers",
      },
      {
        name: "newsletters:write",
        description: "Can create and edit newsletters",
      },
      {
        name: "newsletters:delete",
        description: "Can delete newsletters",
      },
      {
        name: "categories:read",
        description: "Can view post categories",
      },
      {
        name: "categories:create",
        description: "Can create new categories",
      },
      {
        name: "tags:read",
        description: "Can view post tags",
      },
      {
        name: "tags:create",
        description: "Can create new tags",
      },
      {
        name: "pages:read",
        description: "Can view static pages",
      },
      {
        name: "pages:edit",
        description: "Can view static pages",
      },
      {
        name: "pages:delete",
        description: "Can view static pages",
      },
      {
        name: "seo:edit",
        description: "Can edit SEO settings and metadata",
      },
      {
        name: "seo:view",
        description: "Can view SEO settings and analytics",
      },
      {
        name: "analytics:view",
        description: "Can view site analytics and statistics",
      },
      {
        name: "analytics:export",
        description: "Can export analytics data",
      },
      {
        name: "auth:register",
        description: "Can register a new account",
      },
      {
        name: "auth:login",
        description: "Can login to existing account",
      },
    ];

    const createdPermissions = await Promise.all(
      blogPermissions.map(async (permission) => {
        const [result] = await db.query(
          "INSERT INTO Permissions (name, description) VALUES (?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name)",
          [permission.name, permission.description]
        );
        return {
          id: result.insertId,
          name: permission.name,
          description: permission.description,
        };
      })
    );

    console.log("✅ Permissions created");

    // 3. Assign role-specific permissions
    console.log("Assigning permissions to roles...");

    // Helper function to assign permissions to a role
    const assignPermissionsToRole = async (roleId, permissionNames) => {
      const rolePerms = createdPermissions.filter((p) =>
        permissionNames.includes(p.name)
      );
      await Promise.all(
        rolePerms.map(async (perm) => {
          await db.query(
            "INSERT INTO RolePermissions (role_id, permission_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE role_id = VALUES(role_id), permission_id = VALUES(permission_id)",
            [roleId, perm.id]
          );
        })
      );
    };

    // Admin gets all permissions
    await assignPermissionsToRole(
      adminRole,
      createdPermissions.map((p) => p.name)
    );

    // Editor permissions
    await assignPermissionsToRole(editorRole, [
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
    await assignPermissionsToRole(authorRole, [
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
    await assignPermissionsToRole(contributorRole, [
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
    await assignPermissionsToRole(moderatorRole, [
      "dashboard:access",
      "comments:read",
      "comments:moderate",
      "comments:delete",
      "comments:approve",
      "posts:read",
      "auth:login",
    ]);
    await assignPermissionsToRole(seoManagerRole, [
      "dashboard:access",
      "seo:edit",
      "seo:view",
      "analytics:view",
      "analytics:export",
      "posts:read",
      "auth:login",
    ]);
    // Subscriber permissions
    await assignPermissionsToRole(subscriberRole, [
      "posts:read",
      "comments:create",
      "comments:reply",
      "comments:read",
      "auth:login",
    ]);
    await assignPermissionsToRole(newsletterManagerRole, [
      "dashboard:access",
      "newsletters:read",
      "newsletters:write",
      "newsletters:delete",
      "posts:read",
      "auth:login",
    ]);
    // Public permissions
    await assignPermissionsToRole(publicRole, [
      "posts:read",
      "comments:read",
      "auth:register",
      "auth:login",
    ]);
    // 4. Create default admin user
    console.log("Creating admin user...");
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminPassword || !adminEmail) {
      throw new Error("Admin password or email not provided");
    }
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Check if admin user already exists
    const [[existingAdmin]] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [adminEmail]
    );

    if (!existingAdmin) {
      const [result] = await db.query(
        "INSERT INTO Users (auth_id,name, email, password, username,role_id, auth_type,title,bio) VALUES (?, ?, ?, ?, ?, ?,?,?,?)",
        [
          "131872340407637508096",
          "Super Admin",
          adminEmail,
          hashedPassword,
          "admin",
          adminRole,
          "local",
          "Chief Editor",
          "I am the Chief Editor of this blog. I am responsible for overseeing the editorial content and ensuring the quality and accuracy of the articles.",
        ]
      );
      const [[adminUser]] = await db.query("SELECT * FROM users WHERE id = ?", [
        result.insertId,
      ]);
      console.log("✅ Admin user created:", adminUser);
      try {
        await db.query(
          "INSERT INTO Posts (title,content,slug,author_id,status,category_id,post_id) VALUES(?,?,?,?,?,?,?)",
          [
            "Welcome to my blog",
            "This is your first post, edit or delete it",
            "welcome-to-my-blog",
            adminUser.auth_id,
            "published",
            1,
            uuidv4(),
          ]
        );
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
  } finally {
    await db.end();
  }
}

main();
