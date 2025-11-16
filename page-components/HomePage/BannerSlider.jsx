"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BannerSlider() {
  const images = ["/bannerImg/0.jpg","/bannerImg/1.jpg", "/bannerImg/2.jpg", "/bannerImg/3.jpg"];

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, [isPaused, images.length]);

  const goToPrevious = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const goToSlide = (slideIndex) => {
    setIndex(slideIndex);
  };

  return (
    <div
      className="relative max-w-7xl mx-auto sm:h-[500px] h-[280px] rounded-2xl overflow-hidden mt-6 mb-4 shadow-2xl group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Images */}
      {images.map((src, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            i === index ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        >
          <Image
            src={src}
            alt={`Banner ${i + 1}`}
            fill
            className="object-cover"
            priority={i === 0}
          />
          {/* Gradient Overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 sm:p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 sm:p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`transition-all duration-300 rounded-full ${
              i === index
                ? "w-8 h-2 bg-white"
                : "w-2 h-2 bg-white/60 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
