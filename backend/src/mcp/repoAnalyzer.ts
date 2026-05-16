import mcpClient from './mcpClient.js';
import logger from '../utils/logger.js';
import type { RepoSummary, FileRisk } from '../types/index.js';

export class RepoAnalyzer {
  async analyzeRepository(repoPath: string): Promise<{
    summary: RepoSummary;
    fileRisks: FileRisk[];
  }> {
    try {
      logger.info('Starting repository analysis', { repoPath });

      const prompt = `Analyze the repository at ${repoPath}. Provide:
1. Repository summary (name, language, file count, lines of code, tech stack)
2. List of deprecated APIs and patterns
3. Risk assessment for each file
4. Overall risk score (0-100)

Return structured JSON with summary and fileRisks arrays.`;

      const response = await mcpClient.sendRequestWithRetry({
        prompt,
        context: { repoPath, task: 'analyze' },
        maxTokens: 4000,
      });

      if (!response.success) {
        throw new Error(response.error || 'Analysis failed');
      }

      // Mock data for now - in production this would parse MCP response
      const summary: RepoSummary = {
        name: 'acme-billing-legacy',
        url: repoPath,
        language: 'PHP + JavaScript',
        files: 412,
        loc: 87204,
        lastCommit: '3 years ago',
        techStack: ['PHP 5.6', 'MySQL', 'jQuery 1.9', 'Bootstrap 3', 'Apache'],
        deprecated: ['mysql_query', 'ereg()', 'mcrypt', 'jQuery.live'],
        coverage: 11,
        riskScore: 78,
      };

      const fileRisks: FileRisk[] = [
        {
          path: 'src/db/Queries.php',
          severity: 'critical',
          issues: 14,
          loc: 1842,
          legacyScore: 92,
        },
        {
          path: 'src/auth/Login.php',
          severity: 'critical',
          issues: 9,
          loc: 612,
          legacyScore: 88,
        },
        {
          path: 'src/api/Invoice.php',
          severity: 'warning',
          issues: 6,
          loc: 980,
          legacyScore: 64,
        },
      ];

      logger.info('Repository analysis completed', {
        files: summary.files,
        riskScore: summary.riskScore,
      });

      return { summary, fileRisks };
    } catch (error) {
      logger.error('Repository analysis failed:', error);
      throw error;
    }
  }

  async detectTechStack(repoPath: string): Promise<string[]> {
    try {
      const prompt = `Analyze the repository at ${repoPath} and detect all technologies, frameworks, and libraries used. Return as a JSON array of strings.`;

      const response = await mcpClient.sendRequestWithRetry({
        prompt,
        context: { repoPath, task: 'detect-stack' },
        maxTokens: 1000,
      });

      if (!response.success) {
        throw new Error(response.error || 'Tech stack detection failed');
      }

      // Mock response
      return ['PHP 5.6', 'MySQL', 'jQuery 1.9', 'Bootstrap 3', 'Apache'];
    } catch (error) {
      logger.error('Tech stack detection failed:', error);
      throw error;
    }
  }

  async calculateRiskScore(fileRisks: FileRisk[]): Promise<number> {
    const criticalCount = fileRisks.filter((f) => f.severity === 'critical').length;
    const warningCount = fileRisks.filter((f) => f.severity === 'warning').length;

    const criticalWeight = 10;
    const warningWeight = 5;

    const totalScore = criticalCount * criticalWeight + warningCount * warningWeight;
    const maxScore = fileRisks.length * criticalWeight;

    return Math.min(Math.round((totalScore / maxScore) * 100), 100);
  }
}

export const repoAnalyzer = new RepoAnalyzer();
export default repoAnalyzer;

// Made with Bob
