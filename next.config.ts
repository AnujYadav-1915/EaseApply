import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['pdf-parse', 'puppeteer', 'puppeteer-core', '@sparticuz/chromium', '@napi-rs/canvas'],
};

export default nextConfig;
