
import PrivacyPolicy from "@/page-components/HomePage/PrivacyPolicy";
import Navbar from "@/components/common/Navbar";
import ScrollToTopButton from "@/ui/ScrollToTopButton";
import { Footer } from "@/components/common/Footer";
import React from "react";

export const metadata = {
  title: "Privacy Policy",
  description: "Read about Best Buyers View's privacy practices and how we protect your information.",
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
