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

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("view-products");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [userRole, setUserRole] = useState("admin");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  
  // ✅ CATEGORIES STATE - Load once and share across components
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [selectedMain, setSelectedMain] = useState("");
  const [selectedSub, setSelectedSub] = useState("");

  // ✅ Fetch Categories ONCE when dashboard loads
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        console.log("🔄 Loading categories...");
        
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        if (!res.ok) throw new Error('Failed to fetch categories');
        
        const data = await res.json();
        console.log("✅ Categories loaded:", data.length);
        
        setCategories(data || []);
        
      } catch (error) {
        console.error("❌ Category fetch failed:", error);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // ✅ Fetch products
  const fetchProducts = async (pageNum = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      let url = `${process.env.NEXT_PUBLIC_API_URL}/products?page=${pageNum}&limit=10`;

      if (selectedSub) url += `&subCategory=${selectedSub}`;
      else if (selectedMain) url += `&mainCategory=${selectedMain}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
    if (
      activeSection === "view-products" &&
      !editingProduct &&
      !viewingProduct
    ) {
      fetchProducts(page);
    }
  }, [
    activeSection,
    editingProduct,
    viewingProduct,
    page,
    selectedMain,
    selectedSub,
  ]);

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
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${product.asin}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchProducts(page);
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  const handleSaveEdit = async (updatedProduct) => {
    try {
      const token = localStorage.getItem("token");

      // Convert empty strings to null for ObjectId fields
      const cleanObjectIdFields = (obj) => {
        const cleaned = { ...obj };
        ['mainCategory', 'subCategory', 'subSubCategory'].forEach(field => {
          if (cleaned[field] === '') {
            cleaned[field] = null;
          }
        });
        return cleaned;
      };

      const cleanedProduct = cleanObjectIdFields(updatedProduct);

      const updateData = {
        // Basic Information
        title: cleanedProduct.title || "",
        brand: cleanedProduct.brand || "",
        labels: cleanedProduct.labels || [],
        mainCategory: cleanedProduct.mainCategory || null,
        subCategory: cleanedProduct.subCategory || null,
        subSubCategory: cleanedProduct.subSubCategory || null,
        affiliateUrl: cleanedProduct.affiliateUrl || "",
        isFeatured: cleanedProduct.isFeatured || false,
        isFullReview: cleanedProduct.isFullReview || false,
        isCoupon: cleanedProduct.isCoupon || false,

        // Pricing
        price: cleanedProduct.price || { amount: 0, currency: "USD", displayAmount: "$0.00" },
        listPrice: cleanedProduct.listPrice || { amount: 0, currency: "USD", displayAmount: "$0.00" },
        discount: cleanedProduct.discount || { amount: 0, currency: "USD", displayAmount: "0%", percentage: 0 },

        // Custom Rating
        customRating: cleanedProduct.customRating || { rating: 0, reviewCount: 0 },

        // Images
        images: cleanedProduct.images || [],

        // Features & Content
        features: cleanedProduct.features || { feature: [] },
        colors: cleanedProduct.colors || [],
        styles: cleanedProduct.styles || [],
        specifications: cleanedProduct.specifications || [],
        customReviews: cleanedProduct.customReviews || [],
        anchorTags: cleanedProduct.anchorTags || [],

        // SEO
        seo: cleanedProduct.seo || { title: "", description: "", keywords: [] },

        // Description
        descriptionTitle: cleanedProduct.descriptionTitle || "",
        introduction: cleanedProduct.introduction || "",
        description: cleanedProduct.description || "",

        // Factors
        factorsToConsider: cleanedProduct.factorsToConsider || [],
        mostImportantFactors: cleanedProduct.mostImportantFactors || { heading: "", text: "" },

        // Common Questions
        commonQuestions: cleanedProduct.commonQuestions || [],

        // Conclusion
        conclusion: cleanedProduct.conclusion || { heading: "", text: "" },

        // Status
        availability: cleanedProduct.availability || "In Stock",
        isActive: cleanedProduct.isActive !== undefined ? cleanedProduct.isActive : true,
      };

      console.log("🚀 FINAL UPDATE DATA:", updateData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${updatedProduct.asin}`,
        {
          method: "PATCH",
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
        fetchProducts(page);
      } else {
        console.error("Backend error:", result);
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

  const handleLogout = () => {
    if (confirm("Log out?")) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  };

  // ✅ Refresh categories function (for Categories page)
  const refreshCategories = async () => {
    try {
      setCategoriesLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      const data = await res.json();
      setCategories(data || []);
    } catch (error) {
      console.error("❌ Category refresh failed:", error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // ✅ FIXED: Create separate components for each section to avoid hook order issues
  const ViewProductsSection = () => (
    <div>
      <CategoryFilters
        categories={categories}
        categoriesLoading={categoriesLoading}
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
    </div>
  );

  const AddProductSection = () => (
    <ProductForm 
      onSubmit={fetchProducts} 
      onCancel={handleBackToList}
      categories={categories}
      categoriesLoading={categoriesLoading}
    />
  );

  const EditProductSection = () => (
    <ProductEdit
      product={editingProduct}
      onSave={handleSaveEdit}
      onCancel={handleBackToList}
      categories={categories}
      categoriesLoading={categoriesLoading}
    />
  );

  const ViewProductSection = () => (
    <ProductView product={viewingProduct} onClose={handleBackToList} />
  );

  const CategoriesSection = () => (
    <Categories 
      categories={categories}
      categoriesLoading={categoriesLoading}
      onRefresh={refreshCategories}
    />
  );

  const UserManagementSection = () => (
    <UserManagement />
  );

  // ✅ FIXED: Simple conditional rendering without switch statement
  const renderContent = () => {
    if (activeSection === "add-product") return <AddProductSection />;
    if (activeSection === "edit-product") return <EditProductSection />;
    if (activeSection === "view-product") return <ViewProductSection />;
    if (activeSection === "categories") return <CategoriesSection />;
    if (activeSection === "user-management") return <UserManagementSection />;
    
    // Default: view-products
    return <ViewProductsSection />;
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
        {/* Show loading state for categories if needed */}
        {categoriesLoading && activeSection !== "categories" && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">Loading categories...</p>
          </div>
        )}
        {renderContent()}
      </div>
    </div>
  );
}