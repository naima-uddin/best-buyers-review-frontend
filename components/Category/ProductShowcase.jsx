"use client";
import { useEffect, useState } from "react";

export default function ProductShowcase() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // ✅ Fetch categories
  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => {
        const catArray = Array.isArray(data)
          ? data
          : data.data || data.categories || [];
        setCategories(catArray);
        if (catArray.length > 0) setSelectedCategory(catArray[0]); // default Home
      })
      .catch((err) => console.error("Category fetch error:", err));
  }, []);

  // ✅ Fetch products
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        const arr =
          data?.data?.products && Array.isArray(data.data.products)
            ? data.data.products
            : [];
        setProducts(arr);
      })
      .catch((err) => console.error("Product fetch error:", err));
  }, []);

  // ✅ Filter products by selected category
  useEffect(() => {
    if (selectedCategory && products.length > 0) {
      const filtered = products.filter(
        (p) =>
          p.mainCategory?.toLowerCase() ===
          selectedCategory.name?.toLowerCase()
      );
      setFilteredProducts(filtered);
    }
  }, [selectedCategory, products]);

  const categoryImages = {
    Home: "https://m.media-amazon.com/images/I/71B9y3zAaEL._AC_UY879_.jpg",
    Baby: "https://m.media-amazon.com/images/I/61pHAeWsdIL._AC_UY879_.jpg",
    Tools: "https://m.media-amazon.com/images/I/71sCzsnlFBL._AC_SL1500_.jpg",
    default: "https://m.media-amazon.com/images/I/71p1LPLc4pL._AC_UY879_.jpg",
  };

  if (!selectedCategory) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto border rounded-md bg-white mt-6">
      <div className="grid grid-cols-12">
        {/* ✅ Sidebar */}
        <div className="col-span-3 bg-cyan-500 text-white p-4 overflow-y-auto">
          <h2 className="text-2xl font-bold text-center mb-6">
            Categories
          </h2>

          {/* Main category list */}
          <ul className="space-y-4">
            {categories.map((cat) => (
              <li
                key={cat._id}
                className={`p-3 rounded-lg cursor-pointer transition ${
                  selectedCategory._id === cat._id
                    ? "bg-cyan-700"
                    : "hover:bg-cyan-600"
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                <img
                  src={categoryImages[cat.name] || categoryImages.default}
                  alt={cat.name}
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
                <h3 className="text-lg font-semibold text-center">{cat.name}</h3>

                {/* Subcategories (only for selected main category) */}
                {selectedCategory._id === cat._id &&
                  cat.subcategories?.length > 0 && (
                    <ul className="mt-2 space-y-1 text-center">
                      {cat.subcategories.map((sub) => (
                        <li
                          key={sub._id}
                          className="text-sm hover:underline cursor-pointer"
                        >
                          {sub.name}
                        </li>
                      ))}
                    </ul>
                  )}
              </li>
            ))}
          </ul>
        </div>

        {/* ✅ Middle: Category Image */}
        <div className="col-span-4 flex justify-center items-center border-x p-6">
          <img
            src={
              categoryImages[selectedCategory.name] || categoryImages.default
            }
            alt={selectedCategory.name}
            className="rounded-lg shadow-md max-h-[400px] object-contain"
          />
        </div>

        {/* ✅ Right: Product grid */}
        <div className="col-span-5 p-6 grid grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.length === 0 ? (
            <p className="col-span-3 text-gray-500 text-center">
              No products found
            </p>
          ) : (
            filteredProducts.slice(0, 9).map((item) => (
              <div
                key={item._id}
                className="flex flex-col items-center text-center bg-gray-50 p-4 rounded-lg shadow hover:shadow-lg transition"
              >
                <img
                  src={item.images && item.images[0]?.url}
                  alt={item.title}
                  className="h-24 object-contain mb-2"
                />
                <p className="text-sm font-medium line-clamp-2">
                  {item.title}
                </p>
                <p className="text-blue-600 font-semibold mt-1">
                  {item.price?.displayAmount || "N/A"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
