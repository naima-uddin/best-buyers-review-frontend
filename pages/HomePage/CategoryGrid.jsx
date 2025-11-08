"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(12);
  const [showAll, setShowAll] = useState(false);
  const router = useRouter();

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();

        // Extract only level 1 categories (main categories)
        const mainCategories = data.filter((category) => category.level === 1);
        setCategories(mainCategories);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Calculate visible categories based on screen size
  useEffect(() => {
    const calculateVisibleCount = () => {
      const width = window.innerWidth;

      if (width < 768) {
        // Mobile: show 4 categories + "More"
        return 5;
      } else if (width >= 768 && width < 1024) {
        // Tablet: show 8 categories + "More"
        return 9;
      } else {
        // Desktop: show 10 categories + "More"
        return 12;
      }
    };

    const handleResize = () => {
      if (!showAll) {
        setVisibleCount(calculateVisibleCount());
      }
    };

    // Set initial value only if we have categories
    if (categories.length > 0 && !showAll) {
      handleResize();
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [showAll, categories.length]);

  const toggleShowAll = () => {
    setShowAll(!showAll);
    if (!showAll) {
      setVisibleCount(categories.length);
    } else {
      // Recalculate based on current screen size when hiding
      const width = window.innerWidth;
      if (width < 768) {
        setVisibleCount(5);
      } else if (width >= 768 && width < 1024) {
        setVisibleCount(9);
      } else {
        setVisibleCount(12);
      }
    }
  };

  // Default placeholder image for categories without images
  const getCategoryImage = (category) => {
    if (category.image) {
      return category.image;
    }

    // Return a placeholder based on category name or use a default
    return "/category_img/placeholder.png"; // You might want to create this
  };

  const displayCategories = categories.slice(0, visibleCount);
  const hasMoreCategories = categories.length > visibleCount;

  // Loading state
  if (loading) {
    return (
      <div className="">
        <div className="max-w-7xl mx-auto px-1 py-2">
          <div className="flex flex-wrap justify-center gap-6">
            {/* Loading skeletons */}
            {[...Array(12)].map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <div className="w-9 h-9 md:w-14 md:h-14 rounded-full bg-gray-200 animate-pulse mb-2 shadow-sm border border-gray-200"></div>
                <div className="w-12 h-3 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="shadow-lg">
        <div className="max-w-7xl mx-auto px-1 py-2">
          <div className="text-center text-red-600 py-8">
            <p>Error loading categories: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No categories state
  if (categories.length === 0) {
    return (
      <div className="shadow-lg">
        <div className="max-w-7xl mx-auto px-1 py-2">
          <div className="text-center text-gray-500 py-8">
            <p>No categories found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="max-w-7xl mx-auto px-1 py-2">
        {/* Category Grid */}
        <div className="flex flex-wrap justify-center gap-6">
          {displayCategories.map((category) => (
            <div
              key={category._id}
              className="flex flex-col items-center text-center cursor-pointer group"
              onClick={() => router.push(`/category/${category._id}`)}
            >
              {/* Circular Image */}
              <div className="w-9 h-9 md:w-14 md:h-14 rounded-full bg-gray-100 flex items-center justify-center mb-2 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                {category.image ? (
                  <Image
                    src={getCategoryImage(category)}
                    alt={category.name}
                    width={70}
                    height={70}
                    className="object-contain rounded-full p-2"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "block";
                    }}
                  />
                ) : null}
                {/* Fallback initial */}
                <div
                  className={`w-full h-full rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    !category.image ? "block" : "hidden"
                  }`}
                  style={{
                    backgroundColor: "#078c8c",
                  }}
                >
                  {category.name.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Category Name */}
              <span className="text-[13px] md:text-sm text-[#078c8c] font-medium leading-tight group-hover:text-[#FFBC03] transition-colors max-w-[80px] break-words">
                {category.name}
              </span>
            </div>
          ))}

          {/* More Button */}
          {hasMoreCategories && (
            <div
              className="flex flex-col items-center text-center cursor-pointer group"
              onClick={toggleShowAll}
            >
              <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 hover:bg-gray-200">
                <span className="text-lg md:text-xl font-bold text-gray-600">
                  +{categories.length - visibleCount}
                </span>
              </div>
              <span className="text-[13px] md:text-sm text-gray-700 font-medium leading-tight group-hover:text-blue-600 transition-colors">
                More →
              </span>
            </div>
          )}

          {/* Show Less Button when all categories are shown */}
          {showAll && (
            <div
              className="flex flex-col items-center text-center cursor-pointer group"
              onClick={toggleShowAll}
            >
              <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 hover:bg-gray-200">
                <span className="text-lg md:text-xl font-bold text-gray-600">
                  −
                </span>
              </div>
              <span className="text-[13px] md:text-sm text-gray-700 font-medium leading-tight group-hover:text-blue-600 transition-colors">
                Show Less
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid;
