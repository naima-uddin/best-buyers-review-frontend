"use client";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function CategoryPage() {
  const searchParams = useSearchParams();
  const categoryName = searchParams.get("name");

  const [mainCategory, setMainCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoryName) return;

    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();

        // Find the clicked main category (level 1)
        const selected = data.find(
          (cat) => cat.level === 1 && cat.name.toLowerCase() === categoryName.toLowerCase()
        );

        setMainCategory(selected || null);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [categoryName]);

  if (loading)
    return (
      <div className="py-20 text-center text-gray-500">
        Loading category data...
      </div>
    );

  if (error)
    return (
      <div className="py-20 text-center text-red-500">
        Error: {error}
      </div>
    );

  if (!mainCategory)
    return (
      <div className="py-20 text-center text-gray-500">
        Category not found.
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
        {mainCategory.name}
      </h1>
      <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
        Browse top {mainCategory.name} categories and subcategories to find exactly what you need.
      </p>

      {/* Subcategories (level 2) */}
      {mainCategory.children && mainCategory.children.length > 0 ? (
        mainCategory.children.map((sub) => (
          <div key={sub._id} className="mb-10">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">
              {sub.name.toUpperCase()}
            </h2>

            {/* Nested children (level 3) */}
            {sub.children && sub.children.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {sub.children.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col items-center text-center bg-white rounded-lg p-3 shadow-sm border hover:shadow-md transition cursor-pointer"
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="object-contain mb-2"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded mb-2 text-gray-500 font-bold">
                        {item.name.charAt(0)}
                      </div>
                    )}
                    <span className="text-sm text-gray-700 font-medium">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No subcategories found.</p>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">
          No subcategories available.
        </p>
      )}
    </div>
  );
}
