"use client";
import { useEffect, useState, Suspense, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import ProductPageSidebar from "./ProductPageSidebar";
import Link from "next/link";
import { useCompare } from "@/context/CompareContext";
import CompareBox from "@/components/CompareBox";
import CompareModal from "@/components/CompareModal";
import CouponPopup from "./CouponPopup";
import BackButton from "@/ui/BackButton";
import Navbar from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import Breadcrumbs from "@/ui/Breadcrumbs";

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
      <div className="flex items-center text-yellow-500 text-base sm:text-lg">
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
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-6 md:py-10">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Best {subName} ({mainName})
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 px-4 sm:px-8">
            Explore our expertly curated collection designed to fit your
            lifestyle, budget, and every need. Updated{" "}
            {new Date().toLocaleString("default", { month: "long" })}{" "}
            {new Date().getFullYear()} • Top-rated {subName} selected by
            experts.
          </p>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8">
          {/* Product List */}
          <div className="flex-1">
            <div className="flex flex-col justify-center items-center h-64 md:h-96 text-gray-500">
              <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-b-4 border-blue-600 mb-4"></div>
              <p className="text-sm sm:text-base md:text-lg font-medium">
                Loading products...
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80">
            <ProductPageSidebar
              mainCategory={mainCategory}
              currentSubCategory={subCategory}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <Navbar />
    <div className="max-w-7xl mx-auto px-4 ">
            <Breadcrumbs />
          </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      {/* Header */}
      <div className="text-center mb-6 md:mb-8">
        <BackButton className="-mb-2" />
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Best {subName} ({mainName})
        </h1>
        <h2 className="text-xs sm:text-sm md:text-base px-4 sm:px-8 md:px-16 lg:px-40 text-gray-700 mb-2 leading-relaxed">
          Home, Food, Fashion, Beauty, Baby, Electronics, Sports, Health,
          Automotive, Pets and so many more. Explore our expertly curated
          collection designed to fit your lifestyle, budget, and every need
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-gray-600">
          Updated {new Date().toLocaleString("default", { month: "long" })}{" "}
          {new Date().getFullYear()} • Top-rated {subName} selected by experts.
        </p>
      </div>

      {/* Sorting option */}
      <div className="flex justify-between items-center mb-4 md:mb-6 px-2 sm:px-0">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">
            Sort by:
          </span>
          <select
            value={sortParam}
            onChange={handleSortChange}
            className="border border-gray-300 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm bg-white hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          >
            <option value="rating">Ratings (High to Low)</option>
            <option value="reviews">Reviews Count (High to Low)</option>
            <option value="popularity">Popularity</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
        </div>
        <div className="text-xs sm:text-sm text-gray-600">
          {products.length} Products
        </div>
      </div>

      {/* Mobile Related Categories - Only visible on small/medium devices */}
      <div className="block lg:hidden mb-6">
        <div className="border border-gray-200 rounded-xl shadow-sm p-4 bg-white">
          <h3 className="text-lg font-semibold mb-3">Related Categories</h3>
          <ProductPageSidebar
            mainCategory={mainCategory}
            currentSubCategory={subCategory}
            showOnlyRelatedCategories={true}
          />
        </div>
      </div>

      {/* Content Layout */}
      <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8">
        {/* Product List */}
        <div className="flex-1 space-y-4 md:space-y-6">
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
                    {/* Product Number Badge */}
                    <div className="absolute -left-2 sm:left-2 md:left-4 top-6 sm:top-1/2 z-10 bg-gradient-to-br from-orange-500 to-orange-600 text-white w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base transform sm:-translate-y-1/2 shadow-lg">
                      {productNumber}
                    </div>

                    {/* Card container */}
                    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-orange-400 ml-6 sm:ml-8 md:ml-10">
                      {/* Product Content */}
                      <div className="p-3 sm:p-4 md:p-6">
                        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                          {/* Left Section - Image Gallery */}
                          <div className="flex flex-col items-center w-full md:w-40 lg:w-48 relative mx-auto md:mx-0">
                            {/* Labels/Badges */}
                            {product.labels && product.labels.length > 0 && (
                              <div className="absolute left-0 top-0 z-10 flex flex-wrap gap-1">
                                {product.labels
                                  .slice(0, 2)
                                  .map((label, labelIndex) => (
                                    <span
                                      key={labelIndex}
                                      className="bg-gradient-to-r from-red-600 to-red-500 text-white px-2 py-1 rounded text-xs font-bold shadow-md uppercase"
                                    >
                                      {label}
                                    </span>
                                  ))}
                              </div>
                            )}

                            {/* Main Image */}
                            <div className="relative w-40 h-40 sm:w-44 sm:h-44 md:w-40 md:h-40 lg:w-48 lg:h-48 mb-3 md:mb-4">
                              <Image
                                src={currentImage || "/placeholder-image.jpg"}
                                alt={product.title}
                                fill
                                className="object-contain rounded-lg"
                              />
                            </div>

                            {/* Thumbnail Images */}
                            {thumbImages.length > 0 && (
                              <div className="flex gap-1 sm:gap-2 flex-wrap justify-center">
                                {thumbImages
                                  .slice(0, 4)
                                  .map((thumb, thumbIndex) => (
                                    <div
                                      key={thumbIndex}
                                      className="relative w-8 h-8 sm:w-10 sm:h-10 border-2 border-gray-300 rounded cursor-pointer hover:border-blue-500 transition-all hover:scale-110"
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
                            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                              <div className="flex items-center">
                                {getStarRating(
                                  product.customRating?.rating || 4.5
                                )}
                              </div>
                              <span className="text-gray-700 font-bold text-base sm:text-lg">
                                {product.customRating?.rating?.toFixed(1) ||
                                  "4.5"}
                              </span>
                              <span className="text-gray-600 text-xs sm:text-sm">
                                ({product.customRating?.reviewCount || 29}{" "}
                                reviews)
                              </span>
                            </div>

                            {/* Product Title */}
                            <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 leading-tight text-gray-900">
                              {product.title}
                            </h2>

                            {/* Features from API */}
                            <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                              {product.features?.feature &&
                              product.features.feature.length > 0 ? (
                                product.features.feature
                                  .slice(0, 4)
                                  .map((feature, featureIndex) => (
                                    <div
                                      key={featureIndex}
                                      className="flex items-start"
                                    >
                                      <span className="text-gray-800 text-xs sm:text-sm leading-relaxed">
                                        • {truncateFeature(feature, 47)}
                                      </span>
                                    </div>
                                  ))
                              ) : (
                                // Fallback features if none available
                                <>
                                  <div className="flex items-start">
                                    <span className="text-gray-800 text-xs sm:text-sm">
                                      • 16-inch carbon steel frame ideal for
                                      teens and adults under 5'2"
                                    </span>
                                  </div>
                                  <div className="flex items-start">
                                    <span className="text-gray-800 text-xs sm:text-sm">
                                      • Dual suspension system with 4 shock
                                      absorbers and large shock-absorbing seat
                                    </span>
                                  </div>
                                  <div className="flex items-start">
                                    <span className="text-gray-800 text-xs sm:text-sm">
                                      • 16" X 4" fat tires suitable for
                                      mountains, sand, snow, and grass
                                    </span>
                                  </div>
                                  <div className="flex items-start">
                                    <span className="text-gray-800 text-xs sm:text-sm">
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
                                className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium mt-2 inline-flex items-center gap-1 hover:gap-2 transition-all"
                              >
                                Read Full Details Specification
                                <span>→</span>
                              </Link>
                            )}
                          </div>

                          {/* Right Section - Price and Action */}
                          <div className="flex flex-col items-center md:items-end justify-between w-full md:w-44 lg:w-48 mt-3 md:mt-0 border-t md:border-t-0 pt-3 md:pt-0">
                            <div className="text-center md:text-right w-full">
                              {/* Save Percentage Box */}
                              <div className="text-lg sm:text-xl md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb- text-center">
                                Save {product.discount?.percentage || 36}%
                              </div>

                              {/* Check Price Button */}
                              <a
                                href={product.affiliateUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-105 text-center text-base sm:text-lg md:text-xl mt-2"
                              >
                                Check Price
                              </a>

                              {/* Amazon Logo and Prime Delivery */}
                              <div className="flex flex-col items-center my-3 sm:my-4">
                                <img
                                  src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
                                  alt="Amazon"
                                  className="h-5 sm:h-6 mb-1"
                                />
                                <span className="text-xs text-gray-500">
                                  Prime Delivery
                                </span>
                              </div>

                              {/* Compare Checkbox */}
                              <div className="flex items-center justify-center mt-4 sm:mt-6">
                                <input
                                  type="checkbox"
                                  id={`compare-${product._id}`}
                                  className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
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
                                  className="ml-2 text-xs sm:text-sm text-gray-700 font-medium cursor-pointer"
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
              <div className="flex justify-center items-center mt-6 md:mt-10 gap-1 sm:gap-2 flex-wrap">
                <button
                  onClick={() => handlePageChange(pageParam - 1)}
                  disabled={pageParam === 1}
                  className={`px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base font-medium transition-all ${
                    pageParam === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-blue-50 hover:border-blue-500 text-gray-700"
                  }`}
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base font-medium transition-all ${
                      pageParam === i + 1
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent shadow-md"
                        : "bg-white hover:bg-blue-50 hover:border-blue-500 text-gray-700"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(pageParam + 1)}
                  disabled={pageParam === totalPages}
                  className={`px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base font-medium transition-all ${
                    pageParam === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-blue-50 hover:border-blue-500 text-gray-700"
                  }`}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            /* No Products Found Message */
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 md:p-12 text-center">
              <div className="max-w-md mx-auto">
                <svg
                  className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4"
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
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                  No Products Found
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                  We couldn't find any products in this category. Please check
                  back later or browse other categories.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm sm:text-base rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                >
                  Browse Other Categories
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Responsive positioning */}
        <div className="w-full lg:w-80 lg:sticky lg:top-24 lg:self-start">
          <ProductPageSidebar
            mainCategory={mainCategory}
            currentSubCategory={subCategory}
          />
        </div>
      </div>

      <CompareBox />
      <CompareModal />
      <CouponPopup
        show={showCoupon}
        onClose={handleCloseCoupon}
        couponProduct={couponProduct}
      />
    </div>
    <Footer />
    </>
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
