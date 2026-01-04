"use client";
import { memo, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, Eye, ArrowRight } from "lucide-react";

// Memoized Blog Card for optimal re-rendering
const BlogCard = memo(function BlogCard({ blog, featured = false }) {
  const readTime = useMemo(() => {
    if (!blog?.content) return "5 min";
    const text = blog.content
      ?.map((block) => {
        if (block.data?.text) return block.data.text.map((t) => t.value).join(" ");
        if (block.data?.items) return block.data.items.join(" ");
        return "";
      })
      .join(" ") || "";
    const words = text.split(/\s+/).length;
    return `${Math.max(1, Math.ceil(words / 200))} min`;
  }, [blog?.content]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const imageUrl = blog.featuredImage?.url || "/default-blog.jpg";
  const category = blog.categories?.[0]?.name || blog.categories?.[0] || "General";

  if (featured) {
    return (
      <Link href={`/blog/${blog.slug}`} prefetch={true} className="group block">
        <article className="relative h-[400px] sm:h-[500px] rounded-2xl overflow-hidden shadow-xl">
          <div className="absolute inset-0">
            <img
              src={imageUrl}
              alt={blog.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <span className="inline-block px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full mb-4">
              {category}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-300 transition-colors">
              {blog.title}
            </h2>
            <p className="text-gray-200 line-clamp-2 mb-4 hidden sm:block">
              {blog.excerpt || blog.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(blog.datePublished || blog.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {readTime}
              </span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${blog.slug}`} prefetch={true} className="group block">
      <article className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <span className="absolute top-3 left-3 px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
            {category}
          </span>
        </div>
        <div className="flex-1 p-5 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {blog.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">
            {blog.excerpt || blog.description}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(blog.datePublished || blog.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {readTime}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
});

// Skeleton loader for blog cards
const BlogCardSkeleton = memo(function BlogCardSkeleton({ featured = false }) {
  if (featured) {
    return (
      <div className="relative h-[400px] sm:h-[500px] rounded-2xl overflow-hidden bg-gray-200 animate-pulse">
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="h-6 w-24 bg-gray-300 rounded-full mb-4" />
          <div className="h-8 w-3/4 bg-gray-300 rounded mb-3" />
          <div className="h-4 w-full bg-gray-300 rounded mb-4" />
          <div className="flex gap-4">
            <div className="h-4 w-24 bg-gray-300 rounded" />
            <div className="h-4 w-16 bg-gray-300 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-5">
        <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-full bg-gray-200 rounded mb-2" />
        <div className="h-4 w-2/3 bg-gray-200 rounded mb-4" />
        <div className="flex justify-between">
          <div className="h-3 w-20 bg-gray-200 rounded" />
          <div className="h-3 w-16 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
});

export default function OptimizedBlogList({
  blogs = [],
  loading = false,
  showFeatured = false,
  title = "Latest Articles",
  columns = 3,
}) {
  // Separate featured and regular blogs
  const { featuredBlog, regularBlogs } = useMemo(() => {
    if (!showFeatured || !blogs.length) {
      return { featuredBlog: null, regularBlogs: blogs };
    }
    
    const featured = blogs.find((b) => b.isFeatured) || blogs[0];
    const regular = blogs.filter((b) => b._id !== featured?._id);
    return { featuredBlog: featured, regularBlogs: regular };
  }, [blogs, showFeatured]);

  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  if (loading) {
    return (
      <div className="space-y-8">
        {showFeatured && <BlogCardSkeleton featured />}
        <div className={`grid ${gridCols[columns]} gap-6`}>
          {Array.from({ length: 6 }).map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!blogs.length) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs found</h3>
        <p className="text-gray-500">Check back later for new content.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Section Title */}
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
          <Link
            href="/blog"
            className="hidden sm:flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Featured Blog */}
      {showFeatured && featuredBlog && (
        <BlogCard blog={featuredBlog} featured />
      )}

      {/* Blog Grid */}
      <div className={`grid ${gridCols[columns]} gap-6`}>
        {regularBlogs.map((blog) => (
          <BlogCard key={blog._id || blog.slug} blog={blog} />
        ))}
      </div>
    </div>
  );
}

export { BlogCard, BlogCardSkeleton };
