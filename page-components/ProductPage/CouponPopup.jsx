"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function CouponPopup({ show, onClose, couponProduct }) {
  const [activeImage, setActiveImage] = useState("");

  // 🧠 Set the main image when popup opens
  useEffect(() => {
    if (couponProduct && couponProduct.images?.length > 0) {
      const mainImg =
        couponProduct.images.find((img) => img.variant === "MAIN")?.url ||
        couponProduct.images[0].url;
      setActiveImage(mainImg);
    }
  }, [couponProduct]);

  if (!show || !couponProduct) return null;

  // 🧩 Get thumbnail images
  const thumbImages =
    couponProduct.images?.filter((img) => img.variant === "SUB") ||
    couponProduct.images?.slice(1, 5) ||
    [];

  // 🎯 Get discount percentage from product data
  const discountPercentage = couponProduct.discount?.percentage;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-2xl relative overflow-hidden animate-fadeIn">
        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white md:text-blue-600 hover:text-black text-xl font-bold"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* 🟦 Left Side - Coupon Info */}
          <div className="bg-blue-700 text-white flex flex-col justify-center items-center p-6 text-center">
            {couponProduct.boughtInPastMonth && (
              <p className="text-lg  text-[#9AE630] flex justify-center -mt-6 mb-2 drop-shadow-[0_0_6px_rgba(154,230,48,0.5)]">
                {couponProduct.boughtInPastMonth || "N/A"}+ Bought in Past Month
              </p>
            )}

            <h2 className="text-2xl font-bold mb-3">
              Best {couponProduct.subCategory?.name || "Deal"}
            </h2>
            <div className="bg-white text-blue-700 font-bold px-4 py-1 rounded mb-2">
              {discountPercentage ? (
                <span className="text-lg">{discountPercentage}% OFF</span>
              ) : (
                "Exclusive Savings"
              )}
            </div>
            <p className="text-sm mb-1 text-white/90">
              {couponProduct.title.slice(0, 100)}...
            </p>
            <div className="hidden md:block mt-4">
              <a
                href={couponProduct.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg transition-colors flex items-center justify-center w-full max-w-xs "
              >
                View
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
                  alt="Amazon"
                  width={60}
                  height={20}
                  className="h-5 ml-2 mr-2 flex items-center justify-center"
                />
                Deal
              </a>
            </div>
          </div>

          {/* 🟨 Right Side - Product Images */}
          <div className="flex flex-col items-center justify-center p-3">
            {/* Rating */}
            <div className="text-xl font-bold mb-1 text-yellow-600">
              {couponProduct.customRating?.rating || "9.8"} ⭐
            </div>
            <div className="text-gray-500 mb-2">
              {couponProduct.customRating?.reviewCount || 50}+ reviewed in past
              month
            </div>

            {/* 🖼️ Main Image */}
            <div className="relative w-34 h-34 md:w-48 md:h-48 mb-4">
              <Image
                src={activeImage || "/placeholder-image.jpg"}
                alt={couponProduct.title}
                fill
                className="object-contain rounded-lg"
              />
            </div>

            {/* 🧩 Thumbnail Images (hover to change main image) */}
            {thumbImages.length > 0 && (
              <div className="flex gap-2 flex-wrap justify-center">
                {thumbImages.slice(0, 4).map((thumb, idx) => (
                  <div
                    key={idx}
                    className={`relative w-12 h-12 border rounded cursor-pointer ${
                      activeImage === thumb.url
                        ? "border-blue-600"
                        : "border-gray-300 hover:border-blue-500"
                    }`}
                    onMouseEnter={() => setActiveImage(thumb.url)}
                  >
                    <Image
                      src={thumb.url}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            )}
            {/* 📱 Mobile Only: View Deal Button Below Images */}
            <div className="block md:hidden w-full mt-4">
              <a
                href={couponProduct.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg transition-colors flex items-center justify-center w-full"
              >
                View
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
                  alt="Amazon"
                  width={60}
                  height={20}
                  className="h-5 ml-2 mr-2 flex items-center justify-center"
                />
                Deal
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
