import "server-only";

import { Resend } from "resend";
import { getSettings } from "../queries/settings";
import isEmpty from "just-is-empty";
import { ReactNode } from "react";

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
  const siteSettings = await getSettings();
  const resendApiKey = siteSettings?.resendApiKey?.value;
  const resend = new Resend(resendApiKey);
  let defaultFrom = "";

  if (isEmpty(from)) {
    defaultFrom = `${siteSettings?.emailFromName.value || siteSettings?.siteName?.value} <${siteSettings?.emailFrom.value}>`;
  }
  return await resend.emails.send({
    from: from || defaultFrom,
    to,
    subject,
    react,
  });
};
