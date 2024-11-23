const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@repo/ui'],
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'links.papareact.com',
      },
      {
        protocol: 'http',
        hostname: 'image.tmdb.org',
      },
    ],
  },
};

module.exports = nextConfig;
