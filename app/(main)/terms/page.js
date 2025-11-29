
import PrivacyPolicy from "@/page-components/HomePage/PrivacyPolicy";
import Navbar from "@/components/common/Navbar";
import ScrollToTopButton from "@/ui/ScrollToTopButton";
import { Footer } from "@/components/common/Footer";
import React from "react";
import TermsOfService from "@/page-components/HomePage/TermsSection";

export const metadata = {
  title: "Terms of Service | Best Buyers View",
  description:
    "Read the terms of service for using Best Buyers View. Understand your rights and responsibilities when accessing our product reviews, comparisons, and buying guides.",
  keywords: [
    "terms of service",
    "terms and conditions",
    "user agreement",
    "platform policies",
    "legal terms",
  ],
  alternates: {
    canonical: "https://www.bestbuyersview.com/terms",
  },
  openGraph: {
    title: "Terms of Service | Best Buyers View",
    description:
      "Read the terms of service for using Best Buyers View and our platform policies.",
    url: "https://www.bestbuyersview.com/terms",
    siteName: "Best Buyers View",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function page() {
  return (
    <>
          <Navbar />

      <TermsOfService />
      <Footer />
      <ScrollToTopButton />
    </>
  );
}
