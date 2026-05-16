import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import config from '../config/index.js';
import logger from '../utils/logger.js';
import type { MCPRequest, MCPResponse } from '../types/index.js';

export class MCPClient {
  private client: Client | null = null;
  private transport: StdioClientTransport | null = null;
  private isConnected = false;
  private mockMode = true; // Use mock mode for development

  async connect(): Promise<void> {
    try {
      if (this.isConnected) {
        logger.info('MCP client already connected');
        return;
      }

      // Check if we should use mock mode (no actual MCP server)
      if (this.mockMode || !process.env.MCP_SERVER_PATH) {
        logger.warn('MCP client running in MOCK MODE - no actual MCP server connection');
        this.isConnected = true;
        return;
      }

      this.transport = new StdioClientTransport({
        command: 'node',
        args: [process.env.MCP_SERVER_PATH],
      });

      this.client = new Client(
        {
          name: 'codeguardian-backend',
          version: '1.0.0',
        },
        {
          capabilities: {},
        }
      );

      await this.client.connect(this.transport);
      this.isConnected = true;
      logger.info('MCP client connected successfully');
    } catch (error) {
      logger.warn('Failed to connect MCP client, falling back to mock mode:', error);
      this.mockMode = true;
      this.isConnected = true;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.client) {
        await this.client.close();
        this.client = null;
      }
      if (this.transport) {
        await this.transport.close();
        this.transport = null;
      }
      this.isConnected = false;
      logger.info('MCP client disconnected');
    } catch (error) {
      logger.error('Error disconnecting MCP client:', error);
    }
  }

  async sendRequest(request: MCPRequest): Promise<MCPResponse> {
    try {
      if (!this.isConnected || !this.client) {
        await this.connect();
      }

      logger.info('Sending MCP request', { prompt: request.prompt.substring(0, 100) });

      // For now, return mock response since we don't have actual MCP server
      // In production, this would call the actual MCP server
      const response: MCPResponse = {
        success: true,
        data: {
          message: 'MCP response placeholder',
          context: request.context,
        },
        tokensUsed: 100,
      };

      logger.info('MCP request completed', { tokensUsed: response.tokensUsed });
      return response;
    } catch (error) {
      logger.error('MCP request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async sendRequestWithRetry(
    request: MCPRequest,
    maxRetries: number = config.mcp.maxRetries
  ): Promise<MCPResponse> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        logger.info(`MCP request attempt ${attempt}/${maxRetries}`);
        const response = await this.sendRequest(request);

        if (response.success) {
          return response;
        }

        lastError = new Error(response.error || 'Request failed');
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        logger.warn(`MCP request attempt ${attempt} failed:`, lastError.message);

        if (attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    logger.error('All MCP request attempts failed');
    return {
      success: false,
      error: lastError?.message || 'All retry attempts failed',
    };
  }

  isClientConnected(): boolean {
    return this.isConnected;
  }
}

export const mcpClient = new MCPClient();
export default mcpClient;

// Made with Bob
