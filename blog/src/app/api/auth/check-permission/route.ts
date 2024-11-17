import { checkPermission } from "@/src/middlewares/check-permission";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { permission } = await req.json();
  if (!permission)
    return NextResponse.json(
      {
        message: "Permission name is required",
      },
      { status: 400 }
    );
  return await checkPermission(permission, async () => {
    return NextResponse.json({
      message: "Permissions checked",
      data: { hasPermission: true },
    });
  });
}
