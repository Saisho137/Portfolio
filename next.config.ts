import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  trailingSlash: true,
  assetPrefix: '',
  basePath: '',
  images: { unoptimized: true }
};

export default nextConfig;
