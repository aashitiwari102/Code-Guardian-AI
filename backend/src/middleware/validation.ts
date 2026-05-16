import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from './errorHandler.js';

export const uploadSchema = z.object({
  type: z.enum(['github', 'zip']),
  url: z.string().url().optional(),
});

export const analyzeSchema = z.object({
  repoId: z.string().uuid(),
});

export const modernizeSchema = z.object({
  repoId: z.string().uuid(),
  files: z.array(z.string()).optional(),
});

export const generateTestsSchema = z.object({
  repoId: z.string().uuid(),
  endpoints: z.array(z.string()).optional(),
});

export const scanVulnerabilitiesSchema = z.object({
  repoId: z.string().uuid(),
});

export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        next(new AppError(`Validation error: ${message}`, 400));
      } else {
        next(error);
      }
    }
  };
};

export const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        next(new AppError(`Query validation error: ${message}`, 400));
      } else {
        next(error);
      }
    }
  };
};

export const validateParams = (schema: z.ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        next(new AppError(`Params validation error: ${message}`, 400));
      } else {
        next(error);
      }
    }
  };
};

// Made with Bob
