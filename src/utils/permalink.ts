import { format } from "date-fns";
import { convertToDateFnsFormatAndSlug } from ".";
import { PostSelect } from "../types";

// export const permalinkFormats = {
//   custom: "/%custom%/",
//   day_and_name: "/%year%/%month%/%day%/%postname%/",
//   postname: "/%postname%/",
//   month_and_name: "/%year%/%month%/%postname%/",
//   plain: "/%post_id%/",
//   category_and_name: "/%category%/%postname%/",
// } as const;

export type PermalinkType = keyof typeof permalinkFormats;

export function formatPostPermalink(
  post: PostSelect,
  prefix: string | "blog" = "blog",
  slugPattern?: string,
  includeSlugPattern = true
) {
  if (includeSlugPattern) {
    return `/${prefix}/${format(
      new Date(
        post?.published_at ? post?.published_at : (post?.updated_at as Date)
      ),
      convertToDateFnsFormatAndSlug(
        slugPattern || "%year%/%month%/%day%/%slug%"
      ).dateFormat
    )}/${post?.slug}`;
  }

  return `/${prefix}/${post?.slug}`;
}

// Modify the permalink matcher to handle both patterns
export function matchPermalink(
  url: string,
  type: PermalinkType
): Record<string, string> | null {
  const format = permalinkFormats[type];
  const formatParts = format.split("/").filter(Boolean);
  const urlParts = url.split("/").filter(Boolean);

  // Special handling for blog-prefixed URLs
  if (format.startsWith("blog/")) {
    formatParts.shift(); // Remove 'blog' from format parts
    if (urlParts[0] === "blog") {
      urlParts.shift(); // Remove 'blog' from URL parts
    }
  }

  if (formatParts.length !== urlParts.length) {
    return null;
  }

  const result: Record<string, string> = {};
  for (let i = 0; i < formatParts.length; i++) {
    const formatPart = formatParts[i];
    const urlPart = urlParts[i];

    if (formatPart.startsWith("%") && formatPart.endsWith("%")) {
      const key = formatPart.slice(1, -1);
      result[key] = urlPart;
    } else if (formatPart !== urlPart) {
      return null;
    }
  }

  return result;
}

// Updated permalink formats to support both patterns
export const permalinkFormats = {
  day_and_name: "/%year%/%month%/%day%/%postname%/",
  month_and_name: "/%year%/%month%/%postname%/",
  postname: "/blog/%postname%/",
  plain: "/%postname%/",
} as const;

// Helper function to generate URLs based on format
export function generatePostUrl(
  post: PostSelect,
  format: PermalinkType = "plain"
): string {
  const date = new Date((post?.published_at as Date) || post?.updated_at);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const template = permalinkFormats[format];
  return template
    .replace("%year%", String(year))
    .replace("%month%", month)
    .replace("%day%", day)
    .replace("%postname%", post?.slug || "");
}
