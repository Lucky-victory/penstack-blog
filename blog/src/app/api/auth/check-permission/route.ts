import { getUserPermissions } from "@/src/lib/auth/permissions";
import { checkPermission } from "@/src/middlewares/checkPermission";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { permission } = await req.json();

  return await checkPermission(permission, async () => {
    return NextResponse.json({
      message: "Permissions checked",
      data: { hasPermission: true },
    });
  });
}
