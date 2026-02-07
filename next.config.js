/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com"],
    remotePatterns: [
      //local
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3000",
      },
      //stage
      {
        protocol: "https",
        hostname: "souaba-stage-app.vercel.app",
      },
    ],
  },
};

module.exports = nextConfig;
