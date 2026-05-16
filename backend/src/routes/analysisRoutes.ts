import { Router } from 'express';
import { analysisController } from '../controllers/analysisController.js';
import { validateRequest } from '../middleware/validation.js';
import { z } from 'zod';

const router = Router();

const analyzeSchema = z.object({
  repoPath: z.string().min(1, 'Repository path is required'),
});

const generatePRSchema = z.object({
  repoId: z.string().uuid('Invalid repository ID'),
});

const exportTestSchema = z.object({
  repoId: z.string().uuid('Invalid repository ID'),
  format: z.enum(['jest', 'pytest', 'postman']),
});

const clearCacheSchema = z.object({
  repoId: z.string().uuid('Invalid repository ID').optional(),
});

// POST /api/analyze - Analyze a repository
router.post('/analyze', validateRequest(analyzeSchema), analysisController.analyze);

// GET /api/analysis/:repoId - Get analysis results
router.get('/analysis/:repoId', analysisController.getAnalysis);

// POST /api/modernize - Generate modernization PR
router.post('/modernize', validateRequest(generatePRSchema), analysisController.generateModernizationPR);

// POST /api/generate-tests - Export test bundle
router.post('/generate-tests', validateRequest(exportTestSchema), analysisController.exportTestBundle);

// GET /api/security-report/:repoId - Generate security report
router.get('/security-report/:repoId', analysisController.generateSecurityReport);

// POST /api/clear-cache - Clear cache
router.post('/clear-cache', validateRequest(clearCacheSchema), analysisController.clearCache);

export default router;

// Made with Bob
