import { type AuthOptions, getServerSession } from "next-auth";
import { eq, or } from "drizzle-orm";
import NextAuth, { type User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { db } from "@/src/db";
import { users } from "@/src/db/schemas";
import { randomUUID } from "crypto";

interface CustomUser extends User {
  id: number;
  role_id: number;
  auth_type: "local" | "google" | "github";
  username: string;
  avatar: string;
}
function checkUserAuthType(
  user: CustomUser,
  provider: "google" | "github" | "credentials"
) {
  if (user.auth_type === "local" && provider !== "credentials") {
    return "This account was created with a different provider. Please sign in with the same provider.";
  }
  if (provider !== "credentials" && user.auth_type !== provider) {
    return "This account was created with a different provider. Please sign in with the same provider.";
  }
  return false;
}
const authOptions: AuthOptions = {
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
          image: profile.picture,
        } as CustomUser;
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
          image: profile?.avatar_url,
        } as CustomUser;
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
          throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return {
          name: user.name,
          email: user.email,

          image: (user.avatar as string) || "https://picsum.photos/200",
        } as CustomUser;
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, user.email),
      });
      if (existingUser) {
        const authTypeCheck = checkUserAuthType(
          user as CustomUser,
          account?.provider as "google" | "github" | "credentials"
        );
        if (authTypeCheck) {
          throw new Error(authTypeCheck);
        }
        return true;
      }
      if (!existingUser && account?.provider !== "credentials") {
        // Create user for OAuth providers if they don't exist
        await db.insert(users).values({
          email: user.email,
          name: user.name,
          username: (user as CustomUser).username,
          avatar: (user as CustomUser).avatar,
          auth_type: (user as CustomUser).auth_type,
          role_id: (user as CustomUser).role_id,
        });
        return true;
      }

      if (!existingUser) {
        throw new Error("Account not found. Please sign up.");
      }

      return true;
    },
    async jwt({ token, user, account, trigger }) {
      return token;
    },
    async session({ session, token }) {
      console.log("Session token:", token);
      console.log("Session user:", session.user);
      console.log("Session:", session);

      return {
        ...session,
        user: {
          ...session.user,
        },
      };
    },
  },
};

const getSession = () => getServerSession(authOptions);

export { authOptions, getSession };
