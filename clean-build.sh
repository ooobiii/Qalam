#!/bin/bash
# Stop any running Next.js processes
pkill -f "next dev" || true
# Remove the .next directory
rm -rf .next
# Clear npm cache
npm cache clean --force
# Reinstall dependencies
rm -rf node_modules
npm install
# Build the app
npm run build 