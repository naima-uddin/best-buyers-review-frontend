// components/CompareModal.js
"use client";
import { useCompare } from "@/context/CompareContext";
import Image from "next/image";

export default function CompareModal() {
  const { compareItems, clearCompare } = useCompare();

  const getFeatureValue = (product, featureKey) => {
    // You might need to adjust this based on your product data structure
    const features = product.features?.feature || [];
    const feature = features.find((f) =>
      f.toLowerCase().includes(featureKey.toLowerCase())
    );
    return feature || "—";
  };

  const getStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center text-yellow-500 text-sm">
        {"★".repeat(fullStars)}
        {hasHalfStar && "★"}
        {"☆".repeat(emptyStars)}
      </div>
    );
  };

  return (
    <dialog
      id="compare_modal"
      className="modal flex justify-center items-center"
    >
      <div className="modal-box max-w-4xl max-h-[65vh] w-full mx-auto my-auto p-0 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
          <h3 className="font-bold text-2xl text-gray-900">Compare Products</h3>
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost text-gray-500 hover:text-gray-700 hover:bg-gray-100">
              ✕
            </button>
          </form>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="overflow-x-auto">
            <table className="table table-fixed w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="w-28 align-top p-4 border-r sticky left-0 bg-gray-50 z-10">
                    Features
                  </th>
                  {compareItems.map((product) => (
                    <th
                      key={product._id}
                      className="w-64 align-top p-4 border-r last:border-r-0"
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
                          Save {product.discount?.percentage || 36}%
                        </div>
                        <a
                          href={product.affiliateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition-colors text-sm"
                        >
                          Check Price
                        </a>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Rating Row */}
                <tr className="border-b">
                  <td className="p-4 font-semibold bg-gray-50 border-r sticky left-0 bg-gray-50 z-10">
                    Rating
                  </td>
                  {compareItems.map((product) => (
                    <td
                      key={product._id}
                      className="p-4 border-r last:border-r-0"
                    >
                      <div className="text-center">
                        {getStarRating(product.customRating?.rating || 4.5)}
                        <div className="text-sm text-gray-600 mt-1">
                          {product.customRating?.rating?.toFixed(1) || "4.5"}(
                          {product.customRating?.reviewCount || 29} reviews)
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Type Row */}
                <tr className="border-b">
                  <td className="p-4 font-semibold bg-gray-50 border-r sticky left-0 bg-gray-50 z-10">
                    Type
                  </td>
                  {compareItems.map((product) => (
                    <td
                      key={product._id}
                      className="p-4 border-r last:border-r-0 text-center"
                    >
                      {getFeatureValue(product, "type") || "Sheet-fed, photo"}
                    </td>
                  ))}
                </tr>

                {/* Scan Speed Row */}
                <tr className="border-b">
                  <td className="p-4 font-semibold bg-gray-50 border-r sticky left-0 bg-gray-50 z-10">
                    Scan Speed
                  </td>
                  {compareItems.map((product) => (
                    <td
                      key={product._id}
                      className="p-4 border-r last:border-r-0 text-center"
                    >
                      {getFeatureValue(product, "speed") || "35 ppm"}
                    </td>
                  ))}
                </tr>

                {/* Two-Sided Scanning Row */}
                <tr className="border-b">
                  <td className="p-4 font-semibold bg-gray-50 border-r sticky left-0 bg-gray-50 z-10">
                    Two-Sided Scanning
                  </td>
                  {compareItems.map((product) => (
                    <td
                      key={product._id}
                      className="p-4 border-r last:border-r-0 text-center"
                    >
                      {getFeatureValue(product, "two-sided") || "Yes"}
                    </td>
                  ))}
                </tr>

                {/* Max Paper Size Row */}
                <tr className="border-b">
                  <td className="p-4 font-semibold bg-gray-50 border-r sticky left-0 bg-gray-50 z-10">
                    Max Paper Size
                  </td>
                  {compareItems.map((product) => (
                    <td
                      key={product._id}
                      className="p-4 border-r last:border-r-0 text-center"
                    >
                      {getFeatureValue(product, "paper size") || '8.5" x 240"'}
                    </td>
                  ))}
                </tr>

                {/* Connectivity Row */}
                <tr className="border-b">
                  <td className="p-4 font-semibold bg-gray-50 border-r sticky left-0 bg-gray-50 z-10">
                    Connectivity
                  </td>
                  {compareItems.map((product) => (
                    <td
                      key={product._id}
                      className="p-4 border-r last:border-r-0 text-center"
                    >
                      {getFeatureValue(product, "connectivity") || "USB"}
                    </td>
                  ))}
                </tr>

                {/* Document Feeder Row */}
                <tr className="border-b">
                  <td className="p-4 font-semibold bg-gray-50 border-r sticky left-0 bg-gray-50 z-10">
                    Document Feeder
                  </td>
                  {compareItems.map((product) => (
                    <td
                      key={product._id}
                      className="p-4 border-r last:border-r-0 text-center"
                    >
                      {getFeatureValue(product, "feeder") || "50-sheet auto"}
                    </td>
                  ))}
                </tr>

                {/* Scan To Row */}
                <tr className="border-b">
                  <td className="p-4 font-semibold bg-gray-50 border-r sticky left-0 bg-gray-50 z-10">
                    Scan To
                  </td>
                  {compareItems.map((product) => (
                    <td
                      key={product._id}
                      className="p-4 border-r last:border-r-0 text-center"
                    >
                      {getFeatureValue(product, "scan to") ||
                        "Cloud, USB, file, email"}
                    </td>
                  ))}
                </tr>

                {/* Additional Features */}
                {compareItems[0]?.features?.feature
                  ?.slice(0, 4)
                  .map((_, featureIndex) => (
                    <tr key={`feature-${featureIndex}`} className="border-b">
                      <td className="p-4 font-semibold bg-gray-50 border-r sticky left-0 bg-gray-50 z-10">
                        Feature {featureIndex + 1}
                      </td>
                      {compareItems.map((product) => (
                        <td
                          key={product._id}
                          className="p-4 border-r last:border-r-0 text-center text-sm"
                        >
                          {product.features?.feature?.[featureIndex] || "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </dialog>
  );
}
