// next.config.js - Optimized for maximum performance and SEO
/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',

  trailingSlash: false,

  images: {
    unoptimized: false, // Enable Next.js image optimization
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
      },
      {
        protocol: "https",
        hostname: "bestbuyersview.com",
      },
      {
        protocol: "https",
        hostname: "api.bestbuyersview.com",
      },
      {
        protocol: "https",
        hostname: "www.bestbuyersview.com",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com", // Amazon S3 images
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com", // Amazon product images
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000, // 1 year
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // Aggressive caching
  generateBuildId: async () => {
    return "build-" + Date.now();
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Ensure environment variables are available
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_IMAGE_API_URL: process.env.NEXT_PUBLIC_IMAGE_API_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },

  // SEO-friendly headers with aggressive caching
  async headers() {
    return [
      // Cache static assets aggressively
      {
        source: "/bannerImg/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/category_img/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
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
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "bestbuyersview.com",
          },
        ],
        destination: "https://www.bestbuyersview.com/:path*",
        permanent: true,
      },
    ];
  },

  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["react-icons", "lucide-react"],
  },
};

module.exports = nextConfig;
