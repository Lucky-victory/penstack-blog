import { db } from "@/src/db";
import { posts } from "@/src/db/schemas";
import { or, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { title, content } = {
    title: "me",
    content: "content",
  };

  return new Response(JSON.stringify({}), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { slugOrPostId: string } }
) {
  try {
    const { slugOrPostId } = params;
    const body = await req.json();
    const oldPost = await db.query.posts.findFirst({
      where: or(eq(posts.slug, slugOrPostId), eq(posts.post_id, slugOrPostId)),
    });

    if (!oldPost)
      return NextResponse.json(
        {
          message: "Post not found",
        },
        { status: 404 }
      );

    await db
      .update(posts)
      .set(body)
      .where(or(eq(posts.slug, slugOrPostId), eq(posts.post_id, slugOrPostId)));
    return NextResponse.json(
      {
        message: "Post updated successfully",
        lastUpdate: new Date().getTime(),
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
