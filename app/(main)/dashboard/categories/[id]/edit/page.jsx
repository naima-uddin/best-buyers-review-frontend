"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, FolderTree, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/ui/Card";
import { Button } from "@/ui/Button";
import CategoryForm from "@/page-components/DashboardPage/category/CategoryForm";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params?.id;

  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch category details and all categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // Fetch all categories for parent selection
        const categoriesRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData || []);

          // Find the specific category to edit
          const findCategory = (cats, id) => {
            for (const cat of cats) {
              if (cat._id === id) return cat;
              if (cat.children) {
                const found = findCategory(cat.children, id);
                if (found) return found;
              }
            }
            return null;
          };

          const foundCategory = findCategory(categoriesData, categoryId);
          if (foundCategory) {
            setCategory(foundCategory);
          } else {
            setError("Category not found");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchData();
    }
  }, [categoryId]);

  const handleUpdated = () => {
    router.push("/dashboard/categories");
  };

  const handleCancel = () => {
    router.push("/dashboard/categories");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
            <p className="mt-4 text-gray-600">Loading category...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="p-12">
              <div className="text-center">
                <FolderTree className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Category Not Found
                </h3>
                <p className="text-gray-500 mb-6">
                  {error || "The category you're looking for doesn't exist."}
                </p>
                <Button
                  onClick={handleCancel}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Back to Categories
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
            Back to Categories
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <FolderTree className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Edit Category</h1>
          </div>
          <p className="text-gray-500">
            Update category information and hierarchy
          </p>
        </div>

        {/* Category Form */}
        <Card>
          <CardContent className="p-6">
            <CategoryForm
              onCreated={handleUpdated}
              categories={categories}
              editCategory={category}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
