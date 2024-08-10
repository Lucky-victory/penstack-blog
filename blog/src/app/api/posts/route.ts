import {db }from '@/src/db';
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try { 
const _posts=await db.query.posts.findMany({
  with:{category:{
    columns:{
      name:true,
      slug:true,
      id:true,
    }
  },
   'author':{'columns':{
    name:true,
    avatar:true,
    'username':true,
    
   }},
  },
})


  const posts= [
    {
      id: 1,
      title: "Introduction to TypeScript",
      summary:'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript',
      content: "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript with a type system. It is a superset of JavaScript, which means that all JavaScript code is also valid TypeScript code. TypeScript adds optional static typing to JavaScript, which helps catch errors at compile time and improves code readability and maintainability.",
      author: {
        name: "Alice Johnson",
        avatar: "https://example.com/avatars/alice.jpg",
        username: "alicej"
      },
      category: {
        name: "Programming",
        slug: "programming",
        id: 1
      },
      published_at: "2023-06-01",
      created_at: "2023-06-01",
      updated_at: "2023-06-01",
       featured_image:{src:"https://picsum.photos/800/400?random=3",alt_text:''}
    },
    {
      id: 2,
      title: "React Hooks Explained",
      summary:'React Hooks are functions that let you use state and other React features without writing a class',
      content: "React Hooks are functions that let you use state and other React features without writing a class component. They let you use state and other React features without writing a class.",
      author: {
        name: "Bob Smith",
        avatar: "https://example.com/avatars/bob.jpg",
        username: "bobsmith"
      },
      category: {
        name: "Web Development",
        slug: "web-development",
        id: 2
      },
      published_at: "2023-06-05",
        created_at: "2023-06-05",
        updated_at: "2023-06-05",
      featured_image:{src:"https://picsum.photos/800/400?random=3",alt_text:''}
    },
    {
      id: 3,
      title: "Getting Started with Next.js",
      summary:'Next.js is a React framework that enables functionality such as server-side rendering and generating static websites',
      content: " Next.js is a React framework that enables functionality such as server-side rendering and generating static websites for improved performance and SEO.", 
      author: {
        name: "Charlie Brown",
        avatar: "https://example.com/avatars/charlie.jpg",
        username: "charliebrown"
      },
      category: {
        name: "Web Development",
        slug: "web-development",
        id: 2
      },
      published_at: "2023-06-10",
      created_at: "2023-06-10",
      updated_at: "2023-06-10",
      featured_image:{src:"https://picsum.photos/800/400?random=3",alt_text:''}
    }
  ]

  return new Response(JSON.stringify({posts,p:_posts}), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}catch(error){

  }

}
export async function POST(req: Request) {
  const { title, content,summary,slug ,featured_image} = await req.json()

  return new Response(JSON.stringify({ title, content,summary ,slug,featured_image,updated_at: new Date()}), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}