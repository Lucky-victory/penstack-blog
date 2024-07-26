import { defineConfig } from 'drizzle-kit'
import { connectionUri } from './db'
export default defineConfig({
  schema: ['./db/schemas/posts.sql.ts','./db/schemas/users.sql.ts'],
  dialect: 'mysql',
  'dbCredentials':{
    url:connectionUri
  }
})