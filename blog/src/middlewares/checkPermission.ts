import { NextResponse } from "next/server";
import { getUserPermissions } from "@/src/lib/auth/permissions";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { TPermissions } from "../types";

import { db } from "@/src/db";
import { roles, rolePermissions, permissions } from "@/src/db/schemas";
import { eq } from "drizzle-orm";

// Get public permissions (cached to avoid repeated DB queries)
let publicPermissionsCache: string[] | null = null;
let publicPermissionsCacheTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function getPublicPermissions(): Promise<string[]> {
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

  // Update cache
  publicPermissionsCache = publicRole.permissions.map(
    (rp) => rp.permission.name
  );
  publicPermissionsCacheTime = now;

  return publicPermissionsCache;
}

export async function checkPermission(
  requiredPermission: TPermissions,
  handler: () => Promise<NextResponse>
) {
  // First check if this is a public permission
  const publicPermissions = await getPublicPermissions();
  if (publicPermissions.includes(requiredPermission)) {
    return handler();
  }

  // If not public, check user session
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userPermissions = await getUserPermissions(session.user.id);

  if (!userPermissions.includes(requiredPermission)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return handler();
}
