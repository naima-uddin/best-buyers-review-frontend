import { Footer } from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import AboutUs from "@/page-components/AboutPage/About";
import ScrollToTopButton from "@/ui/ScrollToTopButton";
import React from "react";

export const metadata = {
  title: "About Us | Best Buyers View",
  description:
    "Learn more about Best Buyers View, our mission to help consumers make informed purchase decisions, and how we provide unbiased product reviews, comparisons, and buying guides.",
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
      "Discover the mission behind Best Buyers View and how we help consumers make informed purchase decisions through expert product reviews and comparisons.",
    url: "https://bestbuyersview.com/about",
    siteName: "Best Buyers View",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "About Us | Best Buyers View",
    description:
      "Learn about our mission to help consumers make informed purchase decisions through expert product reviews.",
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
      <AboutUs />
      <Footer />
      <ScrollToTopButton />
    </>
  );
}
