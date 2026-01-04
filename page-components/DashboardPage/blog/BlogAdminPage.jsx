"use client";
import React, { useState, useEffect, useTransition } from "react";
import api from "@/lib/api/axios";
import SimplifiedBlogForm from "./SimplifiedBlogForm";
import BlogTable from "./BlogTable";
import { useBlogCache } from "@/context/BlogCacheContext";

// Prefetch blog data - starts loading immediately when module loads
let prefetchedBlogs = null;
let prefetchPromise = null;

const prefetchBlogs = () => {
  if (!prefetchPromise) {
    prefetchPromise = api.get("/blog").then(res => {
      if (res.data.success) {
        prefetchedBlogs = res.data.data;
        return prefetchedBlogs;
      }
      return [];
    }).catch(() => []);
  }
  return prefetchPromise;
};

// Start prefetching immediately
prefetchBlogs();

export default function BlogAdminPage() {
  const [blogs, setBlogs] = useState(prefetchedBlogs || []);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { invalidateCache } = useBlogCache();

  const loadBlogs = async () => {
    const res = await api.get("/blog");
    if (res.data.success) {
      setBlogs(res.data.data);
      prefetchedBlogs = res.data.data; // Update cache
    }
  };

  useEffect(() => {
    // If prefetch already completed, use it; otherwise wait for it
    if (prefetchedBlogs) {
      setBlogs(prefetchedBlogs);
    } else {
      prefetchBlogs().then(data => {
        if (data.length > 0) setBlogs(data);
      });
    }
  }, []);

const handleSubmit = async (data) => {
  try {
    setIsLoading(true);
    console.log("🔄 Submitting blog data:", data);
    
    if (editingBlog) {
      // Update existing blog - encode slug for URL safety
      await api.patch(`/blog/${encodeURIComponent(editingBlog.slug)}`, data);
      alert("Blog updated successfully!");
    } else {
      // Create new blog
      const response = await api.post("/blog", data);
      console.log("✅ Blog created successfully:", response.data);
      alert("Blog created successfully!");
    }

    setShowForm(false);
    setEditingBlog(null);
    loadBlogs(); // Refresh the list
    invalidateCache(); // Clear public blog cache so /blog shows updated data
  } catch (error) {
    console.error("❌ Error submitting blog:", error);
    console.error("❌ Error response:", error.response?.data);
    alert(`Error: ${error.response?.data?.message || error.message}`);
  } finally {
    setIsLoading(false);
  }
};

  const handleEdit = async (slug) => {
    // Check if blog is already in memory
    const cachedBlog = blogs.find(b => b.slug === slug);
    if (cachedBlog) {
      setEditingBlog(cachedBlog);
      setShowForm(true);
      return;
    }
    
    // Fallback to API fetch - encode slug for URL safety
    try {
      const res = await api.get(`/blog/${encodeURIComponent(slug)}`);
      if (res.data.success) {
        setEditingBlog(res.data.data);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
      alert("Error loading blog for editing!");
    }
  };

  const handleDelete = async (slug) => {
    console.log("🗑️ Attempting to delete blog with slug:", slug);
    if (confirm("Are you sure you want to delete this blog?")) {
      try {
        // Encode slug for URL safety
        const response = await api.delete(`/blog/${encodeURIComponent(slug)}`);
        console.log("✅ Delete response:", response);
        alert("Blog deleted successfully!");
        loadBlogs();
        invalidateCache(); // Clear public blog cache
      } catch (error) {
        console.error("❌ Error deleting blog:", error);
        console.error("❌ Error response:", error.response?.data);
        console.error("❌ Request URL:", error.config?.url);
        alert(`Error deleting blog: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBlog(null);
  };

  return (
    <div className="p-6">
      {!showForm ? (
        <>
          <button
            className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
            onClick={() => {
              setEditingBlog(null);
              setShowForm(true);
            }}
          >
            Add New Blog
          </button>
          <BlogTable blogs={blogs} onEdit={handleEdit} onDelete={handleDelete} />
        </>
      ) : (
        <SimplifiedBlogForm
          initialData={editingBlog}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}