"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";

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

  const [visibleCount, setVisibleCount] = useState(categories.length);
  const [showAll, setShowAll] = useState(false);

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

    // Set initial value
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [showAll]);

  const toggleShowAll = () => {
    setShowAll(!showAll);
    if (!showAll) {
      setVisibleCount(categories.length);
    } else {
      // Recalculate based on current screen size when hiding
      const width = window.innerWidth;
      if (width < 768) {
        setVisibleCount(4);
      } else if (width >= 768 && width < 1024) {
        setVisibleCount(8);
      } else {
        setVisibleCount(10);
      }
    }
  };

  const displayCategories = categories.slice(0, visibleCount);
  const hasMoreCategories = categories.length > visibleCount;

  return (
    <div className="shadow-lg">
      <div className="max-w-7xl mx-auto px-1  py-2">
        {/* Category Grid */}
        <div className="flex flex-wrap justify-center gap-6">
          {displayCategories.map((category, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center cursor-pointer group"
            >
              {/* Circular Image */}
              <div className="w-9 h-9 md:w-14 md:h-14 rounded-full bg-gray-100 flex items-center justify-center mb-2 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={70}
                  height={70}
                  className="object-contain rounded-full p-2"
                />
              </div>

              {/* Category Name */}
              <span className="text-[13px] md:text-sm text-[#078c8c] font-medium leading-tight group-hover:text-[#FFBC03 ] transition-colors">
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
                <span className="text-lg md:text-xl font-bold text-gray-600">+{categories.length - visibleCount}</span>
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
                <span className="text-lg md:text-xl font-bold text-gray-600">−</span>
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