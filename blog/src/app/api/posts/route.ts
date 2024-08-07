import { Post } from "@/src/types"

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { title, content } = {
    title:'me',content:'content'
  }
  const posts: Post[] = [
    {
      id: 1,
      title: "Introduction to TypeScript",
      content: "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript...",
      author: {
        name: "Alice Johnson",
        avatar: "https://example.com/avatars/alice.jpg"
      },
      date: "2023-06-01",
      image: "https://picsum.photos/800/400?random=1"
    },
    {
      id: 2,
      title: "React Hooks Explained",
      content: "React Hooks are functions that let you use state and other React features without writing a class...",
      author: {
        name: "Bob Smith",
        avatar: "https://example.com/avatars/bob.jpg"
      },
      date: "2023-06-05",
      image: "https://picsum.photos/800/400?random=2"
    },
    {
      id: 3,
      title: "Getting Started with Next.js",
      content: "Next.js is a React framework that enables functionality such as server-side rendering and generating static websites...",
      author: {
        name: "Charlie Brown",
        avatar: "https://example.com/avatars/charlie.jpg"
      },
      date: "2023-06-10",
      image: "https://picsum.photos/800/400?random=3"
    }
  ]

  return new Response(JSON.stringify(posts), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })

}
export async function POST(req: Request) {
  const { title, content,summary,slug ,featured_image} = await req.json()

  return new Response(JSON.stringify({ title, content,summary ,slug,featured_image,updated_at: new Date().getTime()}), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}