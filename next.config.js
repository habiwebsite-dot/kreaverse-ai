/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_WA_NUMBER: process.env.NEXT_PUBLIC_WA_NUMBER,
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
