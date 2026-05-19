# 📡 API Documentation

## Table of Contents

- [Overview](#overview)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Rate Limiting](#rate-limiting)
- [Error Handling](#error-handling)
- [Endpoints](#endpoints)
  - [Health Check](#health-check)
  - [Repository Analysis](#repository-analysis)
  - [Modernization](#modernization)
  - [Security Scanning](#security-scanning)
  - [Test Generation](#test-generation)
  - [Architecture Analysis](#architecture-analysis)
  - [Cache Management](#cache-management)

---

## Overview

The CodeGuardian AI API provides RESTful endpoints for code analysis, modernization, security scanning, test generation, and architecture visualization.

### API Characteristics

- **Protocol**: HTTP/HTTPS
- **Format**: JSON
- **Authentication**: API Key (optional in development)
- **Rate Limiting**: 100 requests per 15 minutes
- **Versioning**: v1 (current)

---

## Base URL

### Development
```
http://localhost:3001
```

### Production
```
https://api.codeguardian.ai
```

---

## Authentication

### API Key Authentication (Production)

Include API key in request headers:

```http
Authorization: Bearer YOUR_API_KEY
```

**Example:**
```bash
curl -H "Authorization: Bearer sk_live_abc123..." \
     https://api.codeguardian.ai/api/analyze
```

### Development Mode

Authentication is optional in development mode (`NODE_ENV=development`).

---

## Rate Limiting

### Limits

- **Window**: 15 minutes
- **Max Requests**: 100 per IP address
- **Headers**: Rate limit info included in response

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

### Rate Limit Exceeded Response

```json
{
  "error": "Too many requests",
  "message": "Rate limit exceeded. Please try again later.",
  "retryAfter": 900
}
```

---

## Error Handling

### Error Response Format

```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "statusCode": 400,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/analyze"
}
```

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid API key |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Service temporarily unavailable |

---

## Endpoints

### Health Check

Check API server status and configuration.

#### Request

```http
GET /health
```

#### Response

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "version": "1.0.0",
  "environment": "development",
  "services": {
    "mcp": "connected",
    "cache": "active"
  }
}
```

#### Example

```bash
curl http://localhost:3001/health
```

---

### Repository Analysis

Analyze a repository for code quality, security, and modernization opportunities.

#### Request

```http
POST /api/analyze
Content-Type: application/json
```

**Body:**
```json
{
  "repoPath": "https://github.com/user/repo",
  "options": {
    "includeTests": true,
    "includeSecurity": true,
    "includeArchitecture": true,
    "includeModernization": true
  }
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `repoPath` | string | Yes | GitHub URL or local path |
| `options.includeTests` | boolean | No | Generate edge case tests (default: true) |
| `options.includeSecurity` | boolean | No | Run security scan (default: true) |
| `options.includeArchitecture` | boolean | No | Analyze architecture (default: true) |
| `options.includeModernization` | boolean | No | Find legacy patterns (default: true) |

#### Response

```json
{
  "repoId": "uuid-here",
  "status": "completed",
  "summary": {
    "totalFiles": 150,
    "linesOfCode": 12500,
    "riskScore": 65,
    "qualityScore": 78
  },
  "techStack": {
    "frameworks": ["React", "Express"],
    "languages": ["TypeScript", "JavaScript"],
    "libraries": ["axios", "lodash"]
  },
  "fileRisks": [
    {
      "path": "src/auth/login.ts",
      "riskLevel": "high",
      "issues": 3,
      "reasons": ["Hardcoded credentials", "No input validation"]
    }
  ],
  "modernization": {
    "patternsFound": 12,
    "suggestions": [...]
  },
  "security": {
    "vulnerabilities": 5,
    "critical": 1,
    "high": 2,
    "medium": 2
  },
  "tests": {
    "generated": 45,
    "coverage": "85%"
  },
  "architecture": {
    "nodes": 25,
    "bottlenecks": 3
  }
}
```

#### Example

```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "repoPath": "https://github.com/user/repo",
    "options": {
      "includeTests": true,
      "includeSecurity": true
    }
  }'
```

---

### Get Analysis Results

Retrieve cached analysis results by repository ID.

#### Request

```http
GET /api/analysis/:repoId
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `repoId` | string | Yes | Repository UUID from analysis |

#### Response

```json
{
  "repoId": "uuid-here",
  "status": "completed",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "data": {
    "summary": {...},
    "techStack": {...},
    "fileRisks": [...],
    "modernization": {...},
    "security": {...},
    "tests": {...},
    "architecture": {...}
  }
}
```

#### Example

```bash
curl http://localhost:3001/api/analysis/abc-123-def-456
```

---

### Modernization

#### Generate Pull Request

Create a pull request description for modernization changes.

##### Request

```http
POST /api/modernize
Content-Type: application/json
```

**Body:**
```json
{
  "repoId": "uuid-here",
  "patterns": ["callback-hell", "var-declarations"],
  "includeRationale": true
}
```

##### Response

```json
{
  "prTitle": "Modernize codebase: Convert callbacks to async/await",
  "prDescription": "## Changes\n\n### Callback Hell → Async/Await\n...",
  "filesChanged": 12,
  "linesAdded": 150,
  "linesRemoved": 200
}
```

##### Example

```bash
curl -X POST http://localhost:3001/api/modernize \
  -H "Content-Type: application/json" \
  -d '{
    "repoId": "abc-123",
    "patterns": ["callback-hell"],
    "includeRationale": true
  }'
```

#### Apply Modernization

Apply modernization changes to repository (future feature).

```http
POST /api/modernize/apply
Content-Type: application/json
```

**Body:**
```json
{
  "repoId": "uuid-here",
  "patterns": ["callback-hell"],
  "createBranch": true,
  "branchName": "modernize/async-await"
}
```

---

### Security Scanning

#### Get Security Report

Generate comprehensive security report.

##### Request

```http
GET /api/security-report/:repoId
```

**Query Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `format` | string | No | Report format: `json`, `pdf` (default: json) |
| `severity` | string | No | Filter by severity: `critical`, `high`, `medium`, `low` |

##### Response (JSON)

```json
{
  "repoId": "uuid-here",
  "generatedAt": "2024-01-15T10:30:00.000Z",
  "summary": {
    "totalVulnerabilities": 8,
    "critical": 2,
    "high": 3,
    "medium": 2,
    "low": 1
  },
  "vulnerabilities": [
    {
      "id": "vuln-001",
      "title": "SQL Injection in User Login",
      "severity": "critical",
      "cwe": "CWE-89",
      "file": "src/auth/login.ts",
      "line": 45,
      "description": "User input is directly concatenated into SQL query",
      "remediation": "Use parameterized queries or ORM",
      "example": "const query = `SELECT * FROM users WHERE email = ?`;"
    }
  ],
  "compliance": {
    "owasp": ["A1", "A3"],
    "pci": false,
    "hipaa": false
  }
}
```

##### Example

```bash
# JSON format
curl http://localhost:3001/api/security-report/abc-123

# PDF format
curl http://localhost:3001/api/security-report/abc-123?format=pdf \
  --output security-report.pdf

# Filter by severity
curl http://localhost:3001/api/security-report/abc-123?severity=critical
```

#### Analyze Specific File

Scan a specific file for vulnerabilities.

```http
POST /api/security/analyze-file
Content-Type: application/json
```

**Body:**
```json
{
  "repoId": "uuid-here",
  "filePath": "src/auth/login.ts"
}
```

---

### Test Generation

#### Generate Tests

Generate edge case tests for repository.

##### Request

```http
POST /api/generate-tests
Content-Type: application/json
```

**Body:**
```json
{
  "repoId": "uuid-here",
  "framework": "jest",
  "options": {
    "includeEdgeCases": true,
    "includeSecurityTests": true,
    "includePerformanceTests": false
  }
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `repoId` | string | Yes | Repository UUID |
| `framework` | string | Yes | Test framework: `jest`, `pytest`, `postman` |
| `options.includeEdgeCases` | boolean | No | Generate edge case tests (default: true) |
| `options.includeSecurityTests` | boolean | No | Generate security tests (default: true) |
| `options.includePerformanceTests` | boolean | No | Generate performance tests (default: false) |

##### Response

```json
{
  "framework": "jest",
  "testsGenerated": 45,
  "files": [
    {
      "path": "tests/auth/login.test.ts",
      "tests": 12,
      "coverage": ["null-inputs", "sql-injection", "rate-limiting"]
    }
  ],
  "downloadUrl": "/api/download/tests/abc-123.zip",
  "expiresAt": "2024-01-15T11:30:00.000Z"
}
```

##### Example

```bash
curl -X POST http://localhost:3001/api/generate-tests \
  -H "Content-Type: application/json" \
  -d '{
    "repoId": "abc-123",
    "framework": "jest",
    "options": {
      "includeEdgeCases": true,
      "includeSecurityTests": true
    }
  }'
```

#### Download Test Bundle

Download generated test files as ZIP.

```http
GET /api/download/tests/:bundleId
```

**Response:** ZIP file download

##### Example

```bash
curl http://localhost:3001/api/download/tests/abc-123.zip \
  --output tests.zip
```

---

### Architecture Analysis

#### Get Architecture Graph

Retrieve dependency graph data.

##### Request

```http
GET /api/architecture/:repoId
```

**Query Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `format` | string | No | Output format: `json`, `mermaid`, `svg` (default: json) |
| `depth` | number | No | Dependency depth (default: 3) |

##### Response (JSON)

```json
{
  "repoId": "uuid-here",
  "nodes": [
    {
      "id": "node-1",
      "name": "UserService",
      "type": "service",
      "file": "src/services/user.ts",
      "dependencies": ["node-2", "node-3"],
      "metrics": {
        "complexity": 15,
        "coupling": 8,
        "cohesion": 0.75
      }
    }
  ],
  "edges": [
    {
      "source": "node-1",
      "target": "node-2",
      "type": "imports",
      "weight": 5
    }
  ],
  "bottlenecks": [
    {
      "nodeId": "node-1",
      "reason": "High coupling",
      "severity": "high",
      "suggestion": "Consider splitting into smaller modules"
    }
  ],
  "circularDependencies": [
    ["node-1", "node-2", "node-1"]
  ]
}
```

##### Example

```bash
# JSON format
curl http://localhost:3001/api/architecture/abc-123

# Mermaid diagram
curl http://localhost:3001/api/architecture/abc-123?format=mermaid

# SVG image
curl http://localhost:3001/api/architecture/abc-123?format=svg \
  --output architecture.svg
```

---

### Cache Management

#### Clear Cache

Clear cached analysis results.

##### Request

```http
POST /api/clear-cache
Content-Type: application/json
```

**Body:**
```json
{
  "repoId": "uuid-here"
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `repoId` | string | No | Specific repo to clear (omit for all) |

##### Response

```json
{
  "success": true,
  "message": "Cache cleared successfully",
  "itemsCleared": 5
}
```

##### Example

```bash
# Clear specific repository
curl -X POST http://localhost:3001/api/clear-cache \
  -H "Content-Type: application/json" \
  -d '{"repoId": "abc-123"}'

# Clear all cache
curl -X POST http://localhost:3001/api/clear-cache \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

## Webhooks (Future Feature)

### Register Webhook

Subscribe to analysis completion events.

```http
POST /api/webhooks
Content-Type: application/json
```

**Body:**
```json
{
  "url": "https://your-app.com/webhook",
  "events": ["analysis.completed", "security.critical"],
  "secret": "webhook-secret"
}
```

### Webhook Payload

```json
{
  "event": "analysis.completed",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "data": {
    "repoId": "uuid-here",
    "status": "completed",
    "summary": {...}
  }
}
```

---

## SDK Examples

### JavaScript/TypeScript

```typescript
import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});

// Analyze repository
const analyzeRepo = async (repoPath: string) => {
  const response = await client.post('/api/analyze', {
    repoPath,
    options: {
      includeTests: true,
      includeSecurity: true
    }
  });
  return response.data;
};

// Get results
const getResults = async (repoId: string) => {
  const response = await client.get(`/api/analysis/${repoId}`);
  return response.data;
};
```

### Python

```python
import requests

class CodeGuardianClient:
    def __init__(self, base_url, api_key=None):
        self.base_url = base_url
        self.headers = {
            'Content-Type': 'application/json'
        }
        if api_key:
            self.headers['Authorization'] = f'Bearer {api_key}'
    
    def analyze_repo(self, repo_path, options=None):
        url = f'{self.base_url}/api/analyze'
        data = {
            'repoPath': repo_path,
            'options': options or {}
        }
        response = requests.post(url, json=data, headers=self.headers)
        return response.json()
    
    def get_results(self, repo_id):
        url = f'{self.base_url}/api/analysis/{repo_id}'
        response = requests.get(url, headers=self.headers)
        return response.json()

# Usage
client = CodeGuardianClient('http://localhost:3001')
result = client.analyze_repo('https://github.com/user/repo')
```

### cURL

```bash
#!/bin/bash

API_URL="http://localhost:3001"
API_KEY="your-api-key"

# Analyze repository
analyze_repo() {
  curl -X POST "$API_URL/api/analyze" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $API_KEY" \
    -d "{
      \"repoPath\": \"$1\",
      \"options\": {
        \"includeTests\": true,
        \"includeSecurity\": true
      }
    }"
}

# Get results
get_results() {
  curl "$API_URL/api/analysis/$1" \
    -H "Authorization: Bearer $API_KEY"
}

# Usage
analyze_repo "https://github.com/user/repo"
```

---

## Best Practices

### 1. Error Handling

Always handle errors gracefully:

```typescript
try {
  const result = await client.post('/api/analyze', data);
  return result.data;
} catch (error) {
  if (error.response) {
    // Server responded with error
    console.error('API Error:', error.response.data);
  } else if (error.request) {
    // No response received
    console.error('Network Error:', error.message);
  } else {
    // Request setup error
    console.error('Error:', error.message);
  }
}
```

### 2. Rate Limiting

Implement exponential backoff:

```typescript
const retryWithBackoff = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.response?.status === 429) {
        const delay = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
};
```

### 3. Caching

Cache results to reduce API calls:

```typescript
const cache = new Map();

const getCachedAnalysis = async (repoId: string) => {
  if (cache.has(repoId)) {
    return cache.get(repoId);
  }
  
  const result = await client.get(`/api/analysis/${repoId}`);
  cache.set(repoId, result.data);
  
  // Clear cache after 1 hour
  setTimeout(() => cache.delete(repoId), 3600000);
  
  return result.data;
};
```

### 4. Pagination (Future)

Handle paginated responses:

```typescript
const getAllResults = async (endpoint: string) => {
  let allResults = [];
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    const response = await client.get(`${endpoint}?page=${page}`);
    allResults = [...allResults, ...response.data.results];
    hasMore = response.data.hasMore;
    page++;
  }
  
  return allResults;
};
```

---

## Changelog

### v1.0.0 (Current)
- Initial API release
- Repository analysis
- Modernization suggestions
- Security scanning
- Test generation
- Architecture visualization

### Upcoming Features
- Webhooks
- Batch processing
- Custom rules engine
- Team collaboration
- CI/CD integration

---

**Built with ❤️ for hackathons, made for engineers**

*CodeGuardian AI - API Documentation*