import { Metadata } from "next";
import FrontPage from "./components/pages/FrontPage";
import siteConfig from "../vida-config.json";

export const metadata: Metadata = {
  title: siteConfig.site_name,
  description: siteConfig.site_description,
  openGraph: {
    title: siteConfig.site_name,
    description: siteConfig.site_description,
    url: siteConfig.site_url,
    siteName: siteConfig.site_name,
    images: [
      {
        url: siteConfig.og_image || `/api/og?title=${siteConfig.site_name}`,
        width: 1200,
        height: 630,
      },
    ],
    locale: "en-US",
    type: "website",
  },
};
export default function Home() {
  return <FrontPage />;
}
