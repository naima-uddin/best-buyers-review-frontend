"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function () {
  const { mainCategory, subCategory } = useParams();
  const searchParams = useSearchParams();
  const pageParam = parseInt(searchParams.get("page")) || 1;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10; // 10 products per page

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products?category=${subCategory}&page=${pageParam}&limit=${limit}`
        );
        const data = await res.json();

        if (data.success) {
          setProducts(data.data.products);
          setTotalPages(data.data.totalPages || 1);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [subCategory, pageParam]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const params = new URLSearchParams(window.location.search);
      params.set("page", newPage);
      window.location.search = params.toString();
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading products...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold mb-2">
          Best {subCategory.replace(/-/g, " ")}
        </h1>
        <p className="text-gray-600">
          {new Date().getFullYear()} Buyer&apos;s Guide
        </p>
      </div>

      {/* Product List */}
      <div className="space-y-6">
        {products.map((product, index) => (
          <div
            key={product._id}
            className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex flex-col md:flex-row items-start gap-4">
              {/* Product Image */}
              <div className="flex-shrink-0">
                <Image
                  src={product.images?.[0]?.url || "/placeholder-image.jpg"}
                  alt={product.title}
                  width={150}
                  height={150}
                  className="rounded-lg object-contain"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-800">
                  {product.title}
                </h2>
                <p className="text-sm text-gray-600 mt-1">{product.brand}</p>

                {/* Features */}
                <ul className="mt-3 text-sm text-gray-700 list-disc pl-5 space-y-1">
                  {product.features?.feature?.slice(0, 5).map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>

              {/* Right Section */}
              <div className="flex flex-col items-center gap-2">
                <div className="text-xl font-bold text-yellow-500">
                  ⭐ {product.customRating?.rating || 0}
                </div>
                <a
                  href={product.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  Check Price
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-10 space-x-2">
        <button
          onClick={() => handlePageChange(pageParam - 1)}
          disabled={pageParam === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 border rounded ${
              pageParam === i + 1 ? "bg-blue-500 text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(pageParam + 1)}
          disabled={pageParam === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
