import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

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
      "INSERT INTO Categories (name,slug) VALUES (?,?) ON DUPLICATE KEY UPDATE name = VALUES(name), slug = VALUES(slug)",
      ["Uncategorized", "uncategorized"]
    );

    console.log("✅Categories created");

    console.log("Creating tags...");
    const seedTags = [
      {
        name: "React",
        slug: "react",
      },
      {
        name: "Next.JS",
        slug: "next-js",
      },
      {
        name: "NodeJS",
        slug: "node-js",
      },
      {
        name: "Beginner",
        slug: "beginner",
      },
      {
        name: "Javascript",
        slug: "javascript",
      },
      {
        name: "Typescript",
        slug: "typescript",
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
      {
        description: "Full access to all features",
        name: "admin",
      },
      {
        description: "Can edit and publish content",
        name: "editor",
      },
      {
        name: "author",
        description: "Can create and edit own content",
      },
      {
        description: "Can create content but not publish",
        name: "contributor",
      },
      {
        name: "subscriber",
        description: "Can only view content",
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
      subscriberRole,
      publicRole,
    ] = createdRolesIds;

    console.log("Roles created:", {
      adminRole,
      editorRole,
      authorRole,
      contributorRole,
      subscriberRole,
      publicRole,
    });

    // 2. Create blog-specific permissions
    console.log("Creating permissions...");
    const blogPermissions = [
      {
        name: "dashboard:access",
        description: "Can access the dashboard",
      },
      {
        name: "dashboard:view",
        description: "Can view dashboard contents",
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
        name: "users:read",
        description: "Can view users",
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
      "posts:create",
      "posts:edit",
      "posts:delete",
      "posts:publish",
      "posts:read",
      "comments:create",
      "comments:moderate",
      "auth:login",
      "dashboard:access",
      "dashboard:view",
      "media:upload",
      "media:read",
      "media:delete",
    ]);

    // Author permissions
    await assignPermissionsToRole(authorRole, [
      "posts:create",
      "posts:edit",
      "posts:read",
      "comments:create",
      "auth:login",
      "dashboard:access",
      "dashboard:view",
      "media:upload",
      "media:read",
    ]);

    // Contributor permissions
    await assignPermissionsToRole(contributorRole, [
      "posts:create",
      "posts:read",
      "comments:create",
      "auth:login",
      "dashboard:access",
      "dashboard:view",
      "media:read",
    ]);

    // Subscriber permissions
    await assignPermissionsToRole(subscriberRole, [
      "posts:read",
      "comments:create",
      "auth:login",
    ]);
    // Public permissions
    await assignPermissionsToRole(publicRole, [
      "posts:read",
      "auth:register",
      "auth:login",
    ]);
    // 4. Create default admin user
    console.log("Creating admin user...");
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";

    // Check if admin user already exists
    const [[existingAdmin]] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [adminEmail]
    );

    if (!existingAdmin) {
      const [result] = await db.query(
        "INSERT INTO Users (name, email, password, username,role_id, auth_type,title,bio) VALUES (?, ?, ?, ?, ?, ?,?,?)",
        [
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
          "INSERT INTO Posts (title,content,slug,author_id,status) VALUES(?,?,?,?,?)",
          [
            "Welcome to my blog",
            "This is your first post, edit or delete it",
            "welcome-to-my-blog",
            adminUser.auth_id,
            "published",
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
