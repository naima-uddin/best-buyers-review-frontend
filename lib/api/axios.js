import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
});

// Optional: add token automatically if you have admin auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // Remove trailing slash from URL
  if (config.url && config.url.endsWith('/')) {
    config.url = config.url.slice(0, -1);
  }

  return config;
});

export default api;
