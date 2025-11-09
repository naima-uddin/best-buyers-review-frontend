"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function ProductByCategory() {
  const { mainCategory, subCategory } = useParams(); // these are IDs
  const searchParams = useSearchParams();
  const router = useRouter();

  const mainName = searchParams.get("mainName");
  const subName = searchParams.get("subName");
  const pageParam = parseInt(searchParams.get("page")) || 1;

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products?mainCategory=${mainCategory}&subCategory=${subCategory}&page=${pageParam}&limit=10`
        );
        const data = await res.json();

        if (data.success && data.data) {
          setProducts(data.data.products || []);
          setTotalPages(data.data.pagination?.pages || 1);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [mainCategory, subCategory, pageParam]);

  const handlePageChange = (newPage) => {
    router.push(
      `/category/${mainCategory}/${subCategory}?page=${newPage}&mainName=${encodeURIComponent(
        mainName
      )}&subName=${encodeURIComponent(subName)}`,
      { scroll: false }
    );
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading products...
      </div>
    );

  if (!loading && products.length === 0)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        No products found.
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold mb-2">
          Best {subName} ({mainName})
        </h1>
        <p className="text-gray-600">
          Updated November 2025 • 10 best {subName} reviewed and ranked.
        </p>
      </div>

      {/* Product Grid */}
      <div className="space-y-8">
        {products.map((product, index) => (
          <div
            key={product._id}
            className="flex flex-col md:flex-row items-center border border-gray-200 rounded-xl shadow-sm p-4 md:p-6 hover:shadow-md transition"
          >
            {/* Rank */}
            <div className="text-3xl font-bold text-blue-600 mb-2 md:mb-0 md:mr-6">
              {index + 1 + (pageParam - 1) * 10}
            </div>

            {/* Product Image */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 mr-0 md:mr-6 mb-4 md:mb-0">
              <Image
                src={product.images?.[0]?.url || "/placeholder-image.jpg"}
                alt={product.title}
                fill
                className="object-contain rounded-lg"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1">
              <h2 className="text-lg md:text-xl font-semibold mb-1">
                {product.title}
              </h2>
              <p className="text-gray-600 text-sm mb-2">
                {product.brand ? `by ${product.brand}` : ""}
              </p>
              <ul className="text-sm text-gray-700 space-y-1 mb-3">
                {product.mostImportantFactors?.heading && (
                  <li>✅ {product.mostImportantFactors.heading}</li>
                )}
                {product.mostImportantFactors?.text && (
                  <li>⭐ {product.mostImportantFactors.text}</li>
                )}
              </ul>

              {/* Rating and Price */}
              <div className="flex items-center gap-4">
                {product.customRating && (
                  <span className="text-yellow-500 text-lg">
                    ⭐ {product.customRating.rating}/5
                  </span>
                )}
                {product.price?.displayAmount && (
                  <span className="text-green-600 font-semibold">
                    {product.price.displayAmount}
                  </span>
                )}
                {product.discount?.displayAmount && (
                  <span className="text-red-500 text-sm">
                    {product.discount.displayAmount}
                  </span>
                )}
              </div>
            </div>

            {/* Button */}
            <div className="mt-4 md:mt-0">
              <a
                href={product.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Check Price
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-10 space-x-2">
        <button
          onClick={() => handlePageChange(pageParam - 1)}
          disabled={pageParam === 1}
          className={`px-4 py-2 border rounded-lg ${
            pageParam === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`px-4 py-2 border rounded-lg ${
              pageParam === i + 1
                ? "bg-blue-500 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(pageParam + 1)}
          disabled={pageParam === totalPages}
          className={`px-4 py-2 border rounded-lg ${
            pageParam === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
