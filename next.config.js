// next.config.js - Optimized for maximum performance
/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',

  trailingSlash: false,
  
  images: {
    unoptimized: true,
    domains: ['bestbuyersview.com', 'api.bestbuyersview.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 year
  },

  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Aggressive caching
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },

  // Optimize bundle
  swcMinify: true,
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Ensure environment variables are available
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_IMAGE_API_URL: process.env.NEXT_PUBLIC_IMAGE_API_URL,
  },

  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['react-icons', 'lucide-react'],
  }
}

module.exports = nextConfig