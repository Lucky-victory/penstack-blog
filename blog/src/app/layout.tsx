import type { Metadata } from "next";
import "./globals.css";
import "./tiptap.css";
import "./calendar.css";

export const metadata: Metadata = {
  title: "Tech Blog",
  description: "Tech Blog is a blog for developers and tech enthusiasts.",
  other: {
    viewport: "viewport-fit=cover, width=device-width, initial-scale=1.0",
  },
};

import { fonts } from "../lib/fonts";
import { Providers } from "../providers/chakra";
import ReactQueryClient from "../providers/react-query";
import AuthProvider from "../providers/auth";
import { getSession } from "../lib/auth/next-auth";
import { SiteConfigProvider } from "../context/SiteConfig";
import { getSettings } from "../lib/settings";
import { DEFAULT_SETTINGS } from "../types";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const initialConfig = await getSettings();
  return (
    <html
      lang="en"
      className={`${fonts.rubik.variable} ${fonts.karla.variable}`}
    >
      <body>
        <SiteConfigProvider
          initialConfig={{ ...DEFAULT_SETTINGS, ...initialConfig }}
        >
          <AuthProvider session={session}>
            <ReactQueryClient>
              <Providers>{children}</Providers>
            </ReactQueryClient>
          </AuthProvider>
        </SiteConfigProvider>
      </body>
    </html>
  );
}
