"use client";
import React, { useState, useEffect } from "react";
import api from "@/lib/api/axios";
import EditBlogForm from "./EditBlogForm";
import CreateBlog from "./BlogForm";
import BlogTable from "./BlogTable";


export default function BlogAdminPage() {
  const [blogs, setBlogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  const loadBlogs = async () => {
    const res = await api.get("/blog");
    if (res.data.success) setBlogs(res.data.data);
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleSubmit = async (data) => {
    try {
      if (editingBlog) {
        // Update existing blog
        await api.patch(`/blog/${editingBlog.slug}`, data);
        alert("Blog updated successfully!");
      } else {
        // Create new blog
        await api.post("/blog", data);
        alert("Blog created successfully!");
      }

      setShowForm(false);
      setEditingBlog(null);
      loadBlogs(); // Refresh the list
    } catch (error) {
      console.error("Error:", error);
      alert("Error occurred!");
    }
  };

  const handleEdit = async (slug) => {
    try {
      const res = await api.get(`/blog/${slug}`);
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
    if (confirm("Are you sure you want to delete this blog?")) {
      try {
        // Encode the slug to handle spaces and special characters
        const encodedSlug = encodeURIComponent(slug);
        await api.delete(`/blog/${encodedSlug}`);
        alert("Blog deleted successfully!");
        loadBlogs();
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert("Error deleting blog!");
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
            className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => {
              setEditingBlog(null);
              setShowForm(true);
            }}
          >
            Add New Blog
          </button>
          <BlogTable blogs={blogs} onEdit={handleEdit} onDelete={handleDelete} />
        </>
      ) : editingBlog ? (
        <EditBlogForm
          editingData={editingBlog}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <CreateBlog
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}