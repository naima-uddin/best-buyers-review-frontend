// components/CompareBox.js
"use client";
import Image from "next/image";
import { X } from "lucide-react";
import { useCompare } from "@/context/CompareContext";

export default function CompareBox() {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();

  if (compareItems.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-1 py-1 sm:py-1">
        <div className="flex items-center justify-between mb-1 sm:mb-1">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800">
            Compare Products ({compareItems.length}/3)
          </h3>
          <button
            onClick={clearCompare}
            className="text-xs sm:text-sm text-red-600 hover:text-red-700 font-medium px-2 sm:px-3 py-1 rounded hover:bg-red-50 transition-colors"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
          {compareItems.map((product) => (
            <div
              key={product._id}
              className="border border-gray-300 rounded-lg p-1 p-1 relative hover:border-blue-400 transition-colors bg-gray-50"
            >
              <button
                onClick={() => removeFromCompare(product._id)}
                className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full p-1 hover:from-red-600 hover:to-red-700 shadow-md hover:scale-110 transition-all z-10"
                aria-label="Remove product"
              >
                <X size={14} className="sm:w-4 sm:h-4" />
              </button>

              <div className="relative w-full h-10 sm:h-14 md:h-14 mb-2 sm:mb-3">
                <Image
                  src={
                    product.images?.find((img) => img.variant === "MAIN")
                      ?.url ||
                    product.images?.[0]?.url ||
                    "/placeholder-image.jpg"
                  }
                  alt={product.title}
                  fill
                  className="object-contain"
                />
              </div>

              <h4 className="font-semibold text-xs sm:text-sm  line-clamp-2 leading-tight text-center">
                {product.title}
              </h4>

              <div className="text-sm sm:text-base md:text-lg text-center font-bold bg-green-600 bg-clip-text text-transparent">
                Save {product.discount?.percentage || 36}%
              </div>
            </div>
          ))}

          {/* Empty slots - hide on mobile if no space */}
          {Array.from({ length: 3 - compareItems.length }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className={`border-2 border-dashed border-gray-300 rounded-lg p-2 sm:p-3 md:p-4 flex items-center justify-center min-h-[80px] sm:min-h-[100px] ${
                compareItems.length === 1 && index > 0 ? 'hidden sm:flex' : ''
              }`}
            >
              <div className="text-center text-gray-500">
                <div className="text-xl sm:text-2xl mb-1 sm:mb-2">+</div>
                <div className="text-xs sm:text-sm">Add Product</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
