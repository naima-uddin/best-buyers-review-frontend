"use client";
import React, { useState } from "react";
import CategoryList from "./CategoryList";
import CategoryForm from "./CategoryForm";
import { Plus, ArrowLeft } from "lucide-react";

export default function CategoryManagement({
  categories,
  categoriesLoading,
  onRefresh,
}) {
  const [view, setView] = useState("list"); // "list" | "create" | "edit"
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCreatedOrUpdated = async () => {
    await onRefresh(); // 🔁 use parent’s refresh function from Dashboard
    setView("list");
    setSelectedCategory(null);
  };

  if (categoriesLoading) {
    return <p className="text-blue-600">Loading categories...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        {view !== "list" ? (
          <button
            onClick={() => {
              setView("list");
              setSelectedCategory(null);
            }}
            className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            <ArrowLeft size={18} />
            Back to Categories
          </button>
        ) : (
          <button
            onClick={() => setView("create")}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={18} />
            Create Category
          </button>
        )}
      </div>

      {/* CONTENT */}
      {view === "list" && (
        <CategoryList
          categories={categories}
          onUpdated={onRefresh}
          onEdit={(cat) => {
            setSelectedCategory(cat);
            setView("edit");
          }}
        />
      )}

      {view === "create" && (
        <CategoryForm
          onCreated={handleCreatedOrUpdated}
          categories={categories}
        />
      )}

      {view === "edit" && selectedCategory && (
        <CategoryForm
          onCreated={handleCreatedOrUpdated}
          categories={categories}
          editCategory={selectedCategory}
        />
      )}
    </div>
  );
}
