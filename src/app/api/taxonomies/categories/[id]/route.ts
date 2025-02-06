import { db } from "@/src/db";
import { categories } from "@/src/db/schemas";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  const { id } = params;
  try {
    const category = await db.query.categories.findFirst({
      where: eq(categories.id, id),
    });

    return NextResponse.json({ data: category });
  } catch (error: any) {
    return NextResponse.json(
      { data: null, error: error?.message, message: "Something went wrong..." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  const { id } = params;
  const body = await req.json();

  try {
    const updatedCategory = await db
      .update(categories)
      .set(body)
      .where(eq(categories.id, id));

    return NextResponse.json({
      data: updatedCategory[0],
      message: "Category updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message, message: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  const { id } = params;

  try {
    await db.delete(categories).where(eq(categories.id, id));

    return NextResponse.json({
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message, message: "Failed to delete category" },
      { status: 500 }
    );
  }
}
