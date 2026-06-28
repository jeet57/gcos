//import type { NextConfig } from 'next';

/**
 * M01 scope: minimal config. ISR revalidate windows (TAD 2.4),
 * image domains, and any rewrites to the NestJS API are added once
 * those features exist (M10+).
 */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@gcos/types', '@gcos/ui'],
};

export default nextConfig;
