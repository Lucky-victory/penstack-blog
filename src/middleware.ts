import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      if (!token) return false;
      return token.permissions.includes("dashboard:access");
    },
  },

  pages: {
    signIn: "/auth/signin",
  },
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
