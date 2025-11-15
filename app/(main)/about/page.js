import { Footer } from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import AboutUs from "@/page-components/AboutPage/About";
import ScrollToTopButton from "@/ui/ScrollToTopButton";
import React from "react";

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
