import { Footer } from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import AboutUs from "@/page-components/AboutPage/About";
import ScrollToTopButton from "@/ui/ScrollToTopButton";
import React from "react";

export const metadata = {
  title: "About Us | Best Buyers View",
  description:
    "Learn more about Best Buyers View, our mission to help consumers make informed purchase decisions through unbiased reviews, comparisons, and buying guides.",
  keywords: [
    "about Best Buyers View",
    "our mission",
    "product review platform",
    "unbiased reviews",
    "consumer guide",
    "about us",
  ],
  alternates: {
    canonical: "https://bestbuyersview.com/about",
  },
  openGraph: {
    title: "About Us | Best Buyers View",
    description:
      "Discover the mission behind Best Buyers View and how we help consumers make informed purchase decisions through expert product reviews.",
    url: "https://bestbuyersview.com/about",
    siteName: "Best Buyers View",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Best Buyers View",
    description:
      "Learn about our mission to help consumers make informed and confident purchase decisions.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// ORGANIZATION STRUCTURED DATA
function OrganizationJsonLD() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Best Buyers View",
    url: "https://bestbuyersview.com",
    logo: "https://bestbuyersview.com/logo.png",
    sameAs: [
      "https://www.facebook.com/bestbuyersview",
      "https://www.linkedin.com/company/bestbuyersview",
      "https://www.youtube.com/@bestbuyersview",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// WEBPAGE SCHEMA
function WebPageJsonLD() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "About Us | Best Buyers View",
    description:
      "Learn more about our mission to provide unbiased product reviews and buying guides.",
    url: "https://bestbuyersview.com/about",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// BREADCRUMB SCHEMA
function BreadcrumbJsonLD() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://bestbuyersview.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "About",
        item: "https://bestbuyersview.com/about",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function Page() {
  return (
    <>
      {/* JSON-LD SCHEMAS */}
      <OrganizationJsonLD />
      <WebPageJsonLD />
      <BreadcrumbJsonLD />

      {/* PAGE CONTENT */}
      <Navbar />
      <AboutUs />
      <Footer />
      <ScrollToTopButton />
    </>
  );
}
