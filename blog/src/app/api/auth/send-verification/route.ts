import { Resend } from "resend";
import { db } from "@/src/db";
import { verificationTokens, users } from "@/src/db/schemas";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { VerificationEmail } from "@/src/app/components/Emails/Verification";
import { getSession } from "@/src/lib/auth/next-auth";
import { addMinutes } from "date-fns";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  const token = crypto.randomBytes(32).toString("hex");
  const expires = addMinutes(new Date(), 15); // 15 minutes

  await db.insert(verificationTokens).values({
    user_id: userId,
    token,
    expires,
  });
  const user = await db.query.users.findFirst({
    where: eq(users.auth_id, userId),
  });
  const { origin, protocol } = new URL(req.url);
  const appUrl = `${protocol}://${origin}`;

  const verificationLink = `${appUrl}/verify-email?token=${token}`;

  await resend.emails.send({
    from: "mail@devvick.com",
    to: user?.email as string,
    subject: "Verify your email address",
    react: VerificationEmail({ verificationLink }),
  });

  return NextResponse.json({ success: true });
}
