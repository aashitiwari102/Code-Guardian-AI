# CodeGuardian AI Backend

Enterprise-grade backend API for CodeGuardian AI - powered by IBM Bob MCP servers.

## 🚀 Features

- **Repository Analysis**: Deep code analysis using IBM Bob MCP integration
- **Vulnerability Scanning**: CWE-mapped security findings with remediation
- **Modernization Suggestions**: AI-powered code modernization recommendations
- **Edge Case Test Generation**: Intelligent test generation for Jest, Pytest, and Postman
- **Architecture Visualization**: Dependency graph generation and bottleneck identification
- **Caching Layer**: Redis-like in-memory caching for performance
- **Rate Limiting**: Protection against abuse
- **Comprehensive Logging**: Winston-based structured logging

## 📋 Prerequisites

- Node.js 18+ or Bun
- TypeScript 5+
- IBM Bob MCP Server (configured)

## 🛠️ Installation

```bash
cd backend
npm install
```

Or with Bun:

```bash
cd backend
bun install
```

## ⚙️ Configuration

1. Copy the environment template:

```bash
cp .env.example .env
```

2. Configure your environment variables:

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
```

## 🏃 Running the Server

### Development Mode

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

## 📡 API Endpoints

### Health Check

```http
GET /health
```

Returns server status and configuration.

### Analysis Endpoints

#### Analyze Repository

```http
POST /api/analyze
Content-Type: application/json

{
  "repoPath": "https://github.com/user/repo" or "/path/to/local/repo"
}
```

Returns complete analysis including:
- Repository summary
- File risk assessment
- Vulnerabilities
- Modernization suggestions
- Edge case tests
- Architecture graph

#### Get Analysis Results

```http
GET /api/analysis/:repoId
```

Retrieve cached analysis results by repository ID.

#### Generate Modernization PR

```http
POST /api/modernize
Content-Type: application/json

{
  "repoId": "uuid-here"
}
```

Generates a pull request description for modernization changes.

#### Export Test Bundle

```http
POST /api/generate-tests
Content-Type: application/json

{
  "repoId": "uuid-here",
  "format": "jest" | "pytest" | "postman"
}
```

Exports edge case tests in the specified format.

#### Generate Security Report

```http
GET /api/security-report/:repoId
```

Generates a comprehensive security audit report.

#### Clear Cache

```http
POST /api/clear-cache
Content-Type: application/json

{
  "repoId": "uuid-here" // optional, clears all if omitted
}
```

## 🏗️ Architecture

```
backend/
├── src/
│   ├── config/           # Configuration management
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Express middleware
│   ├── mcp/             # IBM Bob MCP integrations
│   │   ├── mcpClient.ts
│   │   ├── repoAnalyzer.ts
│   │   ├── modernizationAgent.ts
│   │   ├── edgeCaseGenerator.ts
│   │   ├── vulnerabilityScanner.ts
│   │   └── architectureExplainer.ts
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   └── server.ts        # Express app entry point
├── logs/                # Application logs
├── uploads/             # Uploaded files
├── temp/                # Temporary files
├── .env.example         # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

## 🔌 IBM Bob MCP Integration

The backend uses IBM Bob MCP servers for AI-powered code analysis:

### MCP Modules

1. **Repository Analyzer** (`repoAnalyzer.ts`)
   - Scans repository structure
   - Detects tech stack
   - Calculates risk scores

2. **Modernization Agent** (`modernizationAgent.ts`)
   - Identifies legacy patterns
   - Generates before/after code examples
   - Creates PR descriptions

3. **Edge Case Generator** (`edgeCaseGenerator.ts`)
   - Generates comprehensive test cases
   - Supports Jest, Pytest, Postman
   - Covers null inputs, injections, race conditions

4. **Vulnerability Scanner** (`vulnerabilityScanner.ts`)
   - Maps findings to CWE
   - Assigns severity levels
   - Provides remediation steps

5. **Architecture Explainer** (`architectureExplainer.ts`)
   - Generates dependency graphs
   - Identifies bottlenecks
   - Suggests improvements

### MCP Client Features

- **Automatic Retry**: Configurable retry logic with exponential backoff
- **Connection Management**: Graceful connect/disconnect
- **Error Handling**: Comprehensive error capture and logging
- **Token Tracking**: Monitors API usage

## 🔒 Security

- **Helmet.js**: Security headers
- **CORS**: Configurable cross-origin policies
- **Rate Limiting**: Per-IP request throttling
- **Input Validation**: Zod schema validation
- **Error Sanitization**: No sensitive data in error responses

## 📊 Logging

Winston-based structured logging with:
- Console output (development)
- File rotation (production)
- Error-specific logs
- Request/response tracking

Log files:
- `logs/combined.log` - All logs
- `logs/error.log` - Errors only

## 🧪 Testing

```bash
npm test
```

## 🐛 Debugging

Enable debug logging:

```env
LOG_LEVEL=debug
```

## 📈 Performance

- **Caching**: In-memory cache with configurable TTL
- **Rate Limiting**: Prevents API abuse
- **Async Operations**: Non-blocking I/O
- **Connection Pooling**: Efficient resource usage

## 🚢 Deployment

### Docker (Recommended)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3001
LOG_LEVEL=info
```

## 🤝 Contributing

1. Follow TypeScript best practices
2. Add tests for new features
3. Update documentation
4. Use conventional commits

## 📝 License

MIT

## 🆘 Support

For issues or questions:
- Check logs in `logs/` directory
- Review environment configuration
- Verify MCP server connectivity

---

**Built with ❤️ for hackathons, made for engineers.**