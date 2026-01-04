"use client";
import { useEffect, useState } from "react";
import { useBlogCache } from "@/context/BlogCacheContext";
import BlogDetails from "./BlogDetails";

// Loading skeleton
function BlogDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white animate-pulse">
      {/* Hero skeleton */}
      <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-4 w-32 bg-white/20 rounded mb-6" />
          <div className="flex gap-2 mb-4">
            <div className="h-6 w-16 bg-white/20 rounded-full" />
          </div>
          <div className="h-10 w-3/4 bg-white/20 rounded mb-6" />
          <div className="flex gap-4">
            <div className="h-4 w-24 bg-white/20 rounded" />
            <div className="h-4 w-20 bg-white/20 rounded" />
          </div>
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="max-w-3xl">
          <div className="h-[300px] bg-gray-200 rounded-2xl mb-10 -mt-20" />
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-100 rounded w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BlogDetailsWrapper({ slug, initialBlog }) {
  const { getBlogBySlug, cacheBlog } = useBlogCache();
  const [blog, setBlog] = useState(initialBlog);
  const [isLoading, setIsLoading] = useState(!initialBlog);

  useEffect(() => {
    if (!slug) return;

    // If we have initial blog from server, use it and cache it
    if (initialBlog) {
      setBlog(initialBlog);
      cacheBlog(initialBlog);
      setIsLoading(false);
      return;
    }

    // Fetch from cache or API
    setIsLoading(true);
    getBlogBySlug(slug).then((data) => {
      if (data) setBlog(data);
      setIsLoading(false);
    });
  }, [slug]); // Only depend on slug - callbacks are stable now

  if (isLoading && !blog) {
    return <BlogDetailsSkeleton />;
  }

  if (!blog) {
    return null; // Will show not found from parent
  }

  return <BlogDetails blog={blog} />;
}
