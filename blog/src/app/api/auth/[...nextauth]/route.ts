import { eq, or } from "drizzle-orm";
import NextAuth, { User, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcryptjs";
import { db } from "@/src/db";
import { users } from "@/src/db/schemas";

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          avatar: profile.picture,
          username: profile.email.split("@")[0],
          auth_type: "google",
          role_id: 5,
        };
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      profile(profile) {
        return {
          id: profile.id?.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          avatar: profile.avatar_url,
          username: profile.login,
          auth_type: "github",
          role_id: 5,
        };
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        emailOrUsername: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.emailOrUsername || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await db.query.users.findFirst({
          where: or(
            eq(users.username, credentials.emailOrUsername),
            eq(users.email, credentials.emailOrUsername)
          ),
        });

        if (!user || !user.password) {
          throw new Error("User not found");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          username: user.username as string,
          auth_type: user.auth_type as User["auth_type"],
          role_id: user.role_id,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role_id = user.role_id;
        token.auth_type = user.auth_type;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role_id = token.role_id;
        session.user.auth_type = token.auth_type;
        session.user.username = token.username;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
