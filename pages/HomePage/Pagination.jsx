"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Pagination() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // 10 per page

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const fetchProducts = async (pageNumber) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products?page=${pageNumber}&limit=${limit}`);
      const { products, pagination } = res.data.data;

      setProducts(products);
      setTotalPages(pagination.pages);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Products (Page {page})</h2>

      {/* Products List */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <div key={p._id} className="border rounded-lg p-3 shadow-sm">
            <img
              src={p.image || "/placeholder.png"}
              alt={p.title}
              className="w-full h-40 object-cover mb-2"
            />
            <h3 className="text-sm font-semibold">{p.title}</h3>
            <p className="text-xs text-gray-600">{p.asin}</p>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-6 gap-2">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(totalPages)].slice(0, 5).map((_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 border rounded ${
              page === i + 1 ? "bg-blue-500 text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
