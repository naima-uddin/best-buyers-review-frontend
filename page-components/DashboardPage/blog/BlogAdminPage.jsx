"use client";
import React, { useState, useEffect } from "react";
import api from "@/lib/api/axios";
import SimplifiedBlogForm from "./SimplifiedBlogForm";
import BlogTable from "./BlogTable";
import { useBlogCache } from "@/context/BlogCacheContext";

// Prefetch blog data - starts loading immediately when module loads
let prefetchedBlogs = null;
let prefetchPromise = null;

const prefetchBlogs = () => {
  if (!prefetchPromise) {
    // Use admin endpoint - no cache, includes unpublished blogs
    prefetchPromise = api.get("/admin/blogs").then(res => {
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
  const { reloadBlogs } = useBlogCache();

  const loadBlogs = async () => {
    // Use admin endpoint - no cache, includes unpublished blogs
    try {
      const res = await api.get("/admin/blogs");
      if (res.data.success) {
        setBlogs(res.data.data);
        prefetchedBlogs = res.data.data;
        prefetchPromise = null;
      }
    } catch (error) {
      console.error("Error loading blogs:", error);
    }
  };

  useEffect(() => {
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
      
      if (editingBlog) {
        await api.patch(`/blog/${encodeURIComponent(editingBlog.slug)}`, data);
        alert("Blog updated successfully!");
      } else {
        await api.post("/blog", data);
        alert("Blog created successfully!");
      }

      setShowForm(false);
      setEditingBlog(null);
      
      // Refresh both dashboard and public blog cache
      await Promise.all([
        loadBlogs(),
        reloadBlogs()
      ]);
    } catch (error) {
      console.error("Error submitting blog:", error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (slug) => {
    const blog = blogs.find(b => b.slug === slug);
    if (blog) {
      setEditingBlog(blog);
      setShowForm(true);
    }
  };

  const handleDelete = async (slug) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      try {
        await api.delete(`/blog/${encodeURIComponent(slug)}`);
        alert("Blog deleted successfully!");
        
        // Refresh both dashboard and public blog cache
        await Promise.all([
          loadBlogs(),
          reloadBlogs()
        ]);
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert(`Error: ${error.response?.data?.message || error.message}`);
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