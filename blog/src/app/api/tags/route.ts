import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/db";
import { tags } from "@/src/db/schemas/posts.sql";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    const allTags = await db.select().from(tags);
    return NextResponse.json(
      { data: allTags, message: "All tags fetched successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { data: null, error: "Failed to retrieve tags" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, slug } = await request.json();

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    // const existingTag = await db.select().from(tags).where(eq(tags.slug, slug));
    // if (existingTag.length > 0) {
    //   return NextResponse.json(
    //     { error: "Tag with this slug already exists" },
    //     { status: 409 }
    //   );
    // }

    const newTag = await db
      .insert(tags)
      .values({ name, slug })
      .onDuplicateKeyUpdate({set:{name:sql`name`,slug:sql`slug`}});
    return NextResponse.json(
      { data: newTag, message: "Tag created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { data: null, error: "Failed to create Tag" },
      { status: 500 }
    );
  }
}
