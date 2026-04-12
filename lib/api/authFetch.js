/**
 * Authenticated fetch wrapper
 * Automatically adds the Authorization header from localStorage token
 */

export async function authFetch(url, options = {}) {
  // Only run on client side
  if (typeof window === 'undefined') {
    return fetch(url, options);
  }

  const token = localStorage.getItem('token');
  
  const headers = {
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return fetch(url, {
    ...options,
    headers,
  });
}

export default authFetch;
