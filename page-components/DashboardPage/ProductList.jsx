"use client";
import { useEffect, useState } from "react";
import { Eye, Edit, Trash2, ExternalLink } from "lucide-react";
import Image from "next/image";

export default function ProductList({ products = [], loading, onRefresh, onEdit, onView, onDelete, onMigrateUncategorized }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [userRole, setUserRole] = useState("admin");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserRole(payload.role);
      } catch (error) {
        console.error("Error parsing token:", error);
      }
    }
  }, []);

  // Format price
  const formatPrice = (price) => {
    if (!price) return "$0.00";
    if (typeof price === "string") return price;
    if (price.displayAmount) return price.displayAmount;
    if (price.amount && price.currency)
      return `${price.currency} ${price.amount}`;
    return "$0.00";
  };

  const calculateDiscount = (currentPrice, listPrice) => {
    if (!currentPrice || !listPrice) return null;

    const current =
      typeof currentPrice === "object"
        ? currentPrice.amount
        : parseFloat(currentPrice.replace(/[^0-9.]/g, ""));
    const list =
      typeof listPrice === "object"
        ? listPrice.amount
        : parseFloat(listPrice.replace(/[^0-9.]/g, ""));

    if (!list || current >= list) return null;

    const discount = ((list - current) / list) * 100;
    return Math.round(discount);
  };

  const getCurrentPrice = (product) => product?.price || product?.currentPrice;
  const getListPrice = (product) => product?.listPrice || product?.originalPrice;

  const truncateTitle = (title, maxLength = 50) =>
    title?.length > maxLength ? title.substring(0, maxLength) + "..." : title || "No Title";

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-600 mt-1">Manage your Amazon products</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            {safeProducts.length} product{safeProducts.length !== 1 ? "s" : ""}
          </span>
          {onMigrateUncategorized && (
            <button
              onClick={onMigrateUncategorized}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm"
              title="Assign all products without categories to Uncategorized"
            >
              Fix Uncategorized
            </button>
          )}
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh All
          </button>
        </div>
      </div>

      {safeProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📦</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No products yet
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Add products using ASINs to see them here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                    PRODUCT
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                    CATEGORY
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                    PRICE
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                    DISCOUNT
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {safeProducts.map((product) => {
                  const currentPrice = getCurrentPrice(product);
                  const listPrice = getListPrice(product);
                  const discount = calculateDiscount(currentPrice, listPrice);

                  return (
                    <tr
                      key={product._id || product.asin}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Product column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                            {product.images?.length > 0 ? (
                              <Image
                                src={product.images[0].url}
                                alt={product.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = "/placeholder-image.jpg";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                <span className="text-gray-500 text-xs">
                                  No Image
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                              {truncateTitle(product.title)}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                              ASIN: {product.asin}
                            </p>
                            {product.affiliateUrl && (
                              <a
                                href={product.affiliateUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 mt-1"
                              >
                                <span>Amazon</span>
                                <ExternalLink size={12} />
                              </a>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {product.mainCategory?.name ||
                            product.subCategory?.name||
                            "Uncategorized"}
                        </div>
                        {product.subCategory?.name && (
                          <div className="text-xs text-gray-500">
                            {product.subCategory?.name}
                          </div>
                        )}
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatPrice(currentPrice)}
                        </div>
                        {listPrice && (
                          <div className="text-xs text-gray-500 line-through">
                            {formatPrice(listPrice)}
                          </div>
                        )}
                      </td>

                      {/* Discount */}
                      <td className="px-6 py-4">
                        {discount ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {discount}% OFF
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onEdit(product)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => onView(product)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          {userRole === "admin" && (
                            <button
                              onClick={() => onDelete(product)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
