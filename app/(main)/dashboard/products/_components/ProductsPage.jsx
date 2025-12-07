"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Package,
  X,
  ChevronDown,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/Table";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/Card";
import { Badge } from "@/ui/Badge";
import { Button } from "@/ui/Button";
import { useUserRole } from "../../context/UserRoleContext";

export default function ProductsPage() {
  const router = useRouter();
  const { userRole } = useUserRole();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Category states
  const [categories, setCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState("");
  const [mainCategorySearch, setMainCategorySearch] = useState("");
  const [subCategorySearch, setSubCategorySearch] = useState("");
  const [subSubCategorySearch, setSubSubCategorySearch] = useState("");
  const [showMainDropdown, setShowMainDropdown] = useState(false);
  const [showSubDropdown, setShowSubDropdown] = useState(false);
  const [showSubSubDropdown, setShowSubSubDropdown] = useState(false);

  // Helper functions to get categories
  const getMainCategories = () => {
    return categories.filter((cat) => cat.level === 1);
  };

  const getSubCategories = (mainCategoryId) => {
    if (!mainCategoryId) return [];
    const mainCategory = categories.find((cat) => cat._id === mainCategoryId);
    return mainCategory?.children || [];
  };

  const getSubSubCategories = (subCategoryId) => {
    if (!subCategoryId) return [];

    // First, find the main category that contains this sub category
    const mainCategory = categories.find((mainCat) =>
      mainCat.children?.some((subCat) => subCat._id === subCategoryId)
    );

    if (!mainCategory) return [];

    // Then find the specific sub category
    const subCategory = mainCategory.children?.find(
      (subCat) => subCat._id === subCategoryId
    );
    return subCategory?.children || [];
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setCategories(data || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products
  const fetchProducts = async (
    pageNum = 1,
    search = "",
    mainCat = "",
    subCat = "",
    subSubCat = ""
  ) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      let url = `${process.env.NEXT_PUBLIC_API_URL}/products?page=${pageNum}&limit=10`;

      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (mainCat) url += `&mainCategory=${mainCat}`;
      if (subCat) url += `&subCategory=${subCat}`;
      if (subSubCat) url += `&subSubCategory=${subSubCat}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });
      const result = await res.json();

      if (res.ok) {
        setProducts(result.data.products || []);
        setPage(result.data.pagination.page);
        setTotalPages(result.data.pagination.pages);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(
      page,
      searchQuery,
      selectedMainCategory,
      selectedSubCategory,
      selectedSubSubCategory
    );
  }, [page]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".category-dropdown")) {
        setShowMainDropdown(false);
        setShowSubDropdown(false);
        setShowSubSubDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle delete
  const handleDelete = async (asin, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${asin}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        alert("Product deleted successfully!");
        fetchProducts(
          page,
          searchQuery,
          selectedMainCategory,
          selectedSubCategory,
          selectedSubSubCategory
        );
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product");
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts(
      1,
      searchQuery,
      selectedMainCategory,
      selectedSubCategory,
      selectedSubSubCategory
    );
  };

  // Handle main category selection
  const selectMainCategory = (category) => {
    setSelectedMainCategory(category._id);
    setMainCategorySearch(category.name);
    setShowMainDropdown(false);

    // Reset sub and sub-sub categories
    setSelectedSubCategory("");
    setSubCategorySearch("");
    setSelectedSubSubCategory("");
    setSubSubCategorySearch("");

    setPage(1);
    fetchProducts(1, searchQuery, category._id, "", "");
  };

  // Handle sub category selection
  const selectSubCategory = (category) => {
    setSelectedSubCategory(category._id);
    setSubCategorySearch(category.name);
    setShowSubDropdown(false);

    // Reset sub-sub category
    setSelectedSubSubCategory("");
    setSubSubCategorySearch("");

    setPage(1);
    fetchProducts(1, searchQuery, selectedMainCategory, category._id, "");
  };

  // Handle sub-sub category selection
  const selectSubSubCategory = (category) => {
    setSelectedSubSubCategory(category._id);
    setSubSubCategorySearch(category.name);
    setShowSubSubDropdown(false);
    setPage(1);
    fetchProducts(
      1,
      searchQuery,
      selectedMainCategory,
      selectedSubCategory,
      category._id
    );
  };

  // Clear main category filter
  const clearMainCategory = () => {
    setSelectedMainCategory("");
    setMainCategorySearch("");
    setSelectedSubCategory("");
    setSubCategorySearch("");
    setSelectedSubSubCategory("");
    setSubSubCategorySearch("");
    setPage(1);
    fetchProducts(1, searchQuery, "", "", "");
  };

  // Clear sub category filter
  const clearSubCategory = () => {
    setSelectedSubCategory("");
    setSubCategorySearch("");
    setSelectedSubSubCategory("");
    setSubSubCategorySearch("");
    setPage(1);
    fetchProducts(1, searchQuery, selectedMainCategory, "", "");
  };

  // Clear sub-sub category filter
  const clearSubSubCategory = () => {
    setSelectedSubSubCategory("");
    setSubSubCategorySearch("");
    setPage(1);
    fetchProducts(
      1,
      searchQuery,
      selectedMainCategory,
      selectedSubCategory,
      ""
    );
  };

  // Filter categories based on search
  const filteredMainCategories = getMainCategories().filter((cat) =>
    cat.name.toLowerCase().includes(mainCategorySearch.toLowerCase())
  );

  const filteredSubCategories = getSubCategories(selectedMainCategory).filter(
    (cat) => cat.name.toLowerCase().includes(subCategorySearch.toLowerCase())
  );

  const filteredSubSubCategories = getSubSubCategories(
    selectedSubCategory
  ).filter((cat) =>
    cat.name.toLowerCase().includes(subSubCategorySearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Package className="h-8 w-8 text-blue-600" />
                Products
              </h1>
              <p className="text-gray-500 mt-1">
                Manage your Amazon products inventory
              </p>
            </div>

            <Button
              onClick={() => router.push("/dashboard/products/create")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
            >
              <Plus size={20} />
              Add Product
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              {/* Search input (commented out as per your original code) */}
              {/* <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search products by title, brand, or ASIN..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Search
                </Button>
              </div> */}

              {/* Category Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Main Category Dropdown */}
                <div className="relative category-dropdown">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Category
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search main category..."
                      value={mainCategorySearch}
                      onChange={(e) => setMainCategorySearch(e.target.value)}
                      onFocus={() => setShowMainDropdown(true)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-20"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                      {selectedMainCategory && (
                        <button
                          type="button"
                          onClick={clearMainCategory}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                          title="Clear selection"
                        >
                          <X size={16} className="text-gray-500" />
                        </button>
                      )}
                      <ChevronDown size={20} className="text-gray-400" />
                    </div>

                    {/* Dropdown */}
                    {showMainDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredMainCategories.length > 0 ? (
                          filteredMainCategories.map((category) => (
                            <button
                              key={category._id}
                              type="button"
                              onClick={() => selectMainCategory(category)}
                              className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                            >
                              <span className="font-medium text-gray-900">
                                {category.name}
                              </span>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-500">
                            No categories found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Sub Category Dropdown */}
                <div className="relative category-dropdown">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sub Category
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={
                        selectedMainCategory
                          ? "Search sub category..."
                          : "Select main category first"
                      }
                      value={subCategorySearch}
                      onChange={(e) => setSubCategorySearch(e.target.value)}
                      onFocus={() =>
                        selectedMainCategory && setShowSubDropdown(true)
                      }
                      disabled={!selectedMainCategory}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-20 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                      {selectedSubCategory && (
                        <button
                          type="button"
                          onClick={clearSubCategory}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                          title="Clear selection"
                        >
                          <X size={16} className="text-gray-500" />
                        </button>
                      )}
                      <ChevronDown size={20} className="text-gray-400" />
                    </div>

                    {/* Dropdown */}
                    {showSubDropdown && selectedMainCategory && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredSubCategories.length > 0 ? (
                          filteredSubCategories.map((category) => (
                            <button
                              key={category._id}
                              type="button"
                              onClick={() => selectSubCategory(category)}
                              className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                            >
                              <span className="font-medium text-gray-900">
                                {category.name}
                              </span>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-500">
                            No sub categories found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Sub-Sub Category Dropdown */}
                <div className="relative category-dropdown">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sub-Sub Category
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={
                        selectedSubCategory
                          ? "Search sub-sub category..."
                          : "Select sub category first"
                      }
                      value={subSubCategorySearch}
                      onChange={(e) => setSubSubCategorySearch(e.target.value)}
                      onFocus={() =>
                        selectedSubCategory && setShowSubSubDropdown(true)
                      }
                      disabled={!selectedSubCategory}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-20 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                      {selectedSubSubCategory && (
                        <button
                          type="button"
                          onClick={clearSubSubCategory}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                          title="Clear selection"
                        >
                          <X size={16} className="text-gray-500" />
                        </button>
                      )}
                      <ChevronDown size={20} className="text-gray-400" />
                    </div>

                    {/* Dropdown */}
                    {showSubSubDropdown && selectedSubCategory && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredSubSubCategories.length > 0 ? (
                          filteredSubSubCategories.map((category) => (
                            <button
                              key={category._id}
                              type="button"
                              onClick={() => selectSubSubCategory(category)}
                              className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                            >
                              <span className="font-medium text-gray-900">
                                {category.name}
                              </span>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-500">
                            No sub-sub categories found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Rest of your component remains exactly the same */}
        {/* Products Table */}
        <Card>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                  No products found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by adding a new product.
                </p>
                <div className="mt-6">
                  <Button
                    onClick={() => router.push("/dashboard/products/create")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
                  >
                    <Plus size={16} />
                    Add Product
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-100">
                        <TableHead className="w-16 font-bold text-gray-700">
                          #
                        </TableHead>
                        <TableHead className="min-w-[400px] font-bold text-gray-700">
                          Product
                        </TableHead>
                        <TableHead className="font-bold text-gray-700">
                          Brand
                        </TableHead>
                        <TableHead className="font-bold text-gray-700">
                          Price
                        </TableHead>
                        <TableHead className="font-bold text-gray-700">
                          Rating
                        </TableHead>
                        <TableHead className="font-bold text-gray-700">
                          Status
                        </TableHead>
                        <TableHead className="text-right font-bold text-gray-700">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product, index) => (
                        <TableRow
                          key={product._id || product.asin}
                          className="hover:bg-blue-50/50 transition-colors"
                        >
                          <TableCell className="font-semibold text-gray-600">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm">
                              {(page - 1) * 10 + index + 1}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-start gap-4">
                              <div className="h-16 w-16 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 shadow-sm border border-gray-200">
                                <img
                                  src={
                                    product.images?.find(
                                      (img) => img.variant === "MAIN"
                                    )?.url || "/placeholder-image.jpg"
                                  }
                                  alt={product.title}
                                  className="h-full w-full object-cover hover:scale-110 transition-transform duration-200"
                                  onError={(e) => {
                                    e.target.src = "/placeholder-image.jpg";
                                  }}
                                />
                              </div>
                              <div className="min-w-0 flex-1 py-1">
                                <p
                                  className="font-semibold text-gray-900 line-clamp-2 leading-snug mb-1.5 hover:text-blue-600 transition-colors cursor-default"
                                  title={product.title}
                                >
                                  {product.title}
                                </p>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded">
                                    ASIN: {product.asin}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium text-gray-800 px-2 py-1 bg-gray-50 rounded">
                              {product.brand || "N/A"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-0.5">
                              <span className="font-bold text-gray-900 text-base">
                                ${product.price?.amount?.toFixed(2) || "0.00"}
                              </span>
                              {product.listPrice?.amount >
                                product.price?.amount && (
                                <span className="text-xs text-gray-500 line-through">
                                  ${product.listPrice?.amount?.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                              <span className="text-yellow-500 text-lg">★</span>
                              <span className="font-bold text-gray-900">
                                {product.customRating?.rating?.toFixed(1) ||
                                  "N/A"}
                              </span>
                              <span className="text-xs text-gray-500">
                                ({product.customRating?.reviewCount || 0})
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1.5">
                              {product.isFeatured && (
                                <Badge
                                  variant="success"
                                  className="font-medium"
                                >
                                  Featured
                                </Badge>
                              )}
                              {product.isFullReview && (
                                <Badge
                                  variant="default"
                                  className="font-medium"
                                >
                                  Full Review
                                </Badge>
                              )}
                              {product.isCoupon && (
                                <Badge
                                  variant="warning"
                                  className="font-medium"
                                >
                                  Coupon
                                </Badge>
                              )}
                              {!product.isFeatured &&
                                !product.isFullReview &&
                                !product.isCoupon && (
                                  <Badge
                                    variant="outline"
                                    className="font-medium"
                                  >
                                    Standard
                                  </Badge>
                                )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() =>
                                  router.push(
                                    `/dashboard/products/${product._id}`
                                  )
                                }
                                className="p-2.5 text-green-600 hover:bg-green-50 rounded-lg transition-all hover:shadow-md hover:scale-105 border border-transparent hover:border-green-200"
                                title="View product"
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                onClick={() =>
                                  router.push(
                                    `/dashboard/products/${product?._id}/edit`
                                  )
                                }
                                className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all hover:shadow-md hover:scale-105 border border-transparent hover:border-blue-200"
                                title="Edit product"
                              >
                                <Edit size={18} />
                              </button>
                              {userRole === "admin" && (
                                <button
                                  onClick={() =>
                                    handleDelete(product.asin, product.title)
                                  }
                                  className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all hover:shadow-md hover:scale-105 border border-transparent hover:border-red-200"
                                  title="Delete product"
                                >
                                  <Trash2 size={18} />
                                </button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                    <div className="text-sm text-gray-700">
                      Page <span className="font-medium">{page}</span> of{" "}
                      <span className="font-medium">{totalPages}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                      >
                        <ChevronLeft size={16} />
                        Previous
                      </Button>
                      <Button
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                      >
                        Next
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
