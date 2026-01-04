"use client";
import SimplifiedBlogForm from "@/page-components/DashboardPage/blog/SimplifiedBlogForm";
import api from "@/lib/api/axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useBlogCache } from "@/context/BlogCacheContext";

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const { reloadBlogs } = useBlogCache();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blog/${encodeURIComponent(params.slug)}`);
        if (res.data.success) {
          setBlog(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        alert("Error loading blog");
        router.push("/dashboard/blog");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (params.slug) {
      fetchBlog();
    }
  }, [params.slug, router]);

  const handleSubmit = async (data) => {
    try {
      setIsSaving(true);
      await api.patch(`/blog/${encodeURIComponent(params.slug)}`, data);
      alert("Blog updated successfully!");
      await reloadBlogs();
      router.push("/dashboard/blog");
    } catch (error) {
      console.error("Error updating blog:", error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/blog");
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading blog...</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-red-500">Blog not found</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <SimplifiedBlogForm
        initialData={blog}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isSaving}
      />
    </div>
  );
}
