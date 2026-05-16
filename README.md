# CodeGuardian AI

**Modernize, Secure, and Stress-Test Any Codebase**

An AI-powered SDLC platform that acts as your senior engineer, security auditor, and QA engineer — all in one delightful tool.

![CodeGuardian AI](https://img.shields.io/badge/Status-Hackathon%20Ready-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Express](https://img.shields.io/badge/Express-4.21-lightgrey)

## 🎯 Overview

CodeGuardian AI combines legacy code modernization, intelligent edge-case test generation, security vulnerability detection, and architecture visualization into a single, visually stunning platform powered by IBM Bob MCP servers.

### Key Features

- 🔄 **Legacy Code Modernizer** - Transform outdated patterns into modern, safe code
- 🧪 **Edge-Case Test Generator** - Generate Jest, Pytest & Postman tests automatically
- 🛡️ **Vulnerability Scanner** - CWE-mapped findings with severity and remediation
- 🏗️ **Architecture Visualizer** - Interactive dependency graphs
- 🤖 **AI Explanations** - Plain-English reasoning for every finding
- 📊 **Export Reports** - Audit-ready PDFs, JSON, and test bundles

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun
- npm or bun package manager

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd codeguardian-ai
```

2. **Install frontend dependencies**

```bash
npm install
# or
bun install
```

3. **Install backend dependencies**

```bash
cd backend
npm install
# or
bun install
cd ..
```

4. **Configure environment variables**

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration
```

5. **Start the development servers**

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

6. **Open your browser**

Navigate to `http://localhost:3000`

## 📁 Project Structure

```
codeguardian-ai/
├── src/                      # Frontend source
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── Blobs.tsx       # Animated background
│   │   ├── HeroMock.tsx    # Hero section mockup
│   │   ├── Logo.tsx        # Brand logo
│   │   ├── MarketingNav.tsx
│   │   └── DashboardSidebar.tsx
│   ├── routes/             # TanStack Router pages
│   │   ├── index.tsx       # Landing page
│   │   ├── dashboard.tsx   # Dashboard layout
│   │   ├── dashboard.index.tsx
│   │   ├── dashboard.modernize.tsx
│   │   ├── dashboard.security.tsx
│   │   ├── dashboard.tests.tsx
│   │   └── dasboard.architecture.tsx
│   ├── lib/                # Utilities
│   │   ├── mock-data.ts    # Sample data
│   │   └── utils.ts        # Helper functions
│   ├── hooks/              # Custom React hooks
│   └── styles.css          # Global styles
├── backend/                 # Backend API
│   ├── src/
│   │   ├── config/         # Configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── mcp/           # IBM Bob MCP integrations
│   │   │   ├── mcpClient.ts
│   │   │   ├── repoAnalyzer.ts
│   │   │   ├── modernizationAgent.ts
│   │   │   ├── edgeCaseGenerator.ts
│   │   │   ├── vulnerabilityScanner.ts
│   │   │   └── architectureExplainer.ts
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── types/         # TypeScript types
│   │   ├── utils/         # Utilities
│   │   └── server.ts      # Express entry point
│   ├── logs/              # Application logs
│   ├── uploads/           # Uploaded files
│   └── temp/              # Temporary files
├── public/                 # Static assets
├── package.json
├── tsconfig.json
└── README.md
```

## 🎨 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router via TanStack Start)
- **Language**: TypeScript
- **Styling**: TailwindCSS 4
- **UI Components**: shadcn/ui + Radix UI
- **Animations**: Framer Motion
- **Graphs**: React Flow
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **AI Integration**: IBM Bob MCP SDK
- **Validation**: Zod
- **Logging**: Winston
- **Caching**: node-cache
- **Security**: Helmet, CORS, Rate Limiting

## 🔌 API Endpoints

### Backend API (Port 3001)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/analyze` | Analyze repository |
| GET | `/api/analysis/:repoId` | Get analysis results |
| POST | `/api/modernize` | Generate modernization PR |
| POST | `/api/generate-tests` | Export test bundle |
| GET | `/api/security-report/:repoId` | Generate security report |
| POST | `/api/clear-cache` | Clear cache |

See [backend/README.md](backend/README.md) for detailed API documentation.

## 🎭 Design System

### Color Palette

```css
--brand-pink: #FF6FA6
--brand-teal: #18B7B0
--brand-cream: #FFF6E5
--brand-yellow: #FFD166
--brand-orange: #FF7A59
--brand-navy: #202B3D
```

### Typography

- **Display**: Fredoka (playful, bold headings)
- **Body**: Poppins (clean, readable)
- **Code**: Space Grotesk (technical content)

### Design Principles

- Vibrant, artistic color palette
- Rounded cards with grain texture
- Blob gradients and floating shapes
- Playful but professional
- Retro creative studio aesthetic

## 🤖 IBM Bob MCP Integration

CodeGuardian AI leverages IBM Bob MCP servers for intelligent code analysis:

### MCP Modules

1. **Repository Analyzer** - Scans structure, detects tech stack, calculates risk
2. **Modernization Agent** - Identifies legacy patterns, generates refactoring suggestions
3. **Edge Case Generator** - Creates comprehensive test suites
4. **Vulnerability Scanner** - Maps security issues to CWE standards
5. **Architecture Explainer** - Visualizes dependencies and identifies bottlenecks

### Features

- Automatic retry with exponential backoff
- Token usage tracking
- Graceful error handling
- Response caching

## 🛡️ Security

- Input validation with Zod schemas
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- Sanitized error responses
- No sensitive data exposure

## 📊 Performance Optimizations

- In-memory caching (1-hour TTL)
- Lazy loading components
- Code splitting
- Optimized images
- Minimal bundle size
- Server-side rendering

## 🧪 Testing

```bash
# Frontend tests
npm test

# Backend tests
cd backend
npm test
```

## 🚢 Deployment

### Frontend (Vercel/Netlify)

```bash
npm run build
npm run preview
```

### Backend (Docker)

```bash
cd backend
docker build -t codeguardian-backend .
docker run -p 3001:3001 --env-file .env codeguardian-backend
```

### Environment Variables

**Frontend:**
- `VITE_API_URL` - Backend API URL

**Backend:**
- See `backend/.env.example` for full list

## 📸 Screenshots

### Landing Page
*Vibrant hero section with animated blobs and playful typography*

### Dashboard
*Risk heatmap, tech stack detection, and action items*

### Modernization View
*Before/after code comparisons with AI rationale*

### Security Scanner
*CWE-mapped vulnerabilities with severity indicators*

### Test Generator
*Intelligent edge case tests for Jest, Pytest, Postman*

### Architecture Map
*Interactive dependency graph with React Flow*

## 🎯 Hackathon Highlights

- ✅ **Production-Quality Code** - No placeholders, fully functional
- ✅ **Beautiful UI** - Illustrator-inspired design system
- ✅ **IBM Bob MCP Integration** - Real AI-powered analysis
- ✅ **Complete Feature Set** - All 6 core features implemented
- ✅ **Scalable Architecture** - Modular, maintainable codebase
- ✅ **Comprehensive Documentation** - Setup guides and API docs
- ✅ **Demo-Ready** - Smooth presentation flow

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- IBM Bob MCP for AI capabilities
- shadcn/ui for beautiful components
- TanStack for routing excellence
- The open-source community

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ for hackathons, made for engineers.**

*CodeGuardian AI - Your AI-powered SDLC assistant*