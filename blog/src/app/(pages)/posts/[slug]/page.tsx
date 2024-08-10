import PostPage from '@/src/app/components/PostPage';
import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation';

// This function fetches data from an API or database
async function getData(slug: string) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${slug}`);
  const post = await res.json();
console.log({post});

  if (!post) {
    notFound()
  }
return post
 
}

type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const slug = params.slug

  // fetch data
  const post = await getData(slug)

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []

  return {
    title: post?.title,
    description: post?.summary,
    openGraph: {
      images: [
        post?.image ||
        'https://picsum.photos/1200/630',
        ...previousImages
      ],
    },
  }
}

export default async function Page({ params, searchParams }: Props) {
  const post = await getData(params.slug)

  return (
   <PostPage/>
  )
}