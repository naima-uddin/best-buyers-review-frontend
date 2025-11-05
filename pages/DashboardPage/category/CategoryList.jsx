"use client";
import React, { useEffect, useState } from "react";
import { ChevronRight, ChevronDown, Trash2, Pencil } from "lucide-react";
import api from "@/lib/api/axios";
import { getImageUrl } from "@/utils/imageHelper";
import Image from "next/image";

const CategoryList = ({ categories, onUpdated, onEdit }) => {
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

  // console.log(cats, "cats");

  // Recursive rendering function
  const renderCategories = (cats, level = 1) => {
    console.log(cats, "cats");

    console.log(`${process.env.NEXT_PUBLIC_IMAGE_API_URL}${cats?.[0].image}`);
    return (
      <ul className="space-y-2">
        {cats.map((cat) => {
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
                  {cat.children?.length > 0 && (
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

                  {/* Category Image */}
                  {cat.image && level <= 2 && (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_API_URL}${cat?.image}`}
                      alt={cat.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-cover rounded-md border"
                    />
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
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Pencil size={16} />
                  </button>

                  {userRole === "admin" && (
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Render Subcategories */}
              {expanded[cat._id] && cat.children?.length > 0 && (
                <div className="ml-6 border-l border-gray-200 pl-4">
                  {renderCategories(cat.children, level + 1)}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  // Top-level categories logging
  console.log("🚀 Initial categories received:", categories);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Category Management
      </h2>
      {categories.length === 0 ? (
        <p className="text-gray-500">No categories found.</p>
      ) : (
        renderCategories(categories)
      )}
    </div>
  );
};

export default CategoryList;
