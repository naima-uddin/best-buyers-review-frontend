"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Breadcrumbs from "@/ui/Breadcrumbs";
import BackButton from "@/ui/BackButton";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredBlog, setFeaturedBlog] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog`);
        const data = await res.json();
        const blogsData = data.data || [];
        
        setBlogs(blogsData);
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

  // Filter blogs based on category and search
  const filteredBlogs = blogs.filter(blog => {
    const matchesCategory = activeCategory === 'all' || 
      blog.categories?.some(cat => 
        (typeof cat === 'string' ? cat : cat.name).toLowerCase() === activeCategory
      );
    
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const regularBlogs = filteredBlogs.filter(blog => blog._id !== featuredBlog?._id);

  // Get recent posts (excluding featured)
  const recentPosts = blogs
    .filter(blog => blog._id !== featuredBlog?._id)
    .sort((a, b) => new Date(b.datePublished || b.createdAt) - new Date(a.datePublished || a.createdAt))
    .slice(0, 5);

  // Get unique categories from all blogs
  const categories = ['all', ...new Set(
    blogs.flatMap(blog => 
      blog.categories?.map(cat => 
        typeof cat === 'string' ? cat.toLowerCase() : cat.name.toLowerCase()
      ) || []
    )
  )];

  if (loading) {
    return <BlogPageSkeleton />;
  }

  if (!blogs.length) {
    return <EmptyState />;
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/10">
      {/* Category Filter */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumbs/>
          <BackButton />
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.slice(0, 8).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 sm:px-4 py-2 rounded-xl font-medium transition-all duration-300 capitalize text-sm sm:text-base ${
                  activeCategory === category
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-blue-200 hover:text-blue-600'
                }`}
              >
                {category === 'all' ? 'All Reviews' : category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Main Content Column */}
          <div className="lg:w-3/4">
            {/* Featured Blog */}
            {featuredBlog && activeCategory === 'all' && (
              <FeaturedSection blog={featuredBlog} />
            )}

            {/* Blog Grid */}
            {regularBlogs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
                {regularBlogs.map((blog) => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Add more blogs</h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                  {searchTerm 
                    ? `No reviews match "${searchTerm}". Try different keywords.`
                    : `No reviews in ${activeCategory} category yet.`
                  }
                </p>
                {(searchTerm || activeCategory !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setActiveCategory('all');
                    }}
                    className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors duration-300 text-sm sm:text-base"
                  >
                    Show All Reviews
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="lg:w-1/4">
            <Sidebar recentPosts={recentPosts} categories={categories} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Updated Sidebar Component with Categories
function Sidebar({ recentPosts, categories }) {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Recent Posts */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 pb-2 sm:pb-3 border-b border-gray-200">
          Recent Posts
        </h3>
        <div className="space-y-3 sm:space-y-4">
          {recentPosts.map((post, index) => (
            <Link 
              key={post._id} 
              href={`/blog/${post.slug}`}
              className="group flex items-start gap-2 sm:gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-gray-100">
                {post.featuredImage?.url ? (
                  <Image
                    src={post.featuredImage.url?.trim()}
                    alt={post.featuredImage.alt || post.title}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                    <div className="w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center">
                      <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9m0 0v3m0-3a2 2 0 012-2h2a2 2 0 012 2m-6 5v6m4-3H9" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 leading-tight mb-1">
                  {post.title}
                </h4>
                <p className="text-xs text-gray-500">
                  Buyers View
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      
    </div>
  );
}

// FeaturedSection Component
function FeaturedSection({ blog }) {
  const readingTime = Math.ceil((blog.content?.length || 0) / 5);

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden mb-8 sm:mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Image Column */}
        <div className="lg:col-span-1">
          <div className="relative h-48 sm:h-64 lg:h-80 min-h-[200px] sm:min-h-[300px]">
            {blog.featuredImage?.url ? (
              <Image
                src={blog.featuredImage.url}
                alt={blog.featuredImage.alt || blog.title}
                width={320}
                height={240}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9m0 0v3m0-3a2 2 0 012-2h2a2 2 0 012 2m-6 5v6m4-3H9" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium text-sm sm:text-base">Featured Review</p>
                </div>
              </div>
            )}
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex gap-1 sm:gap-2">
              <span className="px-2 sm:px-3 py-1 bg-red-500 text-white text-xs sm:text-sm font-semibold rounded-full">
                Featured
              </span>
              {blog.categories?.slice(0, 1).map((category, index) => (
                <span
                  key={index}
                  className="px-2 sm:px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs sm:text-sm font-semibold rounded-full"
                >
                  {typeof category === 'string' ? category : category.name}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Content Column */}
        <div className="lg:col-span-2 p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
          <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4 text-xs sm:text-sm text-gray-500">
            
            <span>{readingTime} min read</span>
          </div>
          
          <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
            {blog.title}
          </h2>
          
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-3">
            {blog.excerpt || blog.description}
          </p>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-3">
              {blog.author?.avatar ? (
                <Image 
                  src={blog.author.avatar} 
                  alt={blog.author.name}
                  width={40}
                  height={40}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white shadow-lg"
                />
              ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                  <span className="text-white font-semibold text-xs sm:text-sm">
                    {blog.author?.name?.charAt(0) || 'B'}
                  </span>
                </div>
              )}
              <div>
                <p className="text-xs sm:text-sm font-semibold text-gray-900">
                  Best Buyers View
                </p>
              </div>
            </div>
            
            <Link
              href={`/blog/${blog.slug}`}
              className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 sm:hover:-translate-y-1 flex items-center gap-2 justify-center text-sm sm:text-base"
            >
              Read Full Analysis
              <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Blog Card Component
function BlogCard({ blog }) {
  const getCategoryName = (category) => {
    return typeof category === 'string' ? category : category.name || category;
  };

  const readingTime = Math.ceil((blog.content?.length || 0) / 5);

  return (
    <div className="group bg-white rounded-xl sm:rounded-2xl shadow-lg shadow-gray-200/50 hover:shadow-xl sm:hover:shadow-2xl sm:hover:shadow-blue-100/50 transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200">
      {/* Image */}
      <div className="relative h-40 sm:h-48 overflow-hidden">
        {blog.featuredImage?.url ? (
          <Image
            src={blog.featuredImage.url?.trim()}
            alt={blog.featuredImage.alt || blog.title}
            width={320}
            height={240}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-1 sm:mb-2">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9m0 0v3m0-3a2 2 0 012-2h2a2 2 0 012 2m-6 5v6m4-3H9" />
                </svg>
              </div>
              <p className="text-gray-500 text-xs sm:text-sm">No Image</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Categories Overlay */}
        {blog.categories && blog.categories.length > 0 && (
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-wrap gap-1 sm:gap-2">
            {blog.categories.slice(0, 2).map((category, index) => (
              <span
                key={index}
                className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold rounded-md sm:rounded-lg"
              >
                {getCategoryName(category)}
              </span>
            ))}
          </div>
        )}

        {/* Featured Badge */}
        {blog.isFeatured && (
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
              Featured
            </span>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-6">
        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
          <div className="flex items-center gap-2 sm:gap-4">
            
            <span>{readingTime} min read</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-2 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 leading-relaxed line-clamp-2 sm:line-clamp-3 mb-3 sm:mb-4 text-sm sm:text-base">
          {blog.excerpt || blog.description}
        </p>

        {/* Author & CTA */}
        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 sm:gap-3">
            {blog.author?.avatar ? (
              <Image 
                src={blog.author.avatar?.trim() || ""}
                alt={blog.author.name}
                width={32}
                height={32}
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-white shadow-sm"
              />

            ) : (
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                <span className="text-white text-xs font-semibold">
                  {blog.author?.name?.charAt(0) || 'B'}
                </span>
              </div>
            )}
            <div>
              <p className="text-xs sm:text-sm font-semibold text-gray-900">
                Best Buyers View
              </p>
            </div>
          </div>

          <Link
            href={`/blog/${blog.slug}`}
            className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-300 flex items-center gap-1 group/link text-xs sm:text-sm"
          >
            Read More
            <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Skeleton Loading
function BlogPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/10">
      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-40 sm:h-48 bg-gray-200 rounded-xl sm:rounded-2xl mb-3 sm:mb-4"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-3 sm:mb-4"></div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full"></div>
                <div className="h-2.5 sm:h-3 bg-gray-200 rounded w-16 sm:w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Empty State
function EmptyState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/10 flex items-center justify-center px-4 sm:px-6">
      <div className="text-center max-w-md mx-auto">
        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <svg className="w-8 h-8 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">No Reviews Yet</h1>
        <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
          We're working on creating amazing product reviews and buying guides for you. Check back soon!
        </p>
      </div>
    </div>
  );
}