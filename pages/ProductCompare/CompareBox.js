// components/CompareBox.js
"use client";
import Image from 'next/image';
import { X } from 'lucide-react';
import { useCompare } from '@/context/CompareContext';

export default function CompareBox() {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();

  if (compareItems.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Compare Products ({compareItems.length}/3)
          </h3>
          <div className="flex items-center gap-4">
            <button
              onClick={clearCompare}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Clear All
            </button>
            {compareItems.length >= 2 && (
              <button
                onClick={() => document.getElementById('compare_modal').showModal()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Compare Now
              </button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {compareItems.map((product) => (
            <div key={product._id} className="border border-gray-300 rounded-lg p-4 relative">
              <button
                onClick={() => removeFromCompare(product._id)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X size={16} />
              </button>
              
              <div className="relative w-full h-20 mb-3">
                <Image
                  src={product.images?.find(img => img.variant === "MAIN")?.url || product.images?.[0]?.url || "/placeholder-image.jpg"}
                  alt={product.title}
                  fill
                  className="object-contain"
                />
              </div>
              
              <h4 className="font-semibold text-sm mb-2 line-clamp-2">
                {product.title}
              </h4>
              
              <div className="text-lg text-center font-bold text-blue-600 -mt-6">
                Save {product.discount?.percentage || 36}%
              </div>
            </div>
          ))}
          
          {/* Empty slots */}
          {Array.from({ length: 3 - compareItems.length }).map((_, index) => (
            <div key={`empty-${index}`} className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center min-h-[100px]">
              <div className="text-center text-gray-500">
                <div className="text-2xl mb-2">+</div>
                <div className="text-sm">Add Product</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}