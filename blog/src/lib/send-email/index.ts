"use server";

import { Resend } from "resend";
import { getSettings } from "../settings";
import isEmpty from "just-is-empty";
import { ReactNode } from "react";
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
  to,
  from,
  subject,
  html,
  react,
}: {
  from?: string;
  to: string;
  subject: string;
  html?: string;
  react: ReactNode;
}) => {
  let defaultFrom = "";

  if (isEmpty(from)) {
    const siteSettings = await getSettings();
    defaultFrom = `${siteSettings?.emailFromName.value || siteSettings?.siteName?.value} <${siteSettings?.emailFrom.value}>`;
  }
  return await resend.emails.send({
    from: from || defaultFrom,
    to,
    subject,
    react,
  });
};
