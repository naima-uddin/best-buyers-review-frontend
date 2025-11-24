"use client";

import { ArrowLeft, Star, ExternalLink, ShoppingCart, Package, DollarSign } from "lucide-react";
import Image from "next/image";

export default function ProductView({ product, onClose }) {
  // Format price
  const formatPrice = (price) => {
    if (!price) return "$0.00";
    if (typeof price === "string") return price;
    if (price.displayAmount) return price.displayAmount;
    if (price.amount && price.currency) return `${price.currency} ${price.amount}`;
    return "$0.00";
  };

  // Main image
  const getMainImage = (product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0].url;
    }
    return "/placeholder-image.jpg";
  };

  const processContentWithAnchors = (content, anchorTags) => {
    if (!content || !anchorTags || anchorTags.length === 0) {
      return content;
    }

    let processedContent = content;
    const sortedAnchors = [...anchorTags].sort((a, b) => b.word.length - a.word.length);
    
    sortedAnchors.forEach(anchor => {
      const regex = new RegExp(`\\b${anchor.word}\\b`, 'gi');
      processedContent = processedContent.replace(regex, (match) => {
        return `<a href="${anchor.link}" ${
          anchor.isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''
        } class="text-blue-600 underline hover:text-blue-800 transition-colors">${match}</a>`;
      });
    });
    
    return processedContent;
  };

  if (!product) return null;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Product Details</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="font-mono bg-gray-100 px-3 py-1 rounded-lg">
                ASIN: {product.asin}
              </span>
              {product.brand && (
                <span className="font-medium">{product.brand}</span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Products
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Images */}
            <div>
              {product.images && product.images.length > 0 ? (
                <div className="space-y-4">
                  <Image
                    src={getMainImage(product)}
                    alt={product.title}
                    width={600}
                    height={400}
                    className="w-full h-96 object-cover rounded-xl"
                  />
                   
                  {product.images.length > 1 && (
                    <div className="flex flex-wrap gap-2">
                      {product.images.slice(1, 5).map((img, idx) => (
                        <Image
                          key={idx}
                          src={img.url}
                          alt={`Variant ${idx}`}
                          width={80}
                          height={80}
                          className="w-20 h-20 object-cover rounded-md border"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-xl flex items-center justify-center">
                  <span className="text-gray-500">No Image Available</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {product.title}
                </h2>
                
                
                {/* Pricing */}
                <div className="flex items-center space-x-4 mb-4">
                  {product.price && (
                    <span className="text-3xl font-bold text-blue-600">
                      {formatPrice(product.price)}
                    </span>
                  )}
                  {product.listPrice && (
                    <span className="text-lg text-gray-400 line-through">
                      {formatPrice(product.listPrice)}
                    </span>
                  )}
                </div>
                {product.discount && (
                  <div className="text-green-600 font-medium">
                    Save {product.discount.percentage}% (
                    {formatPrice(product.discount.amount)})
                  </div>
                )}
              </div>

              {/* Categories */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="block text-sm font-medium text-gray-700 mb-1">Main Category</span>
                  <p className="text-gray-900 font-semibold">{product.mainCategory?.name || "—"}</p>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-700 mb-1">Sub Category</span>
                  <p className="text-gray-900 font-semibold">{product.subCategory?.name || "—"}</p>
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {product.color && (
                  <div>
                    <span className="font-medium text-gray-700">Color:</span>
                    <p className="text-gray-900">{product.color}</p>
                  </div>
                )}
                {product.size && (
                  <div>
                    <span className="font-medium text-gray-700">Size:</span>
                    <p className="text-gray-900">{product.size}</p>
                  </div>
                )}
                {product.rating && (
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium text-gray-700">Rating:</span>
                    <span className="text-gray-900">{product.rating} / 5</span>
                  </div>
                )}
                {product.availability && (
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-green-500" />
                    <span className="font-medium text-gray-700">Availability:</span>
                    <span className="text-gray-900">{product.availability}</span>
                  </div>
                )}
              </div>

              {/* Amazon Link */}
              {product.affiliateUrl && (
                <a
                  href={product.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <span>View on Amazon</span>
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Introduction with Anchor Tags */}
          {product.introduction && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Introduction</h3>
              <div 
                className="text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: processContentWithAnchors(
                    product.introduction, 
                    product.anchorTags || []
                  ) 
                }}
              />
            </div>
          )}

         {/* Features with Anchor Tags */}
          {product.features?.feature?.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Features</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.features.feature.map((f, i) => (
                  <li key={i} className="flex items-start space-x-2 text-gray-600">
                    <span className="text-green-500 mt-1">•</span>
                    <div 
                      className="leading-relaxed"
                      dangerouslySetInnerHTML={{ 
                        __html: processContentWithAnchors(f, product.anchorTags || [])
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Conclusion with Anchor Tags */}
          {product.conclusion?.text && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Conclusion</h3>
              <div 
                className="text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: processContentWithAnchors(
                    product.conclusion.text, 
                    product.anchorTags || []
                  ) 
                }}
              />
            </div>
          )}

          {/* Most Important Factors with Anchor Tags */}
          {product.mostImportantFactors?.text && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Most Important Factors</h3>
              <div 
                className="text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: processContentWithAnchors(
                    product.mostImportantFactors.text, 
                    product.anchorTags || []
                  ) 
                }}
              />
            </div>
          )}

          {/* Personal Review */}
          {product.personalReview && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Review</h3>
              <p className="text-gray-600 leading-relaxed bg-blue-50 p-4 rounded-lg">
                {product.personalReview}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}