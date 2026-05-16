import fs from 'fs/promises';
import path from 'path';
import AdmZip from 'adm-zip';
import simpleGit from 'simple-git';
import { v4 as uuidv4 } from 'uuid';
import logger from './logger.js';
import config from '../config/index.js';

export class FileHandler {
  async handleGitHubUpload(repoUrl: string): Promise<string> {
    try {
      logger.info('Cloning GitHub repository', { repoUrl });

      const repoId = uuidv4();
      const targetPath = path.join(config.upload.tempDir, repoId);

      await fs.mkdir(targetPath, { recursive: true });

      const git = simpleGit();
      await git.clone(repoUrl, targetPath, ['--depth', '1']);

      logger.info('Repository cloned successfully', { repoId, targetPath });
      return targetPath;
    } catch (error) {
      logger.error('GitHub repository clone failed:', error);
      throw new Error('Failed to clone repository');
    }
  }

  async handleZipUpload(zipBuffer: Buffer): Promise<string> {
    try {
      logger.info('Extracting ZIP file');

      const repoId = uuidv4();
      const targetPath = path.join(config.upload.tempDir, repoId);

      await fs.mkdir(targetPath, { recursive: true });

      const zip = new AdmZip(zipBuffer);
      zip.extractAllTo(targetPath, true);

      logger.info('ZIP file extracted successfully', { repoId, targetPath });
      return targetPath;
    } catch (error) {
      logger.error('ZIP extraction failed:', error);
      throw new Error('Failed to extract ZIP file');
    }
  }

  async cleanupTempFiles(repoPath: string): Promise<void> {
    try {
      logger.info('Cleaning up temporary files', { repoPath });

      await fs.rm(repoPath, { recursive: true, force: true });

      logger.info('Temporary files cleaned up', { repoPath });
    } catch (error) {
      logger.error('Cleanup failed:', error);
    }
  }

  async listFiles(dirPath: string, extensions?: string[]): Promise<string[]> {
    try {
      const files: string[] = [];

      const readDir = async (currentPath: string): Promise<void> => {
        const entries = await fs.readdir(currentPath, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(currentPath, entry.name);

          if (entry.isDirectory()) {
            // Skip common directories
            if (!['node_modules', '.git', 'dist', 'build', '.next'].includes(entry.name)) {
              await readDir(fullPath);
            }
          } else if (entry.isFile()) {
            if (!extensions || extensions.some((ext) => entry.name.endsWith(ext))) {
              files.push(fullPath);
            }
          }
        }
      };

      await readDir(dirPath);
      return files;
    } catch (error) {
      logger.error('Failed to list files:', error);
      throw error;
    }
  }

  async readFile(filePath: string): Promise<string> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return content;
    } catch (error) {
      logger.error('Failed to read file:', error);
      throw error;
    }
  }

  async getFileStats(filePath: string): Promise<{
    size: number;
    lines: number;
    extension: string;
  }> {
    try {
      const stats = await fs.stat(filePath);
      const content = await this.readFile(filePath);
      const lines = content.split('\n').length;
      const extension = path.extname(filePath);

      return { size: stats.size, lines, extension };
    } catch (error) {
      logger.error('Failed to get file stats:', error);
      throw error;
    }
  }

  async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      logger.error('Failed to create directory:', error);
      throw error;
    }
  }
}

export const fileHandler = new FileHandler();
export default fileHandler;

// Made with Bob
