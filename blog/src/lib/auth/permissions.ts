import { db } from "@/src/db";
import { users } from "@/src/db/schemas";
import { eq } from "drizzle-orm";

export async function getUserPermissions(userEmail: string) {
  const result = await db.query.users.findFirst({
    where: eq(users.email, userEmail),
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

  if (!result?.role?.permissions) return [];

  return result.role.permissions.map((rp) => rp.permission.name);
}
