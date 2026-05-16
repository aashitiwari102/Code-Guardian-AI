import type { Request, Response, NextFunction } from 'express';
import { analysisService } from '../services/analysisService.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';
import type { ApiResponse, AnalysisResult } from '../types/index.js';

export class AnalysisController {
  analyze = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { repoPath } = req.body;

    if (!repoPath) {
      throw new AppError('Repository path is required', 400);
    }

    logger.info('Analysis request received', { repoPath });

    const result = await analysisService.analyzeRepository(repoPath);

    const response: ApiResponse<AnalysisResult> = {
      success: true,
      data: result,
      message: 'Repository analysis completed successfully',
    };

    res.status(200).json(response);
  });

  getAnalysis = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const repoId = req.params.repoId as string;

    if (!repoId) {
      throw new AppError('Repository ID is required', 400);
    }

    logger.info('Get analysis request', { repoId });

    const result = await analysisService.getAnalysis(repoId);

    if (!result) {
      throw new AppError('Analysis not found', 404);
    }

    const response: ApiResponse<AnalysisResult> = {
      success: true,
      data: result,
    };

    res.status(200).json(response);
  });

  generateModernizationPR = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { repoId } = req.body;

      if (!repoId) {
        throw new AppError('Repository ID is required', 400);
      }

      logger.info('Generate PR request', { repoId });

      const prDescription = await analysisService.generateModernizationPR(repoId);

      const response: ApiResponse<{ prDescription: string }> = {
        success: true,
        data: { prDescription },
        message: 'Pull request description generated successfully',
      };

      res.status(200).json(response);
    }
  );

  exportTestBundle = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { repoId, format } = req.body;

    if (!repoId || !format) {
      throw new AppError('Repository ID and format are required', 400);
    }

    if (!['jest', 'pytest', 'postman'].includes(format)) {
      throw new AppError('Invalid format. Must be jest, pytest, or postman', 400);
    }

    logger.info('Export test bundle request', { repoId, format });

    const bundle = await analysisService.exportTestBundle(repoId, format);

    const response: ApiResponse<{ bundle: string; format: string }> = {
      success: true,
      data: { bundle, format },
      message: 'Test bundle exported successfully',
    };

    res.status(200).json(response);
  });

  generateSecurityReport = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const repoId = req.params.repoId as string;

      if (!repoId) {
        throw new AppError('Repository ID is required', 400);
      }

      logger.info('Generate security report request', { repoId });

      const report = await analysisService.generateSecurityReport(repoId);

      const response: ApiResponse<{ report: string }> = {
        success: true,
        data: { report },
        message: 'Security report generated successfully',
      };

      res.status(200).json(response);
    }
  );

  clearCache = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { repoId } = req.body;

    logger.info('Clear cache request', { repoId: repoId || 'all' });

    analysisService.clearCache(repoId);

    const response: ApiResponse = {
      success: true,
      message: repoId ? 'Cache cleared for repository' : 'All cache cleared',
    };

    res.status(200).json(response);
  });
}

export const analysisController = new AnalysisController();
export default analysisController;

// Made with Bob
