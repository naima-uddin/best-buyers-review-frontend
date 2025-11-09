import React from "react";
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
    </>
  );
};

export default HomePage;
