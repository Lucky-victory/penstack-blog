import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

export const newsletters=mysqlTable('NewsLetters',{
    id:int('id').autoincrement().primaryKey(),
    email:varchar('email',{length:255}).notNull(),
    name:varchar('name',{length:255}),
    referrer:varchar('referrer',{length:255}),
    created_at:timestamp('created_at').defaultNow(),
    updated_at:timestamp('updated_at').onUpdateNow(),
})
