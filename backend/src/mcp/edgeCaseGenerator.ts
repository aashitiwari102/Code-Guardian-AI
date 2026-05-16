import mcpClient from './mcpClient.js';
import logger from '../utils/logger.js';
import type { EdgeCase } from '../types/index.js';

export class EdgeCaseGenerator {
  async generateEdgeCases(repoPath: string, endpoints: string[]): Promise<EdgeCase[]> {
    try {
      logger.info('Generating edge case tests', { repoPath, endpointCount: endpoints.length });

      const prompt = `Analyze the API endpoints and code in ${repoPath}:
${endpoints.join('\n')}

Generate comprehensive edge case tests covering:
1. Null and undefined inputs
2. SQL injection attempts
3. XSS payloads
4. Oversized payloads
5. Unicode and emoji edge cases
6. Race conditions
7. Authentication edge cases
8. Malformed JSON

For each test, provide:
- Category
- Test name
- Framework (Jest, Pytest, or Postman)
- Complete test code

Return as JSON array.`;

      const response = await mcpClient.sendRequestWithRetry({
        prompt,
        context: { repoPath, endpoints, task: 'generate-tests' },
        maxTokens: 8000,
      });

      if (!response.success) {
        throw new Error(response.error || 'Edge case generation failed');
      }

      // Mock data - in production this would parse MCP response
      const edgeCases: EdgeCase[] = [
        {
          id: 'e1',
          category: 'Null & Undefined',
          name: 'createInvoice handles null line items',
          framework: 'Jest',
          code: `test('createInvoice rejects null lineItems', async () => {
  await expect(createInvoice({ lineItems: null }))
    .rejects.toThrow(/lineItems must be an array/);
});`,
        },
        {
          id: 'e2',
          category: 'Injection',
          name: 'Login resists SQL injection in email field',
          framework: 'Jest',
          code: `test("login is safe against SQLi payloads", async () => {
  const res = await api.post('/login', {
    email: "' OR 1=1 --",
    password: 'x',
  });
  expect(res.status).toBe(401);
});`,
        },
        {
          id: 'e3',
          category: 'Oversized Payload',
          name: 'Upload rejects > 25MB body',
          framework: 'Pytest',
          code: `def test_upload_rejects_oversized(client):
    big = b"a" * (26 * 1024 * 1024)
    r = client.post("/upload", data=big)
    assert r.status_code == 413`,
        },
        {
          id: 'e4',
          category: 'Unicode',
          name: 'Username accepts emoji & RTL combining marks',
          framework: 'Jest',
          code: `test('username supports emoji + RTL', () => {
  expect(validateUsername('شيرين🌸')).toBe(true);
  expect(validateUsername('a\\u0301'.repeat(50))).toBe(false);
});`,
        },
        {
          id: 'e5',
          category: 'Race Condition',
          name: 'Concurrent charge attempts settle once',
          framework: 'Jest',
          code: `test('double-submit charges only once', async () => {
  const [a, b] = await Promise.all([
    charge(order), charge(order),
  ]);
  expect([a.ok, b.ok].filter(Boolean)).toHaveLength(1);
});`,
        },
        {
          id: 'e6',
          category: 'Auth',
          name: 'Expired JWT is rejected',
          framework: 'Postman',
          code: `pm.test("expired token -> 401", () => {
  pm.response.to.have.status(401);
  pm.expect(pm.response.json().error).to.eql("token_expired");
});`,
        },
        {
          id: 'e7',
          category: 'Malformed JSON',
          name: 'Webhook returns 400 on broken JSON',
          framework: 'Pytest',
          code: `def test_webhook_bad_json(client):
    r = client.post("/webhook", data="{not json", headers={"Content-Type":"application/json"})
    assert r.status_code == 400`,
        },
        {
          id: 'e8',
          category: 'XSS',
          name: 'Cart escapes <script> in product name',
          framework: 'Jest',
          code: `test('cart escapes script tags', () => {
  document.body.innerHTML = render({ name: '<script>x</script>' });
  expect(document.querySelector('script')).toBeNull();
});`,
        },
      ];

      logger.info('Edge case tests generated', { count: edgeCases.length });
      return edgeCases;
    } catch (error) {
      logger.error('Edge case generation failed:', error);
      throw error;
    }
  }

  async exportTestBundle(edgeCases: EdgeCase[], format: 'jest' | 'pytest' | 'postman'): Promise<string> {
    try {
      logger.info('Exporting test bundle', { format, count: edgeCases.length });

      const filtered = edgeCases.filter((e) => e.framework.toLowerCase() === format);

      if (format === 'jest') {
        return this.generateJestBundle(filtered);
      } else if (format === 'pytest') {
        return this.generatePytestBundle(filtered);
      } else {
        return this.generatePostmanBundle(filtered);
      }
    } catch (error) {
      logger.error('Test bundle export failed:', error);
      throw error;
    }
  }

  private generateJestBundle(tests: EdgeCase[]): string {
    return `// Generated Edge Case Tests
import { describe, test, expect } from '@jest/globals';

describe('Edge Case Tests', () => {
${tests.map((t) => `  // ${t.category}: ${t.name}\n  ${t.code}\n`).join('\n')}
});
`;
  }

  private generatePytestBundle(tests: EdgeCase[]): string {
    return `# Generated Edge Case Tests
import pytest

${tests.map((t) => `# ${t.category}: ${t.name}\n${t.code}\n`).join('\n')}
`;
  }

  private generatePostmanBundle(tests: EdgeCase[]): string {
    const collection = {
      info: {
        name: 'CodeGuardian Edge Cases',
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
      },
      item: tests.map((t) => ({
        name: t.name,
        request: {
          method: 'POST',
          header: [],
          url: {
            raw: '{{baseUrl}}/api/test',
            host: ['{{baseUrl}}'],
            path: ['api', 'test'],
          },
        },
        event: [
          {
            listen: 'test',
            script: {
              exec: [t.code],
            },
          },
        ],
      })),
    };

    return JSON.stringify(collection, null, 2);
  }
}

export const edgeCaseGenerator = new EdgeCaseGenerator();
export default edgeCaseGenerator;

// Made with Bob
