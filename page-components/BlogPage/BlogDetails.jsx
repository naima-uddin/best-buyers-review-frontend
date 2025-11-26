"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useBlogData } from "./BlogDataProvider";
import React, { useState, useEffect } from "react";
import Breadcrumbs from "@/ui/Breadcrumbs";
import Navbar from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";

export default function BlogDetails({ slug }) {
  const { blogs } = useBlogData();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showTableOfContents, setShowTableOfContents] = useState(() => {
  // Check if the user has closed TOC before
  if (typeof window !== "undefined") {
    return localStorage.getItem("tocClosed") !== "true";
  }
  return true; // default visible
});
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const router = useRouter();

  

  useEffect(() => {
    const cachedBlog = blogs.find(b => b.slug === slug);
    
    if (cachedBlog) {
      setBlog(cachedBlog);
      setLoading(false);
    } else {
      async function fetchBlog() {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${slug}`);
          const data = await res.json();
          setBlog(data.data);
          // Simulate initial likes count
          setLikes(Math.floor(Math.random() * 50) + 10);
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

  useEffect(() => {
  const handleScroll = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const progress = (scrollTop / documentHeight) * 100;
    setReadingProgress(Math.min(100, Math.max(0, progress)));
    
    // Only show TOC if user hasn't closed it
    if (localStorage.getItem("tocClosed") !== "true") {
      setShowTableOfContents(scrollTop > 400);
    }
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);


  const handleLike = () => {
    if (!hasLiked) {
      setLikes(likes + 1);
      setHasLiked(true);
    } else {
      setLikes(likes - 1);
      setHasLiked(false);
    }
  };

  // Generate table of contents from headings
  const tableOfContents = blog?.content?.filter(block => 
    block.type === "heading" && block.data?.text?.[0]?.value
  ).map((block, index) => ({
    id: `heading-${index}`,
    text: block.data.text[0].value,
    level: 2 // Assuming h2 for simplicity
  })) || [];

  // Function to render different content block types
  const renderContentBlock = (block, index) => {
    const headingId = `heading-${index}`;
    
    switch (block.type) {
      case "paragraph":
        const paragraphText = block.data?.text?.[0]?.value || "";
        if (paragraphText.trim()) {
          return (
            <p key={index} className="text-gray-700 leading-relaxed text-lg mb-8">
              {paragraphText}
            </p>
          );
        }
        return null;

      case "heading":
        const headingText = block.data?.text?.[0]?.value || "";
        if (headingText.trim()) {
          return (
            <h2 
              id={headingId}
              key={index} 
              className="text-3xl font-bold text-gray-900 mt-16 mb-8 leading-tight scroll-mt-24 border-l-4 border-blue-500 pl-6 py-2 bg-blue-50/30 rounded-r-lg"
            >
              {headingText}
            </h2>
          );
        }
        return null;

      case "quote":
        const quoteText = block.data?.text?.[0]?.value || "";
        if (quoteText.trim()) {
          return (
            <blockquote key={index} className="relative my-12 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-l-4 border-blue-500">
              <div className="text-6xl text-blue-500 absolute -top-2 left-4">"</div>
              <p className="text-xl text-gray-700 leading-relaxed italic relative z-10">
                {quoteText}
              </p>
              <div className="text-6xl text-blue-500 absolute -bottom-8 right-4">"</div>
            </blockquote>
          );
        }
        return null;

      case "link":
        const linkText = block.data?.text?.[0]?.value || block.data?.url || "";
        const linkUrl = block.data?.url || "#";
        if (linkText.trim()) {
          return (
            <div key={index} className="my-8">
              <a 
                href={linkUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-4 bg-blue-50 text-blue-700 rounded-2xl font-medium hover:bg-blue-100 transition-all duration-300 group border border-blue-200"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span className="font-semibold">{linkText}</span>
              </a>
            </div>
          );
        }
        return null;

      case "list":
        const listItems = block.data?.items || [];
        if (listItems.length > 0) {
          return (
            <div key={index} className="my-8">
              <ul className="space-y-4">
                {listItems.map((item, itemIndex) => (
                  item.trim() && (
                    <li key={itemIndex} className="flex items-start gap-4 text-gray-700 text-lg bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>{item}</span>
                    </li>
                  )
                ))}
              </ul>
            </div>
          );
        }
        return null;

      case "image":
        const imageUrl = block.data?.url;
        const imageAlt = block.data?.alt || blog?.title || "Blog image";
        if (imageUrl) {
          return (
            <div key={index} className="my-12">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl group">
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  width={320}
                  height={240}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              {block.data?.alt && (
                <p className="text-center text-gray-500 text-sm mt-4 italic bg-gray-50 py-2 rounded-lg">
                  {block.data.alt}
                </p>
              )}
            </div>
          );
        }
        return null;

      default:
        return null;
    }
  };

  if (loading) {
    return <BlogDetailsSkeleton readingProgress={readingProgress} />;
  }

  if (!blog) {
    return <NotFoundState />;
  }

  const readingTime = Math.ceil((blog.content?.length || 0) / 5);

  const applyAnchorTags = (text, anchors) => {
  if (!anchors || !Array.isArray(anchors) || !text) return text;

  let result = text;

  anchors.forEach(({ keyword, url }) => {
    if (!keyword || !url) return;

    // Replace ONLY first occurrence per paragraph
    const regex = new RegExp(`\\b${keyword}\\b`, "i"); 
    result = result.replace(
      regex,
      `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">${keyword}</a>`
    );
  });

  return result;
};


  return (
    <>
      <Navbar />
      <div className=" bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
        {/* Reading Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200/50 z-50 backdrop-blur-sm">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-150 ease-out shadow-lg shadow-blue-500/25"
            style={{ width: `${readingProgress}%` }}
          />
        </div>

        {/* Table of Contents Sidebar */}
        {/* Table of Contents Sidebar */}
{showTableOfContents && tableOfContents.length > 0 && (
  <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 hidden xl:block">
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-200/50 max-w-xs relative">
      {/* Close Button */}
      <button
  onClick={() => {
    setShowTableOfContents(false);
    localStorage.setItem("tocClosed", "true"); // remember user closed it
  }}
  className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors"
>
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
</button>


      <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Contents</h4>
      <nav className="space-y-2">
        {tableOfContents.map((item, index) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="block text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 py-1 border-l-2 border-transparent hover:border-blue-500 hover:pl-2 pl-1"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(item.id)?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              });
            }}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </div>
  </div>
)}



        <div className="max-w-6xl mx-auto px-6 py-16">
        <Breadcrumbs />

          {/* Back Button */}
          <div className="mb-12">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-all duration-300 font-medium"
            >
              <div className="w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                <svg className="w-5 h-5 transform group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </div>
              <span className="group-hover:translate-x-1 transition-transform">Back to Blog</span>
            </Link>
          </div>

          {/* Blog Content */}
          <article className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100/80 overflow-hidden">
            {/* Header with Gradient Background */}
            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white p-12 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
              </div>
              
              <div className="relative z-10">
                {/* Categories */}
                {blog.categories && blog.categories.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-6">
                    {blog.categories.map((category, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white/90 text-sm font-semibold rounded-2xl border border-white/30"
                      >
                        {category.name || category}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight tracking-tight">
                  {blog.title}
                </h1>
                
                {/* Meta Information */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    
                      <div className="w-14 h-14 rounded-2xl border-2 border-white/30 overflow-hidden shadow-lg">
                        <Image 
                          src="/logoWithBG.png"
                          alt="Best Buyers View"
                          width={56}
                          height={56}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    
                    <div>
                      <p className="font-semibold text-white/95 text-lg">Best Buyers View</p>
                      <p className="text-white/70 flex items-center gap-3 text-sm">
                        
                        <span>•</span>
                        <span>{readingTime} min read</span>
                      </p>
                    </div>
                  </div>

                  {/* Social Stats */}
                  <div className="flex items-center gap-6 text-white/80">
                    <button 
                      onClick={handleLike}
                      className={`flex items-center gap-2 transition-all duration-300 ${
                        hasLiked ? 'text-red-400' : 'hover:text-red-300'
                      }`}
                    >
                      <svg className="w-5 h-5" fill={hasLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{likes}</span>
                    </button>
                    
                    
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {blog.featuredImage?.url && (
              <div className="relative h-96 -mt-8 mx-8 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src={blog.featuredImage.url}
                  alt={blog.featuredImage.alt || blog.title}
                  width={320}
                  height={240}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            )}

            {/* Content Area */}
            <div className="p-8 md:p-12">
              {/* Excerpt */}
              {blog.excerpt && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-12 border border-blue-100 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-4 h-full bg-gradient-to-b from-blue-500 to-purple-500"></div>
                  <div className="relative z-10">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2" >
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Quick Summary
                      
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: applyAnchorTags(blog.excerpt, blog.anchors) }}>
                    </p>
                  </div>
                </div>
              )}

              {/* Description */}
              {blog.description && (
                <div className="mb-12">
                  <p className="text-gray-600 text-lg leading-relaxed border-l-4 border-green-500 pl-6 py-2 bg-green-50/30 rounded-r-lg">
                    {blog.description}
                  </p>
                </div>
              )}

              {/* Main Content Blocks */}
              <div className="prose prose-lg max-w-none">
                {blog.content && blog.content.length > 0 ? (
                  blog.content.map((block, index) => renderContentBlock(block, index))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-lg">Content coming soon...</p>
                  </div>
                )}
              </div>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-16 pt-12 border-t border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Related Topics
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {blog.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-5 py-3 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 text-base font-medium rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer hover:border-blue-200 hover:text-blue-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Author Bio */}
              <div className="mt-16 pt-12 border-t border-gray-200">
                <div className="flex flex-col md:flex-row items-start gap-6 bg-gray-50 rounded-2xl p-8">
                    <Image 
                      src="/logoWithBG.png"
                      alt="Best Buyers View"
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-2xl object-contain border-4 border-white shadow-lg flex-shrink-0"
                    />
                 
                    
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      Best Buyers View Team
                    </h4>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Our team of expert reviewers tests and analyzes products to bring you unbiased, comprehensive reviews and buying guides.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Senior Product Reviewer</span>
                      <span>•</span>
                      <span>5+ years experience</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Share & Actions */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  

                  <div className="flex items-center gap-4">
                    <button 
                      onClick={handleLike}
                      className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                        hasLiked 
                          ? 'bg-red-50 text-red-600 border border-red-200' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <svg className="w-5 h-5" fill={hasLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {likes} {hasLiked ? 'Liked' : 'Like'}
                    </button>
                    
                    
                  </div>
                </div>
              </div>
            </div>
          </article>


          {/* Back to Blog CTA */}
          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Explore More Reviews
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

// Skeleton Loading for Blog Details
function BlogDetailsSkeleton({ readingProgress }) {
  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200/50 z-50 backdrop-blur-sm">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-150 ease-out shadow-lg shadow-blue-500/25"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="animate-pulse space-y-8">
          {/* Back Button Skeleton */}
          <div className="h-6 bg-gray-200 rounded w-24 mb-12"></div>
          
          {/* Header Skeleton */}
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 space-y-6">
            <div className="h-4 bg-white/20 rounded w-32"></div>
            <div className="h-12 bg-white/20 rounded w-3/4"></div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl"></div>
              <div className="space-y-2">
                <div className="h-4 bg-white/20 rounded w-24"></div>
                <div className="h-3 bg-white/20 rounded w-16"></div>
              </div>
            </div>
          </div>

          {/* Featured Image Skeleton */}
          <div className="h-96 bg-gray-200 rounded-2xl -mt-8 mx-8"></div>

          {/* Content Skeleton */}
          <div className="bg-white rounded-3xl p-12 space-y-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

// Not Found State
function NotFoundState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Review Not Found</h1>
        <p className="text-gray-600 mb-8">The product review you're looking for doesn't exist or has been moved.</p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Reviews
        </Link>
      </div>
    </div>
  );
}