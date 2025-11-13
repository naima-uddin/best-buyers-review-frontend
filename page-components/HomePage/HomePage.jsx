import React from "react";
import BannerSlider from "./BannerSlider";
import CategoryGrid from "./CategoryGrid";
import ReviewsSection from "./reviews-section";
import TrustSection from "./trust-section";
import FeaturedProducts from "./FeaturedProducts";
import ConnectSection from "./ConnectSection";

const HomePage = () => {
  return (
    <>
      <BannerSlider />
      <CategoryGrid />
      <FeaturedProducts/>
      <ReviewsSection />
      <TrustSection />
      <ConnectSection/>
    </>
  );
};

export default HomePage;
