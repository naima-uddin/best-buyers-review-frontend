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
  const [readingProgress, setReadingProgress] = useState(0);
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
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
        {/* Reading Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-150" 
               style={{ width: `${readingProgress}%` }} />
        </div>

        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="animate-pulse space-y-8">
            {/* Back Button Skeleton */}
            <div className="h-6 bg-gray-200 rounded w-24 mb-12"></div>
            
            {/* Header Skeleton */}
            <div className="space-y-6">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-12 bg-gray-200 rounded w-3/4"></div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>

            {/* Featured Image Skeleton */}
            <div className="h-96 bg-gray-200 rounded-2xl"></div>

            {/* Content Skeleton */}
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
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
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist or has been moved.</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200/50 z-50 backdrop-blur-sm">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-150 ease-out shadow-lg shadow-blue-500/25"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
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
            <span className="group-hover:translate-x-1 transition-transform">All Articles</span>
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
                      {category}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Title */}
              <h1 className="text-5xl font-bold mb-8 leading-tight tracking-tight">
                {blog.title}
              </h1>
              
              {/* Meta Information */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">
                      {blog.author?.name?.charAt(0) || 'B'}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-white/95 text-lg">{blog.author?.name || 'Best Buyers View'}</p>
                    <p className="text-white/70 flex items-center gap-2">
                      <span>{new Date(blog.datePublished || blog.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                      {blog.readTime && (
                        <>
                          <span>•</span>
                          <span>{blog.readTime} min read</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {blog.featuredImage?.url && (
            <div className="relative h-96 -mt-8 mx-8 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={blog.featuredImage.url}
                alt={blog.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          )}

          {/* Content Area */}
          <div className="p-12">
            {/* Excerpt */}
            {blog.excerpt && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-12 border border-blue-100">
                <p className="text-xl text-gray-700 leading-relaxed font-medium italic">
                  "{blog.excerpt}"
                </p>
              </div>
            )}

            {/* Main Content */}
            <div className="prose prose-lg max-w-none">
              {blog.content?.map((block, index) => {
                if (block.type === 'paragraph' && block.data?.text) {
                  const textContent = block.data.text.map(text => text.value).join('');
                  if (textContent.trim()) {
                    return (
                      <p key={index} className="text-gray-700 leading-relaxed text-lg mb-8">
                        {textContent}
                      </p>
                    );
                  }
                }
                return null;
              })}
              
              {(!blog.content?.length || blog.content.every(block => 
                !block.data?.text?.some(text => text.value.trim())
              )) && blog.description && (
                <p className="text-gray-700 leading-relaxed text-lg">
                  {blog.description}
                </p>
              )}
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-16 pt-12 border-t border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Topics</h3>
                <div className="flex flex-wrap gap-3">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-5 py-3 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 text-base font-medium rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap gap-4">
              <button className="flex items-center gap-3 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-medium transition-all duration-300 hover:scale-105">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                Like
              </button>
              <button className="flex items-center gap-3 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-medium transition-all duration-300 hover:scale-105">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
            </div>
          </div>
        </article>

        {/* Related Posts Suggestion */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">Enjoyed this article?</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            Explore More Articles
          </Link>
        </div>
      </div>
    </div>
  );
}