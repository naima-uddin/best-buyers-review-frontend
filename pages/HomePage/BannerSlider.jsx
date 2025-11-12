"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function BannerSlider() {
  const images = ["/BannerImg/1.jpg", "/BannerImg/2.jpg"];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000); // 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative max-w-7xl mx-auto sm:h-[400px] h-[200px] rounded-xl overflow-hidden mt-4">
      {images.map((src, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src}
            alt={`Banner ${i + 1}`}
            fill
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}
    </div>
  );
}
