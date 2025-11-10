// next.config.js - For development (remove output: 'export')
/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',

  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['bestbuyersview.com', 'api.bestbuyersview.com'],
  },

  // Ensure environment variables are available
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_IMAGE_API_URL: process.env.NEXT_PUBLIC_IMAGE_API_URL,
  }
}

module.exports = nextConfig