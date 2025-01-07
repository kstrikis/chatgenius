/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment variables are handled by .env files
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  },
  
  // Enable SWC compiler for faster builds
  swcMinify: true,
  
  // Type checking and ESLint settings based on environment
  typescript: {
    // Only ignore type checking in development
    ignoreBuildErrors: process.env.NODE_ENV !== 'production',
  },
  eslint: {
    // Only ignore ESLint in development
    ignoreDuringBuilds: process.env.NODE_ENV !== 'production',
  },
};

export default nextConfig; 