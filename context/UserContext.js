"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { authFetch } from "@/lib/api/authFetch";

const UserContext = createContext({
  user: null,
  setUser: () => {},
  loading: true,
});

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // First check if we have a stored user in localStorage
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        
        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
        } else {
          // Try to fetch from API if token exists
          const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
          const res = await authFetch(`${API}/auth/me`);
          if (res.ok) {
            const data = await res.json();
            setUser(data.user || data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
