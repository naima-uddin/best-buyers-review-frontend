"use client";
import { createContext, useContext, useEffect, useState } from "react";

const CategoryContext = createContext();

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Use the environment variable with fallback
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.bestbuyersview.com/api';
        console.log('Fetching categories from:', `${apiUrl}/categories`);

        const res = await fetch(`${apiUrl}/categories`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Add cache option for Next.js
          cache: 'no-store'
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log('Categories fetched successfully:', data.length);
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        console.error("Error details:", {
          message: err.message,
          name: err.name,
          stack: err.stack
        });
        // Set empty array on error so UI can still render
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, loading }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);

  // Add this check to handle SSR/undefined context
  if (context === undefined) {
    return { categories: [], loading: true };
  }

  return context;
}
