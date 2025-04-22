import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import { username } from "better-auth/plugins";
import { IdGenerator } from "../utils";

import * as schema from "@/src/db/schemas";
export const auth = betterAuth({
  appName: "Code With Vick",
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: { ...user, username: user.email.split("@")[0] },
          };
        },
      },
    },
  },
  //   user: {
  //     fields: {
  //       image: "avatar",
  //     },
  //     modelName: "Users",
  //     additionalFields: {
  //       bio: {
  //         type: "string",
  //         required: false,
  //         defaultValue: null,
  //         input: true,
  //         returned: true,
  //       },
  //       title: {
  //         type: "string",
  //         required: false,
  //         sortable: true,
  //         returned: true,
  //         defaultValue: null,
  //         input: true,
  //       },

  //       social_id: {
  //         type: "number",
  //         required: false,
  //         defaultValue: null,
  //         input: true,
  //       },
  //       meta_id: {
  //         type: "number",
  //         required: false,
  //         defaultValue: null,
  //         input: true,
  //       },
  //       account_status: {
  //         type: "string",
  //         required: false,
  //         defaultValue: "active",
  //         input: true,
  //       },
  //       auth_id: {
  //         type: "string",
  //         required: false,
  //         defaultValue: () => IdGenerator.uuid(),
  //         sortable: true,
  //         input: false,
  //         returned: true,
  //       },

  //       role_id: {
  //         type: "number",
  //         required: true,
  //         returned: true,
  //         defaultValue: null,
  //         input: true,
  //       },
  //     },
  //   },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      enabled: true,

      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      enabled: true,
      clientSecret: process.env.GITHUB_SECRET as string,
      clientId: process.env.GITHUB_ID as string,
    },
  },
  plugins: [username()],
  database: drizzleAdapter(db, {
    provider: "mysql",
    schema: {
      ...schema,
      user: schema.users,
    },
    usePlural: true,
  }),
});
