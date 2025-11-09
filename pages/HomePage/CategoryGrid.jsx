"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const CategoryGrid = () => {
  const categories = [
    { name: "Baby", image: "/category_img/baby.png" },
    { name: "Beauty", image: "/category_img/beauty.png" },
    { name: "Fashion", image: "/category_img/fashion.png" },
    { name: "Fitness", image: "/category_img/fitness.png" },
    { name: "Tech", image: "/category_img/tech.png" },
    { name: "Garden", image: "/category_img/garden.png" },
    { name: "Gifts", image: "/category_img/gift.png" },
    { name: "Home", image: "/category_img/home.png" },
    { name: "Health", image: "/category_img/health.png" },
    { name: "Money", image: "/category_img/money.png" },
    { name: "Office", image: "/category_img/office.png" },
    { name: "Outdoor", image: "/category_img/outdoor.png" },
    { name: "Pets", image: "/category_img/pets.png" },
    { name: "Sports", image: "/category_img/sports.png" },
    { name: "Tools", image: "/category_img/tools.png" },
    { name: "Food", image: "/category_img/food.png" },
  ];

  const [visibleCount, setVisibleCount] = useState(12);
  const [showAll, setShowAll] = useState(false);
  const router = useRouter();

  // Calculate visible categories based on screen size
  useEffect(() => {
    const calculateVisibleCount = () => {
      const width = window.innerWidth;
      if (width < 768) {
        return 5; // 4 + "More"
      } else if (width >= 768 && width < 1024) {
        return 9;
      } else {
        return 12;
      }
    };

    const handleResize = () => {
      if (!showAll) {
        setVisibleCount(calculateVisibleCount());
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [showAll]);

  const toggleShowAll = () => {
    setShowAll(!showAll);
    if (showAll) {
      const width = window.innerWidth;
      if (width < 768) setVisibleCount(5);
      else if (width >= 768 && width < 1024) setVisibleCount(9);
      else setVisibleCount(12);
    } else {
      setVisibleCount(categories.length);
    }
  };

  const getCategoryImage = (category) =>
    category.image ? category.image : "/category_img/placeholder.png";

  const displayCategories = categories.slice(0, visibleCount);
  const hasMoreCategories = categories.length > visibleCount;

  return (
    <div className="">
      <div className="max-w-7xl mx-auto px-1 py-2">
        {/* Category Grid */}
        <div className="flex flex-wrap justify-center gap-6">
          {displayCategories.map((category, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center cursor-pointer group"
              onClick={() => router.push("/category")}
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
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}

                {/* Fallback Initial */}
                <div
                  className={`w-full h-full rounded-full items-center justify-center text-white font-bold text-sm ${
                    category.image ? "hidden" : "flex"
                  }`}
                  style={{
                    backgroundColor: "#078c8c",
                  }}
                >
                  {category.name.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Category Name */}
              <span className="text-[13px] md:text-sm text-[#0782F5] font-medium leading-tight group-hover:text-[#FFBC03] transition-colors max-w-[80px] break-words">
                {category.name}
              </span>
            </div>
          ))}

          {/* More Button */}
          {hasMoreCategories && !showAll && (
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

          {/* Show Less Button */}
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
