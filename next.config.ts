import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Cloudflare Pages (OpenNext adapter)
  // This disables Node.js-specific APIs that aren't available in edge runtime
  serverExternalPackages: [],
};

export default nextConfig;
