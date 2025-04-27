import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    // No need to expose sensitive variables here, they will be available via process.env
  },
  // Ensure server components can access environment variables
  serverRuntimeConfig: {
    // Will only be available on the server side
  },
  // Expose public environment variables to the browser (do not expose API keys here)
  publicRuntimeConfig: {
    // Will be available on both server and client
  }
};

export default nextConfig;
