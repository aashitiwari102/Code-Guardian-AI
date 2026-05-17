#!/bin/bash

# Cloudflare Pages Deployment Script for TanStack Start
# This script builds and deploys your app to Cloudflare Pages

set -e  # Exit on error

echo "🚀 Starting Cloudflare Pages deployment..."

# Step 1: Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist

# Step 2: Build the application
echo "📦 Building application..."
npm run build

# Step 3: Verify build output
if [ ! -d "dist/client" ]; then
    echo "❌ Error: dist/client directory not found!"
    exit 1
fi

echo "✅ Build completed successfully!"

# Step 4: Deploy to Cloudflare Pages
echo "🌐 Deploying to Cloudflare Pages..."
npx wrangler pages deploy dist/client --project-name=code-guardian-ai

echo "✨ Deployment complete!"
echo "📝 Note: If this is your first deployment, you may need to:"
echo "   1. Login to Cloudflare: npx wrangler login"
echo "   2. Create the project first in Cloudflare Pages dashboard"

# Made with Bob
