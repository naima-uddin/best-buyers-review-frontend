"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function RelatedProducts({
  mainCategory,
  subCategory,
  currentProductId,
}) {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  const totalToShow = 8;
  const visibleCards = 6;

  useEffect(() => {
    if (!mainCategory || !subCategory) return;

    async function fetchRelated() {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL ||
          "https://api.bestbuyersview.com/api";

        const res = await fetch(
          `${apiUrl}/products?mainCategory=${encodeURIComponent(
            mainCategory
          )}&subCategory=${encodeURIComponent(subCategory)}`
        );
        const data = await res.json();

        if (data.success && data.data?.products) {
          const filtered = data.data.products.filter(
            (p) => p._id !== currentProductId
          );
          setRelatedProducts(filtered.slice(0, totalToShow));
        } else {
          setRelatedProducts([]);
        }
      } catch (err) {
        console.error("Error fetching related products:", err);
      }
    }

    fetchRelated();
  }, [mainCategory, subCategory, currentProductId]);

  // Duplicate list for smooth looping effect
  const displayedProducts = [...relatedProducts, ...relatedProducts];

  const handleNext = () => {
    if (!sliderRef.current) return;
    const cardWidth = sliderRef.current.scrollWidth / displayedProducts.length;
    const newIndex = (currentIndex + 1) % relatedProducts.length;
    setCurrentIndex(newIndex);
    sliderRef.current.scrollTo({
      left: cardWidth * newIndex,
      behavior: "smooth",
    });
  };

  const handlePrev = () => {
    if (!sliderRef.current) return;
    const cardWidth = sliderRef.current.scrollWidth / displayedProducts.length;
    const newIndex =
      currentIndex === 0 ? relatedProducts.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    sliderRef.current.scrollTo({
      left: cardWidth * newIndex,
      behavior: "smooth",
    });
  };

  if (relatedProducts.length === 0) return null;

  return (
    <div className="mt-12 relative">
      <h2 className="text-2xl font-semibold mb-3 text-gray-800 text-center">
        Related Products
      </h2>

      <div className="relative group">
        {/* Scrollable Row */}
        <div
          ref={sliderRef}
          className="flex overflow-hidden scroll-smooth transition-all"
          style={{ scrollBehavior: "smooth" }}
        >
          {displayedProducts.map((product, index) => {
            const mainImage =
              product.images?.find((img) => img.variant === "MAIN")?.url ||
              product.images?.[0]?.url ||
              "/placeholder-image.jpg";

            return (
              <div
                key={`${product._id}-${index}`}
                className="min-w-[16.66%] p-3"
              >
                <Link
                  href={`/category/${mainCategory}/${subCategory}/${product._id}`}
                  className="block bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="relative w-full h-48">
                    <Image
                      src={mainImage}
                      alt={product.title}
                      fill
                      className="object-contain p-3"
                    />
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
                      {product.title}
                    </h3>
                    {product.discount?.percentage && (
                      <p className="text-blue-600 font-semibold mt-1 text-sm">
                        Save {product.discount.percentage}%
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Prev Button */}
        <button
          onClick={handlePrev}
          className="absolute top-1/2 -translate-y-1/2 left-0 bg-white border rounded-full shadow-md p-2 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition"
        >
          <ChevronLeft className="h-5 w-5 text-gray-700" />
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="absolute top-1/2 -translate-y-1/2 right-0 bg-white border rounded-full shadow-md p-2 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition"
        >
          <ChevronRight className="h-5 w-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
}
