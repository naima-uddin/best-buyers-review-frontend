"use client";
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

const BlogCacheContext = createContext(null);

export function BlogCacheProvider({ children }) {
  const [blogs, setBlogs] = useState([]);
  const [blogDetails, setBlogDetails] = useState({}); // { slug: blogData }
  const [isLoading, setIsLoading] = useState(true);
  
  // Use refs for stable callback access
  const blogDetailsRef = useRef(blogDetails);
  const blogsRef = useRef(blogs);
  
  useEffect(() => {
    blogDetailsRef.current = blogDetails;
  }, [blogDetails]);
  
  useEffect(() => {
    blogsRef.current = blogs;
  }, [blogs]);

  // Fetch all blogs (called on app load)
  const fetchBlogs = useCallback(async () => {
    // If already have blogs, don't fetch again (instant navigation)
    if (blogsRef.current.length > 0) {
      setIsLoading(false);
      return blogsRef.current;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog`, {
        headers: { 'Accept': 'application/json' },
      });
      
      if (!res.ok) throw new Error('Failed to fetch blogs');
      
      const data = await res.json();
      const fetchedBlogs = data.data || [];
      
      setBlogs(fetchedBlogs);
      
      // Also cache individual blogs from list for quick access
      const detailsCache = {};
      fetchedBlogs.forEach(blog => {
        detailsCache[blog.slug] = blog;
      });
      setBlogDetails(prev => ({ ...prev, ...detailsCache }));
      
      return fetchedBlogs;
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get blog by slug - from cache or fetch (stable callback)
  const getBlogBySlug = useCallback(async (slug) => {
    // Check if already cached
    if (blogDetailsRef.current[slug]) {
      return blogDetailsRef.current[slug];
    }

    // Fetch single blog
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${slug}`, {
        headers: { 'Accept': 'application/json' },
      });
      
      if (!res.ok) return null;
      
      const json = await res.json();
      const blogData = json.data;
      
      // Cache it
      setBlogDetails(prev => ({ ...prev, [slug]: blogData }));
      
      return blogData;
    } catch (error) {
      console.error('Error fetching blog:', error);
      return null;
    }
  }, []);

  // Cache a blog (stable callback)
  const cacheBlog = useCallback((blog) => {
    if (blog?.slug && !blogDetailsRef.current[blog.slug]) {
      setBlogDetails(prev => ({ ...prev, [blog.slug]: blog }));
    }
  }, []);

  // Reload blogs (for admin after create/update/delete)
  const reloadBlogs = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog`, {
        headers: { 'Accept': 'application/json' },
      });
      
      if (!res.ok) throw new Error('Failed to fetch blogs');
      
      const data = await res.json();
      const fetchedBlogs = data.data || [];
      
      setBlogs(fetchedBlogs);
      
      // Update cache
      const detailsCache = {};
      fetchedBlogs.forEach(blog => {
        detailsCache[blog.slug] = blog;
      });
      setBlogDetails(detailsCache);
      
      return fetchedBlogs;
    } catch (error) {
      console.error('Error reloading blogs:', error);
      return blogsRef.current;
    }
  }, []);

  // Prefetch on app load
  useEffect(() => {
    fetchBlogs();
  }, []);

  const value = {
    blogs,
    isLoading,
    fetchBlogs,
    getBlogBySlug,
    cacheBlog,
    reloadBlogs,
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
