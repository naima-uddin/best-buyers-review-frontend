import { Footer } from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import HomePage from "@/page-components/HomePage/HomePage";
import ScrollToTopButton from "@/ui/ScrollToTopButton";
import OrganizationSchema from "@/components/seo/OrganizationSchema";
import WebsiteSchema from "@/components/seo/WebsiteSchema";

export const metadata = {
  title: "Best Buyers View | Discover, Compare & Pick the Best Products",
  description:
    "Find the best product reviews, comparisons, and buying guides at Best Buyers View. Expert recommendations for tech, home, baby, beauty, fitness, and more. Make informed purchase decisions with our comprehensive product analysis.",
  keywords: [
    "Best Buyers View",
    "product reviews",
    "product comparisons",
    "buying guides",
    "best products",
    "consumer reviews",
    "tech reviews",
    "home products",
    "baby products",
    "beauty products",
    "fitness equipment",
    "product recommendations",
    "purchase decisions",
    "Amazon products",
    "best deals",
  ],
  alternates: {
    canonical: "https://www.bestbuyersview.com",
  },
  openGraph: {
    title: "Best Buyers View | Discover, Compare & Pick the Best Products",
    description:
      "Your trusted source for product reviews, comparisons, and buying guides across multiple categories.",
    url: "https://www.bestbuyersview.com",
    siteName: "Best Buyers View",
    images: [
      {
        url: "https://www.bestbuyersview.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Best Buyers View - Product Reviews & Comparisons",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Buyers View | Discover, Compare & Pick the Best Products",
    description:
      "Your trusted source for product reviews, comparisons, and buying guides across multiple categories.",
    images: ["https://www.bestbuyersview.com/og-image.jpg"],
    site: "@bestbuyersview",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function Home() {
  return (
    <>
      <Navbar />
      <HomePage />
      <Footer />
      <ScrollToTopButton />

      {/* JSON-LD Structured Data */}
      <OrganizationSchema />
      <WebsiteSchema />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Best Buyers View",
            url: "https://www.bestbuyersview.com",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate:
                  "https://www.bestbuyersview.com/search?q={search_term_string}",
              },
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
    </>
  );
}
