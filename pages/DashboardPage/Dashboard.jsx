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

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/products",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      if (response.ok) {
        setProducts(result.data?.products || []);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      activeSection === "view-products" &&
      !editingProduct &&
      !viewingProduct
    ) {
      fetchProducts();
    }
  }, [activeSection, editingProduct, viewingProduct]);

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
          `http://localhost:5000/api/products/${product.asin}`,
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
          fetchProducts(); // This should now exclude the soft-deleted product
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

      // Create update data - MAKE SURE TO INCLUDE anchorTags
      const updateData = {
        // Basic Information
        title: updatedProduct.title,
        brand: updatedProduct.brand,
        mainCategory: updatedProduct.mainCategory,
        subCategory: updatedProduct.subCategory,
        subSubCategory: updatedProduct.subSubCategory,

        // Images
        images: updatedProduct.images,

        // Pricing
        price: updatedProduct.price,
        listPrice: updatedProduct.listPrice,
        discount: updatedProduct.discount,

        // Custom Rating
        customRating: updatedProduct.customRating,

        // Features & Content
        features: updatedProduct.features,
        colors: updatedProduct.colors,
        styles: updatedProduct.styles,
        specifications: updatedProduct.specifications,
        customReviews: updatedProduct.customReviews,

        // SEO
        seo: updatedProduct.seo,

        // Description Content
        description: updatedProduct.description,
        descriptionTitle: updatedProduct.descriptionTitle,
        introduction: updatedProduct.introduction,
        factorsToConsider: updatedProduct.factorsToConsider,
        mostImportantFactors: updatedProduct.mostImportantFactors,
        commonQuestions: updatedProduct.commonQuestions,
        conclusion: updatedProduct.conclusion,

        // Affiliate & Status
        affiliateUrl: updatedProduct.affiliateUrl,
        isFeatured: updatedProduct.isFeatured,
        availability: updatedProduct.availability || "In Stock",

        anchorTags: updatedProduct.anchorTags || [],
      };

      const response = await fetch(
        `http://localhost:5000/api/products/${updatedProduct.asin}`,
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
        fetchProducts();
      } else {
        alert(result.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Error updating product");
    }
  };

  // Back to products list
  const handleBackToList = () => {
    setEditingProduct(null);
    setViewingProduct(null);
    setActiveSection("view-products");
  };

  // Get user role from auth context or token
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

  // Handle logout
  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // redirect to login page
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
            onSubmit={fetchProducts}
            onCancel={() => setActiveSection("view-products")}
          />
        )}

        {activeSection === "view-products" &&
          !editingProduct &&
          !viewingProduct && (
            <ProductList
              products={products}
              loading={loading}
              onRefresh={fetchProducts}
              onEdit={handleEdit}
              onView={handleView}
              onDelete={handleDelete}
            />
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
