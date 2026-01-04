"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const BlogCacheContext = createContext(null);

export function BlogCacheProvider({ children }) {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all blogs
  const fetchBlogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog`, {
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      });
      
      if (!res.ok) throw new Error('Failed to fetch blogs');
      
      const data = await res.json();
      const fetchedBlogs = data.data || [];
      
      setBlogs(fetchedBlogs);
      return fetchedBlogs;
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Reload blogs - same as fetchBlogs but always fetches fresh
  const reloadBlogs = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog?_t=${Date.now()}`, {
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      });
      
      if (!res.ok) throw new Error('Failed to fetch blogs');
      
      const data = await res.json();
      const fetchedBlogs = data.data || [];
      
      setBlogs(fetchedBlogs);
      console.log('✅ Blogs reloaded:', fetchedBlogs.length);
      return fetchedBlogs;
    } catch (error) {
      console.error('Error reloading blogs:', error);
      return blogs;
    }
  }, [blogs]);

  // Fetch on app load
  useEffect(() => {
    fetchBlogs();
  }, []);

  const value = {
    blogs,
    isLoading,
    fetchBlogs,
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
