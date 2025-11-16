"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useBlogData } from "./BlogDataProvider";
import React, { useState, useEffect } from "react";


export default function BlogDetails({ slug }) {
  const { blogs } = useBlogData();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // First try to find blog in cached data
    const cachedBlog = blogs.find(b => b.slug === slug);
    
    if (cachedBlog) {
      setBlog(cachedBlog);
      setLoading(false);
    } else {
      // Fallback to API call if not found in cache
      async function fetchBlog() {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${slug}`);
          const data = await res.json();
          setBlog(data.data);
        } catch (err) {
          console.log("Error loading blog =>", err);
          router.push("/blog");
        } finally {
          setLoading(false);
        }
      }
      fetchBlog();
    }
  }, [slug, router, blogs]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/20 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-96 bg-gray-200 rounded-2xl mb-8"></div>
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/20 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
          <p className="text-gray-600 mb-8">The requested blog post could not be found.</p>
          <Link
            href="/blog"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/20 py-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors duration-200 group"
          >
            <svg
              className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Blog
          </Link>
        </div>

        {/* Blog Content */}
        <article className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-8 border border-gray-100">
          {/* Header */}
          <header className="mb-8">
            {blog.categories && blog.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.categories.map((category, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {blog.title}
            </h1>
            
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {blog.author?.name?.charAt(0) || 'B'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{blog.author?.name || 'Best Buyers View'}</p>
                  <p className="text-sm">{new Date(blog.datePublished).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {blog.featuredImage?.url && (
            <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
              <Image
                src={blog.featuredImage.url}
                alt={blog.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {blog.content?.map((block, index) => {
              if (block.type === 'paragraph' && block.data?.text) {
                return (
                  <p key={index} className="text-gray-700 leading-relaxed mb-4">
                    {block.data.text.map((text, textIndex) => (
                      <span key={textIndex}>{text.value}</span>
                    ))}
                  </p>
                );
              }
              return null;
            })}
            
            {!blog.content?.length && (
              <p className="text-gray-700 leading-relaxed">
                {blog.excerpt || blog.description}
              </p>
            )}
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}