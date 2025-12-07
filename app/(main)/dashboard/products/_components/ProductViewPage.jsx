"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  Star,
  DollarSign,
  Tag,
  Image as ImageIcon,
  FileText,
  CheckCircle,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/Card";
import { Badge } from "@/ui/Badge";
import { Button } from "@/ui/Button";
import Image from "next/image";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default function ProductViewPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  // Fetch product details
  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await res.json();
        setProduct(data.data || data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${product?.title}"?`))
      return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        alert("Product deleted successfully!");
        router.push("/dashboard/products");
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <p className="mt-4 text-gray-600">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="p-12">
              <div className="text-center">
                <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Product Not Found
                </h3>
                <p className="text-gray-500 mb-6">
                  {error || "The product you're looking for doesn't exist."}
                </p>
                <Button
                  onClick={() => router.push("/dashboard/products")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Back to Products
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const allImages = product.images || [];
  const mainImage = allImages.find((img) => img.variant === "MAIN");
  const subImages = allImages.filter((img) => img.variant === "SUB");
  const displayImages = [mainImage, ...subImages].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <Button
              onClick={() => router.push("/dashboard/products")}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 w-fit"
            >
              <ArrowLeft size={16} />
              Back to Products
            </Button>

            <div className="flex gap-2">
              <Button
                onClick={() =>
                  router.push(`/dashboard/products/${productId}/edit`)
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Edit size={16} />
                Edit Product
              </Button>
              <Button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Trash2 size={16} />
                Delete
              </Button>
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {product.title}
            </h1>
            <p className="text-gray-500 mt-1 font-mono">ASIN: {product.asin}</p>
          </div>
        </div>

        {/* Product Overview */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Images Section */}
              <div>
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
                  {displayImages.length > 0 ? (
                    <Image
                      src={
                        displayImages[activeImage]?.url ||
                        "/placeholder-image.jpg"
                      }
                      alt={product.title}
                      width={600}
                      height={600}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-24 w-24 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {displayImages.length > 1 && (
                  <div className="grid grid-cols-5 gap-2">
                    {displayImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImage(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                          activeImage === index
                            ? "border-blue-600"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Image
                          src={img.url}
                          alt={`${product.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                          width={100}
                          height={100}
                          onError={(e) => {
                            e.target.src = "/placeholder-image.jpg";
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                {/* Brand & Category */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">
                    Brand
                  </h3>
                  <p className="text-lg text-gray-900">
                    {product.brand || "N/A"}
                  </p>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">
                    Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.mainCategory && (
                      <Badge variant="default">
                        {product.mainCategory.name || product.mainCategory}
                      </Badge>
                    )}
                    {product.subCategory && (
                      <Badge variant="secondary">
                        {product.subCategory.name || product.subCategory}
                      </Badge>
                    )}
                    {product.subSubCategory && (
                      <Badge variant="outline">
                        {product.subSubCategory.name || product.subSubCategory}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Status Badges */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">
                    Status
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.isFeatured && (
                      <Badge variant="success">Featured</Badge>
                    )}
                    {product.isFullReview && (
                      <Badge variant="default">Full Review</Badge>
                    )}
                    {product.isCoupon && (
                      <Badge variant="warning">Coupon</Badge>
                    )}
                    {product.labels?.map((label, index) => (
                      <Badge key={index} variant="outline">
                        {label}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Pricing</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Price:</span>
                      <span className="font-bold text-2xl text-green-600">
                        ${product.price?.amount?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                    {product.listPrice?.amount > product.price?.amount && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Original Price:</span>
                          <span className="text-gray-500 line-through">
                            ${product.listPrice?.amount?.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Discount:</span>
                          <span className="font-semibold text-red-600">
                            {product.discount?.percentage || 0}% OFF
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Rating */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    <h3 className="font-semibold text-gray-900">Rating</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <span className="text-3xl font-bold text-gray-900">
                        {product.customRating?.rating?.toFixed(1) || "N/A"}
                      </span>
                      <span className="text-yellow-500 text-2xl">★</span>
                    </div>
                    <div className="text-gray-600">
                      {product.customRating?.reviewCount || 0} reviews
                    </div>
                  </div>
                </div>

                {/* Affiliate Link */}
                {product.affiliateUrl && (
                  <a
                    href={product.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    <ExternalLink size={20} />
                    View on Amazon
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        {product.features?.feature && product.features.feature.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {product.features.feature.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Grid for Colors, Styles, Specifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Available Colors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color, index) => (
                    <Badge key={index} variant="secondary">
                      {color}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Styles */}
          {product.styles && product.styles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Available Styles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {product.styles.map((style, index) => (
                    <Badge key={index} variant="secondary">
                      {style}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Specifications */}
          {product.specifications && product.specifications.length > 0 && (
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {product.specifications.map((spec, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-blue-500 pl-3"
                    >
                      <div className="text-sm font-semibold text-gray-600">
                        {spec.key}
                      </div>
                      <div className="text-gray-900">{spec.value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Description & Content */}
        {(product.descriptionTitle || product.introduction) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                {product.descriptionTitle || "Description"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-line">
                {product.introduction || product.description}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Factors to Consider */}
        {product.factorsToConsider && product.factorsToConsider.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Factors to Consider</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {product.factorsToConsider.map((factor, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">→</span>
                    <span className="text-gray-700">{factor}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Most Important Factors */}
        {product.mostImportantFactors?.text && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {product.mostImportantFactors.heading ||
                  "Most Important Factors"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-line">
                {product.mostImportantFactors.text}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Custom Reviews */}
        {product.customReviews && product.customReviews.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {product.customReviews.map((review, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-yellow-400 pl-4 py-3 bg-gray-50 rounded-r-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-gray-900">
                        {review.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium">{review.rating}</span>
                      </div>
                    </div>
                    {review.title && (
                      <div className="font-medium text-gray-800 mb-1">
                        {review.title}
                      </div>
                    )}
                    <p className="text-gray-600 text-sm">{review.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Common Questions */}
        {product.commonQuestions && product.commonQuestions.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Common Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {product.commonQuestions.map((qa, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 last:border-0 pb-4 last:pb-0"
                  >
                    <div className="font-semibold text-gray-900 mb-2">
                      Q: {qa.question}
                    </div>
                    <div className="text-gray-700 pl-4">A: {qa.answer}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Conclusion */}
        {product.conclusion?.text && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {product.conclusion.heading || "Conclusion"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-line">
                {product.conclusion.text}
              </p>
            </CardContent>
          </Card>
        )}

        {/* SEO Info (Admin Only) */}
        {product.seo && (
          <Card className="mb-6 border-2 border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-purple-900">SEO Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {product.seo.title && (
                  <div>
                    <div className="text-sm font-semibold text-purple-700">
                      SEO Title
                    </div>
                    <div className="text-gray-900">{product.seo.title}</div>
                  </div>
                )}
                {product.seo.description && (
                  <div>
                    <div className="text-sm font-semibold text-purple-700">
                      SEO Description
                    </div>
                    <div className="text-gray-900">
                      {product.seo.description}
                    </div>
                  </div>
                )}
                {product.seo.keywords && product.seo.keywords.length > 0 && (
                  <div>
                    <div className="text-sm font-semibold text-purple-700 mb-2">
                      SEO Keywords
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.seo.keywords.map((keyword, index) => (
                        <Badge key={index} variant="outline">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
