/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow binding to all network interfaces in Docker
  hostname: process.env.CLIENT_HOST || 'localhost',
  port: 3000,
}

module.exports = nextConfig 