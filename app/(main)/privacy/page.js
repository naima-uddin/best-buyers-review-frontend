
import PrivacyPolicy from "@/page-components/HomePage/PrivacyPolicy";
import Navbar from "@/components/common/Navbar";
import ScrollToTopButton from "@/ui/ScrollToTopButton";
import { Footer } from "@/components/common/Footer";
import React from "react";

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
