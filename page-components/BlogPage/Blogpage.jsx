"use client";
import { useState, useMemo, useCallback, memo, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, X, ChevronRight } from "lucide-react";
import BlogList, { BlogCard, BlogCardSkeleton } from "./BlogList";
import { useBlogCache } from "@/context/BlogCacheContext";

// Category list - can be moved to config
const CATEGORIES = [
  "All", "Food", "Tools", "Sports", "Pets", "Outdoor", "Office", "Money", "Health",
  "Gifts", "Home", "Garden", "Tech", "Fitness", "Fashion", "Beauty", "Baby"
];

// Memoized category filter component
const CategoryFilter = memo(function CategoryFilter({ categories, active, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            active === cat
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
});

// Memoized search input
const SearchInput = memo(function SearchInput({ value, onChange, onClear }) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search articles..."
        className="w-full pl-12 pr-10 py-3 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
});

// Sidebar component for popular posts
const PopularPosts = memo(function PopularPosts({ blogs }) {
  const popularBlogs = useMemo(() => {
    return [...blogs]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);
  }, [blogs]);

  if (!popularBlogs.length) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Posts</h3>
      <div className="space-y-4">
        {popularBlogs.map((blog, i) => (
          <Link
            key={blog._id || blog.slug}
            href={`/blog/${blog.slug}`}
            className="flex gap-3 group"
          >
            <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {blog.title}
              </h4>
              {blog.views > 0 && (
                <span className="text-xs text-gray-500">{blog.views.toLocaleString()} views</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
});

// Categories sidebar
const CategoriesSidebar = memo(function CategoriesSidebar({ blogs, activeCategory, onSelect }) {
  const categoryCounts = useMemo(() => {
    const counts = {};
    blogs.forEach((blog) => {
      blog.categories?.forEach((cat) => {
        const name = cat.name || cat;
        counts[name] = (counts[name] || 0) + 1;
      });
    });
    return counts;
  }, [blogs]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
      <div className="space-y-2">
        {Object.entries(categoryCounts).map(([cat, count]) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${
              activeCategory === cat
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <span className="font-medium">{cat}</span>
            <span className="text-sm text-gray-500">{count}</span>
          </button>
        ))}
      </div>
    </div>
  );
});

export default function OptimizedBlogPage({ initialBlogs = [] }) {
  const { blogs: cachedBlogs, isLoading } = useBlogCache();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Use cached blogs if available, otherwise use initialBlogs from server
  const blogs = cachedBlogs.length > 0 ? cachedBlogs : initialBlogs;

  // Filter blogs based on search and category
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      // Category filter
      if (activeCategory !== "All") {
        const categories = blog.categories?.map((c) => c.name || c) || [];
        if (!categories.includes(activeCategory)) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const searchable = [
          blog.title,
          blog.excerpt,
          blog.description,
          ...(blog.tags || []),
          ...(blog.categories?.map((c) => c.name || c) || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return searchable.includes(query);
      }

      return true;
    });
  }, [blogs, activeCategory, searchQuery]);

  // Get featured blog
  const featuredBlog = useMemo(() => {
    return filteredBlogs.find((b) => b.isFeatured) || filteredBlogs[0];
  }, [filteredBlogs]);

  // Get remaining blogs
  const regularBlogs = useMemo(() => {
    return filteredBlogs.filter((b) => b._id !== featuredBlog?._id);
  }, [filteredBlogs, featuredBlog]);

  const handleCategorySelect = useCallback((cat) => {
    setActiveCategory(cat);
    setShowMobileFilters(false);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setActiveCategory("All");
  }, []);

  const hasActiveFilters = searchQuery || activeCategory !== "All";

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative text-white py-16 sm:py-28 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/blog-banner.png')" }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-purple-900/80 to-blue-900/80" />
        
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Our Blog
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Discover expert reviews, buying guides, and the latest insights to help you make smarter purchasing decisions.
          </p>
          
          {/* Search */}
          <div className="max-w-xl mx-auto">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery("")}
            />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            )}
          </button>
        </div>

        {/* Mobile Filters Dropdown */}
        {showMobileFilters && (
          <div className="lg:hidden mb-6 p-4 bg-white rounded-xl shadow-lg">
            <CategoryFilter
              categories={CATEGORIES}
              active={activeCategory}
              onSelect={handleCategorySelect}
            />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Desktop Category Filter */}
            <div className="hidden lg:block mb-8">
              <CategoryFilter
                categories={CATEGORIES}
                active={activeCategory}
                onSelect={handleCategorySelect}
              />
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 mb-6">
                <span className="text-sm text-gray-500">Active filters:</span>
                {activeCategory !== "All" && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
                    {activeCategory}
                    <button onClick={() => setActiveCategory("All")}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery("")}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-600 hover:underline"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Results count */}
            <p className="text-sm text-gray-500 mb-6">
              {isLoading && blogs.length === 0 
                ? "Loading articles..." 
                : `Showing ${filteredBlogs.length} of ${blogs.length} articles`}
            </p>

            {/* Show skeleton while loading */}
            {isLoading && blogs.length === 0 ? (
              <>
                {/* Featured skeleton */}
                <div className="mb-10">
                  <BlogCardSkeleton featured />
                </div>
                {/* Grid skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <BlogCardSkeleton key={i} />
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Featured Blog */}
                {featuredBlog && filteredBlogs.length > 0 && (
                  <div className="mb-10">
                    <BlogCard blog={featuredBlog} featured />
                  </div>
                )}

                {/* Blog Grid */}
                {regularBlogs.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {regularBlogs.map((blog) => (
                      <BlogCard key={blog._id || blog.slug} blog={blog} />
                    ))}
                  </div>
                ) : filteredBlogs.length === 0 && hasActiveFilters ? (
                  <div className="text-center py-16">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-20 h-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
                    <button
                      onClick={clearFilters}
                      className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : null}
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block w-80 shrink-0 space-y-6">
            <CategoriesSidebar
              blogs={blogs}
              activeCategory={activeCategory}
              onSelect={handleCategorySelect}
            />
            <PopularPosts blogs={blogs} />
          </aside>
        </div>
      </div>
    </main>
  );
}
