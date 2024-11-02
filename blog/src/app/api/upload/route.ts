import { NextResponse } from "next/server";
import { db } from "@/src/db"; // Your database connection
import { medias } from "@/src/db/schemas"; // Your schema
import { MediaType } from "@/src/types";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const result = await db.transaction(async (tx) => {
      const [response] = await tx
        .insert(medias)
        .values({
          name: data.original_filename,
          url: data.secure_url,
          type: determineFileType(data.format || data.resource_type),
          size: data.bytes,
          mime_type: data.format ? `image/${data.format}` : data.resource_type,
          width: data.width,
          height: data.height,
          folder: data.folder,
          caption: data.caption,
          alt_text: data.alt_text || "",
        })
        .$returningId();
      return await tx.query.medias.findFirst({
        where: eq(medias.id, response.id),
      });
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save media data" },
      { status: 500 }
    );
  }
}
function determineFileType(
  arg0: any
):
  | import("drizzle-orm").SQL<unknown>
  | "audio"
  | "image"
  | "video"
  | "pdf"
  | "doc"
  | import("drizzle-orm").Placeholder<string, any> {
  throw new Error("Function not implemented.");
}
