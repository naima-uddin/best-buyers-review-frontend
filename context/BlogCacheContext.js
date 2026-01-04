"use client";
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

const BlogCacheContext = createContext(null);

// Cache duration: 30 minutes
const CACHE_DURATION = 30 * 60 * 1000;

export function BlogCacheProvider({ children }) {
  const [blogs, setBlogs] = useState([]);
  const [blogDetails, setBlogDetails] = useState({}); // { slug: blogData }
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const lastFetchTime = useRef(0);

  // Fetch all blogs (called on app load)
  const fetchBlogs = useCallback(async (force = false) => {
    const now = Date.now();
    
    // Skip if recently fetched and not forced
    if (!force && blogs.length > 0 && (now - lastFetchTime.current) < CACHE_DURATION) {
      return blogs;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog`, {
        headers: { 'Accept': 'application/json' },
        cache: 'no-store' // We handle caching ourselves
      });
      
      if (!res.ok) throw new Error('Failed to fetch blogs');
      
      const data = await res.json();
      const fetchedBlogs = data.data || [];
      
      setBlogs(fetchedBlogs);
      lastFetchTime.current = now;
      
      // Also cache individual blogs from list
      const detailsCache = {};
      fetchedBlogs.forEach(blog => {
        detailsCache[blog.slug] = { data: blog, fetchedAt: now, isPartial: true };
      });
      setBlogDetails(prev => ({ ...prev, ...detailsCache }));
      
      return fetchedBlogs;
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return blogs; // Return existing data on error
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, [blogs]);

  // Fetch single blog detail
  const fetchBlogDetail = useCallback(async (slug, force = false) => {
    const now = Date.now();
    const cached = blogDetails[slug];
    
    // Return cached if available, not partial, and not expired
    if (!force && cached && !cached.isPartial && (now - cached.fetchedAt) < CACHE_DURATION) {
      return cached.data;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${slug}`, {
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      });
      
      if (!res.ok) return cached?.data || null;
      
      const json = await res.json();
      const blogData = json.data;
      
      // Cache the full blog detail
      setBlogDetails(prev => ({
        ...prev,
        [slug]: { data: blogData, fetchedAt: now, isPartial: false }
      }));
      
      return blogData;
    } catch (error) {
      console.error('Error fetching blog detail:', error);
      return cached?.data || null;
    }
  }, [blogDetails]);

  // Get cached blog (no fetch)
  const getCachedBlog = useCallback((slug) => {
    return blogDetails[slug]?.data || null;
  }, [blogDetails]);

  // Check if blog is cached
  const isBlogCached = useCallback((slug) => {
    const cached = blogDetails[slug];
    if (!cached) return false;
    return !cached.isPartial && (Date.now() - cached.fetchedAt) < CACHE_DURATION;
  }, [blogDetails]);

  // Prefetch on mount (app load)
  useEffect(() => {
    fetchBlogs();
  }, []);

  const value = {
    blogs,
    isLoading,
    isInitialized,
    fetchBlogs,
    fetchBlogDetail,
    getCachedBlog,
    isBlogCached,
    blogDetails
  };

  return (
    <BlogCacheContext.Provider value={value}>
      {children}
    </BlogCacheContext.Provider>
  );
}

export function useBlogCache() {
  const context = useContext(BlogCacheContext);
  if (!context) {
    throw new Error('useBlogCache must be used within BlogCacheProvider');
  }
  return context;
}

export default BlogCacheContext;
