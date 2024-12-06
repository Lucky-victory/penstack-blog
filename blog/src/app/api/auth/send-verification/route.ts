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
import { getSettings } from "@/src/lib/settings";
import { DEFAULT_SETTINGS } from "@/src/types";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  const siteSettings = await getSettings();
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user)
    return NextResponse.json(
      {
        success: false,
        message: "User not found",
      },
      { status: 404 }
    );
  //   if (user?.email_verified)
  //     return NextResponse.json(
  //       {
  //         success: false,
  //         message: "Email already verified",
  //       },
  //       { status: 400 }
  //     );

  const token = crypto.randomBytes(32).toString("hex");
  const expires = addMinutes(new Date(), 15); // 15 minutes

  await db.insert(verificationTokens).values({
    user_id: user?.auth_id as string,
    token,
    expires,
  });
  const { origin } = new URL(req.url);
  const appUrl = `${origin}`;

  const verificationLink = `${appUrl}/verify-email?token=${token}`;

  await resend.emails.send({
    from: `${siteSettings?.siteName?.value || DEFAULT_SETTINGS?.siteName?.value} <mail@devvick.com>`,
    to: user?.email as string,
    subject: "Verify your email address",
    react: VerificationEmail({ verificationLink }),
  });

  return NextResponse.json({ success: true });
}
