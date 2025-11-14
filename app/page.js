import { Footer } from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import HomePage from "@/page-components/HomePage/HomePage";
import ScrollToTopButton from "@/ui/ScrollToTopButton";

export default function Home() {
  return (
    <>
      <Navbar />
      <HomePage />
      <Footer />
      <ScrollToTopButton />
    </>
  );
}
