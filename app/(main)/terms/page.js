
import PrivacyPolicy from "@/page-components/HomePage/PrivacyPolicy";
import Navbar from "@/components/common/Navbar";
import ScrollToTopButton from "@/ui/ScrollToTopButton";
import { Footer } from "@/components/common/Footer";
import React from "react";
import TermsOfService from "@/page-components/HomePage/TermsSection";

export const metadata = {
  title: "Terms of Service",
  description: "Read the terms of service for using Best Buyers View and our platform policies.",
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
