"use client";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";
import ProductView from "./ProductView";
import ProductEdit from "./ProductEdit";
import UserManagement from "./UserManagement";
import Categories from "./category/CategoryPage";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("view-products");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [userRole, setUserRole] = useState("admin"); // Get this from auth context
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  // ✅ Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://best-buyers-review-backend-q2rp.onrender.com/api/categories");
        const data = await res.json();
        setCategories(data || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // ✅ Fetch products (with category filter)
  const fetchProducts = async (pageNum = 1, categoryId = "") => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      let url = `https://best-buyers-review-backend-q2rp.onrender.com/api/products?page=${pageNum}&limit=10`;
      if (categoryId) url += `&category=${categoryId}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();

      if (response.ok) {
        setProducts(result.data?.products || []);
        if (result.data?.pagination) {
          setPage(result.data.pagination.page);
          setPages(result.data.pagination.pages);
        }
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reload when section/view/page/category changes
  useEffect(() => {
    if (activeSection === "view-products" && !editingProduct && !viewingProduct) {
      fetchProducts(page, selectedCategory);
    }
  }, [activeSection, editingProduct, viewingProduct, page, selectedCategory]);

  // Handle edit
  const handleEdit = (product) => {
    setEditingProduct(product);
    setActiveSection("edit-product");
  };

  // Handle view
  const handleView = (product) => {
    setViewingProduct(product);
    setActiveSection("view-product");
  };

  // Handle delete
  const handleDelete = async (product) => {
    if (confirm(`Are you sure you want to delete "${product.title}"?`)) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `https://best-buyers-review-backend-q2rp.onrender.com/api/products/${product.asin}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (response.ok) {
          alert("Product deleted successfully!");
          fetchProducts(page, selectedCategory);
        } else {
          alert(result.message || "Failed to delete product");
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("Error deleting product");
      }
    }
  };

  // Handle save edit
  const handleSaveEdit = async (updatedProduct) => {
    try {
      const token = localStorage.getItem("token");

      const updateData = {
        title: updatedProduct.title,
        brand: updatedProduct.brand,
        mainCategory: updatedProduct.mainCategory,
        subCategory: updatedProduct.subCategory,
        subSubCategory: updatedProduct.subSubCategory,
        images: updatedProduct.images,
        price: updatedProduct.price,
        listPrice: updatedProduct.listPrice,
        discount: updatedProduct.discount,
        customRating: updatedProduct.customRating,
        features: updatedProduct.features,
        colors: updatedProduct.colors,
        styles: updatedProduct.styles,
        specifications: updatedProduct.specifications,
        customReviews: updatedProduct.customReviews,
        seo: updatedProduct.seo,
        description: updatedProduct.description,
        descriptionTitle: updatedProduct.descriptionTitle,
        introduction: updatedProduct.introduction,
        factorsToConsider: updatedProduct.factorsToConsider,
        mostImportantFactors: updatedProduct.mostImportantFactors,
        commonQuestions: updatedProduct.commonQuestions,
        conclusion: updatedProduct.conclusion,
        affiliateUrl: updatedProduct.affiliateUrl,
        isFeatured: updatedProduct.isFeatured,
        availability: updatedProduct.availability || "In Stock",
        anchorTags: updatedProduct.anchorTags || [],
      };

      const response = await fetch(
        `https://best-buyers-review-backend-q2rp.onrender.com/api/products/${updatedProduct.asin}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Product updated successfully!");
        setEditingProduct(null);
        setActiveSection("view-products");
        fetchProducts(page, selectedCategory);
      } else {
        alert(result.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Error updating product");
    }
  };

  const handleBackToList = () => {
    setEditingProduct(null);
    setViewingProduct(null);
    setActiveSection("view-products");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserRole(payload.role);
      } catch (error) {
        console.error("Error parsing token:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onBackToList={
          editingProduct || viewingProduct ? handleBackToList : null
        }
        userRole={userRole}
        onLogout={handleLogout}
      />

      <div className="ml-64 flex-1 p-8">
        {activeSection === "add-product" && (
          <ProductForm
            onSubmit={() => fetchProducts(page, selectedCategory)}
            onCancel={() => setActiveSection("view-products")}
          />
        )}

        {activeSection === "view-products" &&
          !editingProduct &&
          !viewingProduct && (
            <>
              {/* ✅ Category Filter Dropdown */}
              <div className="flex justify-center mb-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setPage(1); // reset to first page when changing category
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <ProductList
                products={products}
                loading={loading}
                onRefresh={() => fetchProducts(page, selectedCategory)}
                onEdit={handleEdit}
                onView={handleView}
                onDelete={handleDelete}
              />

              {/* Pagination Controls */}
              <div className="flex justify-center items-center space-x-2 mt-6">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-[#2738F5] text-white rounded-lg disabled:opacity-50"
                >
                  Prev
                </button>

                <span className="text-gray-700 text-sm">
                  Page {page} of {pages}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  disabled={page === pages}
                  className="px-4 py-2 bg-[#2738F5] text-white rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}

        {activeSection === "edit-product" && editingProduct && (
          <ProductEdit
            product={editingProduct}
            onSave={handleSaveEdit}
            onCancel={handleBackToList}
          />
        )}

        {activeSection === "view-product" && viewingProduct && (
          <ProductView product={viewingProduct} onClose={handleBackToList} />
        )}

        {activeSection === "categories" && <Categories />}

        {activeSection === "user-management" && <UserManagement />}
      </div>
    </div>
  );
}
