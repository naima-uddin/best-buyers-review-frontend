// Optimized fetch wrapper with automatic caching and request deduplication

const pendingRequests = new Map();

/**
 * Optimized fetch with automatic caching and deduplication
 * @param {string} url - API endpoint URL
 * @param {object} options - Fetch options
 * @returns {Promise} - Response data
 */
export async function optimizedFetch(url, options = {}) {
  const cacheKey = `fetch:${url}:${JSON.stringify(options)}`;
  
  // Check if there's already a pending request for this URL
  if (pendingRequests.has(cacheKey)) {
    console.log('🔄 Deduplicating request:', url);
    return pendingRequests.get(cacheKey);
  }

  // Check cache first (sessionStorage for client-side caching)
  if (typeof window !== 'undefined' && options.method === 'GET') {
    const cached = sessionStorage.getItem(cacheKey);
    const timestamp = sessionStorage.getItem(`${cacheKey}:time`);
    const maxAge = options.cacheTime || 300000; // Default 5 minutes
    
    if (cached && timestamp) {
      const age = Date.now() - parseInt(timestamp);
      if (age < maxAge) {
        console.log('✅ Cache hit:', url);
        return JSON.parse(cached);
      }
    }
  }

  // Create the fetch promise
  const fetchPromise = fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Cache successful GET requests
      if (typeof window !== 'undefined' && (!options.method || options.method === 'GET')) {
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(data));
          sessionStorage.setItem(`${cacheKey}:time`, Date.now().toString());
        } catch (e) {
          // SessionStorage might be full, clear old entries
          if (e.name === 'QuotaExceededError') {
            clearOldCache();
            try {
              sessionStorage.setItem(cacheKey, JSON.stringify(data));
              sessionStorage.setItem(`${cacheKey}:time`, Date.now().toString());
            } catch (e2) {
              console.warn('Could not cache response:', e2);
            }
          }
        }
      }
      return data;
    })
    .finally(() => {
      // Remove from pending requests
      pendingRequests.delete(cacheKey);
    });

  // Store pending request
  pendingRequests.set(cacheKey, fetchPromise);

  return fetchPromise;
}

/**
 * Clear old cache entries to free up space
 */
function clearOldCache() {
  if (typeof window === 'undefined') return;
  
  const keys = Object.keys(sessionStorage);
  const cacheEntries = [];
  
  // Collect all cache entries with timestamps
  keys.forEach(key => {
    if (key.startsWith('fetch:') && key.endsWith(':time')) {
      const timestamp = parseInt(sessionStorage.getItem(key) || '0');
      cacheEntries.push({ key: key.replace(':time', ''), timestamp });
    }
  });
  
  // Sort by timestamp (oldest first)
  cacheEntries.sort((a, b) => a.timestamp - b.timestamp);
  
  // Remove oldest 25% of entries
  const removeCount = Math.ceil(cacheEntries.length * 0.25);
  for (let i = 0; i < removeCount; i++) {
    sessionStorage.removeItem(cacheEntries[i].key);
    sessionStorage.removeItem(`${cacheEntries[i].key}:time`);
  }
  
  console.log(`🗑️ Cleared ${removeCount} old cache entries`);
}

/**
 * Prefetch data for faster navigation
 * @param {string} url - URL to prefetch
 * @param {object} options - Fetch options
 */
export function prefetch(url, options = {}) {
  if (typeof window === 'undefined') return;
  
  // Use requestIdleCallback if available, otherwise setTimeout
  const callback = () => optimizedFetch(url, options).catch(() => {
    // Silently fail prefetch
  });
  
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback);
  } else {
    setTimeout(callback, 1);
  }
}

/**
 * Clear cache for specific URL pattern
 * @param {string} pattern - URL pattern to clear (supports wildcards)
 */
export function clearCache(pattern) {
  if (typeof window === 'undefined') return;
  
  const keys = Object.keys(sessionStorage);
  const regex = new RegExp(pattern.replace(/\*/g, '.*'));
  let cleared = 0;
  
  keys.forEach(key => {
    if (key.startsWith('fetch:') && regex.test(key)) {
      sessionStorage.removeItem(key);
      sessionStorage.removeItem(`${key}:time`);
      cleared++;
    }
  });
  
  console.log(`🗑️ Cleared ${cleared} cache entries matching: ${pattern}`);
  return cleared;
}
