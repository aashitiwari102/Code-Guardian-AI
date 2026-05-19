# 🚀 Installation & Setup Guide

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Installation](#detailed-installation)
- [Environment Configuration](#environment-configuration)
- [Development Setup](#development-setup)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)

---

## Prerequisites

### Required Software

| Software | Minimum Version | Recommended | Purpose |
|----------|----------------|-------------|---------|
| **Node.js** | 18.0.0 | 20.x LTS | Runtime environment |
| **npm** | 9.0.0 | 10.x | Package manager |
| **Git** | 2.30.0 | Latest | Version control |

### Optional Software

| Software | Purpose |
|----------|---------|
| **Bun** | Alternative package manager (faster) |
| **VS Code** | Recommended IDE |
| **Docker** | Containerized deployment |

### System Requirements

- **OS**: Windows 10+, macOS 10.15+, Linux (Ubuntu 20.04+)
- **RAM**: 4GB minimum, 8GB recommended
- **Disk Space**: 2GB free space
- **Network**: Internet connection for dependencies

---

## Quick Start

### 5-Minute Setup

```bash
# 1. Clone repository
git clone https://github.com/your-org/codeguardian-ai.git
cd codeguardian-ai

# 2. Install dependencies
npm install
cd backend && npm install && cd ..

# 3. Configure environment
cp backend/.env.example backend/.env

# 4. Start development servers
npm run dev          # Terminal 1 - Frontend
cd backend && npm run dev  # Terminal 2 - Backend

# 5. Open browser
# Navigate to http://localhost:3000
```

**That's it!** You should see the CodeGuardian AI landing page.

---

## Detailed Installation

### Step 1: Clone Repository

```bash
# Using HTTPS
git clone https://github.com/your-org/codeguardian-ai.git

# Using SSH
git clone git@github.com:your-org/codeguardian-ai.git

# Navigate to project
cd codeguardian-ai
```

### Step 2: Install Frontend Dependencies

```bash
# Using npm
npm install

# Using bun (faster alternative)
bun install

# Verify installation
npm list --depth=0
```

**Expected output:**
```
codeguardian-ai@1.0.0
├── @tanstack/react-start@1.167.50
├── react@19.2.0
├── typescript@5.8.3
└── ... (70+ packages)
```

### Step 3: Install Backend Dependencies

```bash
cd backend

# Using npm
npm install

# Using bun
bun install

# Return to root
cd ..
```

**Expected output:**
```
codeguardian-backend@1.0.0
├── express@4.21.2
├── @modelcontextprotocol/sdk@1.0.4
├── typescript@5.8.3
└── ... (30+ packages)
```

### Step 4: Verify Installation

```bash
# Check Node.js version
node --version  # Should be v18.0.0 or higher

# Check npm version
npm --version   # Should be 9.0.0 or higher

# Check TypeScript
npx tsc --version  # Should be 5.8.3

# List installed packages
npm list --depth=0
cd backend && npm list --depth=0
```

---

## Environment Configuration

### Backend Environment Variables

Create `backend/.env` from template:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
# ============================================
# SERVER CONFIGURATION
# ============================================
PORT=3001
NODE_ENV=development
API_BASE_URL=http://localhost:3001

# ============================================
# CORS CONFIGURATION
# ============================================
CORS_ORIGIN=http://localhost:3000

# ============================================
# IBM BOB MCP CONFIGURATION
# ============================================
MCP_SERVER_URL=http://localhost:3000
MCP_SERVER_PATH=
MCP_TIMEOUT=30000
MCP_MAX_RETRIES=3

# ============================================
# FILE UPLOAD CONFIGURATION
# ============================================
MAX_FILE_SIZE=52428800
UPLOAD_DIR=./uploads
TEMP_DIR=./temp

# ============================================
# RATE LIMITING
# ============================================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# ============================================
# CACHE CONFIGURATION
# ============================================
CACHE_TTL=3600
CACHE_CHECK_PERIOD=600

# ============================================
# LOGGING
# ============================================
LOG_LEVEL=info
LOG_FILE=./logs/app.log

# ============================================
# SECURITY
# ============================================
API_KEY=your-secret-api-key-here
JWT_SECRET=your-jwt-secret-here
```

### Environment Variable Descriptions

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Backend server port | 3001 | Yes |
| `NODE_ENV` | Environment mode | development | Yes |
| `CORS_ORIGIN` | Allowed frontend origin | http://localhost:3000 | Yes |
| `MCP_SERVER_URL` | IBM Bob MCP server URL | - | No |
| `MCP_TIMEOUT` | MCP request timeout (ms) | 30000 | No |
| `MAX_FILE_SIZE` | Max upload size (bytes) | 52428800 | No |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 | No |
| `CACHE_TTL` | Cache time-to-live (seconds) | 3600 | No |
| `LOG_LEVEL` | Logging level | info | No |
| `API_KEY` | API authentication key | - | Yes (production) |

### Frontend Environment Variables (Optional)

Create `.env` in root directory:

```env
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=CodeGuardian AI
VITE_ENABLE_ANALYTICS=false
```

---

## Development Setup

### Starting Development Servers

#### Option 1: Two Terminals (Recommended)

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

#### Option 2: Using Concurrently (Single Terminal)

Install concurrently:
```bash
npm install -g concurrently
```

Add to root `package.json`:
```json
{
  "scripts": {
    "dev:all": "concurrently \"npm run dev\" \"cd backend && npm run dev\""
  }
}
```

Run both:
```bash
npm run dev:all
```

### Accessing the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

### Development Tools

#### VS Code Extensions (Recommended)

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

#### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

### Hot Reload

Both frontend and backend support hot reload:

- **Frontend**: Vite HMR (instant updates)
- **Backend**: tsx watch mode (auto-restart on changes)

### Debugging

#### Frontend Debugging (Chrome DevTools)

1. Open http://localhost:3000
2. Press F12 to open DevTools
3. Use React DevTools extension
4. Check Console for errors

#### Backend Debugging (VS Code)

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "cwd": "${workspaceFolder}/backend",
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

---

## Production Deployment

### Building for Production

#### Frontend Build

```bash
# Build optimized bundle
npm run build

# Preview production build locally
npm run preview
```

**Output**: `dist/` directory with optimized assets

#### Backend Build

```bash
cd backend

# Compile TypeScript
npm run build

# Output: dist/ directory
```

### Deployment Options

#### Option 1: Cloudflare Pages (Frontend)

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
npm run deploy
```

**Configuration** (`wrangler.jsonc`):
```jsonc
{
  "name": "codeguardian-ai",
  "compatibility_date": "2025-09-24",
  "compatibility_flags": ["nodejs_compat"],
  "main": "src/server.ts"
}
```

#### Option 2: Cloudflare Workers (Backend)

```bash
cd backend

# Deploy backend
npx wrangler deploy
```

#### Option 3: Docker Deployment

**Frontend Dockerfile:**
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

**Backend Dockerfile:**
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
EXPOSE 3001
CMD ["npm", "start"]
```

**Docker Compose:**
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://backend:3001
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
    volumes:
      - ./backend/uploads:/app/uploads
      - ./backend/logs:/app/logs
```

**Deploy with Docker:**
```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

#### Option 4: Traditional VPS/Server

```bash
# On server
git clone https://github.com/your-org/codeguardian-ai.git
cd codeguardian-ai

# Install dependencies
npm install
cd backend && npm install && cd ..

# Build
npm run build
cd backend && npm run build && cd ..

# Use PM2 for process management
npm install -g pm2

# Start frontend
pm2 start npm --name "codeguardian-frontend" -- run preview

# Start backend
cd backend
pm2 start npm --name "codeguardian-backend" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

### Production Environment Variables

Update `backend/.env` for production:

```env
NODE_ENV=production
PORT=3001
API_BASE_URL=https://api.yourdomain.com
CORS_ORIGIN=https://yourdomain.com
MCP_SERVER_URL=https://mcp.yourdomain.com
LOG_LEVEL=warn
API_KEY=<strong-random-key>
JWT_SECRET=<strong-random-secret>
```

### SSL/HTTPS Setup

#### Using Cloudflare (Automatic)
- SSL certificates automatically provisioned
- No additional configuration needed

#### Using Let's Encrypt (Manual)
```bash
# Install Certbot
sudo apt-get install certbot

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com

# Configure Nginx
sudo nano /etc/nginx/sites-available/codeguardian
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Troubleshooting

### Common Issues

#### Issue 1: Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Find process using port
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or use different port
PORT=3002 npm run dev
```

#### Issue 2: Module Not Found

**Error:**
```
Cannot find module '@tanstack/react-start'
```

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force
npm install
```

#### Issue 3: TypeScript Errors

**Error:**
```
TS2307: Cannot find module or its corresponding type declarations
```

**Solution:**
```bash
# Reinstall TypeScript
npm install -D typescript@5.8.3

# Clear TypeScript cache
rm -rf node_modules/.cache

# Restart TypeScript server in VS Code
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

#### Issue 4: Build Failures

**Error:**
```
Build failed with errors
```

**Solution:**
```bash
# Check for syntax errors
npm run lint

# Clear build cache
rm -rf dist .tanstack

# Rebuild
npm run build
```

#### Issue 5: Backend Connection Failed

**Error:**
```
Failed to fetch from http://localhost:3001
```

**Solution:**
```bash
# Check backend is running
curl http://localhost:3001/health

# Check CORS configuration
# Verify CORS_ORIGIN in backend/.env matches frontend URL

# Check firewall
# Ensure port 3001 is not blocked
```

### Getting Help

1. **Check Logs**
   ```bash
   # Frontend logs (browser console)
   # Backend logs
   tail -f backend/logs/app.log
   ```

2. **Enable Debug Mode**
   ```bash
   # Backend
   LOG_LEVEL=debug npm run dev
   ```

3. **GitHub Issues**
   - Search existing issues
   - Create new issue with:
     - Error message
     - Steps to reproduce
     - Environment details

4. **Community Support**
   - Discord server
   - Stack Overflow tag: `codeguardian-ai`

---

## FAQ

### General Questions

**Q: Do I need IBM Bob MCP to run the application?**
A: No, the application runs in mock mode by default for development. MCP integration is optional.

**Q: Can I use Bun instead of npm?**
A: Yes, Bun is fully supported and faster than npm.

**Q: What browsers are supported?**
A: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

**Q: Can I run this on Windows?**
A: Yes, fully supported on Windows 10/11.

### Development Questions

**Q: How do I add new dependencies?**
A: Use `npm install <package>` in the appropriate directory (root for frontend, backend/ for backend).

**Q: How do I run tests?**
A: `npm test` (tests coming soon)

**Q: Can I customize the UI?**
A: Yes, edit components in `src/components/` and styles in `src/styles.css`.

**Q: How do I add new API endpoints?**
A: Add routes in `backend/src/routes/` and controllers in `backend/src/controllers/`.

### Deployment Questions

**Q: What's the recommended deployment platform?**
A: Cloudflare Pages for frontend, Cloudflare Workers for backend (easiest and fastest).

**Q: Do I need a database?**
A: No, the application uses in-memory caching. Database support can be added if needed.

**Q: How do I enable HTTPS?**
A: Use Cloudflare (automatic) or Let's Encrypt (manual).

**Q: Can I deploy to AWS/Azure/GCP?**
A: Yes, use Docker containers or traditional Node.js deployment.

---

## Next Steps

After successful setup:

1. ✅ **Explore Features** - Try all 5 analysis modules
2. ✅ **Read Documentation** - Check [FEATURES.md](FEATURES.md) and [ARCHITECTURE.md](ARCHITECTURE.md)
3. ✅ **Customize** - Modify UI, add features, integrate with your tools
4. ✅ **Deploy** - Follow production deployment guide
5. ✅ **Contribute** - Submit PRs, report issues, help others

---

**Built with ❤️ for hackathons, made for engineers**

*CodeGuardian AI - Setup Complete!*