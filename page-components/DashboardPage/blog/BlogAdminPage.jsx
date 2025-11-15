"use client";
import React, { useState, useEffect } from "react";
import api from "@/lib/api/axios";
import BlogTable from "./BlogTable";
import BlogForm from "./BlogForm";
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
        await api.patch(`/blog/${editingBlog.slug}`, data);
        alert("Blog updated!");
      } else {
        await api.post("/blog", data);
        alert("Blog created!");
      }
      setShowForm(false);
      setEditingBlog(null);
      loadBlogs();
    } catch (err) {
      console.log(err);
      alert("Error occurred!");
    }
  };

  const handleEdit = async (slug) => {
    const res = await api.get(`/blog/${slug}`);
    if (res.data.success) {
      setEditingBlog(res.data.data);
      setShowForm(true);
    }
  };

  const handleDelete = async (slug) => {
    if (confirm("Delete blog?")) {
      await api.delete(`/blog/${slug}`);
      loadBlogs();
    }
  };

  return (
    <div className="p-6">
      <button className="mb-4 bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Close Form" : "Add New Blog"}
      </button>

      {!showForm ? (
        <BlogTable blogs={blogs} onEdit={handleEdit} onDelete={handleDelete} />
      ) : (
        <BlogForm onSubmit={handleSubmit} editingData={editingBlog} />
      )}
    </div>
  );
}
