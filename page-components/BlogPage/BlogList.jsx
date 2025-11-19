"use client";
import Link from "next/link";
import Image from "next/image";
import { useBlogData } from "./BlogDataProvider";

export default function BlogList() {
  const { blogs, loading } = useBlogData();

  if (loading) return <BlogListSkeleton />;

  if (!blogs.length) return <EmptyState />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/10">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-60 sm:h-60 lg:w-72 lg:h-72 bg-white/10 rounded-full -translate-y-24 sm:-translate-y-28 lg:-translate-y-36 translate-x-24 sm:translate-x-28 lg:translate-x-36"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-white/5 rounded-full translate-y-32 sm:translate-y-40 lg:translate-y-48 -translate-x-32 sm:-translate-x-40 lg:-translate-x-48"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 border border-white/30">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
            Latest Updates & Reviews
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
            Best Buyers
            <span className="block bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              View Blog
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed px-4">
            Expert product analysis, comprehensive buying guides, and trusted reviews 
            to help you make informed purchasing decisions.
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4 mt-6 sm:mt-8 px-4">
            {['Electronics', 'Home Appliances', 'Beauty', 'Fitness', 'Baby Care', 'Outdoor'].map((category) => (
              <span key={category} className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full text-xs sm:text-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Blog */}
      <FeaturedSection blogs={blogs} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Category Filter */}
        <CategoryFilter />
        
        {/* Blog Grid */}
        <div className="mb-12 sm:mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Latest <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Reviews</span>
            </h2>
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="text-xs sm:text-sm text-gray-500">{blogs.length} articles</span>
              <select className="text-xs sm:text-sm border border-gray-200 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Newest First</option>
                <option>Oldest First</option>
                <option>Most Popular</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <NewsletterSection />
      </div>
    </div>
  );
}

// Skeleton Loading
function BlogListSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/10 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="h-6 sm:h-8 bg-gray-200 rounded w-48 sm:w-64 mx-auto mb-3 sm:mb-4"></div>
          <div className="h-8 sm:h-12 bg-gray-200 rounded w-72 sm:w-96 mx-auto mb-4 sm:mb-6"></div>
          <div className="h-4 sm:h-6 bg-gray-200 rounded w-2/3 mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-40 sm:h-48 bg-gray-200 rounded-xl sm:rounded-2xl mb-3 sm:mb-4"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded mb-1.5 sm:mb-2"></div>
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
        <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">No Articles Yet</h1>
        <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">We're working on creating amazing content for you. Check back soon!</p>
      </div>
    </div>
  );
}

