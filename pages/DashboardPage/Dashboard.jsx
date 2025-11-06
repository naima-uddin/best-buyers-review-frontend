"use client";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";
import ProductView from "./ProductView";
import ProductEdit from "./ProductEdit";
import UserManagement from "./UserManagement";
import Categories from "./category/CategoryPage";
import CategoryFilters from "../DashboardPage/category/CategoryFilters";

// ✅ Shorter Flatten Function
const flattenCategories = (nodes) =>
  nodes.flatMap((n) => [
    { _id: n._id, name: n.name, parent: n.parent, level: n.level },
    ...(n.children ? flattenCategories(n.children) : []),
  ]);

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("view-products");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [userRole, setUserRole] = useState("admin");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [selectedMain, setSelectedMain] = useState("");
  const [selectedSub, setSelectedSub] = useState("");

  // ✅ Fetch Categories
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
        const data = await res.json();
        setCategories(flattenCategories(data));
      } catch (e) {
        console.error("Category fetch failed:", e);
      }
    })();
  }, []);

  // ✅ Fetch products
  const fetchProducts = async (pageNum = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      let url = `${process.env.NEXT_PUBLIC_API_URL}/products?page=${pageNum}&limit=10`;

      if (selectedSub) url += `&subCategory=${selectedSub}`;
      else if (selectedMain) url += `&mainCategory=${selectedMain}`;

      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();

      if (res.ok) {
        setProducts(result.data.products || []);
        setPage(result.data.pagination.page);
        setPages(result.data.pagination.pages);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // 🧲 Reload Products When Filters or Section Change
  useEffect(() => {
    if (activeSection === "view-products" && !editingProduct && !viewingProduct) {
      fetchProducts(page);
    }
  }, [activeSection, editingProduct, viewingProduct, page, selectedMain, selectedSub]);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setActiveSection("edit-product");
  };

  const handleView = (product) => {
    setViewingProduct(product);
    setActiveSection("view-product");
  };

  const handleDelete = async (product) => {
    if (!confirm(`Delete "${product.title}"?`)) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${product.asin}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts(page);
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  const handleSaveEdit = () => {
    setEditingProduct(null);
    setActiveSection("view-products");
    fetchProducts(page);
  };

  const handleBackToList = () => {
    setEditingProduct(null);
    setViewingProduct(null);
    setActiveSection("view-products");
  };

  const handleLogout = () => {
    if (confirm("Log out?")) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  };

  // ✅ Clean Section Rendering
  const renderSection = () => {
    switch (activeSection) {
      case "add-product":
        return <ProductForm onSubmit={fetchProducts} onCancel={handleBackToList} />;

      case "view-products":
        return (
          <>
            <CategoryFilters
              categories={categories}
              selectedMain={selectedMain}
              setSelectedMain={setSelectedMain}
              selectedSub={selectedSub}
              setSelectedSub={setSelectedSub}
              setPage={setPage}
            />
            <ProductList
              products={products}
              loading={loading}
              onRefresh={fetchProducts}
              onEdit={handleEdit}
              onView={handleView}
              onDelete={handleDelete}
            />

            <div className="flex justify-center items-center space-x-2 mt-6">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-[#2738F5] text-white rounded-lg disabled:opacity-50">
                Prev
              </button>

              <span className="text-gray-700 text-sm">Page {page} of {pages}</span>

              <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages} className="px-4 py-2 bg-[#2738F5] text-white rounded-lg disabled:opacity-50">
                Next
              </button>
            </div>
          </>
        );

      case "edit-product":
        return <ProductEdit product={editingProduct} onSave={handleSaveEdit} onCancel={handleBackToList} />;

      case "view-product":
        return <ProductView product={viewingProduct} onClose={handleBackToList} />;

      case "categories":
        return <Categories />;

      case "user-management":
        return <UserManagement />;

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} onBackToList={editingProduct || viewingProduct ? handleBackToList : null} userRole={userRole} onLogout={handleLogout} />
      <div className="ml-64 flex-1 p-8">{renderSection()}</div>
    </div>
  );
}
