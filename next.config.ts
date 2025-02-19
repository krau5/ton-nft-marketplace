import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's.getgems.io',
        port: '',
        search: '',
      },
    ],
  },
};

export default nextConfig;