// Featured Section
function FeaturedSection({ blogs }) {
  const featuredBlog = blogs.find(blog => blog.isFeatured) || blogs[0];
  
  if (!featuredBlog) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 lg:-mt-20 relative z-10">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="relative h-60 sm:h-72 lg:h-80 xl:h-96 min-h-[300px] sm:min-h-[350px] lg:min-h-[400px]">
            {featuredBlog.featuredImage?.url ? (
              <Image
                src={featuredBlog.featuredImage.url}
                alt={featuredBlog.featuredImage.alt || featuredBlog.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9m0 0v3m0-3a2 2 0 012-2h2a2 2 0 012 2m-6 5v6m4-3H9" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium text-sm sm:text-base">Featured Post</p>
                </div>
              </div>
            )}
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
              <span className="px-2 sm:px-3 py-1 bg-red-500 text-white text-xs sm:text-sm font-semibold rounded-full">
                Featured
              </span>
            </div>
          </div>
          
          <div className="p-4 sm:p-6 lg:p-8 xl:p-12 flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
              {featuredBlog.categories?.slice(0, 2).map((category, index) => (
                <span key={index} className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-600 text-xs sm:text-sm font-medium rounded-full">
                  {category.name || category}
                </span>
              ))}
              
            </div>
            
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
              {featuredBlog.title}
            </h2>
            
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-3">
              {featuredBlog.excerpt || featuredBlog.description}
            </p>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
              <div className="flex items-center gap-2 sm:gap-3">
                {featuredBlog.author?.avatar ? (
                  <Image 
                    src={featuredBlog.author.avatar} 
                    alt={featuredBlog.author.name}
                    className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full object-cover border-2 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                    <span className="text-white font-semibold text-xs sm:text-sm">
                      {featuredBlog.author?.name?.charAt(0) || 'B'}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-900">
                    {featuredBlog.author?.name || 'Best Buyers View'}
                  </p>
                  <p className="text-xs text-gray-500">Senior Reviewer</p>
                </div>
              </div>
              
              <Link
                href={`/blog/${featuredBlog.slug}`}
                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 sm:hover:-translate-y-1 flex items-center gap-1.5 sm:gap-2 justify-center text-sm sm:text-base"
              >
                Read Analysis
                <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Category Filter
function CategoryFilter() {
  const categories = ['All', 'Tech', 'Home', 'Beauty', 'Fitness', 'Baby', 'Outdoor', 'Kitchen'];
  
  return (
    <div className="mb-8 sm:mb-10 lg:mb-12">
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            className="px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-white text-gray-700 rounded-xl sm:rounded-2xl font-medium hover:bg-gray-50 transition-all duration-300 border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 hover:text-blue-600 text-xs sm:text-sm lg:text-base"
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

// Newsletter Section
function NewsletterSection() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-12 text-center text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-0 right-0 w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 bg-white/10 rounded-full -translate-y-20 sm:-translate-y-24 lg:-translate-y-28 xl:-translate-y-32 translate-x-20 sm:translate-x-24 lg:translate-x-28 xl:translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 bg-white/5 rounded-full translate-y-16 sm:translate-y-20 lg:translate-y-24 -translate-x-16 sm:-translate-x-20 lg:-translate-x-24"></div>
      
      <div className="relative z-10">
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">Stay Updated</h3>
        <p className="text-blue-100 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
          Get the latest product reviews and buying guides delivered directly to your inbox.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto px-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm sm:text-base"
          />
          <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-blue-600 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 sm:hover:-translate-y-1 text-sm sm:text-base">
            Subscribe
          </button>
        </div>
        <p className="text-blue-200 text-xs sm:text-sm mt-3 sm:mt-4">No spam, unsubscribe at any time</p>
      </div>
    </div>
  );
}

// Blog Card Component
function BlogCard({ blog }) {
  const getCategoryName = (category) => {
    return typeof category === 'string' ? category : category.name || category;
  };

  const readingTime = Math.ceil((blog.content?.length || 0) / 5); // Simple reading time calculation

  return (
    <div className="group bg-white rounded-xl sm:rounded-2xl shadow-lg shadow-gray-200/50 hover:shadow-xl sm:hover:shadow-2xl sm:hover:shadow-blue-100/50 transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200">
      {/* Image */}
      <div className="relative h-40 sm:h-48 overflow-hidden">
        {blog.featuredImage?.url ? (
          <Image
            src={blog.featuredImage.url}
            alt={blog.featuredImage.alt || blog.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-1 sm:mb-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      </div>

      <div className="p-4 sm:p-5 lg:p-6">
        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            <span className="text-xs">{new Date(blog.datePublished || blog.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{readingTime} min read</span>
          </div>
          {blog.isFeatured && (
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
              Featured
            </span>
          )}
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
                src={blog.author.avatar} 
                alt={blog.author.name}
                className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full object-cover border-2 border-white shadow-sm"
              />
            ) : (
              <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                <span className="text-white text-xs font-semibold">
                  {blog.author?.name?.charAt(0) || 'B'}
                </span>
              </div>
            )}
            <div>
              <p className="text-xs sm:text-sm font-semibold text-gray-900">
                {blog.author?.name || 'Best Buyers View'}
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