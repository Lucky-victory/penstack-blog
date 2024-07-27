import { int, mysqlEnum, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users=mysqlTable('Users',{
    id:int('id').autoincrement().primaryKey(),
    name:varchar('name',{'length':120}).notNull(),
    email:varchar('email',{'length':255}).notNull(),
    password:varchar('password',{'length':255}),
    bio:varchar('bio',{'length':255}),
    username:varchar('username',{'length':255}),
    avatar:varchar('avatar',{'length':255}),
    role:mysqlEnum('role',['admin','editor','user']).default('user'),
    created_at:timestamp('created_at').defaultNow(),
    updated_at:timestamp('updated_at').onUpdateNow(),
    
})