"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/lib/api/axios";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("amazon-choice");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);

  const tabs = [
    { key: "best-seller", label: "🧨Best Seller", apiLabel: "best seller" },
    { key: "black-friday", label: "🖤Black Friday Deal", apiLabel: "black-friday-deal" },
    { key: "amazon-choice", label: "❤️‍🔥Amazon's Choice", apiLabel: "amazon-choice" },
    { key: "featured", label: "Featured", apiLabel: null }, // null means use featured endpoint
    { key: "hot", label: "🔥Hot", apiLabel: "hot" }
  ];

  const itemsPerPage = 6;
  const maxPagesPerLabel = 4;

  // Fetch products based on active tab with pagination
  const fetchProducts = async (tabKey, page = 1) => {
    setLoading(true);
    try {
      const activeTabConfig = tabs.find(tab => tab.key === tabKey);
      let response;

      if (activeTabConfig.apiLabel) {
        // Fetch by specific label with server-side pagination
        response = await api.get("/labels", {
          params: {
            labels: activeTabConfig.apiLabel,
            page: page,
            limit: itemsPerPage
          }
        });
      } else {
        // Fetch featured products with server-side pagination
        response = await api.get("/featured", {
          params: {
            page: page,
            limit: itemsPerPage
          }
        });
      }
      
      if (response.data.success) {
        setProducts(response.data.data.products);
        setTotalPages(response.data.data.pagination.pages);
        setTotalProducts(response.data.data.pagination.total);
        setCurrentPage(response.data.data.pagination.page);
        
        console.log(`📊 Loaded ${response.data.data.products.length} products for ${activeTabConfig.label}`, {
          page: response.data.data.pagination.page,
          totalPages: response.data.data.pagination.pages,
          totalProducts: response.data.data.pagination.total
        });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setTotalPages(1);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(activeTab, currentPage);
  }, [activeTab, currentPage]);

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleTabClick = (tabKey) => {
    if (tabKey !== activeTab) {
      setActiveTab(tabKey);
      setCurrentPage(1); // Reset to first page when changing tabs
    }
  };

  const getActiveTabLabel = () => {
    return tabs.find(tab => tab.key === activeTab)?.label || "Products";
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-2 md:py-8">
      {/* Section Header */}
      <div className="text-center mb-4">
        <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Featured Products
        </h2>
        <p className="text-gray-600 text-sm md:text-base">
          Discover our hand-picked selection of top products
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-3 md:gap-6 mb-6 flex-wrap px-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabClick(tab.key)}
            disabled={loading}
            className={`px-4 md:px-6 py-2.5 md:py-3 rounded-full font-semibold text-sm md:text-base transition-all duration-300 shadow-md ${
              activeTab === tab.key
                ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-300 scale-105"
                : "bg-white text-gray-600 hover:bg-gradient-to-r hover:from-orange-100 hover:to-pink-100 hover:text-orange-600 hover:shadow-lg"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Loading products...</span>
        </div>
      )}

      {/* Product Grid - Always 5 products per page */}
      {!loading && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {products.map((product) => (
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
                        i < (product.customRating?.rating || 0) ? "text-yellow-400" : "text-gray-200"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                  {product.customRating?.reviewCount && (
                    <span className="text-xs text-gray-500 ml-1">
                      ({product.customRating.reviewCount})
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  {product.price?.displayAmount && (
                    <span className="text-lg font-bold text-green-600">
                      {product.price.displayAmount}
                    </span>
                  )}
                  {product.listPrice?.displayAmount && product.listPrice.amount !== product.price?.amount && (
                    <span className="text-sm text-gray-500 line-through">
                      {product.listPrice.displayAmount}
                    </span>
                  )}
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

          {/* No Products Message */}
          {products.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found for {getActiveTabLabel()}.</p>
              <p className="text-gray-400 text-sm mt-2">Try selecting a different category</p>
            </div>
          )}

          {/* Enhanced Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-4 mt-2">
              {/* Pagination Controls */}
              <div className="flex justify-center items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1 || loading}
                  className={`p-2 rounded-full shadow-md transition-all duration-300 ${
                    currentPage === 1 || loading
                      ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-110"
                  }`}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Page Numbers */}
                <div className="flex gap-1">
                  {getPageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      disabled={loading}
                      className={`w-8 h-8 rounded-full font-semibold text-sm transition-all duration-300 ${
                        currentPage === pageNum
                          ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg scale-110"
                          : "bg-white text-gray-600 hover:bg-gray-100 shadow-md"
                      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages || loading}
                  className={`p-2 rounded-full shadow-md transition-all duration-300 ${
                    currentPage === totalPages || loading
                      ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-110"
                  }`}
                  aria-label="Next page"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              
            </div>
          )}
        </>
      )}
    </div>
  );
}