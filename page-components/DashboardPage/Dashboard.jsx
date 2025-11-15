@ -1,4 +1,3 @@
// Dashboard.jsx - UPDATED
"use client";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
@ -10,13 +9,6 @@ import UserManagement from "./UserManagement";
import Categories from "./category/CategoryPage";
import CategoryFilters from "../DashboardPage/category/CategoryFilters";

// ✅ Shorter Flatten Function
const flattenCategories = (nodes) =>
  nodes.flatMap((n) => [
    { _id: n._id, name: n.name, parent: n.parent, level: n.level, children: n.children || [] },
    ...(n.children ? flattenCategories(n.children) : []),
  ]);

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("view-products");
  const [products, setProducts] = useState([]);
@ -55,7 +47,6 @@ export default function Dashboard() {
        const data = await res.json();
        console.log("✅ Categories loaded:", data.length);
        
        // Store both hierarchical and flattened versions
        setCategories(data || []);
        
      } catch (error) {
@ -67,7 +58,7 @@ export default function Dashboard() {
    };

    fetchCategories();
  }, []); // Empty dependency array - runs only once on mount
  }, []);

  // ✅ Fetch products
  const fetchProducts = async (pageNum = 1) => {
@ -279,95 +270,96 @@ export default function Dashboard() {
    }
  };

  // ✅ Clean Section Rendering - PASS CATEGORIES TO ALL COMPONENTS
  const renderSection = () => {
    switch (activeSection) {
      case "add-product":
        return (
          <ProductForm 
            onSubmit={fetchProducts} 
            onCancel={handleBackToList}
            categories={categories} // Pass categories
            categoriesLoading={categoriesLoading}
          />
        );
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

      case "view-products":
        return (
          <>
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
          </>
        );
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

      case "edit-product":
        return (
          <ProductEdit
            product={editingProduct}
            onSave={handleSaveEdit}
            onCancel={handleBackToList}
            categories={categories} // Pass categories
            categoriesLoading={categoriesLoading}
          />
        );
  const AddProductSection = () => (
    <ProductForm 
      onSubmit={fetchProducts} 
      onCancel={handleBackToList}
      categories={categories}
      categoriesLoading={categoriesLoading}
    />
  );

      case "view-product":
        return (
          <ProductView product={viewingProduct} onClose={handleBackToList} />
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

      case "categories":
        return (
          <Categories 
            categories={categories} // Pass categories
            categoriesLoading={categoriesLoading}
            onRefresh={refreshCategories} // Pass refresh function
          />
        );
  const ViewProductSection = () => (
    <ProductView product={viewingProduct} onClose={handleBackToList} />
  );

      case "user-management":
        return <UserManagement />;
  const CategoriesSection = () => (
    <Categories 
      categories={categories}
      categoriesLoading={categoriesLoading}
      onRefresh={refreshCategories}
    />
  );

      default:
        return null;
    }
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
@ -388,7 +380,7 @@ export default function Dashboard() {
            <p className="text-sm text-blue-700">Loading categories...</p>
          </div>
        )}
        {renderSection()}
        {renderContent()}
      </div>
    </div>
  );