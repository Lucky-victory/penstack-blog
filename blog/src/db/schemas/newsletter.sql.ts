import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

export const newsletters=mysqlTable('NewsLetters',{
    id:int('id').autoincrement().primaryKey(),
    email:varchar('email',{length:255}).notNull(),
    created_at:timestamp('created_at').defaultNow(),
    updated_at:timestamp('updated_at').onUpdateNow(),
})
