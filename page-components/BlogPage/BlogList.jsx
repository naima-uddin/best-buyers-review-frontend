"use client";
import Link from "next/link";
import Image from "next/image";
import { useBlogData } from "./BlogDataProvider";

export default function BlogList() {
  const { blogs, loading } = useBlogData();

  if (loading) return <p className="text-center py-10">Loading blogs...</p>;

  if (!blogs.length)
    return (
      <p className="text-center py-10 text-gray-500">
        No blog posts found.
      </p>
    );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {blogs.map((blog) => (
        <BlogCard key={blog._id} blog={blog} />
      ))}
    </div>
  );
}

function BlogCard({ blog }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden border border-gray-100">
      {/* Image */}
      {blog.featuredImage?.url ? (
        <img
          src={blog.featuredImage.url}
          alt={blog.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
          No Image
        </div>
      )}

      <div className="p-5">
        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 line-clamp-2">
          {blog.title}
        </h2>

        {/* Excerpt */}
        <p className="text-sm text-gray-600 mt-2 line-clamp-3">
          {blog.excerpt}
        </p>

        {/* Author + Read More */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-gray-500">
            By {blog.author?.name || "Unknown"}
          </span>

          <Link
            href={`/blog/${blog.slug}`}
            className="text-[#0313ff] font-medium hover:underline"
          >
            Read More →
          </Link>
        </div>
      </div>
    </div>
  );
}
