"use client";
import { useEffect, useState, Suspense, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import ProductPageSidebar from "./ProductPageSidebar";
import Link from "next/link";
import { useCompare } from "@/context/CompareContext";
import CompareBox from "../ProductCompare/CompareBox";
import CompareModal from "../ProductCompare/CompareModal";
import CouponPopup from "./CouponPopup";

function ProductByCategoryContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const mainCategory = params?.mainCategory;
  const subCategory = params?.subCategory;
  const mainName = searchParams?.get("mainName");
  const subName = searchParams?.get("subName");
  const pageParam = parseInt(searchParams?.get("page")) || 1;

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeProductImages, setActiveProductImages] = useState({});

  const sortParam = searchParams.get("sort") || "default";

  const { compareItems, addToCompare } = useCompare();

  const [showCoupon, setShowCoupon] = useState(false);
  const [couponProduct, setCouponProduct] = useState(null);
  const [couponQueue, setCouponQueue] = useState([]);
  const [couponIndex, setCouponIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!mainCategory || !subCategory) {
      setLoading(false);
      return;
    }

    async function fetchProducts() {
      try {
        setLoading(true);
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL ||
          "https://api.bestbuyersview.com/api";
        const res = await fetch(
          `${apiUrl}/products?mainCategory=${mainCategory}&subCategory=${subCategory}&page=${pageParam}&limit=10&sort=${sortParam}`
        );
        const data = await res.json();

        if (data.success && data.data) {
          setProducts(data.data.products || []);
          setTotalPages(data.data.pagination?.pages || 1);

          const initialImages = {};
          data.data.products.forEach((product) => {
            const mainImage =
              product.images?.find((img) => img.variant === "MAIN")?.url ||
              product.images?.[0]?.url;
            initialImages[product._id] = mainImage;
          });
          setActiveProductImages(initialImages);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [mainCategory, subCategory, pageParam, sortParam]); // ✅ Also add sortParam dependency

  const handlePageChange = (newPage) => {
    router.push(
      `/category/${mainCategory}/${subCategory}?page=${newPage}&mainName=${encodeURIComponent(
        mainName
      )}&subName=${encodeURIComponent(subName)}`,
      { scroll: false }
    );
  };

  const getStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center text-yellow-500 text-lg">
        {"★".repeat(fullStars)}
        {hasHalfStar && "★"}
        {"☆".repeat(emptyStars)}
      </div>
    );
  };

  const handleThumbnailHover = (productId, imageUrl) => {
    setActiveProductImages((prev) => ({
      ...prev,
      [productId]: imageUrl,
    }));
  };

  // Function to truncate long feature text
  const truncateFeature = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handleCompareCheckbox = (product, isChecked) => {
    if (isChecked) {
      addToCompare(product);
    }
  };

  useEffect(() => {
    if (!products || products.length === 0) return;

    const coupons = products.filter((p) => p.isCoupon);
    setCouponQueue(coupons);
    setCouponIndex(0);
  }, [products, subCategory]);

  useEffect(() => {
    // clear any old timers when category changes
    clearTimeout(timerRef.current);

    if (couponQueue.length === 0) return;

    // show the first coupon after 4 seconds
    timerRef.current = setTimeout(() => {
      setCouponProduct(couponQueue[0]);
      setShowCoupon(true);
      setCouponIndex(0);
    }, 4000);

    return () => clearTimeout(timerRef.current);
  }, [couponQueue, subCategory]);

  const handleCloseCoupon = () => {
    setShowCoupon(false);

    // clear any existing timer
    clearTimeout(timerRef.current);

    // schedule next coupon after 15 seconds
    timerRef.current = setTimeout(() => {
      setCouponIndex((prev) => {
        const nextIndex = (prev + 1) % couponQueue.length;
        setCouponProduct(couponQueue[nextIndex]);
        setShowCoupon(true);
        return nextIndex;
      });
    }, 15000);
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    router.push(
      `/category/${mainCategory}/${subCategory}?page=${pageParam}&sort=${newSort}&mainName=${encodeURIComponent(
        mainName
      )}&subName=${encodeURIComponent(subName)}`
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold mb-2 text-[#0215A6]">
            Best {subName} ({mainName})
          </h1>
          <p className="text-gray-600">
            Explore our expertly curated collection designed to fit your
            lifestyle, budget, and every need. Updated{" "}
            {new Date().toLocaleString("default", { month: "long" })}{" "}
            {new Date().getFullYear()} • Top-rated {subName} selected by
            experts.
          </p>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col md:flex-row md:items-start gap-8">
          {/* Product List */}
          <div className="flex-1">
            <div className="flex justify-center items-center h-64 text-gray-500">
              Loading products...
            </div>
          </div>

          {/* Sidebar */}
          <ProductPageSidebar
            mainCategory={mainCategory}
            currentSubCategory={subCategory}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold mb-2">
          Best {subName} ({mainName})
        </h1>
        <h2 className="text-sm px-40">
          Home, Food, Fashion, Beauty, Baby, Electronics, Sports, Health,
          Automotive,Pets and so many more . Explore our expertly curated
          collection designed to fit your lifestyle, budget, and every need
        </h2>
        <p className="text-gray-600">
          Updated November 2025 • Top-rated {subName} selected by experts.
        </p>
      </div>

      {/* sorting option */}
      <div className="flex justify-start mb-4 ml-4">
        <select
          value={sortParam}
          onChange={handleSortChange}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="rating">Ratings (High to Low)</option>
          <option value="reviews">Reviews Count (High to Low)</option>
          <option value="popularity">Popularity</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
        </select>
      </div>

      {/* Content Layout */}
      <div className="flex flex-col md:flex-row md:items-start gap-8">
        {/* Product List - Add negative margin to allow number badges to show */}
        <div className="flex-1 space-y-6 -ml-4">
          {products.length > 0 ? (
            <>
              {products.map((product, index) => {
                const mainImage =
                  product.images?.find((img) => img.variant === "MAIN")?.url ||
                  product.images?.[0]?.url;
                const thumbImages =
                  product.images?.filter((img) => img.variant === "SUB") ||
                  product.images?.slice(1, 5) ||
                  [];
                const currentImage =
                  activeProductImages[product._id] || mainImage;
                const productNumber = (pageParam - 1) * 10 + index + 1;

                return (
                  <div key={product._id} className="relative">
                    {/* Product Number Badge - Positioned absolutely relative to the product card wrapper */}
                    <div className="absolute left-4 top-1/2 z-10 bg-orange-600 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transform -translate-y-1/2">
                      {productNumber}
                    </div>

                    {/* Card container with margin to make space for number */}
                    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-yellow-500 ml-8">
                      {/* Product Content */}
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Left Section - Image Gallery */}
                          <div className="flex flex-col items-center md:w-48 relative">
                            {/* Labels/Badges */}
                            {product.labels && product.labels.length > 0 && (
                              <div className="absolute -left-1 -top-2 z-10 text-white rounded-full flex items-center justify-center font-bold text-sm transform  ">
                                {product.labels
                                  .slice(0, 2)
                                  .map((label, labelIndex) => (
                                    <span
                                      key={labelIndex}
                                      className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold"
                                    >
                                      {label}
                                    </span>
                                  ))}
                              </div>
                            )}

                            {/* Main Image */}
                            <div className="relative w-48 h-48 mb-4">
                              <Image
                                src={currentImage || "/placeholder-image.jpg"}
                                alt={product.title}
                                fill
                                className="object-contain rounded-lg"
                              />
                            </div>

                            {/* Thumbnail Images */}
                            {thumbImages.length > 0 && (
                              <div className="flex gap-1 flex-wrap justify-center">
                                {thumbImages
                                  .slice(0, 4)
                                  .map((thumb, thumbIndex) => (
                                    <div
                                      key={thumbIndex}
                                      className="relative w-10 h-10 border border-gray-300 rounded cursor-pointer hover:border-blue-500 transition-colors"
                                      onMouseEnter={() =>
                                        handleThumbnailHover(
                                          product._id,
                                          thumb.url
                                        )
                                      }
                                    >
                                      <Image
                                        src={thumb.url}
                                        alt={`${product.title} thumbnail ${
                                          thumbIndex + 1
                                        }`}
                                        fill
                                        className="object-cover rounded"
                                      />
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>

                          {/* Middle Section - Product Info */}
                          <div className="flex-1">
                            {/* Rating and Reviews */}
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex items-center">
                                {getStarRating(
                                  product.customRating?.rating || 4.5
                                )}
                              </div>
                              <span className="text-gray-700 font-bold text-lg">
                                {product.customRating?.rating?.toFixed(1) ||
                                  "4.5"}
                              </span>
                              <span className="text-gray-600 text-sm">
                                ({product.customRating?.reviewCount || 29}{" "}
                                reviews)
                              </span>
                            </div>

                            {/* Product Title */}
                            <h2 className="text-xl font-bold mb-3 leading-tight text-gray-900">
                              {product.title}
                            </h2>

                            {/* Features from API */}
                            <div className="space-y-2 mb-4">
                              {product.features?.feature &&
                              product.features.feature.length > 0 ? (
                                product.features.feature
                                  .slice(0, 4)
                                  .map((feature, featureIndex) => (
                                    <div
                                      key={featureIndex}
                                      className="flex items-start"
                                    >
                                      <span className="text-gray-800 text-sm">
                                        • {truncateFeature(feature)}
                                      </span>
                                    </div>
                                  ))
                              ) : (
                                // Fallback features if none available
                                <>
                                  <div className="flex items-start">
                                    <span className="text-gray-800 text-sm">
                                      • 16-inch carbon steel frame ideal for
                                      teens and adults under 5'2"
                                    </span>
                                  </div>
                                  <div className="flex items-start">
                                    <span className="text-gray-800 text-sm">
                                      • Dual suspension system with 4 shock
                                      absorbers and large shock-absorbing seat
                                    </span>
                                  </div>
                                  <div className="flex items-start">
                                    <span className="text-gray-800 text-sm">
                                      • 16" X 4" fat tires suitable for
                                      mountains, sand, snow, and grass
                                    </span>
                                  </div>
                                  <div className="flex items-start">
                                    <span className="text-gray-800 text-sm">
                                      • Peak 1200W motor with 55-75 miles range
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>

                            {/* Read More Link */}
                            {product?.isFullReview && (
                              <Link
                                href={`/category/${mainCategory}/${subCategory}/${product._id}`}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 flex items-center"
                              >
                                Read Full Details Specification
                                <span className="ml-1">→</span>
                              </Link>
                            )}
                          </div>

                          {/* Right Section - Price and Action */}
                          <div className="flex flex-col items-center md:items-end justify-between md:w-48 mt-4">
                            <div className="text-center w-full">
                              {/* Save Percentage Box */}
                              <div className="text-xl font-bold text-[#0215A6]">
                                Save {product.discount?.percentage || 36}%
                              </div>

                              {/* Check Price Button */}
                              <a
                                href={product.affiliateUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors mb-4 text-center text-xl mt-2"
                              >
                                Check Price
                              </a>

                              {/* Amazon Logo and Prime Delivery */}
                              <div className="flex flex-col items-center mb-4">
                                <img
                                  src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
                                  alt="Amazon"
                                  className="h-6 mb-1"
                                />
                                <span className="text-xs text-gray-500">
                                  Prime Delivery
                                </span>
                              </div>

                              {/* Compare Checkbox */}
                              <div className="flex items-center justify-center mt-4">
                                <input
                                  type="checkbox"
                                  id={`compare-${product._id}`}
                                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                  onChange={(e) =>
                                    handleCompareCheckbox(
                                      product,
                                      e.target.checked
                                    )
                                  }
                                  checked={compareItems.some(
                                    (item) => item._id === product._id
                                  )}
                                />
                                <label
                                  htmlFor={`compare-${product._id}`}
                                  className="ml-2 text-sm text-gray-700"
                                >
                                  Compare
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Pagination */}
              <div className="flex justify-center items-center mt-10 space-x-2">
                <button
                  onClick={() => handlePageChange(pageParam - 1)}
                  disabled={pageParam === 1}
                  className={`px-4 py-2 border rounded-lg ${
                    pageParam === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-4 py-2 border rounded-lg ${
                      pageParam === i + 1
                        ? "bg-blue-500 text-white"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(pageParam + 1)}
                  disabled={pageParam === totalPages}
                  className={`px-4 py-2 border rounded-lg ${
                    pageParam === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            /* No Products Found Message */
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="max-w-md mx-auto">
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Products Found
                </h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find any products in this category. Please check
                  back later or browse other categories.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Other Categories
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Always visible regardless of products */}
        <ProductPageSidebar
          mainCategory={mainCategory}
          currentSubCategory={subCategory}
        />
      </div>

      <CompareBox />
      <CompareModal />
      <CouponPopup
        show={showCoupon}
        onClose={handleCloseCoupon}
        couponProduct={couponProduct}
      />
    </div>
  );
}

export default function ProductByCategory() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen text-gray-500">
          Loading...
        </div>
      }
    >
      <ProductByCategoryContent />
    </Suspense>
  );
}
