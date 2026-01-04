"use client";
import { useState, useEffect, useMemo, useCallback, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Heart, Clock, Calendar, User, Share2, Eye } from "lucide-react";
import Navbar from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import ScrollToTopButton from "@/ui/ScrollToTopButton";
import api from "@/lib/api/axios";
import { useBlogCache } from "@/context/BlogCacheContext";

// Memoized content block renderer for performance
const ContentBlock = memo(function ContentBlock({ block, index }) {
  const { type, data } = block;

  switch (type) {
    case "paragraph":
      return (
        <p className="text-gray-700 leading-relaxed text-lg mb-6">
          {data?.text?.map((t, i) => (
            <span key={i}>{t.value}</span>
          ))}
        </p>
      );

    case "heading":
      const headingId = data?.text?.[0]?.value?.toLowerCase().replace(/\s+/g, "-") || `heading-${index}`;
      return (
        <h2 id={headingId} className="text-2xl font-bold text-gray-900 mt-10 mb-4 scroll-mt-24">
          {data?.text?.map((t, i) => <span key={i}>{t.value}</span>)}
        </h2>
      );

    case "quote":
      return (
        <blockquote className="border-l-4 border-blue-500 pl-6 py-2 my-6 bg-blue-50 rounded-r-lg italic text-gray-700">
          {data?.text?.map((t, i) => <span key={i}>{t.value}</span>)}
        </blockquote>
      );

    case "link":
      return (
        <a
          href={data?.url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline block my-4"
        >
          {data?.text?.[0]?.value || data?.url}
        </a>
      );

    case "list":
      return (
        <ul className="list-disc list-inside space-y-2 my-6 pl-4">
          {data?.items?.map((item, i) => (
            <li key={i} className="text-gray-700">{item}</li>
          ))}
        </ul>
      );

    case "image":
      if (!data?.url) return null;
      return (
        <figure className="my-8">
          <div className="relative w-full h-auto rounded-lg overflow-hidden">
            <img
              src={data.url}
              alt={data.alt || "Blog image"}
              className="w-full h-auto object-cover rounded-lg"
              loading="lazy"
            />
          </div>
          {data.alt && (
            <figcaption className="text-center text-sm text-gray-500 mt-2">
              {data.alt}
            </figcaption>
          )}
        </figure>
      );

    default:
      return null;
  }
});

// Memoized Table of Contents
const TableOfContents = memo(function TableOfContents({ headings, activeHeading }) {
  if (!headings.length) return null;

  return (
    <nav className="sticky top-24 bg-white rounded-xl shadow-lg p-6 max-h-[calc(100vh-150px)] overflow-y-auto">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
        Table of Contents
      </h3>
      <ul className="space-y-2">
        {headings.map((heading, index) => {
          const id = heading.toLowerCase().replace(/\s+/g, "-");
          const isActive = activeHeading === id;
          return (
            <li key={index}>
              <a
                href={`#${id}`}
                className={`block py-2 px-3 text-sm rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {heading}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
});

// Reading progress bar component
const ReadingProgress = memo(function ReadingProgress({ progress }) {
  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
      <div
        className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
});

export default function OptimizedBlogDetails({ blog: initialBlog }) {
  const { getCachedBlog, fetchBlogDetail, isBlogCached } = useBlogCache();
  const [liked, setLiked] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeHeading, setActiveHeading] = useState("");
  const [blogData, setBlogData] = useState(initialBlog);

  // Use cached blog if available, fetch full details if needed
  useEffect(() => {
    if (!initialBlog?.slug) return;
    
    // Check if we have a full cached version
    const cached = getCachedBlog(initialBlog.slug);
    if (cached && isBlogCached(initialBlog.slug)) {
      setBlogData(cached);
    } else {
      // Fetch full details and cache it
      fetchBlogDetail(initialBlog.slug).then((data) => {
        if (data) setBlogData(data);
      });
    }
  }, [initialBlog?.slug, getCachedBlog, fetchBlogDetail, isBlogCached]);

  // Use the most up-to-date blog data
  const blog = blogData || initialBlog;

  // Extract headings from content for TOC
  const headings = useMemo(() => {
    if (!blog?.content) return [];
    return blog.content
      .filter((block) => block.type === "heading")
      .map((block) => block.data?.text?.[0]?.value || "")
      .filter(Boolean);
  }, [blog?.content]);

  // Scroll handler for reading progress and active heading
  useEffect(() => {
    if (typeof window === "undefined") return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
          setReadingProgress(progress);

          // Update active heading
          const headingElements = document.querySelectorAll("h2[id]");
          for (let i = headingElements.length - 1; i >= 0; i--) {
            const el = headingElements[i];
            if (el.getBoundingClientRect().top <= 150) {
              setActiveHeading(el.id);
              break;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check initial like status
  useEffect(() => {
    if (blog?.slug && typeof window !== "undefined") {
      const likedBlogs = JSON.parse(localStorage.getItem("likedBlogs") || "{}");
      setLiked(!!likedBlogs[blog.slug]);
    }
  }, [blog?.slug]);

  // Handle like toggle
  const handleLike = useCallback(async () => {
    if (!blog?.slug) return;
    
    const likedBlogs = JSON.parse(localStorage.getItem("likedBlogs") || "{}");
    const newLiked = !liked;
    
    if (newLiked) {
      likedBlogs[blog.slug] = true;
    } else {
      delete likedBlogs[blog.slug];
    }
    
    localStorage.setItem("likedBlogs", JSON.stringify(likedBlogs));
    setLiked(newLiked);

    try {
      await api.post(`/blog/${blog.slug}/like`, { action: newLiked ? "like" : "unlike" });
    } catch (error) {
      console.error("Failed to update like:", error);
    }
  }, [blog?.slug, liked]);

  // Handle share
  const handleShare = useCallback(async () => {
    const shareData = {
      title: blog?.title,
      text: blog?.excerpt || blog?.description,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== "AbortError") {
          navigator.clipboard.writeText(window.location.href);
        }
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  }, [blog?.title, blog?.excerpt, blog?.description]);

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
    });
  };

  // Calculate read time
  const readTime = useMemo(() => {
    if (!blog?.content) return "5 min";
    const text = blog.content
      .map((block) => {
        if (block.data?.text) return block.data.text.map((t) => t.value).join(" ");
        if (block.data?.items) return block.data.items.join(" ");
        return "";
      })
      .join(" ");
    const words = text.split(/\s+/).length;
    return `${Math.max(1, Math.ceil(words / 200))} min read`;
  }, [blog?.content]);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog not found</h1>
          <Link href="/blog" className="text-blue-600 hover:underline">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <ReadingProgress progress={readingProgress} />

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 text-white">
          <div className="absolute inset-0">
            <img
              src="/blog-banner.png"
              alt={blog.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-50"
              loading="lazy"
            />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
            {/* Breadcrumb */}
            <nav className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-gray-300">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">Home</Link>
                </li>
                <li>/</li>
                <li>
                  <Link href="/blog" prefetch={true} className="hover:text-white transition-colors">Blog</Link>
                </li>
                <li>/</li>
                <li className="text-white font-medium truncate max-w-[200px]">{blog.title}</li>
              </ol>
            </nav>

            {/* Categories */}
            {blog.categories?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.categories.map((cat, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium"
                  >
                    {cat.name || cat}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-200">
              {blog.author?.name && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Best Buyer's View</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(blog.datePublished || blog.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{readTime}</span>
              </div>
              {blog.views > 0 && (
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{blog.views.toLocaleString()} views</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Main Content */}
            <article className="flex-1">
              {/* Featured Image */}
              {blog.featuredImage?.url && (
                <div className="mb-10 -mt-20 relative z-10">
                  <img
                    src={blog.featuredImage.url}
                    alt={blog.featuredImage.alt || blog.title}
                    className="w-full h-auto max-h-[360px] object-cover rounded-2xl shadow-2xl"
                  />
                </div>
              )}

              {/* Excerpt */}
              {blog.excerpt && (
                <p className="text-xl text-gray-600 leading-relaxed mb-8 font-medium border-l-4 border-blue-600 pl-6">
                  {blog.excerpt}
                </p>
              )}

              {/* Content Blocks */}
              <div className="prose prose-lg max-w-none">
                {blog.content?.map((block, index) => (
                  <ContentBlock key={index} block={block} index={index} />
                ))}
              </div>

              {/* Tags */}
              {blog.tags?.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-500 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-8 flex items-center justify-between py-6 border-t border-b border-gray-200">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    liked
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
                  <span>{liked ? "Liked" : "Like"}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>

              {/* Back to Blog */}
              <div className="mt-8">
                <Link
                  href="/blog"
                  prefetch={true}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Blog
                </Link>
              </div>
            </article>

            {/* Sidebar - Table of Contents */}
            <aside className="hidden lg:block w-72 shrink-0">
              <TableOfContents headings={headings} activeHeading={activeHeading} />
            </aside>
          </div>
        </div>
      </main>

      <Footer />
      <ScrollToTopButton />
    </>
  );
}
