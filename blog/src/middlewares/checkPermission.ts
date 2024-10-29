import { NextResponse } from "next/server";
import { getUserPermissions } from "@/src/lib/auth/permissions";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { TPermissions } from "../types";

export async function checkPermission(
  requiredPermission: TPermissions,
  handler: () => Promise<NextResponse>
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userPermissions = await getUserPermissions(
    +(session.user.id as number)
  );
  console.log(userPermissions);

  if (!userPermissions.includes(requiredPermission)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return handler();
}
