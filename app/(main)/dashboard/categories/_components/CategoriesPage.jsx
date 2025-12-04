"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  FolderTree,
  Layers,
  X,
  ChevronRight,
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
import { Card, CardContent } from "@/ui/Card";
import { Badge } from "@/ui/Badge";
import { Button } from "@/ui/Button";
import { useUserRole } from "../../context/UserRoleContext";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default function CategoriesPage() {
  const router = useRouter();
  const { userRole } = useUserRole();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  // Toggle category expansion - optimized with useCallback
  const toggleCategory = useCallback((categoryId) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  }, []);

  // Flatten categories for search display
  const flattenCategories = (nodes, level = 0, parentName = "") => {
    let result = [];
    nodes.forEach((node) => {
      result.push({
        ...node,
        level,
        parentName,
      });
      if (node.children && node.children.length > 0) {
        result = result.concat(
          flattenCategories(node.children, level + 1, node.name)
        );
      }
    });
    return result;
  };

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setCategories(data || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle delete
  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        alert("Category deleted successfully!");
        fetchCategories();
      } else {
        alert("Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Error deleting category");
    }
  };

  // Recursive function to render category rows
  const renderCategoryRow = (category, index, level = 0) => {
    const isExpanded = expandedCategories.has(category._id);
    const hasChildren = category.children && category.children.length > 0;

    return (
      <React.Fragment key={category._id}>
        <TableRow className="hover:bg-purple-50/50 transition-colors">
          <TableCell className="font-semibold text-gray-600">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700 text-sm">
              {index + 1}
            </div>
          </TableCell>
          <TableCell>
            <div
              className="flex items-start gap-4"
              style={{
                paddingLeft: `${level * 24}px`,
              }}
            >
              {/* Expand/Collapse Button */}
              {hasChildren ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCategory(category._id);
                  }}
                  className="flex-shrink-0 p-1 hover:bg-purple-100 rounded transition-colors mt-4"
                  title={isExpanded ? "Collapse" : "Expand"}
                  type="button"
                >
                  {isExpanded ? (
                    <ChevronDown size={20} className="text-purple-600" />
                  ) : (
                    <ChevronRight size={20} className="text-purple-600" />
                  )}
                </button>
              ) : (
                <div className="flex-shrink-0 w-7" />
              )}

              {/* Category Image */}
              <div className="h-16 w-16 rounded-xl overflow-hidden bg-gradient-to-br from-purple-100 to-purple-200 flex-shrink-0 shadow-sm border border-purple-200 flex items-center justify-center">
                {category.image ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${category.image}`}
                    alt={category.name}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover hover:scale-110 transition-transform duration-200"
                  />
                ) : // <img
                //   src={`${process.env.NEXT_PUBLIC_IMAGE_API_URL}/${category.image}`}
                //   alt={category.name}
                //   className="h-full w-full object-cover hover:scale-110 transition-transform duration-200"
                //   onError={(e) => {
                //     e.target.style.display = "none";
                //     e.target.nextSibling.style.display = "flex";
                //   }}
                // />
                null}
                <div
                  className={`${
                    category.image ? "hidden" : "flex"
                  } items-center justify-center h-full w-full`}
                >
                  <Layers className="h-8 w-8 text-purple-400" />
                </div>
              </div>

              {/* Category Name */}
              <div className="min-w-0 flex-1 py-1">
                <div className="flex items-center gap-2 mb-1">
                  <p
                    className="font-semibold text-gray-900 line-clamp-2 leading-snug hover:text-purple-600 transition-colors cursor-default"
                    title={category.name}
                  >
                    {category.name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded">
                    ID: {category._id?.slice(-8) || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <Badge
              variant={level === 0 ? "default" : "secondary"}
              className="font-medium"
            >
              {level === 0 ? "Main" : "Sub"}
            </Badge>
          </TableCell>
          <TableCell>
            <span className="font-medium text-gray-800 px-2 py-1 bg-gray-50 rounded">
              {level === 0 ? "—" : category.parentCategory?.name || "—"}
            </span>
          </TableCell>
          <TableCell>
            <div className="flex justify-center">
              <div className="flex items-center gap-1.5 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                <FolderTree className="h-4 w-4 text-indigo-600" />
                <span className="font-bold text-gray-900">
                  {category.children?.length || 0}
                </span>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() =>
                  router.push(`/dashboard/categories/${category._id}/edit`)
                }
                className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all hover:shadow-md hover:scale-105 border border-transparent hover:border-blue-200"
                title="Edit category"
              >
                <Edit size={18} />
              </button>
              {userRole === "admin" && (
                <button
                  onClick={() => handleDelete(category._id, category.name)}
                  className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all hover:shadow-md hover:scale-105 border border-transparent hover:border-red-200"
                  title="Delete category"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </TableCell>
        </TableRow>

        {/* Render children if expanded */}
        {isExpanded &&
          hasChildren &&
          category.children.map((child, childIndex) =>
            renderCategoryRow(child, childIndex, level + 1)
          )}
      </React.Fragment>
    );
  };

  // Expand/Collapse all handlers - optimized
  const handleExpandAll = useCallback(() => {
    const allIds = new Set();
    const collectIds = (cats) => {
      cats.forEach((cat) => {
        if (cat.children && cat.children.length > 0) {
          allIds.add(cat._id);
          collectIds(cat.children);
        }
      });
    };
    collectIds(categories);
    setExpandedCategories(allIds);
  }, [categories]);

  const handleCollapseAll = useCallback(() => {
    setExpandedCategories(new Set());
  }, []);

  // Filter categories by search - memoized
  const flatCategories = useMemo(
    () => flattenCategories(categories),
    [categories]
  );
  const filteredCategories = useMemo(
    () =>
      searchQuery
        ? flatCategories.filter((cat) =>
            cat.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : categories,
    [searchQuery, flatCategories, categories]
  );

  const displayCategories = searchQuery ? filteredCategories : categories;

  console.log(
    `${process.env.NEXT_PUBLIC_IMAGE_API_URL}`,
    "${process.env.NEXT_PUBLIC_IMAGE_API_URL}/${category.image}"
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FolderTree className="h-8 w-8 text-purple-600" />
                Categories
              </h1>
              <p className="text-gray-500 mt-1">
                Manage product categories and hierarchies
              </p>
            </div>

            <Button
              onClick={() => router.push("/dashboard/categories/create")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
            >
              <Plus size={20} />
              Add Category
            </Button>
          </div>
        </div>

        {/* Search and Controls */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search categories by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    title="Clear search"
                  >
                    <X size={16} className="text-gray-500" />
                  </button>
                )}
              </div>
              {/* {!searchQuery && categories.length > 0 && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleExpandAll}
                    className="px-4 py-3 border border-purple-300 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <ChevronDown size={18} />
                    Expand All
                  </Button>
                  <Button
                    onClick={handleCollapseAll}
                    className="px-4 py-3 border border-purple-300 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <ChevronRight size={18} />
                    Collapse All
                  </Button>
                </div>
              )} */}
            </div>
          </CardContent>
        </Card>

        {/* Categories Table */}
        <Card>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : displayCategories.length === 0 ? (
              <div className="text-center py-12">
                <FolderTree className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                  No categories found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchQuery
                    ? "Try a different search term."
                    : "Get started by creating a new category."}
                </p>
                {!searchQuery && (
                  <div className="mt-6">
                    <Button
                      onClick={() =>
                        router.push("/dashboard/categories/create")
                      }
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
                    >
                      <Plus size={16} />
                      Add Category
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b-2 border-purple-100">
                      <TableHead className="w-16 font-bold text-gray-700">
                        #
                      </TableHead>
                      <TableHead className="min-w-[400px] font-bold text-gray-700">
                        Category
                      </TableHead>
                      <TableHead className="font-bold text-gray-700">
                        Level
                      </TableHead>
                      <TableHead className="font-bold text-gray-700">
                        Parent Category
                      </TableHead>
                      <TableHead className="font-bold text-gray-700 text-center">
                        Children
                      </TableHead>
                      <TableHead className="text-right font-bold text-gray-700">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchQuery
                      ? // Show flattened list when searching
                        filteredCategories.map((category, index) => (
                          <TableRow
                            key={category._id}
                            className="hover:bg-purple-50/50 transition-colors"
                          >
                            <TableCell className="font-semibold text-gray-600">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700 text-sm">
                                {index + 1}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div
                                className="flex items-start gap-4"
                                style={{
                                  paddingLeft: `${category.level * 16}px`,
                                }}
                              >
                                <div className="flex-shrink-0 w-7" />
                                {/* Category Image */}
                                <div className="h-16 w-16 rounded-xl overflow-hidden bg-gradient-to-br from-purple-100 to-purple-200 flex-shrink-0 shadow-sm border border-purple-200 flex items-center justify-center">
                                  {category.image ? (
                                    <Image
                                      src={`${process.env.NEXT_PUBLIC_IMAGE_API_URL}${category.image}`}
                                      alt={category.name}
                                      width={64}
                                      height={64}
                                      className="h-full w-full object-cover hover:scale-110 transition-transform duration-200"
                                    />
                                  ) : // <img
                                  //   src={`${process.env.NEXT_PUBLIC_IMAGE_API_URL}/${category.image}`}
                                  //   alt={category.name}
                                  //   className="h-full w-full object-cover hover:scale-110 transition-transform duration-200"
                                  //   onError={(e) => {
                                  //     e.target.style.display = "none";
                                  //     e.target.nextSibling.style.display =
                                  //       "flex";
                                  //   }}
                                  // />
                                  null}
                                  <div
                                    className={`${
                                      category.image ? "hidden" : "flex"
                                    } items-center justify-center h-full w-full`}
                                  >
                                    <Layers className="h-8 w-8 text-purple-400" />
                                  </div>
                                </div>

                                {/* Category Name */}
                                <div className="min-w-0 flex-1 py-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    {category.level > 0 && (
                                      <span className="text-gray-400 text-sm">
                                        └─
                                      </span>
                                    )}
                                    <p
                                      className="font-semibold text-gray-900 line-clamp-2 leading-snug hover:text-purple-600 transition-colors cursor-default"
                                      title={category.name}
                                    >
                                      {category.name}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded">
                                      ID: {category._id?.slice(-8) || "N/A"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  category.level === 0 ? "default" : "secondary"
                                }
                                className="font-medium"
                              >
                                Level {category.level + 1}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium text-gray-800 px-2 py-1 bg-gray-50 rounded">
                                {category.parentName || "—"}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-center">
                                <div className="flex items-center gap-1.5 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                                  <FolderTree className="h-4 w-4 text-indigo-600" />
                                  <span className="font-bold text-gray-900">
                                    {category.children?.length || 0}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() =>
                                    router.push(
                                      `/dashboard/categories/${category._id}/edit`
                                    )
                                  }
                                  className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all hover:shadow-md hover:scale-105 border border-transparent hover:border-blue-200"
                                  title="Edit category"
                                >
                                  <Edit size={18} />
                                </button>
                                {userRole === "admin" && (
                                  <button
                                    onClick={() =>
                                      handleDelete(category._id, category.name)
                                    }
                                    className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all hover:shadow-md hover:scale-105 border border-transparent hover:border-red-200"
                                    title="Delete category"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      : // Show collapsible tree when not searching
                        displayCategories.map((category, index) =>
                          renderCategoryRow(category, index, 0)
                        )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
