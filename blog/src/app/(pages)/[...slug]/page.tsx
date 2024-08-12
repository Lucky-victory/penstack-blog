import PostPage from '@/src/app/components/pages/PostPage';

import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation';
import {db} from '@/src/db'
import { posts } from '@/src/db/schemas';
import { eq } from 'drizzle-orm';
async function getData(slug: string,fromMetadata:boolean=false) {
  
  try {
    
  
  const post=await db.query.posts.findFirst({
    where: (posts, { eq }) => eq(posts.slug, slug),
    with: {
      author: {
        columns: {
          username: true,
          name: true,
          avatar: true,
        },
      },
      category: {
        columns: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  })
  
  if(!fromMetadata){
    await db.update(posts).set({views:(post?.views!)+1}).where(eq(posts.slug,slug))
  }
  
  return post || notFound()
 } catch (error) {
    return null
  }
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


  const post = await getData(postSlug,true)

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
   <PostPage post={post as any}/>
  )
}