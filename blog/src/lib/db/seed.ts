import { db } from "@/src/db";
import { roles, permissions, rolePermissions, users } from "@/src/db/schemas";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function main() {
  try {
    console.log("🌱 Starting seed...");

    // 1. Create default roles
    console.log("Creating roles...");
    const [adminRole] = await db
      .insert(roles)
      .values({
        name: "admin",
        description: "Super admin with full access",
      })
      .onDuplicateKeyUpdate({ set: { name: "admin" } })
      .returning();

    const [userRole] = await db
      .insert(roles)
      .values({
        name: "user",
        description: "Regular user with limited access",
      })
      .onDuplicateKeyUpdate({ set: { name: "user" } })
      .returning();

    console.log("Roles created:", { adminRole, userRole });

    // 2. Create default permissions
    console.log("Creating permissions...");
    const defaultPermissions = [
      { name: "users:read", description: "Can view users" },
      { name: "users:write", description: "Can create/edit users" },
      { name: "users:delete", description: "Can delete users" },
      { name: "roles:read", description: "Can view roles" },
      { name: "roles:write", description: "Can create/edit roles" },
      { name: "roles:delete", description: "Can delete roles" },
      // Add more permissions as needed
    ];

    const createdPermissions = await Promise.all(
      defaultPermissions.map(async (perm) => {
        const [permission] = await db
          .insert(permissions)
          .values(perm)
          .onDuplicateKeyUpdate({ set: { name: perm.name } })
          .returning();
        return permission;
      })
    );

    console.log("Permissions created");

    // 3. Assign all permissions to admin role
    console.log("Assigning permissions to admin role...");
    await Promise.all(
      createdPermissions.map((perm) =>
        db
          .insert(rolePermissions)
          .values({
            role_id: adminRole.id,
            permission_id: perm.id,
          })
          .onDuplicateKeyUpdate({
            set: {
              role_id: adminRole.id,
              permission_id: perm.id,
            },
          })
      )
    );

    // 4. Assign basic permissions to user role
    const basicPermissions = createdPermissions.filter((p) =>
      p.name.endsWith(":read")
    );
    console.log("Assigning basic permissions to user role...");
    await Promise.all(
      basicPermissions.map((perm) =>
        db
          .insert(rolePermissions)
          .values({
            role_id: userRole.id,
            permission_id: perm.id,
          })
          .onDuplicateKeyUpdate({
            set: {
              role_id: userRole.id,
              permission_id: perm.id,
            },
          })
      )
    );

    // 5. Create default admin user
    console.log("Creating admin user...");
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";

    // Check if admin user already exists
    const existingAdmin = await db.query.users.findFirst({
      where: eq(users.email, adminEmail),
    });

    if (!existingAdmin) {
      const [adminUser] = await db
        .insert(users)
        .values({
          name: "Admin User",
          email: adminEmail,
          password: hashedPassword,
          username: "admin",
          role_id: adminRole.id,
          auth_type: "local",
        })
        .returning();

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
