"use client";
import { useState, useEffect } from "react";
import { useCategories } from "@/context/CategoryContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RelatedSidebar({ mainCategory, currentSubCategory }) {
  const { categories } = useCategories();
  const router = useRouter();
  const [visibleCount, setVisibleCount] = useState(7);

  // Find current main category
  const mainCat = categories?.find((cat) => cat._id === mainCategory);
  if (!mainCat) return null;

  const subcategories = mainCat.children || [];
  const hasMore = subcategories.length > visibleCount;

  // Reset visible count when main category changes
  useEffect(() => {
    setVisibleCount(7);
  }, [mainCategory]);

  return (
    <aside className="w-full md:w-72 lg:w-80 border-l border-gray-200 pl-6 mt-10 md:mt-0">
      <div className="sticky top-20 space-y-6">
        {/* Related Categories */}
        <div className="border border-gray-200 rounded-xl shadow-sm p-4 bg-white">
          <h3 className="text-lg font-semibold mb-3">Related Categories</h3>

          <div className="space-y-2">
            {subcategories.slice(0, visibleCount).map((sub) => (
              <button
                key={sub._id}
                onClick={() =>
                  router.push(
                    `/category/${mainCat._id}/${
                      sub._id
                    }?mainName=${encodeURIComponent(
                      mainCat.name
                    )}&subName=${encodeURIComponent(sub.name)}`
                  )
                }
                className={`block w-full text-left px-3 py-2 rounded-lg transition ${
                  sub._id === currentSubCategory
                    ? "bg-blue-500 text-white font-semibold"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>

          {/* Show more / less button */}
          {subcategories.length > 7 && (
            <button
              onClick={() =>
                setVisibleCount(visibleCount === 7 ? subcategories.length : 7)
              }
              className="text-blue-600 mt-3 text-sm hover:underline"
            >
              {visibleCount === 7 ? "Show more" : "Show less"}
            </button>
          )}
        </div>

        {/* How We Rank Section */}
        <div className="border border-gray-200 rounded-xl shadow-sm p-6 bg-white">
          <h3 className="text-xl font-bold mb-4 text-gray-900">How We Rank</h3>
          
          <div className="space-y-6">
            {/* Expert Analysis */}
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Expert Analysis</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Our team of experts highlights useful information so you can easily compare products to find the one that's right for you.
                </p>
              </div>
            </div>

            {/* Award-Winning Tech */}
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Award-Winning Tech</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Our technology analyzes thousands of purchase trends to bring you the top product recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Trust Our Reviews Section */}
        <div className="border border-gray-200 rounded-xl shadow-sm p-6 bg-white">
          <h3 className="text-xl font-bold mb-4 text-gray-900">Why Trust Our Reviews?</h3>
          
          <div className="space-y-4">
            {/* Shoppers Count */}
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-gray-900 mb-1">1,000,000+</div>
              <p className="text-sm text-gray-600">
                shoppers use Buyer's Guide every week to find the best products and services online.
              </p>
            </div>

            {/* Learn More Link */}
            <div className="text-center mb-4">
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium underline">
                Learn more about our rankings
              </button>
            </div>

            {/* Reliable, Safe & Secure */}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <h4 className="font-semibold text-gray-900 mb-1">Reliable, Safe & Secure</h4>
              <p className="text-sm text-gray-600">
                Helping millions of users make smarter purchases online.
              </p>
            </div>

            {/* BSB Logo */}
            <div className="text-center pt-2">
              <div className ="flex gap-1 justify-center items-center">
                <Image
                  src="/bsb.webp"
                  width={120}
                  height={170}
                  alt="Logo"
                  className="transition-transform duration-300 group-hover:scale-105"
                                />
                <Image
                  src="/ssl.webp"
                  width={120}
                  height={170}
                  alt="Logo"
                  className="transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}