import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role_id: number;
      auth_type: "local" | "google" | "github";
      username?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role_id: number;
    auth_type: "local" | "google" | "github";
    username?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role_id: number;
    auth_type: "local" | "google" | "github";
    username?: string;
  }
}
