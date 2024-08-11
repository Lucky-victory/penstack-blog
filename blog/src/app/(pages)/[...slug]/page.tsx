import PostPage from '@/src/app/components/PostPage';
import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation';

// This function fetches data from an API or database
async function getData(slug: string) {
  
   const posts= [
    {
      id: 1,
      title: "Introduction to TypeScript",
      slug: "introduction-to-typescript",
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
      slug: "react-hooks-explained",
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
      slug: "getting-started-with-nextjs",
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
    return posts.find(post => post.slug === slug) || notFound()
    
 
 
}

type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
 
  const slug = params.slug
  const postSlug=slug[slug.length-1]
  console.log({slug,postSlug});

  const post = await getData(postSlug)

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []

  return {
    title: post?.title,
    description: post?.summary,
    openGraph: {
      images: [
        post?.featured_image?.src ||
        'https://picsum.photos/1200/630',
        ...previousImages
      ],
    },
  }
}

export default async function Page({ params, searchParams }: Props) {
   const slug = params.slug
  const postSlug=slug[slug.length-1]
  const post = await getData(postSlug)

  return (
   <PostPage {...post} />
  )
}