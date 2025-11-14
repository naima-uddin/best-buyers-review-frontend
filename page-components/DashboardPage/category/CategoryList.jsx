"use client";
import React, { useEffect, useState } from "react";
import { ChevronRight, ChevronDown, Trash2, Pencil } from "lucide-react";
import api from "@/lib/api/axios";
import { getImageUrl } from "@/utils/imageHelper";
import Image from "next/image";

const CategoryList = ({ categories, onUpdated, onEdit, categoriesLoading }) => {
  const [expanded, setExpanded] = useState({});
  const [userRole, setUserRole] = useState("admin");

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

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category and all subcategories?")) return;
    try {
      console.log("🗑️ Deleting category with ID:", id);
      await api.delete(`/categories/${id}`);
      onUpdated();
    } catch (err) {
      console.error("❌ Delete failed:", err);
    }
  };

  // Recursive rendering function - FIXED
  const renderCategories = (cats, level = 1) => {
    if (!cats || cats.length === 0) {
      return <p className="text-gray-500 p-2">No categories found.</p>;
    }

    return (
      <ul className="space-y-2">
        {cats.map((cat) => {
          // Safely check for children
          const hasChildren = cat.children && cat.children.length > 0;

          return (
            <li key={cat._id}>
              <div
                className={`flex items-center justify-between p-2 rounded-lg transition ${
                  level === 1
                    ? "bg-gray-100 hover:bg-gray-200"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  {/* Expand/Collapse Button */}
                  {hasChildren && (
                    <button
                      onClick={() => toggleExpand(cat._id)}
                      className="text-gray-600 hover:text-black"
                    >
                      {expanded[cat._id] ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>
                  )}

                  {/* Category Image - FIXED image display */}
                  {cat.image && level <= 2 && (
                    <div className="w-10 h-10 flex-shrink-0">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_API_URL || ""}${
                          cat.image
                        }`}
                        alt={cat.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 object-cover rounded-md border"
                        onError={(e) => {
                          console.error("Image failed to load:", cat.image);
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}

                  {/* Category Name */}
                  <span
                    className={`font-medium ${
                      level === 1 ? "text-gray-900" : "text-gray-700"
                    }`}
                  >
                    {cat.name}
                  </span>
                </div>

                {/* Edit / Delete Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      console.log("✏️ Editing category:", cat);
                      onEdit(cat);
                    }}
                    className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                    title="Edit Category"
                  >
                    <Pencil size={16} />
                  </button>

                  {userRole === "admin" && (
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                      title="Delete Category"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Render Subcategories - FIXED conditional rendering */}
              {expanded[cat._id] && hasChildren && (
                <div className="ml-6 border-l border-gray-200 pl-4 mt-2">
                  {renderCategories(cat.children, level + 1)}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  // Show loading state
  if (categoriesLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Category Management
        </h2>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading categories...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Category Management
      </h2>

      {/* Categories summary */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          Total categories loaded: <strong>{categories?.length || 0}</strong>
        </p>
      </div>

      {!categories || categories.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📁</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No categories found
          </h3>
          <p className="text-gray-600">
            Create your first category to get started.
          </p>
        </div>
      ) : (
        renderCategories(categories)
      )}
    </div>
  );
};

export default CategoryList;
