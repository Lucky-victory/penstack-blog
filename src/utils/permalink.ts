export const defaultPermalinkPrefix = "blog";

export const permalinkFormats = {
  day_and_name: "/%year%/%month%/%day%/%postname%/",
  plain: "/%postname%/",
  month_and_name: "/%year%/%month%/%postname%/",
  with_prefix: "/%prefix%/%postname%/",
  category_and_name: "/%category%/%postname%/",
} as const;
export const defaultPermalinkType: keyof typeof permalinkFormats =
  "category_and_name";
export type PermalinkType = keyof typeof permalinkFormats;

// Modify the permalink matcher to handle both patterns
export function matchPermalink(
  url: string,
  type: PermalinkType = defaultPermalinkType,
  prefix = ""
): Record<string, string> | null {
  const format = permalinkFormats[type];
  const formatParts = format.split("/").filter(Boolean);
  const urlParts = url.split("/").filter(Boolean);

  if (formatParts.length !== urlParts.length) {
    return null;
  }

  const result: Record<string, string> = {};
  for (let i = 0; i < formatParts.length; i++) {
    const formatPart = formatParts[i];
    const urlPart = urlParts[i];

    if (formatPart.startsWith("%") && formatPart.endsWith("%")) {
      const key = formatPart.slice(1, -1);
      if (key === "prefix") {
        result[key] = prefix;
      } else {
        result[key] = urlPart;
      }
    } else if (formatPart !== urlPart) {
      return null;
    }
  }

  return result;
}
