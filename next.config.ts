import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    'http://192.168.248.17',
    'https://*.ngrok-free.app',
    'http://localhost:3000',
  ],
};

export default nextConfig;
