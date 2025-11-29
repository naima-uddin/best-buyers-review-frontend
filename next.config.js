// next.config.js - Optimized for maximum performance and SEO
/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',

  trailingSlash: false,
  
  images: {
    unoptimized: true,
    domains: ['bestbuyersview.com', 'api.bestbuyersview.com', 'www.bestbuyersview.com'],
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
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },

  // SEO-friendly headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
    ];
  },

  // SEO-friendly redirects (add your redirects here)
  async redirects() {
    return [
      // Redirect non-www to www for consistency
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'bestbuyersview.com',
          },
        ],
        destination: 'https://www.bestbuyersview.com/:path*',
        permanent: true,
      },
    ];
  },

  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['react-icons', 'lucide-react'],
  }
}

module.exports = nextConfig