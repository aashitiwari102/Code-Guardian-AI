import { v4 as uuidv4 } from 'uuid';
import NodeCache from 'node-cache';
import logger from '../utils/logger.js';
import { repoAnalyzer } from '../mcp/repoAnalyzer.js';
import { modernizationAgent } from '../mcp/modernizationAgent.js';
import { edgeCaseGenerator } from '../mcp/edgeCaseGenerator.js';
import { vulnerabilityScanner } from '../mcp/vulnerabilityScanner.js';
import { architectureExplainer } from '../mcp/architectureExplainer.js';
import type { AnalysisResult } from '../types/index.js';
import config from '../config/index.js';

const cache = new NodeCache({
  stdTTL: config.cache.ttl,
  checkperiod: config.cache.checkPeriod,
});

export class AnalysisService {
  async analyzeRepository(repoPath: string): Promise<AnalysisResult> {
    try {
      const repoId = uuidv4();
      logger.info('Starting full repository analysis', { repoId, repoPath });

      // Check cache
      const cacheKey = `analysis:${repoPath}`;
      const cached = cache.get<AnalysisResult>(cacheKey);
      if (cached) {
        logger.info('Returning cached analysis', { repoId });
        return cached;
      }

      // Step 1: Analyze repository structure and risks
      const { summary, fileRisks } = await repoAnalyzer.analyzeRepository(repoPath);

      // Step 2: Scan for vulnerabilities
      const vulnerabilities = await vulnerabilityScanner.scanRepository(repoPath);

      // Step 3: Generate modernization suggestions
      const riskyFiles = fileRisks.filter((f) => f.severity !== 'stable').map((f) => f.path);
      const modernizations = await modernizationAgent.generateModernizations(
        repoPath,
        riskyFiles
      );

      // Step 4: Generate edge case tests
      const endpoints = ['POST /api/login', 'POST /api/invoice', 'POST /api/webhook'];
      const edgeCases = await edgeCaseGenerator.generateEdgeCases(repoPath, endpoints);

      // Step 5: Analyze architecture
      const { nodes: graphNodes, edges: graphEdges } =
        await architectureExplainer.analyzeArchitecture(repoPath);

      const result: AnalysisResult = {
        repoId,
        summary,
        fileRisks,
        vulnerabilities,
        modernizations,
        edgeCases,
        graphNodes,
        graphEdges,
        createdAt: new Date().toISOString(),
      };

      // Cache the result
      cache.set(cacheKey, result);

      logger.info('Repository analysis completed', {
        repoId,
        files: summary.files,
        vulnerabilities: vulnerabilities.length,
        modernizations: modernizations.length,
      });

      return result;
    } catch (error) {
      logger.error('Repository analysis failed:', error);
      throw error;
    }
  }

  async getAnalysis(repoId: string): Promise<AnalysisResult | null> {
    try {
      const cacheKey = `analysis:repo:${repoId}`;
      const cached = cache.get<AnalysisResult>(cacheKey);

      if (cached) {
        logger.info('Retrieved analysis from cache', { repoId });
        return cached;
      }

      logger.warn('Analysis not found in cache', { repoId });
      return null;
    } catch (error) {
      logger.error('Failed to retrieve analysis:', error);
      throw error;
    }
  }

  async generateModernizationPR(repoId: string): Promise<string> {
    try {
      logger.info('Generating modernization PR', { repoId });

      const analysis = await this.getAnalysis(repoId);
      if (!analysis) {
        throw new Error('Analysis not found');
      }

      const prDescription = await modernizationAgent.generatePullRequest(
        analysis.modernizations
      );

      return prDescription;
    } catch (error) {
      logger.error('PR generation failed:', error);
      throw error;
    }
  }

  async exportTestBundle(repoId: string, format: 'jest' | 'pytest' | 'postman'): Promise<string> {
    try {
      logger.info('Exporting test bundle', { repoId, format });

      const analysis = await this.getAnalysis(repoId);
      if (!analysis) {
        throw new Error('Analysis not found');
      }

      const bundle = await edgeCaseGenerator.exportTestBundle(analysis.edgeCases, format);

      return bundle;
    } catch (error) {
      logger.error('Test bundle export failed:', error);
      throw error;
    }
  }

  async generateSecurityReport(repoId: string): Promise<string> {
    try {
      logger.info('Generating security report', { repoId });

      const analysis = await this.getAnalysis(repoId);
      if (!analysis) {
        throw new Error('Analysis not found');
      }

      const report = await vulnerabilityScanner.generateSecurityReport(analysis.vulnerabilities);

      return report;
    } catch (error) {
      logger.error('Security report generation failed:', error);
      throw error;
    }
  }

  clearCache(repoId?: string): void {
    if (repoId) {
      cache.del(`analysis:repo:${repoId}`);
      logger.info('Cleared cache for repo', { repoId });
    } else {
      cache.flushAll();
      logger.info('Cleared all cache');
    }
  }
}

export const analysisService = new AnalysisService();
export default analysisService;

// Made with Bob
