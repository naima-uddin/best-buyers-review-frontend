"use client";
import { useCategories } from "@/context/CategoryContext";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, Suspense } from "react";

function CategoryPageContent() {
  const { categories, loading } = useCategories();
  const searchParams = useSearchParams();
  const scrollTo = searchParams?.get("scrollTo");
  const router = useRouter();

  // Create refs for each main category
  const categoryRefs = useRef({});

  // Smooth scroll when category and refs are ready
  useEffect(() => {
    if (!loading && scrollTo && categoryRefs.current[scrollTo]) {
      categoryRefs.current[scrollTo].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [loading, scrollTo]);

  // Add this check to handle the case where categories might be undefined
  if (loading || !categories) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading categories...
      </div>
    );
  }

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
        {categories.map((main) => (
          <div
            key={main._id}
            ref={(el) => (categoryRefs.current[main.name] = el)}
            className="border border-gray-200 rounded-xl p-6 shadow-sm"
          >
            {/* Main Category Title */}
            <h2 className="text-xl font-bold text-gray-800 mb-5 uppercase">
              {main.name}
            </h2>

            {/* Subcategories Grid */}
            {main.children && main.children.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-2 gap-y-4">
                {main.children.map((sub) => {
                  const imageSrc = sub.image
                    ? sub.image.startsWith("http")
                      ? sub.image
                      : `${process.env.NEXT_PUBLIC_IMAGE_API_URL}${sub.image}`
                    : "/placeholder-image.jpg";

                  return (
                    <div
                      key={sub._id}
                      className="flex flex-col items-center text-center group cursor-pointer hover:scale-105 transition-transform duration-200"
                      onClick={() =>
                        router.push(
                          `/category/${main._id}/${
                            sub._id
                          }?mainName=${encodeURIComponent(
                            main.name
                          )}&subName=${encodeURIComponent(sub.name)}`
                        )
                      }
                    >
                      <div className="w-24 h-24 md:w-28 md:h-28 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg shadow-sm overflow-hidden">
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
        ))}
      </div>
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen text-gray-500">Loading...</div>}>
      <CategoryPageContent />
    </Suspense>
  );
}
