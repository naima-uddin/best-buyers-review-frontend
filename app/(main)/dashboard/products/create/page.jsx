"use client";
import { useRouter } from "next/navigation";
import ProductForm from "@/page-components/DashboardPage/ProductForm";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { useState, useEffect } from "react";

export default function CreateProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

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

  const handleSubmit = async () => {
    // Product creation is handled by ProductForm
    // After successful creation, redirect to products page
    router.push("/dashboard/products");
  };

  const handleCancel = () => {
    router.push("/dashboard/products");
  };

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
            <h1 className="text-3xl font-bold text-gray-900">
              Create New Product
            </h1>
            <p className="text-gray-500 mt-1">
              Add a new product to your inventory
            </p>
          </div>
        </div>

        {/* Categories Loading State */}
        {categoriesLoading && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">Loading categories...</p>
          </div>
        )}

        {/* Product Form */}
        <Card>
          <CardContent className="p-6">
            <ProductForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              categories={categories}
              categoriesLoading={categoriesLoading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
