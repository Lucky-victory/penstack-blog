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
