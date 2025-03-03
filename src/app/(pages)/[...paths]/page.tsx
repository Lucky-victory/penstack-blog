import { notFound } from "next/navigation";

import BlogPage from "@/src/app/components/blog";
import { matchPermalink } from "@/src/utils/permalink";
import { getPostBySlug } from "@/src/lib/queries/post";

interface PageProps {
  params: {
    paths?: string[];
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const path = params.paths?.join("/") || "";
  console.log({ path });

  // Skip processing if this is a known Next.js file route
  // This is a safety check but should rarely be needed since
  // Next.js will prioritize file-based routes over dynamic routes

  // Check for date-based patterns (e.g., /2024/03/my-post)
  if (path.match(/^\d{4}\/\d{2}(\/\d{2})?\/[\w-]+$/)) {
    // Try different date-based permalink patterns
    for (const formatType of ["day_and_name", "month_and_name"] as const) {
      const match = matchPermalink(path, formatType);
      if (match?.postname) {
        const post = await getPostBySlug(match.postname);
        if (post) {
          return <BlogPage post={post} />;
        }
      }
    }
  }

  // Check for blog-prefixed patterns (e.g., /blog/my-post)
  if (path.startsWith("blog/")) {
    const slug = path.replace("blog/", "");
    const post = await getPostBySlug(slug);
    if (post) {
      return <BlogPage post={post} />;
    }
  }

  // If no blog post is found, you have two options:
  // 1. Return 404 (this is what we're doing here)
  // 2. Fall back to a file-based page if one exists at this path
  //    (though Next.js should handle this automatically)
  return notFound();
}
