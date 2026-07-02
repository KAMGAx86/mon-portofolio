import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Expose to client-side code so the admin page knows it's on Vercel
    NEXT_PUBLIC_IS_VERCEL: process.env.VERCEL || '0',
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '500mb',
    },
  },
};

export default nextConfig;
