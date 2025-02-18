import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  assetPrefix: '',
  basePath: '',
  images: { unoptimized: true }
};

export default nextConfig;
