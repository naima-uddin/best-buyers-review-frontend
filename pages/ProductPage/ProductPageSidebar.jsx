"use client";
import { useState, useEffect } from "react";
import { useCategories } from "@/context/CategoryContext";
import { useRouter } from "next/navigation";

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

        {/* Info Section */}
        <div className="border border-gray-200 rounded-xl shadow-sm p-4">
          <h4 className="font-semibold mb-2 text-gray-800">How We Rank</h4>
          <p className="text-sm text-gray-600">
            Our team analyzes thousands of reviews to recommend the top
            products.
          </p>
        </div>

        <div className="border border-gray-200 rounded-xl shadow-sm p-4">
          <h4 className="font-semibold mb-2 text-gray-800">Why Trust Us?</h4>
          <p className="text-sm text-gray-600">
            Over 1,000,000+ shoppers rely on our guides weekly.
          </p>
        </div>
      </div>
    </aside>
  );
}
