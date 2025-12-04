// Performance monitoring and optimization utilities

/**
 * Measure and log page load performance
 */
export function measurePageLoad() {
  if (typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    // Wait a bit for all metrics to be available
    setTimeout(() => {
      const perfData = window.performance.getEntriesByType('navigation')[0];
      
      if (perfData) {
        console.log('📊 Page Performance Metrics:');
        console.log(`  DNS Lookup: ${Math.round(perfData.domainLookupEnd - perfData.domainLookupStart)}ms`);
        console.log(`  TCP Connection: ${Math.round(perfData.connectEnd - perfData.connectStart)}ms`);
        console.log(`  Request Time: ${Math.round(perfData.responseStart - perfData.requestStart)}ms`);
        console.log(`  Response Time: ${Math.round(perfData.responseEnd - perfData.responseStart)}ms`);
        console.log(`  DOM Processing: ${Math.round(perfData.domContentLoadedEventEnd - perfData.responseEnd)}ms`);
        console.log(`  Total Load Time: ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`);
      }

      // First Contentful Paint
      const fcp = performance.getEntriesByName('first-contentful-paint')[0];
      if (fcp) {
        console.log(`  First Contentful Paint: ${Math.round(fcp.startTime)}ms`);
      }

      // Largest Contentful Paint (needs PerformanceObserver)
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log(`  Largest Contentful Paint: ${Math.round(lastEntry.startTime)}ms`);
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          // LCP might not be available
        }
      }
    }, 0);
  });
}

/**
 * Track API call performance
 */
export function trackAPICall(url, startTime) {
  const duration = Date.now() - startTime;
  console.log(`⚡ API Call: ${url} - ${duration}ms`);
  
  // Track slow API calls
  if (duration > 1000) {
    console.warn(`⚠️ Slow API call detected: ${url} took ${duration}ms`);
  }
  
  return duration;
}

/**
 * Lazy load images with Intersection Observer
 */
export function lazyLoadImages(selector = 'img[data-src]') {
  if (typeof window === 'undefined') return;
  
  const images = document.querySelectorAll(selector);
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');
          
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px 0px', // Start loading 50px before entering viewport
      threshold: 0.01
    });
    
    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for browsers without IntersectionObserver
    images.forEach(img => {
      const src = img.getAttribute('data-src');
      if (src) {
        img.src = src;
        img.removeAttribute('data-src');
      }
    });
  }
}

/**
 * Preload critical resources
 */
export function preloadCriticalResources(resources = []) {
  if (typeof document === 'undefined') return;
  
  resources.forEach(({ href, as, type }) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    document.head.appendChild(link);
  });
}

/**
 * Prefetch next page resources
 */
export function prefetchPage(url) {
  if (typeof document === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  document.head.appendChild(link);
}

/**
 * Monitor and log slow components
 */
export function monitorComponentPerformance(componentName, callback) {
  const startTime = performance.now();
  
  const result = callback();
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  if (duration > 100) {
    console.warn(`⚠️ Slow component render: ${componentName} took ${duration.toFixed(2)}ms`);
  }
  
  return result;
}

/**
 * Debounce function for performance optimization
 */
export function debounce(func, wait = 300) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle(func, limit = 300) {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get connection speed information
 */
export function getConnectionSpeed() {
  if (typeof navigator === 'undefined' || !navigator.connection) {
    return 'unknown';
  }
  
  const connection = navigator.connection;
  return {
    effectiveType: connection.effectiveType, // '4g', '3g', '2g', 'slow-2g'
    downlink: connection.downlink, // Mbps
    rtt: connection.rtt, // Round trip time in ms
    saveData: connection.saveData // User has enabled data saver
  };
}

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return;
  
  // Measure page load
  measurePageLoad();
  
  // Log connection info
  const connection = getConnectionSpeed();
  if (connection !== 'unknown') {
    console.log('🌐 Connection:', connection);
    
    // Warn on slow connections
    if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
      console.warn('⚠️ Slow connection detected. Consider optimizing further.');
    }
  }
  
  // Monitor long tasks
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn(`⚠️ Long task detected: ${entry.duration.toFixed(2)}ms`);
          }
        }
      });
      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      // Long task observer not supported
    }
  }
}
