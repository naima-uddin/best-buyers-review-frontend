import { Footer } from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import AboutUs from "@/page-components/AboutPage/About";
import ScrollToTopButton from "@/ui/ScrollToTopButton";
import React from "react";

export const metadata = {
  title: "About",
  description: "Learn more about Best Buyers View, our mission, and the team behind the platform.",
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
