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
      <div className="flex items-center text-yellow-500 text-sm justify-center">
        {"★".repeat(fullStars)}
        {hasHalfStar && "★"}
        {"☆".repeat(emptyStars)}
      </div>
    );
  };

  return (
    <>
      {/* 🔹 Compare Box at Bottom */}
      {compareItems.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white shadow-xl rounded-xl p-4 flex items-center space-x-3 z-[999] border border-gray-200">
          <span className="font-semibold text-gray-800">
            {compareItems.length} item{compareItems.length > 1 && "s"} selected
          </span>
          <button
            onClick={openModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-semibold"
          >
            Compare Now
          </button>
          <button
            onClick={clearCompare}
            className="text-gray-500 hover:text-red-500 text-sm"
          >
            Clear
          </button>
        </div>
      )}

      {/* 🔹 Compare Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[85vh] overflow-hidden flex flex-col relative animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
              <h3 className="font-bold text-2xl text-gray-900">
                Compare Products
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="overflow-x-auto">
                <table className="table table-fixed w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="w-40 p-4 border-r sticky left-0 bg-gray-50 z-10 font-semibold text-gray-700">
                        Features
                      </th>
                      {compareItems.map((product) => (
                        <th
                          key={product._id}
                          className="w-64 p-4 border-r last:border-r-0"
                        >
                          <div className="text-center">
                            <div className="relative w-32 h-32 mx-auto mb-3">
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
                            <h4 className="font-semibold text-sm mb-2 line-clamp-3">
                              {product.title}
                            </h4>
                            <div className="text-lg font-bold text-blue-600 mb-2">
                              Save {product.discount?.percentage || 0}%
                            </div>

                            
                            <a
                              href={product.affiliateUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition-colors text-sm flex justify-center items-center gap-2"
                            >
                              <span className="flex items-center">Check Price</span>
                              <Image
                                src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
                                alt="Amazon"
                                className="h-5 mt-1"
                                width={50}
                                height={40}
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
                      <td className="p-4 font-semibold bg-gray-50 border-r sticky left-0 z-10">
                        Rating
                      </td>
                      {compareItems.map((p) => (
                        <td key={p._id} className="p-4 text-center border-r">
                          {getStarRating(p.customRating?.rating || 0)}
                          <div className="text-sm text-gray-600 mt-1">
                            {p.customRating?.rating?.toFixed(1) || "—"} (
                            {p.customRating?.reviewCount || 0} reviews)
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* 🔹 Price */}
                    <tr className="border-b">
                      <td className="p-4 font-semibold bg-gray-50 border-r sticky left-0 z-10">
                        Price
                      </td>
                      {compareItems.map((p) => (
                        <td key={p._id} className="p-4 text-center border-r">
                          <div className="text-lg font-bold text-gray-800">
                            {p.price?.displayAmount || "$0.00"}
                          </div>
                          <div className="text-sm text-gray-500 line-through">
                            {p.listPrice?.displayAmount || ""}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* 🔹 Features (first 2 only) */}
                    <tr className="border-b align-top">
                      <td className="p-4 font-semibold bg-gray-50 border-r sticky left-0 z-10">
                        Key Features
                      </td>
                      {compareItems.map((p) => (
                        <td key={p._id} className="p-4 border-r text-sm">
                          <ul className="list-disc list-inside text-gray-700 space-y-1">
                            {p.features?.feature?.slice(0, 2).map((f, i) => (
                              <li key={i}>{f}</li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>

                    {/* 🔹 Specifications */}
                    <tr className="border-b align-top">
                      <td className="p-4 font-semibold bg-gray-50 border-r sticky left-0 z-10">
                        Specifications
                      </td>
                      {compareItems.map((p) => (
                        <td key={p._id} className="p-4 border-r text-sm">
                          <ul className="text-gray-700 space-y-1">
                            {p.specifications?.slice(0, 3).map((spec, i) => (
                              <li key={i}>
                                <strong>{spec.key}:</strong> {spec.value}
                              </li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>

                    {/* 🔹 Reviews */}
                    <tr className="border-b align-top">
                      <td className="p-4 font-semibold bg-gray-50 border-r sticky left-0 z-10">
                        Latest Review
                      </td>
                      {compareItems.map((p) => (
                        <td key={p._id} className="p-4 border-r text-sm">
                          {p.customReviews && p.customReviews.length > 0 ? (
                            <div className="text-gray-700">
                              <div className="font-semibold">
                                {p.customReviews[0].author}
                              </div>
                              <div className="italic text-gray-600">
                                “{p.customReviews[0].content}”
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
