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
    return "This account already exists but was created with a different provider. Please sign in with the same provider as the account was created with.";
  }
  if (user.auth_type !== provider) {
    return "This account already exists but was created with a different provider. Please sign in with the same provider as the account was created with.";
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
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar as string,
          username: user.username as string,
          auth_type: user.auth_type,
          role_id: user.role_id,
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
          return authTypeCheck;
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
        return "Account not found. Please sign up.";
      }

      return true;
    },
    async jwt({ token, user, account, trigger }) {
      if (user) {
        token.id = (user as CustomUser).id;
        token.role_id = (user as CustomUser).role_id;
        token.auth_type = (user as CustomUser).auth_type;
        token.username = (user as CustomUser).username;
        token.avatar = (user as CustomUser).avatar;
      }
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
          id: token.id,
          role_id: token.role_id,
          auth_type: token.auth_type,
          username: token.username,
          avatar: token.avatar,
        },
      };
    },
  },
};

const getSession = () => getServerSession(authOptions);

export { authOptions, getSession };
