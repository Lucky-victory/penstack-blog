import { db } from "@/src/db";
import { roles } from "@/src/db/schemas";
import { TPermissions } from "@/src/types";
import { eq } from "drizzle-orm";

// Get public permissions (cached to avoid repeated DB queries)
let publicPermissionsCache: TPermissions[] | null = null;
let publicPermissionsCacheTime: number = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export async function getPublicPermissions(): Promise<TPermissions[]> {
  // Return cached permissions if they exist and aren't expired
  const now = Date.now();
  if (
    publicPermissionsCache &&
    now - publicPermissionsCacheTime < CACHE_DURATION
  ) {
    return publicPermissionsCache;
  }

  // Find public role
  const publicRole = await db.query.roles.findFirst({
    where: eq(roles.name, "public"),
    with: {
      permissions: {
        with: {
          permission: true,
        },
      },
    },
  });

  if (!publicRole?.permissions) return [];

  publicPermissionsCache = publicRole.permissions.map(
    (rp) => rp.permission.name
  );
  publicPermissionsCacheTime = now;

  return publicPermissionsCache;
}
