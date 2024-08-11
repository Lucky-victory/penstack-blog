import { Post } from "@/src/types"
import { NextApiRequest } from "next"

export async function GET(req: NextApiRequest) {
    const { title, content } = {
      title:'me',content:'content'
    }
   
    return new Response(JSON.stringify({}), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  
  }