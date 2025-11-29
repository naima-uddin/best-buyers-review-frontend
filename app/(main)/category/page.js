import CategoryPage from "@/page-components/CategoryPage/CategoryPage";
import ScrollToTopButton from "@/ui/ScrollToTopButton";
import React from "react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bestbuyersview.com";

export const metadata = {
  title: "Product Categories | Best Buyers View",
  description:
    "Explore all product categories at Best Buyers View. Find expert reviews and comparisons for Baby, Beauty, Fashion, Fitness, Tech, Garden, Gifts, Home, Health, Money, Office, Outdoor, Pets, Sports, Tools, Food & more.",
  keywords: [
    "product categories",
    "baby products",
    "beauty products",
    "fashion",
    "fitness equipment",
    "tech gadgets",
    "home products",
    "outdoor gear",
    "pet supplies",
    "sports equipment",
    "product reviews by category",
  ],
  alternates: {
    canonical: `${SITE_URL}/category`,
  },
  openGraph: {
    title: "Product Categories | Best Buyers View",
    description:
      "Browse all product categories and find the best items across Baby, Beauty, Fashion, Fitness, Tech, and more. Expert reviews and comparisons to help you decide.",
    url: `${SITE_URL}/category`,
    siteName: "Best Buyers View",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Product Categories | Best Buyers View",
    description: "Discover, Compare & Pick the Best across all categories",
    site: "@bestbuyersview",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return (
    <>
      <CategoryPage />
      <ScrollToTopButton />
    </>
  );
}
