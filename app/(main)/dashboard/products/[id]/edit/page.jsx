"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ProductEdit from "@/page-components/DashboardPage/ProductEdit";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/ui/Card";
import { Button } from "@/ui/Button";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id;

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch categories");

        const data = await res.json();
        setCategories(data || []);
      } catch (error) {
        console.error("❌ Category fetch failed:", error);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSave = async (updatedProduct) => {
    try {
      const token = localStorage.getItem("token");

      // Convert empty strings to null for ObjectId fields
      const cleanObjectIdFields = (obj) => {
        const cleaned = { ...obj };
        ["mainCategory", "subCategory", "subSubCategory"].forEach((field) => {
          if (cleaned[field] === "") {
            cleaned[field] = null;
          }
        });
        return cleaned;
      };

      const cleanedProduct = cleanObjectIdFields(updatedProduct);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cleanedProduct),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Product updated successfully!");
        router.push("/dashboard/products");
      } else {
        console.error("Backend error:", result);
        alert(result.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Error updating product");
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/products");
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Product Not Found
                </h3>
                <p className="text-gray-500 mb-6">
                  {error || "The product you're looking for doesn't exist."}
                </p>
                <Button
                  onClick={handleCancel}
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            onClick={handleCancel}
            className="mb-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Products
          </Button>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-500 mt-1">
              Update product information and details
            </p>
          </div>
        </div>

        {/* Categories Loading State */}
        {categoriesLoading && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">Loading categories...</p>
          </div>
        )}

        {/* Product Edit Form */}
        <ProductEdit
          product={product}
          onSave={handleSave}
          onCancel={handleCancel}
          categories={categories}
          categoriesLoading={categoriesLoading}
        />
      </div>
    </div>
  );
}
