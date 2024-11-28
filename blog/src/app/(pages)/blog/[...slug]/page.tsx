import PostPage from "@/src/app/components/pages/PostPage";

import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getPost } from "@/src/lib/queries/post";

async function getData(slug: string, fromMetadata: boolean = false) {
  try {
    return await getPost(slug);
  } catch (error) {
    console.log(error);

    return null;
  }
}

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const postSlug = slug[slug.length - 1];

  const post = await getData(postSlug, true);
  if (!post) return notFound();

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: post?.title,
    description: post?.summary,

    openGraph: {
      images: [
        post?.featured_image?.url || "https://picsum.photos/1200/630",
        ...previousImages,
      ],
    },
  };
}

export default async function Page({ params, searchParams }: Props) {
  const slug = params.slug;
  const postSlug = slug[slug.length - 1];
  const post = await getData(postSlug);
  if (!post) return notFound();

  return <PostPage post={post as any} />;
}
