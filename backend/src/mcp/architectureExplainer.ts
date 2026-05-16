import mcpClient from './mcpClient.js';
import logger from '../utils/logger.js';
import type { GraphNode, GraphEdge } from '../types/index.js';

export class ArchitectureExplainer {
  async analyzeArchitecture(repoPath: string): Promise<{
    nodes: GraphNode[];
    edges: GraphEdge[];
    explanation: string;
  }> {
    try {
      logger.info('Analyzing repository architecture', { repoPath });

      const prompt = `Analyze the architecture of the repository at ${repoPath}.

Identify:
1. All major components (frontend, backend, databases, services)
2. Dependencies between components
3. External integrations
4. Data flow patterns
5. Service boundaries

Return:
- nodes: Array of components with id, label, and group (frontend/backend/data/infra/external)
- edges: Array of connections between components
- explanation: Plain-English architecture overview

Format as JSON.`;

      const response = await mcpClient.sendRequestWithRetry({
        prompt,
        context: { repoPath, task: 'analyze-architecture' },
        maxTokens: 4000,
      });

      if (!response.success) {
        throw new Error(response.error || 'Architecture analysis failed');
      }

      // Mock data - in production this would parse MCP response
      const nodes: GraphNode[] = [
        { id: 'ui', label: 'Web UI', group: 'frontend' },
        { id: 'api', label: 'Express API', group: 'backend' },
        { id: 'auth', label: 'Auth Service', group: 'backend' },
        { id: 'billing', label: 'Billing Module', group: 'backend' },
        { id: 'db', label: 'MySQL 5.6', group: 'data' },
        { id: 'queue', label: 'Job Queue', group: 'infra' },
        { id: 'mailer', label: 'Mailer', group: 'infra' },
        { id: 'stripe', label: 'Stripe', group: 'external' },
      ];

      const edges: GraphEdge[] = [
        { from: 'ui', to: 'api' },
        { from: 'api', to: 'auth' },
        { from: 'api', to: 'billing' },
        { from: 'auth', to: 'db' },
        { from: 'billing', to: 'db' },
        { from: 'billing', to: 'queue' },
        { from: 'queue', to: 'mailer' },
        { from: 'billing', to: 'stripe' },
      ];

      const explanation = `This is a classic three-tier web application with a PHP/jQuery frontend, Express.js API layer, and MySQL database.

**Frontend Layer:**
The Web UI is built with jQuery 1.9 and Bootstrap 3, communicating with the backend via REST APIs.

**Backend Layer:**
- Express API serves as the main application server
- Auth Service handles user authentication and session management
- Billing Module processes payments and manages invoices

**Data Layer:**
MySQL 5.6 database stores all application data including users, invoices, and transactions.

**Infrastructure:**
- Job Queue handles asynchronous tasks
- Mailer service sends transactional emails

**External Integrations:**
- Stripe for payment processing

**Key Concerns:**
1. Tight coupling between billing and multiple services
2. No caching layer
3. Single database (no read replicas)
4. Legacy frontend technology stack`;

      logger.info('Architecture analysis completed', {
        nodeCount: nodes.length,
        edgeCount: edges.length,
      });

      return { nodes, edges, explanation };
    } catch (error) {
      logger.error('Architecture analysis failed:', error);
      throw error;
    }
  }

  async identifyBottlenecks(nodes: GraphNode[], edges: GraphEdge[]): Promise<string[]> {
    try {
      logger.info('Identifying architecture bottlenecks');

      const prompt = `Given this architecture:
Nodes: ${JSON.stringify(nodes)}
Edges: ${JSON.stringify(edges)}

Identify potential bottlenecks, single points of failure, and scalability concerns.
Return as array of strings.`;

      const response = await mcpClient.sendRequestWithRetry({
        prompt,
        context: { nodes, edges, task: 'identify-bottlenecks' },
        maxTokens: 1000,
      });

      if (!response.success) {
        throw new Error(response.error || 'Bottleneck identification failed');
      }

      // Mock response
      return [
        'Single MySQL instance is a bottleneck for read-heavy operations',
        'No caching layer - all requests hit the database',
        'Billing module has too many dependencies',
        'No load balancing for API layer',
        'Synchronous email sending blocks request processing',
      ];
    } catch (error) {
      logger.error('Bottleneck identification failed:', error);
      throw error;
    }
  }

  async suggestImprovements(
    _nodes: GraphNode[],
    _edges: GraphEdge[]
  ): Promise<Array<{ title: string; description: string; priority: string }>> {
    try {
      logger.info('Generating architecture improvement suggestions');

      const improvements = [
        {
          title: 'Add Redis caching layer',
          description:
            'Implement Redis between API and database to cache frequently accessed data and reduce database load.',
          priority: 'High',
        },
        {
          title: 'Implement read replicas',
          description:
            'Set up MySQL read replicas to distribute read queries and improve performance.',
          priority: 'High',
        },
        {
          title: 'Decouple billing module',
          description:
            'Extract billing into a microservice with its own database to reduce coupling and improve scalability.',
          priority: 'Medium',
        },
        {
          title: 'Add API gateway',
          description:
            'Implement an API gateway (Kong, AWS API Gateway) for rate limiting, authentication, and routing.',
          priority: 'Medium',
        },
        {
          title: 'Modernize frontend',
          description:
            'Migrate from jQuery to React/Vue for better maintainability and performance.',
          priority: 'Low',
        },
      ];

      logger.info('Architecture improvements generated', { count: improvements.length });
      return improvements;
    } catch (error) {
      logger.error('Architecture improvement generation failed:', error);
      throw error;
    }
  }
}

export const architectureExplainer = new ArchitectureExplainer();
export default architectureExplainer;

// Made with Bob
