import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/src/lib/auth/next-auth";
import { getUserPermissions } from "@/src/lib/auth/permissions";
import { getPublicPermissions } from "@/src/lib/auth/public-permissions"; // Separate file
export const revalidate = 3600 * 4;

export async function POST(req: NextRequest) {
  try {
    const { permission } = await req.json();

    // Check public permissions first (with existing caching logic)
    const publicPermissions = await getPublicPermissions();
    if (publicPermissions.includes(permission)) {
      return NextResponse.json({
        data: {
          hasPermission: true,
          permissions: publicPermissions,
        },
      });
    }

    const session = await getSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get and cache user permissions
    const userPermissions = await getUserPermissions(session.user.email);

    return NextResponse.json({
      data: {
        hasPermission: userPermissions.includes(permission),
        permissions: userPermissions,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
