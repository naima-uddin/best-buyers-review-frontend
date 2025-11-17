"use client";
import { createContext, useContext, useEffect, useState } from "react";

// Create a context for blog data
const BlogDataContext = createContext();

export function BlogDataProvider({ children }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredBlog, setFeaturedBlog] = useState(null);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog`);
        const data = await res.json();
        const blogsData = data.blogs || [];

        
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

  return (
    <BlogDataContext.Provider value={{ blogs, loading, featuredBlog }}>
      {children}
    </BlogDataContext.Provider>
  );
}

export const useBlogData = () => {
  const context = useContext(BlogDataContext);
  if (!context) {
    throw new Error("useBlogData must be used within a BlogDataProvider");
  }
  return context;
};