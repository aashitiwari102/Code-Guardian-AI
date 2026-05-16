import mcpClient from './mcpClient.js';
import logger from '../utils/logger.js';
import type { ModernizationItem } from '../types/index.js';

export class ModernizationAgent {
  async generateModernizations(repoPath: string, fileRisks: string[]): Promise<ModernizationItem[]> {
    try {
      logger.info('Generating modernization suggestions', { repoPath, fileCount: fileRisks.length });

      const prompt = `Analyze the following files in ${repoPath} and generate modernization suggestions:
${fileRisks.join('\n')}

For each deprecated pattern or legacy code:
1. Identify the issue
2. Provide before/after code examples
3. Explain the rationale for modernization
4. Assign severity (Critical, High, Medium)

Return as JSON array of modernization items.`;

      const response = await mcpClient.sendRequestWithRetry({
        prompt,
        context: { repoPath, files: fileRisks, task: 'modernize' },
        maxTokens: 6000,
      });

      if (!response.success) {
        throw new Error(response.error || 'Modernization generation failed');
      }

      // Mock data - in production this would parse MCP response
      const modernizations: ModernizationItem[] = [
        {
          id: 'm1',
          title: 'Replace mysql_query with PDO prepared statements',
          file: 'src/db/Queries.php',
          severity: 'Critical',
          before: `$result = mysql_query(
  "SELECT * FROM users WHERE email='" . $_POST['email'] . "'"
);`,
          after: `$stmt = $pdo->prepare(
  "SELECT * FROM users WHERE email = :email"
);
$stmt->execute(['email' => $request->input('email')]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);`,
          rationale:
            'Eliminates SQL injection, removes deprecated mysql_* API (removed in PHP 7), and enables connection pooling.',
        },
        {
          id: 'm2',
          title: 'Modernize callback hell to async/await',
          file: 'public/js/checkout.js',
          severity: 'High',
          before: `getCart(function(cart){
  validate(cart, function(err, ok){
    if (ok) charge(cart, function(res){ render(res); });
  });
});`,
          after: `const cart = await getCart();
const ok = await validate(cart);
if (ok) {
  const res = await charge(cart);
  render(res);
}`,
          rationale:
            'Improves readability, enables structured error handling via try/catch, and removes nesting.',
        },
        {
          id: 'm3',
          title: 'Replace MD5 password hashing with Argon2id',
          file: 'src/auth/Login.php',
          severity: 'Critical',
          before: `if (md5($password) === $row['password']) {
  login_user($row);
}`,
          after: `if (password_verify($password, $row['password'])) {
  login_user($row);
}
// On signup:
$hash = password_hash($password, PASSWORD_ARGON2ID);`,
          rationale:
            'MD5 is cryptographically broken. Argon2id is memory-hard and the OWASP-recommended default.',
        },
        {
          id: 'm4',
          title: 'Migrate jQuery DOM manipulation to native APIs',
          file: 'public/js/cart.js',
          severity: 'Medium',
          before: `$('.cart-item').live('click', function(){
  $(this).fadeOut(300, function(){ $(this).remove(); });
});`,
          after: `document.addEventListener('click', (e) => {
  const item = e.target.closest('.cart-item');
  if (!item) return;
  item.animate({ opacity: [1, 0] }, 300)
      .onfinish = () => item.remove();
});`,
          rationale:
            'Removes 90KB jQuery dependency and uses event delegation that survives DOM updates.',
        },
      ];

      logger.info('Modernization suggestions generated', { count: modernizations.length });
      return modernizations;
    } catch (error) {
      logger.error('Modernization generation failed:', error);
      throw error;
    }
  }

  async generatePullRequest(modernizations: ModernizationItem[]): Promise<string> {
    try {
      logger.info('Generating pull request', { itemCount: modernizations.length });

      const prompt = `Generate a comprehensive pull request description for the following modernizations:
${JSON.stringify(modernizations, null, 2)}

Include:
1. Summary of changes
2. Breaking changes (if any)
3. Testing recommendations
4. Migration guide`;

      const response = await mcpClient.sendRequestWithRetry({
        prompt,
        context: { modernizations, task: 'generate-pr' },
        maxTokens: 2000,
      });

      if (!response.success) {
        throw new Error(response.error || 'PR generation failed');
      }

      // Mock PR description
      return `# Modernization Pull Request

## Summary
This PR modernizes legacy code patterns across ${modernizations.length} files, addressing critical security vulnerabilities and deprecated APIs.

## Changes
${modernizations.map((m) => `- ${m.title} (${m.file})`).join('\n')}

## Breaking Changes
- Database queries now use PDO instead of mysql_* functions
- Password hashing migrated to Argon2id (requires PHP 7.2+)

## Testing
- Run full test suite
- Verify database connections
- Test authentication flow

## Migration Guide
1. Update PHP to 7.2+
2. Install PDO extension
3. Migrate password hashes (use migration script)
`;
    } catch (error) {
      logger.error('PR generation failed:', error);
      throw error;
    }
  }
}

export const modernizationAgent = new ModernizationAgent();
export default modernizationAgent;

// Made with Bob
