import { Webhook } from "svix";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/src/db";
import {
  emailEvents,
  newsletterSubscribers,
  newsletters,
} from "@/src/db/schemas";
import { eq } from "drizzle-orm";
import { ResendWebhookEvent } from "@/src/types";

export async function POST(req: Request) {
  try {
    const signature = headers().get("resend-signature");
    if (!signature || !verifyWebhookSignature(signature)) {
      return new NextResponse("Invalid signature", { status: 401 });
    }

    const payload = (await req.json()) as ResendWebhookEvent;

    // Find associated newsletter and subscriber
    const [newsletter] = await db
      .select()
      .from(newsletters)
      .where(eq(newsletters.resend_email_id, payload.data.email_id))
      .limit(1);

    const [subscriber] = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, payload.data.to))
      .limit(1);

    const eventType = payload.type.split(".")[1] as
      | "sent"
      | "clicked"
      | "opened"
      | "complained"
      | "bounced";
    await db.insert(emailEvents).values({
      email_id: payload.data.email_id,
      newsletter_id: newsletter?.id,
      subscriber_id: subscriber?.id,
      event_type: eventType,
      event_data: payload.data,
    });

    // Handle specific events
    switch (payload.type) {
      case "email.bounced":
      case "email.complained":
        if (subscriber) {
          await db
            .update(newsletterSubscribers)
            .set({
              status: "unsubscribed",
              unsubscribed_at: new Date(),
            })
            .where(eq(newsletterSubscribers.id, subscriber.id));
        }
        break;
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

function verifyWebhookSignature(signature: string | null): boolean {
  if (!signature) return false;
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) throw new Error("RESEND_WEBHOOK_SECRET is not set");
  // These were all sent from the server
  const headers = {
    "svix-id": "msg_p5jXN8AQM9LWM0D4loKWxJek",
    "svix-timestamp": "1614265330",
    "svix-signature": "v1,g0hM9SsE+OTPJTGt/tmIKtSyZlE3uFJELVlNIOLJ1OE=",
  };
  const body = JSON.stringify({ test: 2432232314 });

  const wh = new Webhook(secret);
  // Throws on error, returns the verified content on success
  const payload = wh.verify(body, headers);
  return true;
}
