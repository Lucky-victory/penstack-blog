import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkPermission } from "./src/middlewares/check-permission";
import { getSession } from "./src/lib/auth/next-auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = await getSession();
  const canAccess = await hasAccess();
  const isAuthenticated = !!session;
  if (!isAuthenticated && pathname !== "/auth/signin") {
    const loginUrl = new URL("/auth/signin", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
    if (!canAccess) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (isAuthenticated && pathname === "/auth/signin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

async function hasAccess(): Promise<boolean> {
  try {
    return (await checkPermission(
      "dashboard:access",
      () => {
        return Promise.resolve(true);
      },
      true
    )) as boolean;
  } catch (error) {
    return false;
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/signin"],
};
