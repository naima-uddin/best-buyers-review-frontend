"use client";
import { useCategories } from "@/context/CategoryContext";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CategoryPage() {
  const { categories, loading } = useCategories();
  const router = useRouter();

  // Handle undefined state
  if (!categories || loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading categories...
      </div>
    );
  }

  // Additional safety check
  const safeCategories = Array.isArray(categories) ? categories : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-semibold mb-2">Categories</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We've spent hundreds of hours researching and summarizing the most
          important things you should consider in making online purchases.
          You'll find these guides helpful, informative, and time-saving in
          considering the products we've reviewed.
        </p>
      </div>

      {/* Category List */}
      <div className="space-y-10">
        {safeCategories.length > 0 ? (
          safeCategories.map((main) => (
            <div
              key={main._id}
              className="border border-gray-200 rounded-xl p-6 shadow-sm"
            >
              {/* Main Category Title */}
              <h2 className="text-xl font-bold text-gray-800 mb-5 uppercase">
                {main.name}
              </h2>

              {/* Subcategories Grid */}
              {main.children && main.children.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-0 gap-y-6">
                  {main.children.map((sub) => {
                    const imageSrc = sub.image
                      ? sub.image.startsWith("http")
                        ? sub.image
                        : `${process.env.NEXT_PUBLIC_IMAGE_API_URL}${sub.image}`
                      : "/placeholder-image.jpg";

                    return (
                      <div
                        key={sub._id}
                        onClick={() =>
                          router.push(
                            `/category/${encodeURIComponent(
                              main.name
                            )}/${encodeURIComponent(sub.name)}`
                          )
                        }
                        className="flex flex-col items-center text-center group cursor-pointer hover:scale-105 transition-transform duration-200"
                      >
                        <div className="w-16 h-18 md:w-20 md:h-20 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                          <Image
                            src={imageSrc}
                            alt={sub.name}
                            width={112}
                            height={112}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <span className="mt-2 text-sm text-gray-700 group-hover:text-blue-600 font-medium text-center">
                          {sub.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  No subcategories available
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No categories available</p>
          </div>
        )}
      </div>
    </div>
  );
}
