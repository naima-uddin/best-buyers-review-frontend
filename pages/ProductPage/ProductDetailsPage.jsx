"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
  Truck,
  Shield,
  RotateCcw,
  Award,
  Crown,
  Users,
} from "lucide-react";
import Accordion from "@/ui/Accordion";
import RelatedProducts from "./RelatedProducts";
import ProductInfoTabs from "./ProductInfoTabs";

function ProductDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const { mainCategory, subCategory, productId } = params;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    async function fetchProductDetails() {
      try {
        setLoading(true);
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL ||
          "https://api.bestbuyersview.com/api";

        // Fetch ALL products first to find the specific one
        const res = await fetch(
          `${apiUrl}/products?mainCategory=${mainCategory}&subCategory=${subCategory}`
        );
        const data = await res.json();

        if (data.success && data.data) {
          // Find the specific product by ID
          const foundProduct = data.data.products?.find(
            (p) => p._id === productId
          );

          if (foundProduct) {
            setProduct(foundProduct);

            // Get related products (excluding current product)
            const filteredRelated =
              data.data.products?.filter((p) => p._id !== productId) || [];
            setRelatedProducts(filteredRelated.slice(0, 6));
          } else {
            setProduct(null);
          }
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    if (productId && mainCategory && subCategory) {
      fetchProductDetails();
    }
  }, [productId, mainCategory, subCategory]);

  const nextImage = () => {
    if (product?.images?.length) {
      setSelectedImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product?.images?.length) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product not found
          </h2>
          <Link
            href={`/category/${mainCategory}/${subCategory}`}
            className="text-blue-600 hover:text-blue-700"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const mainImage =
    product.images?.find((img) => img.variant === "MAIN")?.url ||
    product.images?.[0]?.url;
  const currentImage = product.images?.[selectedImageIndex]?.url || mainImage;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-4">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href={`/category/${mainCategory}`}
                className="hover:text-blue-600 transition-colors"
              >
                {product.mainCategory?.name || mainCategory}
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href={`/category/${mainCategory}/${subCategory}`}
                className="hover:text-blue-600 transition-colors"
              >
                {product.subCategory?.name || subCategory}
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium truncate max-w-xs">
              {product.title}
            </li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Product Images */}
          <div className="lg:w-2/5">
            <div className="relative bg-white rounded-xl overflow-hidden shadow-md p-3 mb-2">
              <div className="flex justify-center">
                <div className="relative w-full h-80">
                  <Image
                    src={currentImage || "/placeholder-image.jpg"}
                    alt={product.title}
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
              </div>

              {product.images?.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-md transition-all border border-gray-200"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-md transition-all border border-gray-200"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images?.length > 1 && (
              <div className="flex space-x-2 justify-center mb-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-10 h-10 rounded-md overflow-hidden border transition-all ${
                      selectedImageIndex === index
                        ? "border-blue-600 ring-1 ring-blue-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={image.url}
                        alt={`${product.title} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Key Specifications */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                Key Specifications
              </h2>
              <div className="grid grid-cols-1 gap-2">
                {product.specifications?.slice(0, 6).map((spec, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0"
                  >
                    <dt className="text-xs font-medium text-gray-600">
                      {spec.key}
                    </dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {spec.value}
                    </dd>
                  </div>
                ))}
                {/* Fallback if no specifications */}
                {(!product.specifications ||
                  product.specifications.length === 0) && (
                  <>
                    <div className="flex justify-between items-center py-1 border-b border-gray-100">
                      <dt className="text-xs font-medium text-gray-600">
                        Brand
                      </dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {product.brand}
                      </dd>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-gray-100">
                      <dt className="text-xs font-medium text-gray-600">
                        Category
                      </dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {product.subCategory?.name}
                      </dd>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Amazon Button */}
            <div className="mb-4 mt-8">
              <div className="bg-gray-800 text-white rounded-md p-2 mb-2 text-center">
                <p className="text-xs font-medium mb-1">
                  Reviewed by {product.customRating?.reviewCount || 29} people
                  this week!
                </p>
                <div className="flex items-center justify-center">
                  {getStarRating(product.customRating?.rating || 4.5)}
                </div>
              </div>

              <a
                href={product.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-4 rounded-md mb-2 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
              >
                <span className="text-base">Buy at Amazon</span>
              </a>

              <div className="flex items-center justify-center mt-4">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
                  alt="Amazon"
                  className="h-4 mr-1"
                />
                <span className="text-xs text-gray-500">
                  Prime Delivery • 30-Day Returns
                </span>
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="lg:w-3/5 bg-white rounded-xl shadow-md p-4">
            <div className="mb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                {/* Brand and Rating Info */}
                <div className="flex flex-col gap-2">
                  <div className="inline-flex">
                    <span className="text-blue-700 font-semibold bg-blue-100 px-3 py-1.5 rounded-full text-xs border border-blue-200 shadow-sm">
                      {product.brand}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 shadow-sm">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-gray-900 text-sm ml-1">
                        {product.customRating?.rating?.toFixed(1) || "4.5"}
                      </span>
                    </div>
                    <div className="h-3 w-px bg-amber-200"></div>
                    <span className="text-gray-600 text-xs font-medium">
                      {product.customRating?.reviewCount || 29} reviews
                    </span>
                  </div>
                </div>

                {/* Buy at Amazon Button */}
                <div className="w-full sm:w-auto">
                  <a
                    href={product.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full border border-amber-400 hover:bg-amber-500 text-gray-900 font-bold py-2 px-1 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center group"
                  >
                    <span className="text-base mr-2">Buy at Amazon</span>
                    <svg
                      className="w-4 w-4 group-hover:translate-x-0.5 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      ></path>
                    </svg>
                  </a>

                  <div className="flex items-center justify-center mt-2">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
                      alt="Amazon"
                      className="h-4 mr-1.5"
                    />
                    <span className="text-xs text-gray-500 font-medium">
                      Prime Delivery • 30-Day Returns
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                {product.title}
              </h1>

              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                {product.description}
              </p>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="flex flex-col items-center p-1.5 bg-gray-50 rounded-md">
                <Truck className="h-4 w-4 text-blue-500 mb-1" />
                <span className="text-xs text-gray-600">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center p-1.5 bg-gray-50 rounded-md">
                <Shield className="h-4 w-4 text-blue-500 mb-1" />
                <span className="text-xs text-gray-600">2-Year Warranty</span>
              </div>
              <div className="flex flex-col items-center p-1.5 bg-gray-50 rounded-md">
                <RotateCcw className="h-4 w-4 text-blue-500 mb-1" />
                <span className="text-xs text-gray-600">30-Day Returns</span>
              </div>
            </div>

            {/* Features */}
            <div className="mb-5">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                <Award className="h-4 w-4 mr-2 text-blue-500" />
                Key Features
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {product.features?.feature
                  ?.slice(0, 5)
                  .map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-2 bg-blue-50 p-2 rounded-md"
                    >
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                {/* Fallback features */}
                {(!product.features?.feature ||
                  product.features.feature.length === 0) && (
                  <>
                    <div className="flex items-start space-x-2 bg-blue-50 p-2 rounded-md">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">
                        High-quality materials and construction
                      </span>
                    </div>
                    <div className="flex items-start space-x-2 bg-blue-50 p-2 rounded-md">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">
                        Excellent performance and reliability
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <ProductInfoTabs product={product} />

        <RelatedProducts
          mainCategory={mainCategory}
          subCategory={subCategory}
          currentProductId={productId}
        />

        {/* Customer Reviews Section */}
        {product.customReviews && product.customReviews.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-5">
              <Users className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">
                Customer Reviews
              </h2>
            </div>

            <div className="space-y-5">
              {product.customReviews.map((review, index) => (
                <div
                  key={review._id || index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="flex mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < (review.rating || 5)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-gray-900">
                        {review.title || "Great Product"}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {review.date || "Recently"}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-3 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">
                    {review.reviewText || review.text}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium text-sm mr-2">
                        {(review.username || "User").charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {review.username || "Customer"}
                      </span>
                    </div>

                    {review.verified && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                        <Check className="h-3 w-3 mr-1" />
                        Verified Purchase
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Common Questions Section */}
        {product.commonQuestions && product.commonQuestions.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-6">
              <svg
                className="h-6 w-6 text-blue-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-gray-900">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-2">
              {product.commonQuestions.map((faq, index) => (
                <Accordion
                  key={faq._id}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductDetails() {
  return <ProductDetailsContent />;
}
