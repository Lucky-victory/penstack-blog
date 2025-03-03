import { notFound } from "next/navigation";

import BlogPage from "@/src/app/components/blog";
import {
  defaultPermalinkPrefix,
  defaultPermalinkType,
  matchPermalink,
  permalinkFormats,
} from "@/src/utils/permalink";
import { getPostBySlug } from "@/src/lib/queries/post";

interface PageProps {
  params: {
    paths?: string[];
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const path = params.paths?.join("/") || "";
  console.log({ paths: params.paths });
  console.log({ path });

  // Skip processing if this is a known Next.js file route
  // This is a safety check but should rarely be needed since
  // Next.js will prioritize file-based routes over dynamic routes
  if (path.startsWith("api") || path.startsWith("_next")) {
    return null;
  }
  const firstSegment = params.paths?.[0] || "";

  // Check for known permalink patterns
  if (defaultPermalinkType in permalinkFormats) {
    let match;
    if (
      defaultPermalinkType === "with_prefix" &&
      (await isAllowedPrefix(firstSegment))
    ) {
      match = matchPermalink(path, defaultPermalinkType, firstSegment);
    } else {
      match = matchPermalink(path, defaultPermalinkType);
    }
    console.log({ match }, "with default");
    if (match?.postname) {
      const post = await getPostBySlug(match.postname);
      if (post) {
        return <BlogPage post={post} />;
      }
    }
  }

  // If no blog post is found, you have two options:
  // 1. Return 404 (this is what we're doing here)
  // 2. Fall back to a file-based page if one exists at this path
  //    (though Next.js should handle this automatically)
  return notFound();
}
async function isAllowedPrefix(path: string) {
  return path === defaultPermalinkPrefix;
}
