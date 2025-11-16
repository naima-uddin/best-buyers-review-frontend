"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/lib/api/axios";

export default function FeaturedProducts() {
  const [featured, setFeatured] = useState([]);
  const [activeTab, setActiveTab] = useState("#1 Best Seller");
  const [currentPage, setCurrentPage] = useState(1);

  const tabs = ["#1 Best Seller", "Trending", "Amazon's Choice", "Featured", "Hot"];
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get("/featured");
        if (res.data.success) setFeatured(res.data.data);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      }
    };
    fetchFeatured();
  }, []);

  // Filter products based on active tab
  const filteredProducts = featured.filter((p) => {
    if (activeTab === "#1 Best Seller") return p.labels?.includes("best seller");
    if (activeTab === "Trending") return p.labels?.includes("trending");
    if (activeTab === "Amazon's Choice") return p.labels?.includes("amazon-choice");
    if (activeTab === "Featured") return p.labels?.includes("featured");
    if (activeTab === "Hot") return p.labels?.includes("hot");
    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 mt-8">
      {/* Section Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
          Featured Products
        </h2>
        <p className="text-gray-600 text-sm md:text-base">
          Discover our hand-picked selection of top products
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-3 md:gap-6 mb-10 flex-wrap px-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            className={`px-4 md:px-6 py-2.5 md:py-3 rounded-full font-semibold text-sm md:text-base transition-all duration-300 shadow-md ${
              activeTab === tab
                ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-300 scale-105"
                : "bg-white text-gray-600 hover:bg-gradient-to-r hover:from-orange-100 hover:to-pink-100 hover:text-orange-600 hover:shadow-lg"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {currentProducts.map((product) => (
          <div
            key={product.asin}
            className="group relative bg-white rounded-2xl p-4 text-center hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-2"
          >
            {/* Image */}
            <div className="relative w-full h-36 md:h-44 mb-3 overflow-hidden rounded-xl">
              <Image
                src={product.images?.[0]?.url || "/no-image.png"}
                alt={product.title}
                fill
                className="object-contain group-hover:scale-110 transition-transform duration-300"
              />
              {product.discount?.displayAmount && (
                <span className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                  {product.discount.displayAmount}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-xs md:text-sm font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[2.5rem] leading-tight">
              {product.title}
            </h3>

            {/* Rating */}
            <div className="flex items-center justify-center mb-3 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-base md:text-lg ${
                    i < product.customRating?.rating ? "text-yellow-400" : "text-gray-200"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Amazon Button */}
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 w-full bg-gradient-to-r from-amber-400 to-orange-400 text-gray-900 py-2 md:py-2.5 rounded-xl hover:from-amber-500 hover:to-orange-500 transition-all duration-300 font-semibold text-xs md:text-sm shadow-md hover:shadow-lg group-hover:scale-105"
            >
              <span>View on</span>
              <Image
                src="/white-amazon-logo-1.png"
                alt="Amazon"
                width={40}
                height={50}
                className="object-contain mt-1.5"
              />
            </a>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 md:gap-5 mt-10">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`p-2.5 md:p-3 rounded-full shadow-md transition-all duration-300 ${
              currentPage === 1
                ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-110"
            }`}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <span className="text-gray-700 font-semibold text-sm md:text-base px-2 md:px-4 py-2 bg-white rounded-full shadow-md">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`p-2.5 md:p-3 rounded-full shadow-md transition-all duration-300 ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-110"
            }`}
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      )}
    </div>
  );
}
