import { db } from "@/src/db";
import { roles, rolePermissions, permissions, users } from "@/src/db/schemas";
import { TPermissions } from "@/src/types";
import { eq } from "drizzle-orm";

// In-memory cache for user permissions
const userPermissionsCache = new Map<
  string,
  {
    permissions:TPermissions[];
    timestamp: number;
  }
>();

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export async function getUserPermissions(email: string): Promise<TPermissions[]> {
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
