import mysql from "mysql2/promise";

export async function seedRolesAndPermissions() {
  const { DB_PORT, DB_USER_NAME, DB_USER_PASS, DB_HOST, DB_NAME } = process.env;
  const dbConfig = {
    port: +DB_PORT,
    user: DB_USER_NAME,
    password: DB_USER_PASS,
    host: DB_HOST,
    database: DB_NAME,
    ssl: { rejectUnauthorized: true },
  };

  const connection = await mysql.createConnection(dbConfig);

  try {
    const initialRoles = [
      { name: "Admin", description: "Full access to all features" },
      { name: "Editor", description: "Can edit and publish content" },
      { name: "Author", description: "Can create and edit own content" },
      {
        name: "Contributor",
        description: "Can create content but not publish",
      },
      { name: "Subscriber", description: "Can only view content" },
    ];

    const initialPermissions = [
      { name: "create_post", description: "Can create new posts" },
      { name: "edit_post", description: "Can edit existing posts" },
      { name: "delete_post", description: "Can delete posts" },
      { name: "publish_post", description: "Can publish posts" },
      { name: "manage_users", description: "Can manage user accounts" },
      { name: "manage_roles", description: "Can manage roles and permissions" },
    ];

    // Insert roles
    const insertRoleQuery =
      "INSERT INTO Roles (name, description) VALUES (?, ?)";
    for (const role of initialRoles) {
      await connection.execute(insertRoleQuery, [role.name, role.description]);
    }
    console.log("Roles inserted successfully.");

    // Insert permissions
    const insertPermissionQuery =
      "INSERT INTO Permissions (name, description) VALUES (?, ?)";
    for (const permission of initialPermissions) {
      await connection.execute(insertPermissionQuery, [
        permission.name,
        permission.description,
      ]);
    }
    console.log("Permissions inserted successfully.");

    // Get Admin role ID
    const [adminRows] = await connection.execute(
      "SELECT id FROM Roles WHERE name = ?",
      ["Admin"]
    );
    const adminRoleId = adminRows[0].id;

    // Get all permission IDs
    const [permissionRows] = await connection.execute(
      "SELECT id FROM Permissions"
    );

    // Insert role permissions for Admin
    const insertRolePermissionQuery =
      "INSERT INTO RolePermissions (role_id, permission_id) VALUES (?, ?)";
    for (const permissionRow of permissionRows) {
      await connection.execute(insertRolePermissionQuery, [
        adminRoleId,
        permissionRow.id,
      ]);
    }
    console.log("Admin role permissions assigned successfully.");
  } catch (error) {
    console.error("Error seeding roles and permissions:", error);
  } finally {
    await connection.end();
  }
}
seedRolesAndPermissions();
