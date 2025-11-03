// next.config.js - For development (remove output: 'export')
/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['bestbuyersview.com'],
  }
}

module.exports = nextConfig