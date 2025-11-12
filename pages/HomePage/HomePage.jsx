import React from "react";
import BannerSlider from "./BannerSlider";
import CategoryGrid from "./CategoryGrid";
import ReviewsSection from "./reviews-section";
import TrustSection from "./trust-section";

const HomePage = () => {
  return (
    <>
      <BannerSlider />
      <CategoryGrid />
      <ReviewsSection />
      <TrustSection />
    </>
  );
};

export default HomePage;
