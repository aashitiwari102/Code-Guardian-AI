# Cloudflare Pages Deployment Guide

This guide explains how to deploy your TanStack Start application to Cloudflare Pages.

## Prerequisites

1. A Cloudflare account (free tier works)
2. Node.js and npm installed
3. Git repository connected to Cloudflare Pages

## Deployment Methods

### Method 1: Using npm Scripts (Recommended)

#### First-time Setup

1. **Login to Cloudflare:**
   ```bash
   npm run deploy:login
   ```
   This will open a browser window for authentication.

2. **Deploy your application:**
   ```bash
   npm run deploy
   ```

#### Subsequent Deployments

Simply run:
```bash
npm run deploy
```

### Method 2: Using Deployment Scripts

#### On Windows:
```bash
./deploy-cloudflare.bat
```

#### On Linux/Mac:
```bash
chmod +x deploy-cloudflare.sh
./deploy-cloudflare.sh
```

### Method 3: Cloudflare Pages Dashboard (Automatic)

1. **Connect your repository** to Cloudflare Pages
2. **Configure build settings:**
   - **Framework preset:** None
   - **Build command:** `npm run build`
   - **Build output directory:** `dist/client`
   - **Root directory:** `/`
   - **Node version:** 18 or 20

3. **Deploy:** Push to your main branch, and Cloudflare will automatically build and deploy

## Build Output Structure

Your TanStack Start app builds to:
- `dist/client/` - Static client assets (served by Cloudflare Pages)
- `dist/server/` - SSR server bundle (runs as Cloudflare Pages Functions)

## Troubleshooting

### 404 Errors on Routes

If you get 404 errors when navigating to routes like `/dashboard/overview`:

1. Ensure `dist/client` is set as the build output directory
2. Cloudflare Pages automatically handles SPA routing for TanStack Start
3. The server bundle in `dist/server/` provides SSR support

### Build Failures

1. Check Node.js version (use 18 or 20)
2. Ensure all dependencies are installed: `npm install`
3. Test build locally: `npm run build`
4. Check build logs in Cloudflare Pages dashboard

### Authentication Issues

If `npx wrangler` commands fail:
```bash
npm run deploy:login
```

### Project Name

The default project name is `code-guardian-ai`. To change it:
- Edit `package.json` scripts
- Edit `deploy-cloudflare.sh` and `deploy-cloudflare.bat`
- Or specify manually: `npx wrangler pages deploy dist/client --project-name=your-name`

## Environment Variables

If your app needs environment variables:

1. Go to Cloudflare Pages dashboard
2. Select your project
3. Go to Settings > Environment variables
4. Add your variables for Production and Preview environments

## Custom Domain

To add a custom domain:

1. Go to your Cloudflare Pages project
2. Navigate to Custom domains
3. Add your domain and follow DNS configuration instructions

## Monitoring

- **Deployment logs:** Available in Cloudflare Pages dashboard
- **Analytics:** Enable in Cloudflare Pages settings
- **Error tracking:** Check Functions logs for SSR errors

## Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [TanStack Start Documentation](https://tanstack.com/start)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)