
import PrivacyPolicy from "@/page-components/HomePage/PrivacyPolicy";
import Navbar from "@/components/common/Navbar";
import ScrollToTopButton from "@/ui/ScrollToTopButton";
import { Footer } from "@/components/common/Footer";
import React from "react";

export const metadata = {
  title: "Privacy Policy | Best Buyers View",
  description:
    "Read Best Buyers View's privacy policy to understand how we collect, use, and protect your personal information. Learn about our data practices, cookies, and your privacy rights.",
  keywords: [
    "privacy policy",
    "data protection",
    "personal information",
    "privacy practices",
    "cookies policy",
    "user privacy",
  ],
  alternates: {
    canonical: "https://www.bestbuyersview.com/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Best Buyers View",
    description:
      "Learn about Best Buyers View's privacy practices and how we protect your personal information.",
    url: "https://www.bestbuyersview.com/privacy",
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

      <PrivacyPolicy />
      <Footer />
      <ScrollToTopButton />
    </>
  );
}
