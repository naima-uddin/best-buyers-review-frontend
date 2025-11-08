import React from "react";
import Pagination from "./Pagination";
import BannerSlider from "./BannerSlider";
import CategoryGrid from "./CategoryGrid";
import ReviewsSection from "./reviews-section";
import TrustSection from "./trust-section";

const HomePage = () => {
  return (
    <>
      <CategoryGrid />
      <BannerSlider />
      <ReviewsSection />
      <TrustSection />
      <Pagination />
    </>
  );
};

export default HomePage;
