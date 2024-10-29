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

    const [adminRole, editorRole, authorRole, contributorRole, subscriberRole] =
      createdRolesIds;

    console.log("Roles created:", {
      adminRole,
      editorRole,
      authorRole,
      contributorRole,
      subscriberRole,
    });

    // 2. Create blog-specific permissions
    console.log("Creating permissions...");
    const blogPermissions = [
      { name: "posts:create", description: "Can create new posts" },
      { name: "posts:edit", description: "Can edit existing posts" },
      { name: "posts:delete", description: "Can delete posts" },
      { name: "posts:publish", description: "Can publish posts" },
      { name: "posts:read", description: "Can read posts" },
      { name: "users:read", description: "Can view users" },
      { name: "users:write", description: "Can create/edit users" },
      { name: "users:delete", description: "Can delete users" },
      { name: "roles:read", description: "Can view roles" },
      { name: "roles:write", description: "Can create/edit roles" },
      { name: "roles:delete", description: "Can delete roles" },
      { name: "comments:create", description: "Can create comments" },
      { name: "comments:moderate", description: "Can moderate comments" },
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

    console.log("Permissions created");

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
    ]);

    // Author permissions
    await assignPermissionsToRole(authorRole, [
      "posts:create",
      "posts:edit",
      "posts:read",
      "comments:create",
    ]);

    // Contributor permissions
    await assignPermissionsToRole(contributorRole, [
      "posts:create",
      "posts:read",
      "comments:create",
    ]);

    // Subscriber permissions
    await assignPermissionsToRole(subscriberRole, [
      "posts:read",
      "comments:create",
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
        "INSERT INTO Users (name, email, password, username, role_id, auth_type) VALUES (?, ?, ?, ?, ?, ?)",
        ["Admin", adminEmail, hashedPassword, "admin", adminRole, "local"]
      );
      const [[adminUser]] = await db.query("SELECT * FROM users WHERE id = ?", [
        result.insertId,
      ]);
      console.log("Admin user created:", adminUser);
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
