export type Severity = 'critical' | 'warning' | 'stable';

export type VulnerabilitySeverity = 'Critical' | 'High' | 'Medium' | 'Low';

export type ModernizationSeverity = 'Critical' | 'High' | 'Medium';

export type TestFramework = 'Jest' | 'Pytest' | 'Postman';

export interface FileRisk {
  path: string;
  severity: Severity;
  issues: number;
  loc: number;
  legacyScore: number;
}

export interface Vulnerability {
  id: string;
  title: string;
  severity: VulnerabilitySeverity;
  file: string;
  line: number;
  cwe: string;
  description: string;
  remediation: string;
}

export interface ModernizationItem {
  id: string;
  title: string;
  file: string;
  severity: ModernizationSeverity;
  before: string;
  after: string;
  rationale: string;
}

export interface EdgeCase {
  id: string;
  category: string;
  name: string;
  framework: TestFramework;
  code: string;
}

export interface RepoSummary {
  name: string;
  url: string;
  language: string;
  files: number;
  loc: number;
  lastCommit: string;
  techStack: string[];
  deprecated: string[];
  coverage: number;
  riskScore: number;
}

export interface GraphNode {
  id: string;
  label: string;
  group: string;
}

export interface GraphEdge {
  from: string;
  to: string;
}

export interface AnalysisResult {
  repoId: string;
  summary: RepoSummary;
  fileRisks: FileRisk[];
  vulnerabilities: Vulnerability[];
  modernizations: ModernizationItem[];
  edgeCases: EdgeCase[];
  graphNodes: GraphNode[];
  graphEdges: GraphEdge[];
  createdAt: string;
}

export interface UploadRequest {
  type: 'github' | 'zip';
  url?: string;
  file?: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
  };
}

export interface MCPRequest {
  prompt: string;
  context?: Record<string, unknown>;
  maxTokens?: number;
}

export interface MCPResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  tokensUsed?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}

// Made with Bob
