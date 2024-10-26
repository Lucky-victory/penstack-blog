import { db } from "@/src/db";
import { posts } from "@/src/db/schemas";
import { PostInsert, PostSelect } from "@/src/types";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const params = Object.fromEntries(searchParams) as unknown as {
    status: NonNullable<PostSelect["status"]> | "all";
    limit: number;
    page: number;
  };

  try {
    const { status = "published", limit = 10, page = 1 } = params;
    const offset = limit * (page - 1);
    const _posts = await db.query.posts.findMany({
      where: status === "all" ? undefined : eq(posts.status, status),
      offset: offset,
      limit: limit,
      orderBy: [desc(posts.created_at)],
      with: {
        category: {
          columns: {
            name: true,
            slug: true,
            id: true,
          },
        },
        author: {
          columns: {
            name: true,
            avatar: true,
            username: true,
          },
        },
      },
    });

    const sampleposts = [
      {
        id: 1,
        title: "Introduction to TypeScript",
        slug: "introduction-to-typescript",
        summary:
          "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript",
        content:
          "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript with a type system. It is a superset of JavaScript, which means that all JavaScript code is also valid TypeScript code. TypeScript adds optional static typing to JavaScript, which helps catch errors at compile time and improves code readability and maintainability.",
        author: {
          name: "Alice Johnson",
          avatar: "https://example.com/avatars/alice.jpg",
          username: "alicej",
        },
        category: {
          name: "Programming",
          slug: "programming",
          id: 1,
        },
        published_at: "2023-06-01",
        created_at: "2023-06-01",
        updated_at: "2023-06-01",
        featured_image: {
          src: "https://picsum.photos/800/400?random=3",
          alt_text: "",
        },
      },
      {
        id: 2,
        title: "React Hooks Explained",
        slug: "react-hooks-explained",
        summary:
          "React Hooks are functions that let you use state and other React features without writing a class",
        content:
          "React Hooks are functions that let you use state and other React features without writing a class component. They let you use state and other React features without writing a class.",
        author: {
          name: "Bob Smith",
          avatar: "https://example.com/avatars/bob.jpg",
          username: "bobsmith",
        },
        category: {
          name: "Web Development",
          slug: "web-development",
          id: 2,
        },
        published_at: "2023-06-05",
        created_at: "2023-06-05",
        updated_at: "2023-06-05",
        featured_image: {
          src: "https://picsum.photos/800/400?random=3",
          alt_text: "",
        },
      },
      {
        id: 3,
        title: "Getting Started with Next.js",
        slug: "getting-started-with-nextjs",
        summary:
          "Next.js is a React framework that enables functionality such as server-side rendering and generating static websites",
        content:
          " Next.js is a React framework that enables functionality such as server-side rendering and generating static websites for improved performance and SEO.",
        author: {
          name: "Charlie Brown",
          avatar: "https://example.com/avatars/charlie.jpg",
          username: "charliebrown",
        },
        category: {
          name: "Web Development",
          slug: "web-development",
          id: 2,
        },
        published_at: "2023-06-10",
        created_at: "2023-06-10",
        updated_at: "2023-06-10",
        featured_image: {
          src: "https://picsum.photos/800/400?random=3",
          alt_text: "",
        },
      },
    ];

    return NextResponse.json({ posts: _posts, p: sampleposts });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message });
  }
}
export async function POST(req: NextRequest) {
  const {
    title,
    content,
    summary,
    slug,
    featured_image,
    status,
    author_id,
    visibility,
    category_id,
    post_id,
  } = await req.json();

  const post = await db.transaction(async (tx) => {
    const [insertResponse] = await tx.insert(posts).values({
      title,
      content,
      summary,
      slug,
      featured_image,
      author_id,
      status,
      visibility,
      category_id,
    });
    return await tx.query.posts.findFirst({
      where: eq(posts.id, insertResponse.insertId),
    });
  });

  return NextResponse.json(post);
}
