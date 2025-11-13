"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

export default function AllCategoryPage() {
  const router = useRouter();
  const { id } = router.query; // ✅ Works in /pages directory
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchCategory = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`
        );
        const data = await res.json();
        setCategoryData(data);
      } catch (error) {
        console.error("Error fetching category:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id]);

  console.log("categories", categoryData);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!categoryData)
    return <div className="text-center py-10">Category not found.</div>;

  const { mainCategory, subCategories } = categoryData;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Main Category Title */}
      <h1 className="text-3xl font-bold text-center text-[#078c8c] mb-4">
        {mainCategory.name}
      </h1>
      <p className="text-center text-gray-500 mb-8">
        Explore the best {mainCategory.name} products.
      </p>

      {/* Subcategories */}
      {subCategories.map((sub) => (
        <div key={sub._id} className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-[#078c8c]">
            {sub.name}
          </h2>
          <div className="flex flex-wrap gap-6">
            {sub.children.map((child) => (
              <div
                key={child._id}
                className="flex flex-col items-center text-center cursor-pointer group"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-100 flex items-center justify-center mb-2 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                  {child.image ? (
                    <Image
                      src={child.image}
                      alt={child.name}
                      width={70}
                      height={70}
                      className="object-contain rounded-full p-2"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-sm bg-[#078c8c]">
                      {child.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="text-[13px] md:text-sm text-[#078c8c] font-medium leading-tight group-hover:text-[#FFBC03] transition-colors max-w-[80px] break-words">
                  {child.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
