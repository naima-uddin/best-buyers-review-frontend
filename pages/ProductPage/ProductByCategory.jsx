"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import ProductPageSidebar from "./ProductPageSidebar";

export default function ProductByCategory() {
  const { mainCategory, subCategory } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const mainName = searchParams.get("mainName");
  const subName = searchParams.get("subName");
  const pageParam = parseInt(searchParams.get("page")) || 1;

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products?mainCategory=${mainCategory}&subCategory=${subCategory}&page=${pageParam}&limit=10`
        );
        const data = await res.json();

        if (data.success && data.data) {
          setProducts(data.data.products || []);
          setTotalPages(data.data.pagination?.pages || 1);
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
  }, [mainCategory, subCategory, pageParam]);

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
      <div className="flex items-center">
        {"★".repeat(fullStars)}
        {hasHalfStar && "★"}
        {"☆".repeat(emptyStars)}
      </div>
    );
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading products...
      </div>
    );

  if (!loading && products.length === 0)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        No products found.
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold mb-2">
          Best {subName} ({mainName})
        </h1>
        <p className="text-gray-600">
          Updated November 2025 • Top-rated {subName} selected by experts.
        </p>
      </div>

      {/* Content Layout */}
      <div className="flex flex-col md:flex-row md:items-start gap-8">
        {/* Product List */}
        <div className="flex-1 space-y-6">
          {products.map((product, index) => {
            const mainImage =
              product.images?.find((img) => img.variant === "MAIN")?.url ||
              product.images?.[0]?.url;
            const thumbImages =
              product.images?.filter((img) => img.variant === "SUB") ||
              product.images?.slice(1, 5) ||
              [];
            const currentImage =
              hoveredProduct === product._id && thumbImages.length > 0
                ? thumbImages[0].url
                : mainImage;

            return (
              <div
                key={product._id}
                className="border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all bg-white"
              >
                <div className="flex flex-col md:flex-row p-6">
                  {/* Left Section - Rank and Rating */}
                  <div className="flex flex-col items-center mb-4 md:mb-0 md:mr-6 md:w-20">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {index + 1 + (pageParam - 1) * 10}
                    </div>
                    {product.customRating && (
                      <div className="text-center">
                        <div className="flex flex-col items-center mb-1">
                          <span className="text-2xl font-bold text-black leading-tight">
                            {product.customRating.rating.toFixed(1)}
                          </span>
                          <div className="text-yellow-500 text-lg leading-none">
                            {getStarRating(product.customRating.rating)}
                          </div>
                        </div>
                        <div className="text-gray-500 text-xs mt-1">
                          {product.customRating.reviewCount}+ bought in past
                          month
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Middle Section - Image and Product Info */}
                  <div className="flex-1 flex flex-col md:flex-row">
                    {/* Product Image with Thumbnails */}
                    <div
                      className="flex flex-col items-center mb-4 md:mb-0 md:mr-6"
                      onMouseEnter={() => setHoveredProduct(product._id)}
                      onMouseLeave={() => setHoveredProduct(null)}
                    >
                      <div className="relative w-48 h-48 mb-3">
                        <Image
                          src={currentImage || "/placeholder-image.jpg"}
                          alt={product.title}
                          fill
                          className="object-contain rounded-lg"
                        />
                      </div>
                      {/* Thumbnail Images */}
                      {thumbImages.length > 0 && (
                        <div className="flex gap-2">
                          {thumbImages.slice(0, 4).map((thumb, thumbIndex) => (
                            <div
                              key={thumbIndex}
                              className="relative w-12 h-12 border border-gray-200 rounded cursor-pointer hover:border-blue-500"
                              onMouseEnter={() => {
                                const newImages = [...thumbImages];
                                const hoverImage = newImages[thumbIndex];
                                newImages.splice(thumbIndex, 1);
                                newImages.unshift(hoverImage);
                                // You can implement image swap logic here
                              }}
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

                    {/* Product Details */}
                    <div className="flex-1">
                      {/* Product Title */}
                      <h2 className="text-xl font-bold mb-3 leading-tight">
                        {product.title}
                      </h2>

                      {/* Brand */}
                      {product.brand && (
                        <p className="text-gray-800 font-semibold mb-2 text-lg">
                          {product.brand}
                        </p>
                      )}

                      {/* Specifications */}
                      <div className="space-y-1.5 mb-4">
                        {product.specifications
                          ?.slice(0, 5)
                          .map((spec, specIndex) => (
                            <div key={specIndex} className="flex items-start">
                              <span className="text-green-600 mr-2 text-lg">
                                ✓
                              </span>
                              <span className="text-gray-800">
                                <strong>{spec.key}:</strong> {spec.value}
                              </span>
                            </div>
                          ))}
                      </div>

                      {/* Available Colors */}
                      {product.colors && product.colors.length > 0 && (
                        <p className="text-gray-600 mb-4">
                          Available in: {product.colors.length} colors
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Section - Price and Action */}
                  <div className="flex flex-col items-center md:items-end justify-between md:w-48">
                    {/* Save Percentage */}
                    {product.discount?.percentage && (
                      <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold mb-3">
                        Save {product.discount.percentage}%
                      </div>
                    )}

                    {/* Check Price Box */}
                    <div className="text-center w-full">
                      <a
                        href={product.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors mb-2"
                      >
                        Check Price
                      </a>

                      {/* Amazon Logo */}
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <span className="text-gray-900 font-semibold text-sm">
                          amazon
                        </span>
                      </div>

                      {/* Compare Checkbox */}
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          id={`compare-${product._id}`}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
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
