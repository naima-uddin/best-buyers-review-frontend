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
    <div className="max-w-7xl mx-auto  relative overflow-hidden py-10 mt-10">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-[#0215A6] to-[#0215A6] bg-clip-text text-transparent text-center mt-4">Featured Products</h2>

      {/* Tabs */}
      <div className="flex justify-center gap-8 mb-10 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            className={`text-lg font-semibold pb-2 border-b-2 transition-colors ${
              activeTab === tab
                ? "text-orange-600 border-orange-700"
                : "text-gray-500 border-transparent hover:text-orange-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {currentProducts.map((product) => (
          <div
            key={product.asin}
            className="relative bg-white rounded-lg border border-blue-200 p-4 text-center hover:shadow-md transition"
          >
            {/* Image */}
            <div className="relative w-full h-40 mb-2">
              <Image
                src={product.images?.[0]?.url || "/no-image.png"}
                alt={product.title}
                fill
                className="object-contain rounded-lg"
              />
              {product.discount?.displayAmount && (
                <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
                  {product.discount.displayAmount}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2">
              {product.title}
            </h3>

            {/* Rating */}
            <div className="flex items-center justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-yellow-400 text-sm ${
                    i < product.customRating?.rating ? "text-yellow-500" : "text-gray-300"
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
              className="flex items-center justify-center gap-2 mt-2 w-full border border-amber-500 text-gray-700 py-1.5 rounded hover:bg-amber-50 transition-colors font-medium"
            >
              <span className="flex items-center">View on</span>
              <Image
                src="/amazon-logo.jpg"
                alt="Amazon"
                width={44}
                height={44}
                className="object-contain mt-2"
              />
            </a>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`p-2 rounded-full border ${
              currentPage === 1
                ? "border-gray-300 text-gray-300 cursor-not-allowed"
                : "border-purple-600 text-purple-600 hover:bg-purple-50"
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-gray-700 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-full border ${
              currentPage === totalPages
                ? "border-gray-300 text-gray-300 cursor-not-allowed"
                : "border-purple-600 text-purple-600 hover:bg-purple-50"
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
