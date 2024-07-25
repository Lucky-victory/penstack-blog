import { notFound } from 'next/navigation'

async function getPost(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${slug}`)
  if (!res.ok) {
    throw new Error('Failed to fetch post')
  }
  return res.json()
}

export default async function Post({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}
