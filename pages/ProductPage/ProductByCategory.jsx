"use client";
import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import ProductPageSidebar from "./ProductPageSidebar";

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

  useEffect(() => {
    if (!mainCategory || !subCategory) {
      setLoading(false);
      return;
    }

    async function fetchProducts() {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.bestbuyersview.com/api';
        const res = await fetch(
          `${apiUrl}/products?mainCategory=${mainCategory}&subCategory=${subCategory}&page=${pageParam}&limit=10`
        );
        const data = await res.json();

        if (data.success && data.data) {
          setProducts(data.data.products || []);
          setTotalPages(data.data.pagination?.pages || 1);
          
          const initialImages = {};
          data.data.products.forEach(product => {
            const mainImage = product.images?.find(img => img.variant === "MAIN")?.url || product.images?.[0]?.url;
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
      <div className="flex items-center text-yellow-500 text-lg">
        {"★".repeat(fullStars)}
        {hasHalfStar && "★"}
        {"☆".repeat(emptyStars)}
      </div>
    );
  };

  const handleThumbnailHover = (productId, imageUrl) => {
    setActiveProductImages(prev => ({
      ...prev,
      [productId]: imageUrl
    }));
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
            const mainImage = product.images?.find(img => img.variant === "MAIN")?.url || product.images?.[0]?.url;
            const thumbImages = product.images?.filter(img => img.variant === "SUB") || product.images?.slice(1, 5) || [];
            const currentImage = activeProductImages[product._id] || mainImage;

            return (
              <div
                key={product._id}
                className="border border-gray-300 rounded-lg shadow-sm bg-white overflow-hidden"
              >
                {/* Top Banner */}
                <div className=" text-white py-2 px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold">#ELECTRIC</span>
                      <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Save {product.discount?.percentage || 36}%
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-yellow-500 text-lg">
                        {getStarRating(product.customRating?.rating || 4.5)}
                      </div>
                      <span className="text-white text-sm">
                        ({product.customRating?.reviewCount || 29} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Product Content */}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Left Section - Image Gallery */}
                    <div className="flex flex-col items-center md:w-48">
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
                          {thumbImages.slice(0, 4).map((thumb, thumbIndex) => (
                            <div
                              key={thumbIndex}
                              className="relative w-10 h-10 border border-gray-300 rounded cursor-pointer hover:border-blue-500 transition-colors"
                              onMouseEnter={() => handleThumbnailHover(product._id, thumb.url)}
                            >
                              <Image
                                src={thumb.url}
                                alt={`${product.title} thumbnail ${thumbIndex + 1}`}
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
                      {/* Product Title */}
                      <h2 className="text-xl font-bold mb-3 leading-tight text-gray-900">
                        {product.title}
                      </h2>

                      {/* Specifications */}
                      <div className="space-y-2 mb-4">
                        {product.specifications?.slice(0, 4).map((spec, specIndex) => (
                          <div key={specIndex} className="flex items-start">
                            <span className="text-gray-800 text-sm">
                              <strong>{spec.key}:</strong> {spec.value}
                            </span>
                          </div>
                        ))}
                        {/* Fallback specs if none available */}
                        {(!product.specifications || product.specifications.length === 0) && (
                          <>
                            <div className="flex items-start">
                              <span className="text-gray-800 text-sm">
                                <strong>Wheel Size:</strong> 16 Inches
                              </span>
                            </div>
                            <div className="flex items-start">
                              <span className="text-gray-800 text-sm">
                                <strong>Frame:</strong> Carbon Steel
                              </span>
                            </div>
                            <div className="flex items-start">
                              <span className="text-gray-800 text-sm">
                                <strong>Features:</strong> Dual suspension system with 4 shock absorbers
                              </span>
                            </div>
                            <div className="flex items-start">
                              <span className="text-gray-800 text-sm">
                                <strong>Tires:</strong> 16" X 4" fat tires suitable for mountains, sand, snow, and grass
                              </span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Read More Link */}
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2">
                        Read Full Details Specification →
                      </button>
                    </div>

                    {/* Right Section - Price and Action */}
                    <div className="flex flex-col items-center md:items-end justify-between md:w-48">
                      {/* Save Percentage Box */}
                      <div className="text-center w-full mb-4">
                        <div className="bg-red-600 text-white px-4 py-3 rounded-lg mb-3">
                          <div className="text-2xl font-bold">Save {product.discount?.percentage || 36}%</div>
                        </div>

                        {/* Check Price Button */}
                        <a
                          href={product.affiliateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors mb-3"
                        >
                          Check Price
                        </a>

                        {/* Amazon Logo */}
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <span className="text-gray-900 font-semibold text-lg">amazon</span>
                        </div>

                        {/* Prime Delivery */}
                        <div className="text-center mb-3">
                          <span className="text-green-600 font-bold text-sm">Prime Delivery</span>
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

export default function ProductByCategory() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen text-gray-500">Loading...</div>}>
      <ProductByCategoryContent />
    </Suspense>
  );
}