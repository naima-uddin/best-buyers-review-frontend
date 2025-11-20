import { Footer } from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import HomePage from "@/page-components/HomePage/HomePage";
import ScrollToTopButton from "@/ui/ScrollToTopButton";

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
    canonical: "https://bestbuyersview.com",
  },
  openGraph: {
    title: "Best Buyers View | Discover, Compare & Pick the Best Products",
    description:
      "Your trusted source for product reviews, comparisons, and buying guides. Expert recommendations across tech, home, baby, beauty, fitness, and more categories.",
    url: "https://bestbuyersview.com",
    siteName: "Best Buyers View",
    images: [
      {
        url: "https://bestbuyersview.com/og-image.jpg",
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
    images: ["https://bestbuyersview.com/og-image.jpg"],
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Best Buyers View",
            url: "https://bestbuyersview.com",
            logo: "https://bestbuyersview.com/logo.png",
            description:
              "Best Buyers View provides comprehensive product reviews, comparisons, and buying guides to help consumers make informed purchase decisions.",
            sameAs: [
              "https://twitter.com/bestbuyersview",
              "https://facebook.com/bestbuyersview",
            ],
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "Customer Service",
              url: "https://bestbuyersview.com/contact",
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Best Buyers View",
            url: "https://bestbuyersview.com",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate:
                  "https://bestbuyersview.com/search?q={search_term_string}",
              },
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
    </>
  );
}
