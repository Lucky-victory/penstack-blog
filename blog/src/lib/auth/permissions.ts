import { db } from "@/src/db";
import { roles, rolePermissions, permissions, users } from "@/src/db/schemas";
import { eq } from "drizzle-orm";

// In-memory cache for user permissions
const userPermissionsCache = new Map<
  string,
  {
    permissions: string[];
    timestamp: number;
  }
>();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getUserPermissions(email: string): Promise<string[]> {
  const now = Date.now();

  // Check cache first
  const cachedPermissions = userPermissionsCache.get(email);
  if (cachedPermissions && now - cachedPermissions.timestamp < CACHE_DURATION) {
    return cachedPermissions.permissions;
  }

  // Fetch user permissions
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
    with: {
      role: {
        with: {
          permissions: {
            with: {
              permission: true,
            },
          },
        },
      },
    },
  });

  if (!user?.role) return [];

  const userPermissions = Array.from(
    new Set(user.role.permissions.map((rp) => rp.permission.name))
  );

  // Cache the permissions
  userPermissionsCache.set(email, {
    permissions: userPermissions,
    timestamp: now,
  });

  return userPermissions;
}
