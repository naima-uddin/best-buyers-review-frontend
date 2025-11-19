
import ContactPage from "@/page-components/HomePage/ContactPage";
import React from "react";
import Navbar from "@/components/common/Navbar";
import ScrollToTopButton from "@/ui/ScrollToTopButton";
import { Footer } from "@/components/common/Footer";

export const metadata = {
  title: "Contact",
  description: "Get in touch with the Best Buyers View team for inquiries, support, or feedback.",
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
