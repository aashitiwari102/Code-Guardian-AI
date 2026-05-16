# CodeGuardian AI Backend - Setup Guide

Complete setup instructions for the CodeGuardian AI backend.

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher (or **bun** 1.0.0+)
- **Git** for version control
- **IBM Bob MCP Server** access (for production use)

## 🚀 Installation Steps

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Using bun (faster):
```bash
bun install
```

### 3. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=3001
NODE_ENV=development
API_BASE_URL=http://localhost:3001

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# IBM Bob MCP Configuration
MCP_SERVER_URL=http://localhost:3000
MCP_TIMEOUT=30000
MCP_MAX_RETRIES=3

# File Upload Configuration
MAX_FILE_SIZE=52428800
UPLOAD_DIR=./uploads
TEMP_DIR=./temp

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Cache Configuration
CACHE_TTL=3600
CACHE_CHECK_PERIOD=600

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log

# Security
API_KEY=your-secret-api-key-here
JWT_SECRET=your-jwt-secret-here
```

### 4. Create Required Directories

```bash
mkdir -p logs uploads temp
```

### 5. Build TypeScript (Production)

```bash
npm run build
```

## 🏃 Running the Server

### Development Mode (with hot reload)

```bash
npm run dev
```

The server will start on `http://localhost:3001` with auto-reload on file changes.

### Production Mode

```bash
npm run build
npm start
```

## 🧪 Testing the API

### Health Check

```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "success": true,
  "message": "CodeGuardian AI Backend is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

### Analyze Repository

```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"repoPath": "https://github.com/user/repo"}'
```

## 🔧 Troubleshooting

### Port Already in Use

If port 3001 is already in use:

1. Change `PORT` in `.env` file
2. Or kill the process using the port:

```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3001 | xargs kill -9
```

### TypeScript Errors

If you see TypeScript errors about missing modules:

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or with bun
rm -rf node_modules bun.lockb
bun install
```

### MCP Connection Issues

If MCP client fails to connect:

1. Verify `MCP_SERVER_URL` in `.env`
2. Check MCP server is running
3. Review logs in `logs/error.log`

### Permission Errors

If you get permission errors for logs/uploads/temp:

```bash
# Linux/Mac
chmod -R 755 logs uploads temp

# Windows (run as administrator)
icacls logs /grant Users:F /T
icacls uploads /grant Users:F /T
icacls temp /grant Users:F /T
```

## 📊 Monitoring

### View Logs

```bash
# All logs
tail -f logs/combined.log

# Errors only
tail -f logs/error.log

# With grep filter
tail -f logs/combined.log | grep ERROR
```

### Check Server Status

```bash
curl http://localhost:3001/health
```

## 🐳 Docker Setup (Optional)

### Build Docker Image

```bash
docker build -t codeguardian-backend .
```

### Run Container

```bash
docker run -p 3001:3001 \
  --env-file .env \
  -v $(pwd)/logs:/app/logs \
  -v $(pwd)/uploads:/app/uploads \
  codeguardian-backend
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "3001:3001"
    env_file:
      - .env
    volumes:
      - ./logs:/app/logs
      - ./uploads:/app/uploads
      - ./temp:/app/temp
    restart: unless-stopped
```

Run:
```bash
docker-compose up -d
```

## 🔒 Security Checklist

Before deploying to production:

- [ ] Change default `API_KEY` and `JWT_SECRET`
- [ ] Set `NODE_ENV=production`
- [ ] Configure proper CORS origins
- [ ] Review rate limiting settings
- [ ] Enable HTTPS
- [ ] Set up proper logging rotation
- [ ] Configure firewall rules
- [ ] Review file upload limits
- [ ] Set up monitoring/alerting

## 📈 Performance Tuning

### For High Traffic

1. **Increase cache TTL**:
   ```env
   CACHE_TTL=7200  # 2 hours
   ```

2. **Adjust rate limits**:
   ```env
   RATE_LIMIT_MAX_REQUESTS=200
   ```

3. **Enable clustering** (add to server.ts):
   ```typescript
   import cluster from 'cluster';
   import os from 'os';

   if (cluster.isPrimary) {
     const numCPUs = os.cpus().length;
     for (let i = 0; i < numCPUs; i++) {
       cluster.fork();
     }
   } else {
     startServer();
   }
   ```

## 🆘 Getting Help

If you encounter issues:

1. Check logs in `logs/` directory
2. Verify environment variables
3. Test MCP server connectivity
4. Review [backend/README.md](README.md)
5. Open an issue on GitHub

## ✅ Verification Checklist

After setup, verify:

- [ ] Server starts without errors
- [ ] Health endpoint responds
- [ ] Logs are being written
- [ ] MCP client connects successfully
- [ ] API endpoints are accessible
- [ ] CORS is configured correctly
- [ ] Rate limiting is working

## 🎯 Next Steps

1. Start the frontend: `cd .. && npm run dev`
2. Test the full stack integration
3. Review API documentation in [README.md](README.md)
4. Configure IBM Bob MCP integration
5. Deploy to production

---

**Need help?** Check the main [README.md](../README.md) or open an issue.