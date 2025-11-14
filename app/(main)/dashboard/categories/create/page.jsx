"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FolderTree } from "lucide-react";
import { Card, CardContent } from "@/ui/Card";
import { Button } from "@/ui/Button";
import CategoryForm from "@/page-components/DashboardPage/category/CategoryForm";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default function CreateCategoryPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setCategories(data || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCreated = () => {
    router.push("/dashboard/categories");
  };

  const handleCancel = () => {
    router.push("/dashboard/categories");
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
            Back to Categories
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <FolderTree className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Create New Category
            </h1>
          </div>
          <p className="text-gray-500">
            Add a new category with subcategories and hierarchy
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">Loading categories...</p>
          </div>
        )}

        {/* Category Form */}
        <Card>
          <CardContent className="p-6">
            <CategoryForm
              onCreated={handleCreated}
              categories={categories}
              editCategory={null}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
