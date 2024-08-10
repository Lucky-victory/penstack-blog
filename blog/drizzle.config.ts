import { defineConfig } from 'drizzle-kit'
import { connectionUri } from './src/db'
export default defineConfig({
  schema: ['./src/db/schemas/posts.sql.ts','./src/db/schemas/users.sql.ts'],
  dialect: 'mysql',
  'dbCredentials':{
    url:connectionUri
  }
})