// components/CompareModal.js
"use client";
import { useCompare } from "@/context/CompareContext";
import Image from "next/image";
import { useState } from "react";

export default function CompareModal() {
  const { compareItems, clearCompare } = useCompare();
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const getStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    return (
      <div className="flex items-center text-yellow-500 text-xs sm:text-sm justify-center">
        {"★".repeat(fullStars)}
        {hasHalfStar && "★"}
        {"☆".repeat(emptyStars)}
      </div>
    );
  };

  return (
    <>
      {/* 🔹 Compare Box at Bottom Right */}
      {compareItems.length > 0 && (
        <div className="fixed bottom-4 right-2 sm:right-4 bg-white shadow-2xl rounded-xl p-2 sm:p-3 md:p-4 flex flex-col sm:flex-row items-center gap-2 sm:gap-3 z-[999] border border-gray-200">
          <span className="font-semibold text-gray-800 text-xs sm:text-sm">
            {compareItems.length} item{compareItems.length > 1 && "s"} selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={openModal}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105"
            >
              Compare Now
            </button>
            <button
              onClick={clearCompare}
              className="text-gray-500 hover:text-red-600 text-xs sm:text-sm font-medium px-2 hover:bg-red-50 rounded transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* 🔹 Compare Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col relative">
            {/* Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
              <h3 className="font-bold text-lg sm:text-xl md:text-2xl text-gray-900">
                Compare Products
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center transition-all hover:scale-110"
                aria-label="Close modal"
              >
                <span className="text-xl sm:text-2xl">✕</span>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-3 sm:p-4 md:p-6">
              <div className="overflow-x-auto -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6">
                <table className="table table-fixed w-full min-w-[600px]">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="w-24 sm:w-32 md:w-40 p-2 sm:p-3 md:p-4 border-r sticky left-0 bg-gray-50 z-10 font-semibold text-gray-700 text-xs sm:text-sm">
                        Features
                      </th>
                      {compareItems.map((product) => (
                        <th
                          key={product._id}
                          className="w-48 sm:w-56 md:w-64 p-2 sm:p-3 md:p-4 border-r last:border-r-0"
                        >
                          <div className="text-center">
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 mx-auto mb-2 sm:mb-3">
                              <Image
                                src={
                                  product.images?.find(
                                    (img) => img.variant === "MAIN"
                                  )?.url ||
                                  product.images?.[0]?.url ||
                                  "/placeholder-image.jpg"
                                }
                                alt={product.title}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <h4 className="font-semibold text-xs sm:text-sm mb-1 sm:mb-2 line-clamp-3 leading-tight">
                              {product.title}
                            </h4>
                            <div className="text-sm sm:text-base md:text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                              Save {product.discount?.percentage || 0}%
                            </div>


                            <a
                              href={product.affiliateUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg transition-all shadow-md hover:shadow-lg text-xs sm:text-sm flex justify-center items-center gap-1 sm:gap-2"
                            >
                              <span className="flex items-center">Check Price</span>
                              <Image
                                src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
                                alt="Amazon"
                                className="h-4 sm:h-5"
                                width={40}
                                height={30}
                              />
                            </a>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {/* 🔹 Rating */}
                    <tr className="border-b">
                      <td className="p-2 sm:p-3 md:p-4 font-semibold bg-gray-50 border-r sticky left-0 z-10 text-xs sm:text-sm">
                        Rating
                      </td>
                      {compareItems.map((p) => (
                        <td key={p._id} className="p-2 sm:p-3 md:p-4 text-center border-r">
                          {getStarRating(p.customRating?.rating || 0)}
                          <div className="text-xs sm:text-sm text-gray-600 mt-1">
                            {p.customRating?.rating?.toFixed(1) || "—"} (
                            {p.customRating?.reviewCount || 0} reviews)
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* 🔹 Price */}
                    <tr className="border-b">
                      <td className="p-2 sm:p-3 md:p-4 font-semibold bg-gray-50 border-r sticky left-0 z-10 text-xs sm:text-sm">
                        Price
                      </td>
                      {compareItems.map((p) => (
                        <td key={p._id} className="p-2 sm:p-3 md:p-4 text-center border-r">
                          <div className="text-sm sm:text-base md:text-lg font-bold text-gray-800">
                            {p.price?.displayAmount || "$0.00"}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 line-through">
                            {p.listPrice?.displayAmount || ""}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* 🔹 Features (first 2 only) */}
                    <tr className="border-b align-top">
                      <td className="p-2 sm:p-3 md:p-4 font-semibold bg-gray-50 border-r sticky left-0 z-10 text-xs sm:text-sm">
                        Key Features
                      </td>
                      {compareItems.map((p) => (
                        <td key={p._id} className="p-2 sm:p-3 md:p-4 border-r text-xs sm:text-sm">
                          <ul className="list-disc list-inside text-gray-700 space-y-1">
                            {p.features?.feature?.slice(0, 2).map((f, i) => (
                              <li key={i} className="leading-relaxed">{f}</li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>

                    {/* 🔹 Specifications */}
                    <tr className="border-b align-top">
                      <td className="p-2 sm:p-3 md:p-4 font-semibold bg-gray-50 border-r sticky left-0 z-10 text-xs sm:text-sm">
                        Specifications
                      </td>
                      {compareItems.map((p) => (
                        <td key={p._id} className="p-2 sm:p-3 md:p-4 border-r text-xs sm:text-sm">
                          <ul className="text-gray-700 space-y-1">
                            {p.specifications?.slice(0, 3).map((spec, i) => (
                              <li key={i} className="leading-relaxed">
                                <strong>{spec.key}:</strong> {spec.value}
                              </li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>

                    {/* 🔹 Reviews */}
                    <tr className="border-b align-top">
                      <td className="p-2 sm:p-3 md:p-4 font-semibold bg-gray-50 border-r sticky left-0 z-10 text-xs sm:text-sm">
                        Latest Review
                      </td>
                      {compareItems.map((p) => (
                        <td key={p._id} className="p-2 sm:p-3 md:p-4 border-r text-xs sm:text-sm">
                          {p.customReviews && p.customReviews.length > 0 ? (
                            <div className="text-gray-700">
                              <div className="font-semibold mb-1">
                                {p.customReviews[0].author}
                              </div>
                              <div className="italic text-gray-600 leading-relaxed">
                                "{p.customReviews[0].content}"
                              </div>
                            </div>
                          ) : (
                            <div className="text-gray-500">No reviews yet</div>
                          )}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
