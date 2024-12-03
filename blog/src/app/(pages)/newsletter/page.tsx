import { Metadata } from "next";
import { NewsletterPage } from "../../components/pages/NewsletterPage";
import PageWrapper from "../../components/PageWrapper";

export const metadata: Metadata = {
  title: "Newsletter",
  description: "Join 10,000+ developers and level up your dev game",
  openGraph: {
    title: "Newsletter",
    description: "Join 10,000+ developers and level up your dev game",
    url: "/newsletter",
    siteName: "Vida Blog Starter",
    images: [
      {
        url: "/api/og?title=Join 10,000+ developers and level up your dev game",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en-US",
    type: "website",
  },
};
export default function Newsletter() {
  return (
    <PageWrapper>
      <NewsletterPage />
    </PageWrapper>
  );
}
