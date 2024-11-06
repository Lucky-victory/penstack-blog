import type { Metadata } from "next";
import "./globals.css";
import "./tiptap.css";

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
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fonts.rubik.variable}>
      <body>
        <AuthProvider>
          <ReactQueryClient>
            <Providers>{children}</Providers>
          </ReactQueryClient>
        </AuthProvider>
      </body>
    </html>
  );
}
