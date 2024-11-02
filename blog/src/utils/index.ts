import { formatDistanceToNowStrict, format } from "date-fns";
import { SnowflakeIdGenerator } from "@green-auth/snowflake-unique-id";
import { PostSelect } from "../types";
import { type NextRequest } from "next/server";

type DatePart = "year" | "month" | "day" | "hour" | "minute" | "second";

interface ConversionResult {
  dateFormat: string;
  postSlug: string;
}

const formatMap: Record<DatePart, string> = {
  year: "yyyy",
  month: "MM",
  day: "dd",
  hour: "HH",
  minute: "mm",
  second: "ss",
};

export function convertToDateFnsFormatAndSlug(input: string): ConversionResult {
  // Split the input by either '-' or '/'
  const parts = input.split(/[-/]/);
  const slug = parts.pop()?.replace(/%(\w+)%/g, "$1") || ""; // Extract the last part as slug

  const dateFormatParts = parts.join("-"); // Rejoin the remaining parts with '-'

  const dateFormat = dateFormatParts.replace(
    /%(\w+)%/g,
    (match, part: string) => {
      const datePart = part.toLowerCase() as DatePart;
      return formatMap[datePart] || match;
    }
  );

  // Preserve the original separators in the dateFormat
  const originalSeparators = input.match(/[-/]/g) || [];
  let formattedDate = dateFormat;
  originalSeparators.forEach((separator, index) => {
    formattedDate = formattedDate.replace("-", separator);
  });

  return {
    dateFormat: formattedDate,
    postSlug: slug,
  };
}

export const shortIdGenerator = new SnowflakeIdGenerator({
  nodeId: 10,
  sequenceBits: 20,
});

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    const context = this;
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
};

export function formatDate(date: Date): string {
  if (!date) return "Invalid date";
  try {
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) {
      return formatDistanceToNowStrict(date, {
        addSuffix: true,
        unit: "second",
      });
    } else if (diff < 3600000) {
      return formatDistanceToNowStrict(date, {
        addSuffix: true,
        unit: "minute",
      });
    } else if (diff < 86400000) {
      return formatDistanceToNowStrict(date, { addSuffix: true, unit: "hour" });
    } else {
      return format(date, "MMM d, yyyy");
    }
  } catch (error) {
    return "Invalid date";
  }
}

export function shortenText(text: string, len = 50) {
  return text?.length > len ? text?.substring(0, len) + "..." : text;
}

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
    )}/${post.slug}`;
  }

  return `/${prefix}/${post.slug}`;
}
type QueryParamValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Array<string | number | boolean>;
type QueryParamObject = {
  [key: string]: QueryParamValue | QueryParamObject;
};

/**
 * Converts an object into a URL-encoded query string
 * @param params - Object to convert into query parameters
 * @param prefix - Optional prefix for nested objects
 * @returns URL-encoded query string
 *
 * @example
 * const params = {
 *   name: "John Doe",
 *   age: 30,
 *   filters: {
 *     active: true,
 *     roles: ["admin", "user"]
 *   }
 * };
 * objectToQueryParams(params);
 * // Returns: "name=John%20Doe&age=30&filters[active]=true&filters[roles][]=admin&filters[roles][]=user"
 */
export function objectToQueryParams(
  params: QueryParamObject,
  prefix: string = ""
): string {
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      const currentKey = prefix ? `${prefix}[${key}]` : key;

      if (Array.isArray(value)) {
        return value
          .map(
            (item) =>
              `${encodeURIComponent(currentKey)}[]=${encodeURIComponent(
                String(item)
              )}`
          )
          .join("&");
      }

      if (typeof value === "object") {
        return objectToQueryParams(value as QueryParamObject, currentKey);
      }

      return `${encodeURIComponent(currentKey)}=${encodeURIComponent(
        String(value)
      )}`;
    })
    .filter(Boolean)
    .join("&");
}

type InputObject = {
  [key: string]:
    | null
    | string
    | number
    | boolean
    | Date
    | InputObject
    | Array<any>;
};

/**
 * Recursively transforms null values to empty strings in an object
 * @param obj - Object to transform
 * @returns New object with null values replaced with empty strings
 *
 * @example
 * const input = {
 *   name: null,
 *   age: 30,
 *   details: {
 *     bio: null,
 *     hobbies: ['reading', null, 'gaming']
 *   }
 * };
 * nullToEmptyString(input);
 * // Returns: {
 * //   name: "",
 * //   age: 30,
 * //   details: {
 * //     bio: "",
 * //     hobbies: ['reading', "", 'gaming']
 * //   }
 * // }
 */
export function nullToEmptyString<T extends InputObject>(obj: T): T {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    let transformedValue: any;
    if (key === "featured_image") {
      return acc;
    }

    if (value === null) {
      transformedValue = "";
    } else if (Array.isArray(value)) {
      transformedValue = value.map((item) =>
        item === null
          ? ""
          : typeof item === "object" && item !== null
          ? nullToEmptyString(item as InputObject)
          : item
      );
    } else if (typeof value === "object" && value !== null) {
      transformedValue =
        value instanceof Date ? value : nullToEmptyString(value as InputObject);
    } else {
      transformedValue = value;
    }

    return {
      ...acc,
      [key]: transformedValue,
    };
  }, {} as NonNullable<T>);
}
export function getServerSearchParams<T extends object>(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const params = Object.fromEntries(searchParams);
  return params as T;
}

export function formatBytes(bytes: number) {
  if (!bytes || typeof bytes !== "number") return 0;
  return (bytes / 1024 / 1024).toFixed(2) + " MB";
}
