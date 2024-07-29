import { InferInsertModel } from 'drizzle-orm'
import {posts} from '@/src/db/schemas/posts.sql'
export interface Post {
    id: number
    title: string
    content: string
    author: {
      name: string
      avatar: string
    }
    date: string
    image:string
  }
export type PostToPost =PostInsert & {
    categories:string[],
    tags:string[],
   
}
export type PostInsert=InferInsertModel<typeof posts>