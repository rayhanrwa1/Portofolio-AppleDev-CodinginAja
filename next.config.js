/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
}


// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jagobelajar.cloud',
      },
    ],
  },
};




