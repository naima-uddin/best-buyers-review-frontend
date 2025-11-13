import React from "react";
import BannerSlider from "./BannerSlider";
import CategoryGrid from "./CategoryGrid";
import ReviewsSection from "./reviews-section";
import TrustSection from "./trust-section";
import FeaturedProducts from "./FeaturedProducts";
import ConnectSection from "./ConnectSection";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Section with Banner */}
      <section className="relative px-4">
        <BannerSlider />
      </section>

      {/* Category Section */}
      <section className="relative py-8 md:py-12">
        <CategoryGrid />
      </section>

      {/* Featured Products Section */}
      <section className="relative px-4 my-12 md:my-16">
        <div className="bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 rounded-3xl max-w-7xl mx-auto shadow-lg">
          <FeaturedProducts />
        </div>
      </section>

      {/* Reviews Section */}
      <section className="relative py-12 md:py-16 px-4">
        <ReviewsSection />
      </section>

      {/* Trust Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 py-16 md:py-20 my-12 md:my-16">
        <TrustSection />
      </section>

      {/* Connect Section */}
      <section className="relative py-12 md:py-16 px-4 mb-8">
        <ConnectSection />
      </section>
    </div>
  );
};

export default HomePage;
