"use client";
import Link from "next/link";
import Image from "next/image";
import { useBlogData } from "./BlogDataProvider";
import React, { useEffect } from "react";


export default function BlogPage() {
  const { blogs, loading, featuredBlog } = useBlogData();

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog`); // Adjust API endpoint as needed
        const data = await res.json();
        const blogsData = data.data || [];
        
        setBlogs(blogsData);
        // Set the first featured blog or any blog with isFeatured: true
        const featured = blogsData.find(blog => blog.isFeatured) || blogsData[0];
        setFeaturedBlog(featured);
      } catch (err) {
        console.log("Error loading blogs =>", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/20 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-2xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!blogs.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/20 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Blog</h1>
          <p className="text-gray-600 mb-8">No blog posts found.</p>
        </div>
      </div>
    );
  }

  const regularBlogs = blogs.filter(blog => blog._id !== featuredBlog?._id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/20 py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white shadow-lg shadow-gray-200/50 border border-gray-100 mb-6">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LATEST INSIGHTS
            </span>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Best Buyers View <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Blog</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Expert product reviews, buying guides, and consumer insights to help you make smarter purchasing decisions.
          </p>
        </div>

        {/* Featured Blog Post */}
        {featuredBlog && (
          <div className="mb-16">
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden border border-gray-100">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="relative h-80 lg:h-full">
                  {featuredBlog.featuredImage?.url ? (
                    <Image
                      src={featuredBlog.featuredImage.url}
                      alt={featuredBlog.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9m0 0v3m0-3a2 2 0 012-2h2a2 2 0 012 2m-6 5v6m4-3H9" />
                          </svg>
                        </div>
                        <p className="text-gray-500 font-medium">Featured Post</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">
                      Featured
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(featuredBlog.datePublished).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {featuredBlog.title}
                  </h2>
                  
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    {featuredBlog.excerpt || featuredBlog.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {featuredBlog.author?.name?.charAt(0) || 'B'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {featuredBlog.author?.name || 'Best Buyers View'}
                        </p>
                        <p className="text-xs text-gray-500">Author</p>
                      </div>
                    </div>
                    
                    <Link
                      href={`/blog/${featuredBlog.slug}`}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Read Full Review
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Blog Posts Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Latest <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Reviews</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularBlogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        </div>

        {/* Categories Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Browse by Category
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['Tech', 'Home', 'Baby', 'Beauty', 'Fitness', 'Outdoor'].map((category) => (
              <Link
                key={category}
                href={`/blog/category/${category.toLowerCase()}`}
                className="bg-white px-6 py-3 rounded-xl font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 shadow-sm hover:shadow-md border border-gray-200"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BlogCard({ blog }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 overflow-hidden border border-gray-100 group hover:scale-105">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {blog.featuredImage?.url ? (
          <Image
            src={blog.featuredImage.url}
            alt={blog.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9m0 0v3m0-3a2 2 0 012-2h2a2 2 0 012 2m-6 5v6m4-3H9" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">No Image</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Categories */}
        {blog.categories && blog.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {blog.categories.slice(0, 2).map((category, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full"
              >
                {category}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors duration-300">
          {blog.title}
        </h2>

        {/* Excerpt */}
        <p className="text-gray-600 leading-relaxed line-clamp-3 mb-4">
          {blog.excerpt || blog.description}
        </p>

        {/* Author & Date */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-semibold">
                {blog.author?.name?.charAt(0) || 'B'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {blog.author?.name || 'Best Buyers View'}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(blog.datePublished).toLocaleDateString()}
              </p>
            </div>
          </div>

          <Link
            href={`/blog/${blog.slug}`}
            className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-300 flex items-center gap-1 group/link"
          >
            Read More
            <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}