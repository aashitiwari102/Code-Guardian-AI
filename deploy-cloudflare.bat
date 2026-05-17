@echo off
REM Cloudflare Pages Deployment Script for TanStack Start (Windows)
REM This script builds and deploys your app to Cloudflare Pages

echo 🚀 Starting Cloudflare Pages deployment...

REM Step 1: Clean previous build
echo 🧹 Cleaning previous build...
if exist dist rmdir /s /q dist

REM Step 2: Build the application
echo 📦 Building application...
call npm run build

REM Step 3: Verify build output
if not exist "dist\client" (
    echo ❌ Error: dist\client directory not found!
    exit /b 1
)

echo ✅ Build completed successfully!

REM Step 4: Deploy to Cloudflare Pages
echo 🌐 Deploying to Cloudflare Pages...
call npx wrangler pages deploy dist/client --project-name=code-guardian-ai

echo ✨ Deployment complete!
echo 📝 Note: If this is your first deployment, you may need to:
echo    1. Login to Cloudflare: npx wrangler login
echo    2. Create the project first in Cloudflare Pages dashboard

@REM Made with Bob
