
import ContactPage from "@/page-components/HomePage/ContactPage";
import React from "react";
import Navbar from "@/components/common/Navbar";
import ScrollToTopButton from "@/ui/ScrollToTopButton";
import { Footer } from "@/components/common/Footer";

export const metadata = {
  title: "Contact Us | Best Buyers View",
  description:
    "Get in touch with the Best Buyers View team for inquiries, support, feedback, or partnership opportunities. We're here to help you make informed purchase decisions.",
  keywords: [
    "contact Best Buyers View",
    "customer support",
    "product review inquiries",
    "feedback",
    "partnership opportunities",
    "contact us",
  ],
  alternates: {
    canonical: "https://bestbuyersview.com/contact",
  },
  openGraph: {
    title: "Contact Us | Best Buyers View",
    description:
      "Have questions about our product reviews? Get in touch with the Best Buyers View team for inquiries, support, or feedback.",
    url: "https://bestbuyersview.com/contact",
    siteName: "Best Buyers View",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact Us | Best Buyers View",
    description:
      "Get in touch with the Best Buyers View team for inquiries, support, or feedback.",
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
      <ContactPage />
      <Footer />
      <ScrollToTopButton />

    </>
  );
}
