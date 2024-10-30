import { defineConfig } from "drizzle-kit";
import { connectionUri } from "./src/db";
export default defineConfig({
  schema: ["./src/db/schemas/*.sql.ts"],
  dialect: "mysql",
  dbCredentials: {
    url: connectionUri,
  },
});
