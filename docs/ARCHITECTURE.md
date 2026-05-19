# 🏗️ Architecture Documentation

## Table of Contents

- [System Overview](#system-overview)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [MCP Integration Layer](#mcp-integration-layer)
- [Data Flow](#data-flow)
- [Component Hierarchy](#component-hierarchy)
- [State Management](#state-management)
- [Security Architecture](#security-architecture)
- [Performance Optimizations](#performance-optimizations)
- [Scalability Considerations](#scalability-considerations)

---

## System Overview

CodeGuardian AI follows a **modern full-stack architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  React 19 + TanStack Start (SSR)                         │  │
│  │  • File-based routing                                     │  │
│  │  • Server-side rendering                                  │  │
│  │  • Client-side hydration                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ▼ HTTP/REST
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Express.js + TypeScript                                 │  │
│  │  • Rate limiting                                          │  │
│  │  • CORS protection                                        │  │
│  │  • Request validation                                     │  │
│  │  • Error handling                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Business Logic Layer                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Analysis Service                                         │  │
│  │  • Repository processing                                  │  │
│  │  • Result aggregation                                     │  │
│  │  • Cache management                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AI Integration Layer                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  IBM Bob MCP Client                                       │  │
│  │  • Connection management                                  │  │
│  │  • Retry logic                                            │  │
│  │  • Token tracking                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MCP Agents Layer                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │   Repo   │ │Modernize │ │Vulnerab. │ │Edge Case │          │
│  │ Analyzer │ │  Agent   │ │ Scanner  │ │Generator │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│  ┌──────────┐                                                   │
│  │Architect.│                                                   │
│  │Explainer │                                                   │
│  └──────────┘                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Key Architectural Principles

1. **Separation of Concerns** - Clear boundaries between layers
2. **Type Safety** - TypeScript throughout the stack
3. **Modularity** - Independent, reusable components
4. **Scalability** - Horizontal scaling support
5. **Security First** - Multiple security layers
6. **Performance** - Caching and optimization at every level

---

## Frontend Architecture

### Technology Stack

```typescript
// Core Framework
React 19.2.0              // UI library
TanStack Start 1.167.50   // Full-stack framework
TanStack Router 1.168.25  // Type-safe routing
TanStack Query 5.83.0     // Server state management

// Build & Development
Vite 7.3.1               // Build tool
TypeScript 5.8.3         // Type system

// Styling & UI
Tailwind CSS 4.2.1       // Utility-first CSS
Radix UI                 // Headless components
Framer Motion 12.38.0    // Animations

// Visualization
React Flow 11.11.4       // Node graphs
Recharts 2.15.4          // Charts
```

### File Structure

```
src/
├── routes/                      # File-based routing
│   ├── __root.tsx              # Root layout with providers
│   ├── index.tsx               # Landing page (/)
│   ├── dashboard.tsx           # Dashboard layout (/dashboard)
│   ├── dashboard.index.tsx     # Overview (/dashboard)
│   ├── dashboard.modernize.tsx # Modernization (/dashboard/modernize)
│   ├── dashboard.security.tsx  # Security (/dashboard/security)
│   ├── dashboard.tests.tsx     # Testing (/dashboard/tests)
│   └── dashboard.architecture.tsx # Architecture (/dashboard/architecture)
│
├── components/                  # React components
│   ├── ui/                     # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── DashboardSidebar.tsx    # Navigation sidebar
│   ├── MarketingNav.tsx        # Landing page nav
│   ├── PageHeader.tsx          # Page headers
│   ├── LoadingSpinner.tsx      # Loading states
│   ├── AnimatedCounter.tsx     # Animated numbers
│   ├── FloatingActionButton.tsx # FAB component
│   ├── Blobs.tsx               # Animated backgrounds
│   ├── HeroMock.tsx            # Hero section
│   └── Logo.tsx                # Brand logo
│
├── lib/                        # Utilities
│   ├── utils.ts               # Helper functions
│   ├── mock-data.ts           # Sample data
│   ├── error-capture.ts       # Error handling
│   └── error-page.ts          # Error pages
│
├── hooks/                      # Custom React hooks
│   └── use-mobile.tsx         # Mobile detection
│
├── styles.css                  # Global styles
├── router.tsx                  # Router configuration
└── routeTree.gen.ts           # Generated route tree
```

### Routing Architecture

**File-Based Routing** with TanStack Router:

```typescript
// Route hierarchy
/                           → index.tsx (Landing)
/dashboard                  → dashboard.tsx (Layout)
  ├── /dashboard            → dashboard.index.tsx (Overview)
  ├── /dashboard/modernize  → dashboard.modernize.tsx
  ├── /dashboard/security   → dashboard.security.tsx
  ├── /dashboard/tests      → dashboard.tests.tsx
  └── /dashboard/architecture → dashboard.architecture.tsx
```

**Route Features:**
- Type-safe navigation
- Automatic code splitting
- Nested layouts
- Loading states
- Error boundaries
- Search params validation

### Component Architecture

```typescript
// Component Hierarchy
<Root>
  <Providers>
    <TanStackRouterProvider>
      <TanStackQueryProvider>
        <Route>
          <Layout>
            <Navigation />
            <Content>
              <Page />
            </Content>
          </Layout>
        </Route>
      </TanStackQueryProvider>
    </TanStackRouterProvider>
  </Providers>
</Root>
```

### State Management Strategy

1. **Server State** - TanStack Query
   - API data fetching
   - Caching and invalidation
   - Optimistic updates
   - Background refetching

2. **UI State** - React useState/useReducer
   - Form inputs
   - Modal visibility
   - Sidebar state
   - Theme preferences

3. **URL State** - TanStack Router
   - Search parameters
   - Route parameters
   - Navigation state

4. **Global State** - React Context (minimal)
   - User authentication
   - Theme settings
   - Feature flags

### Server-Side Rendering (SSR)

```typescript
// TanStack Start SSR Flow
1. Request arrives at server
2. Route matched and data loaded
3. React components rendered to HTML
4. HTML sent to client with hydration data
5. Client hydrates and becomes interactive
6. Subsequent navigation is client-side
```

**Benefits:**
- Faster initial page load
- Better SEO
- Improved perceived performance
- Progressive enhancement

---

## Backend Architecture

### Technology Stack

```typescript
// Core Framework
Express.js 4.21.2        // Web framework
TypeScript 5.8.3         // Type system
Node.js 18+              // Runtime

// AI Integration
@modelcontextprotocol/sdk 1.0.4  // MCP SDK

// Security
Helmet 8.0.0             // Security headers
CORS 2.8.5               // Cross-origin
express-rate-limit 7.5.0 // Rate limiting

// Utilities
Winston 3.17.0           // Logging
node-cache 5.1.2         // Caching
Zod 3.24.2              // Validation
Multer 1.4.5            // File uploads
simple-git 3.27.0       // Git operations
```

### File Structure

```
backend/src/
├── config/
│   └── index.ts                # Configuration management
│
├── controllers/
│   └── analysisController.ts   # Request handlers
│
├── middleware/
│   ├── errorHandler.ts         # Error handling
│   └── validation.ts           # Request validation
│
├── mcp/                        # MCP integration
│   ├── mcpClient.ts           # MCP SDK client
│   ├── repoAnalyzer.ts        # Repository analysis
│   ├── modernizationAgent.ts  # Code modernization
│   ├── vulnerabilityScanner.ts # Security scanning
│   ├── edgeCaseGenerator.ts   # Test generation
│   └── architectureExplainer.ts # Architecture analysis
│
├── routes/
│   └── analysisRoutes.ts      # API routes
│
├── services/
│   └── analysisService.ts     # Business logic
│
├── types/
│   └── index.ts               # TypeScript types
│
├── utils/
│   ├── logger.ts              # Winston logger
│   └── fileHandler.ts         # File operations
│
└── server.ts                   # Express entry point
```

### API Layer Architecture

```typescript
// Request Flow
Client Request
    ↓
Rate Limiter (100 req/15min)
    ↓
CORS Validation
    ↓
Helmet Security Headers
    ↓
Request Validation (Zod)
    ↓
Controller
    ↓
Service Layer
    ↓
MCP Client
    ↓
MCP Agents (parallel)
    ↓
Response Aggregation
    ↓
Cache Storage
    ↓
JSON Response
```

### Middleware Stack

```typescript
// Express middleware order
app.use(helmet());              // Security headers
app.use(cors(corsOptions));     // CORS
app.use(express.json());        // JSON parsing
app.use(rateLimiter);          // Rate limiting
app.use('/api', routes);       // API routes
app.use(errorHandler);         // Error handling
```

### Service Layer Pattern

```typescript
// Service responsibilities
class AnalysisService {
  // 1. Validate input
  // 2. Check cache
  // 3. Call MCP agents
  // 4. Aggregate results
  // 5. Store in cache
  // 6. Return response
  
  async analyzeRepository(repoPath: string) {
    // Implementation
  }
}
```

---

## MCP Integration Layer

### IBM Bob MCP Architecture

```typescript
// MCP Client Structure
class MCPClient {
  private client: Client | null
  private transport: StdioClientTransport | null
  private isConnected: boolean
  
  // Connection management
  async connect(): Promise<void>
  async disconnect(): Promise<void>
  
  // Request handling
  async sendRequest(request: MCPRequest): Promise<MCPResponse>
  async sendRequestWithRetry(request: MCPRequest): Promise<MCPResponse>
  
  // Status
  isClientConnected(): boolean
}
```

### MCP Agents

#### 1. Repository Analyzer
```typescript
// Purpose: Scan repository structure and assess risk
class RepoAnalyzer {
  async analyze(repoPath: string) {
    return {
      summary: {
        totalFiles: number,
        linesOfCode: number,
        techStack: string[],
        riskScore: number
      },
      fileRisks: FileRisk[],
      recommendations: string[]
    }
  }
}
```

#### 2. Modernization Agent
```typescript
// Purpose: Identify legacy patterns and suggest improvements
class ModernizationAgent {
  async findLegacyPatterns(code: string) {
    return {
      patterns: LegacyPattern[],
      suggestions: ModernizationSuggestion[],
      prDescription: string
    }
  }
}
```

#### 3. Vulnerability Scanner
```typescript
// Purpose: Detect security vulnerabilities
class VulnerabilityScanner {
  async scan(repoPath: string) {
    return {
      vulnerabilities: Vulnerability[],
      cweMapping: CWEMapping[],
      severityBreakdown: SeverityCount,
      remediationSteps: string[]
    }
  }
}
```

#### 4. Edge Case Generator
```typescript
// Purpose: Generate comprehensive test cases
class EdgeCaseGenerator {
  async generateTests(code: string, framework: TestFramework) {
    return {
      tests: TestCase[],
      coverage: CoverageReport,
      exportBundle: string
    }
  }
}
```

#### 5. Architecture Explainer
```typescript
// Purpose: Visualize dependencies and identify bottlenecks
class ArchitectureExplainer {
  async analyzeArchitecture(repoPath: string) {
    return {
      dependencyGraph: DependencyNode[],
      bottlenecks: Bottleneck[],
      circularDependencies: string[],
      suggestions: string[]
    }
  }
}
```

### MCP Communication Protocol

```typescript
// Request/Response Flow
1. Client creates MCPRequest
   {
     prompt: string,
     context: object,
     options: object
   }

2. MCPClient sends to MCP server via StdioTransport

3. MCP server processes with AI model

4. Server returns MCPResponse
   {
     success: boolean,
     data: object,
     tokensUsed: number,
     error?: string
   }

5. Client handles response with retry logic
```

### Retry Strategy

```typescript
// Exponential backoff with max retries
async sendRequestWithRetry(request, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await sendRequest(request);
    } catch (error) {
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        await sleep(delay);
      }
    }
  }
  throw new Error('All retry attempts failed');
}
```

---

## Data Flow

### Complete Analysis Workflow

```typescript
// Step-by-step data flow
1. User uploads repository
   ↓
2. Frontend validates file/URL
   ↓
3. POST /api/analyze with repoPath
   ↓
4. Backend validates request (Zod)
   ↓
5. Check cache for existing analysis
   ↓
6. If not cached, initialize MCP client
   ↓
7. Parallel execution of 5 MCP agents:
   - Repository Analyzer
   - Modernization Agent
   - Vulnerability Scanner
   - Edge Case Generator
   - Architecture Explainer
   ↓
8. Aggregate results from all agents
   ↓
9. Store in cache (1 hour TTL)
   ↓
10. Return JSON response to frontend
   ↓
11. Frontend displays in dashboard
   ↓
12. User interacts with results:
    - Generate PR
    - Export tests
    - Download reports
    - View architecture
```

### Caching Strategy

```typescript
// Cache key structure
const cacheKey = `analysis:${repoId}:${timestamp}`;

// Cache storage
cache.set(cacheKey, analysisResult, TTL);

// Cache retrieval
const cached = cache.get(cacheKey);
if (cached) return cached;

// Cache invalidation
cache.del(cacheKey);  // Manual
// or automatic after TTL (1 hour)
```

### Error Handling Flow

```typescript
// Error propagation
MCP Agent Error
    ↓
MCP Client catches and logs
    ↓
Service layer handles gracefully
    ↓
Controller returns error response
    ↓
Frontend displays user-friendly message
    ↓
Error logged to Winston
```

---

## Component Hierarchy

### Dashboard Layout

```
<DashboardLayout>
  ├── <DashboardSidebar>
  │   ├── <Logo />
  │   ├── <NavigationMenu>
  │   │   ├── Overview
  │   │   ├── Modernize
  │   │   ├── Security
  │   │   ├── Tests
  │   │   └── Architecture
  │   └── <UserProfile />
  │
  └── <MainContent>
      ├── <PageHeader>
      │   ├── <Breadcrumbs />
      │   └── <Actions />
      │
      └── <PageContent>
          └── [Dynamic Route Content]
```

### Overview Page Components

```
<OverviewPage>
  ├── <RiskHeatmap>
  │   └── <HeatmapGrid />
  │
  ├── <TechStackDetection>
  │   └── <TechStackBadges />
  │
  ├── <QuickActions>
  │   ├── <ActionCard title="Modernize" />
  │   ├── <ActionCard title="Security" />
  │   ├── <ActionCard title="Tests" />
  │   └── <ActionCard title="Architecture" />
  │
  └── <MetricsSummary>
      ├── <AnimatedCounter label="LOC" />
      ├── <AnimatedCounter label="Files" />
      ├── <AnimatedCounter label="Issues" />
      └── <AnimatedCounter label="Score" />
```

### Modernization Page Components

```
<ModernizePage>
  ├── <LegacyPatternsList>
  │   └── <PatternCard>
  │       ├── <BeforeCode />
  │       ├── <AfterCode />
  │       └── <AIRationale />
  │
  ├── <ModernizationActions>
  │   ├── <Button onClick={generatePR}>Generate PR</Button>
  │   └── <Button onClick={exportChanges}>Export</Button>
  │
  └── <ProgressIndicator />
```

---

## State Management

### TanStack Query Usage

```typescript
// Fetching analysis results
const { data, isLoading, error } = useQuery({
  queryKey: ['analysis', repoId],
  queryFn: () => fetchAnalysis(repoId),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 60 * 60 * 1000, // 1 hour
});

// Mutations for actions
const generatePRMutation = useMutation({
  mutationFn: (repoId: string) => generatePR(repoId),
  onSuccess: () => {
    queryClient.invalidateQueries(['analysis', repoId]);
  },
});
```

### Form State Management

```typescript
// React Hook Form with Zod validation
const form = useForm({
  resolver: zodResolver(analysisSchema),
  defaultValues: {
    repoPath: '',
    options: {
      includeTests: true,
      includeSecurity: true,
    },
  },
});
```

---

## Security Architecture

### Multi-Layer Security

```typescript
// Layer 1: Network Security
- HTTPS only
- CORS restrictions
- Rate limiting

// Layer 2: Input Validation
- Zod schema validation
- File type checking
- Size limits

// Layer 3: Authentication (future)
- JWT tokens
- API keys
- OAuth integration

// Layer 4: Data Security
- No sensitive data in logs
- Sanitized error messages
- Secure file handling

// Layer 5: Infrastructure
- Helmet security headers
- CSP policies
- XSS protection
```

### Rate Limiting Strategy

```typescript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests',
  standardHeaders: true,
  legacyHeaders: false,
});
```

---

## Performance Optimizations

### Frontend Optimizations

1. **Code Splitting**
   - Route-based splitting
   - Component lazy loading
   - Dynamic imports

2. **Asset Optimization**
   - Image optimization
   - SVG sprites
   - Font subsetting

3. **Rendering Optimization**
   - React.memo for expensive components
   - useMemo for computed values
   - useCallback for event handlers
   - Virtual scrolling for large lists

4. **Bundle Optimization**
   - Tree shaking
   - Minification
   - Compression (gzip/brotli)

### Backend Optimizations

1. **Caching**
   - In-memory cache (node-cache)
   - 1-hour TTL for analysis results
   - Cache invalidation strategies

2. **Parallel Processing**
   - Concurrent MCP agent execution
   - Promise.all for parallel requests

3. **Connection Pooling**
   - Reuse MCP connections
   - Connection lifecycle management

4. **Response Compression**
   - Gzip compression
   - JSON minification

---

## Scalability Considerations

### Horizontal Scaling

```typescript
// Stateless design enables horizontal scaling
- No server-side sessions
- Cache can be moved to Redis
- MCP clients can be load-balanced
- Database can be added for persistence
```

### Vertical Scaling

```typescript
// Resource optimization
- Efficient memory usage
- CPU-bound tasks offloaded to workers
- Streaming for large files
- Pagination for large datasets
```

### Future Enhancements

1. **Microservices Architecture**
   - Separate services for each MCP agent
   - API gateway for routing
   - Service mesh for communication

2. **Message Queue**
   - Async job processing
   - Background analysis
   - Webhook notifications

3. **Database Layer**
   - PostgreSQL for persistence
   - Redis for caching
   - MongoDB for logs

4. **CDN Integration**
   - Static asset delivery
   - Edge caching
   - Global distribution

---

## Deployment Architecture

### Cloudflare Pages (Frontend)

```
User Request
    ↓
Cloudflare Edge Network
    ↓
Static Assets (CDN)
    ↓
SSR Worker (if needed)
    ↓
HTML Response
```

### Cloudflare Workers (Backend)

```
API Request
    ↓
Cloudflare Worker
    ↓
Express.js Handler
    ↓
MCP Integration
    ↓
JSON Response
```

---

## Monitoring & Observability

### Logging Strategy

```typescript
// Winston logging levels
- error: Critical errors
- warn: Warning conditions
- info: Informational messages
- debug: Debug information

// Log structure
{
  timestamp: ISO8601,
  level: string,
  message: string,
  context: object,
  requestId: string
}
```

### Metrics to Track

1. **Performance Metrics**
   - API response times
   - MCP agent execution time
   - Cache hit/miss ratio
   - Bundle size

2. **Business Metrics**
   - Analysis requests per day
   - PR generations
   - Test exports
   - Report downloads

3. **Error Metrics**
   - Error rate
   - Error types
   - Failed requests
   - MCP failures

---

**Built with ❤️ for hackathons, made for engineers**

*CodeGuardian AI - Enterprise-Grade Architecture*