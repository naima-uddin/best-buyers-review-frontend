// this is my personal key manager , at first check if user already logged in if not then login also logout
// The AuthProvider exposes login, checkAuth, logout

// createContext → creates a shared space for authentication info data between components
// useContext → allows other components to use that info.
'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
const AuthContext = createContext();
const API_BASE_URL = 'https://best-buyers-review-backend-q2rp.onrender.com/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // When the app first loads, this automatically calls checkAuth() to see if the user is already logged in (using a saved token)
  useEffect(() => {
    checkAuth();
  }, []);
 
  const checkAuth = async () => {
    try {
      // Gets your saved token (room key) from localStorage.
      const token = localStorage.getItem('token');
      if (token) {
        // Set the authorization header
        // If token exists, attach it to all future Axios requests (like an ID badge for backend).
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
       
        // 👉 Asks the backend: "Who am I?"
        // (GET /auth/me returns user info if the token is valid.)
        const response = await axios.get(`${API_BASE_URL}/auth/me`);
        
        if (response.data.success) {
          setUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          throw new Error('Authentication failed');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
     // Step 1: Get room key from reception
    try {
      // Step 2: Store the room key safely
      //  Before logging in, clear any old token.
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];

      // Send login request to backend with the user's email and password.
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });

      console.log('Login response:', response.data);

      if (response.data.success && response.data.token) {
        const token = response.data.token;
        localStorage.setItem('token', token);
        
        // Set the authorization header for future requests
          // Step 3: Always show this key when talking to backend
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        setUser(response.data.user);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      // Clear token on error
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      login,
      logout,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// UPDATED HOOK: Safe for build/SSR
export function useAuth() {
  const context = useContext(AuthContext);
  
  // Return default values during build/SSR instead of throwing
  if (!context) {
    return {
      user: null,
      isAuthenticated: false,
      loading: false,
      login: async () => false,
      logout: () => {},
      checkAuth: async () => {}
    };
  }
  
  return context;
}