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
      if (width < 768) setVisibleCount(4);
      else if (width >= 768 && width < 1024) setVisibleCount(7);
      else setVisibleCount(10);
    } else {
      setVisibleCount(categories.length);
    }
  };

  const getCategoryImage = (category) =>
    category.image ? category.image : "/category_img/placeholder.png";

  const displayCategories = categories.slice(0, visibleCount);
  const hasMoreCategories = categories.length > visibleCount;

  return (
    <div className="my-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Shop by Category
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Explore our wide range of products
          </p>
        </div>

        {/* Category Grid */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {displayCategories.map((category, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center cursor-pointer group"
              onClick={() =>
                router.push(
                  `/category?scrollTo=${encodeURIComponent(category.name)}`
                )
              }
            >
              {/* Circular Image with modern design */}
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center mb-3 shadow-md border-2 border-white group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                {/* Decorative ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

                {category.image ? (
                  <Image
                    src={getCategoryImage(category)}
                    alt={category.name}
                    width={70}
                    height={70}
                    className="object-contain rounded-full p-2 relative z-10"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}

                {/* Fallback Initial */}
                <div
                  className={`w-full h-full rounded-full items-center justify-center text-white font-bold text-lg ${
                    category.image ? "hidden" : "flex"
                  } bg-gradient-to-br from-blue-500 to-purple-500`}
                >
                  {category.name.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Category Name */}
              <span className="text-sm md:text-base text-gray-700 font-semibold leading-tight group-hover:text-purple-600 transition-colors max-w-[90px] break-words">
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
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center mb-3 shadow-md border-2 border-white group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <span className="text-xl md:text-2xl font-bold text-orange-600 relative z-10">
                  +{categories.length - visibleCount}
                </span>
              </div>
              <span className="text-sm md:text-base text-gray-700 font-semibold leading-tight group-hover:text-orange-600 transition-colors">
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
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-gray-50 to-slate-50 flex items-center justify-center mb-3 shadow-md border-2 border-white group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-400 to-slate-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <span className="text-xl md:text-2xl font-bold text-gray-600 relative z-10">
                  −
                </span>
              </div>
              <span className="text-sm md:text-base text-gray-700 font-semibold leading-tight group-hover:text-gray-600 transition-colors">
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
