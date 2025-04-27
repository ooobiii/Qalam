#!/bin/bash
# Stop any running Next.js processes
pkill -f "next dev" || true

# Remove the .next directory to ensure a clean build
rm -rf .next

# Create the cache directory structure manually to avoid ENOENT issues
mkdir -p .next/cache/webpack/client-development
mkdir -p .next/cache/webpack/server-development

# Run the Next.js development server with extra memory and no cache
NODE_OPTIONS="--max-old-space-size=4096" NEXT_TELEMETRY_DISABLED=1 next dev --no-cache 