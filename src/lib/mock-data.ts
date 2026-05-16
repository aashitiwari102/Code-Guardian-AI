export type Severity = "critical" | "warning" | "stable";

export interface FileRisk {
  path: string;
  severity: Severity;
  issues: number;
  loc: number;
  legacyScore: number;
}

export interface Vulnerability {
  id: string;
  title: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  file: string;
  line: number;
  cwe: string;
  description: string;
  remediation: string;
}

export interface ModernizationItem {
  id: string;
  title: string;
  file: string;
  severity: "Critical" | "High" | "Medium";
  before: string;
  after: string;
  rationale: string;
}

export interface EdgeCase {
  id: string;
  category: string;
  name: string;
  framework: "Jest" | "Pytest" | "Postman";
  code: string;
}

export const repoSummary = {
  name: "acme-billing-legacy",
  url: "github.com/acme/acme-billing-legacy",
  language: "PHP + JavaScript",
  files: 412,
  loc: 87_204,
  lastCommit: "3 years ago",
  techStack: ["PHP 5.6", "MySQL", "jQuery 1.9", "Bootstrap 3", "Apache"],
  deprecated: ["mysql_query", "ereg()", "mcrypt", "jQuery.live"],
  coverage: 11,
  riskScore: 78,
};

export const fileRisks: FileRisk[] = [
  { path: "src/db/Queries.php", severity: "critical", issues: 14, loc: 1842, legacyScore: 92 },
  { path: "src/auth/Login.php", severity: "critical", issues: 9, loc: 612, legacyScore: 88 },
  { path: "src/api/Invoice.php", severity: "warning", issues: 6, loc: 980, legacyScore: 64 },
  { path: "src/utils/Crypto.php", severity: "critical", issues: 7, loc: 320, legacyScore: 81 },
  { path: "public/js/cart.js", severity: "warning", issues: 4, loc: 540, legacyScore: 58 },
  { path: "src/api/Webhook.php", severity: "warning", issues: 3, loc: 220, legacyScore: 49 },
  { path: "src/views/Dashboard.php", severity: "stable", issues: 0, loc: 410, legacyScore: 18 },
  { path: "src/utils/Logger.php", severity: "stable", issues: 1, loc: 120, legacyScore: 22 },
  { path: "src/api/Payment.php", severity: "critical", issues: 11, loc: 1320, legacyScore: 90 },
  { path: "src/utils/Mailer.php", severity: "warning", issues: 2, loc: 260, legacyScore: 41 },
  { path: "public/js/checkout.js", severity: "stable", issues: 0, loc: 180, legacyScore: 12 },
  { path: "src/db/Migration.php", severity: "stable", issues: 1, loc: 90, legacyScore: 20 },
];

export const vulnerabilities: Vulnerability[] = [
  {
    id: "v1",
    title: "SQL Injection via concatenated query",
    severity: "Critical",
    file: "src/db/Queries.php",
    line: 184,
    cwe: "CWE-89",
    description: "User input is concatenated directly into a SQL string using mysql_query().",
    remediation: "Use PDO with prepared statements and parameterized queries.",
  },
  {
    id: "v2",
    title: "Weak password hashing (MD5)",
    severity: "Critical",
    file: "src/auth/Login.php",
    line: 42,
    cwe: "CWE-916",
    description: "Passwords are stored using unsalted MD5 hashes — trivially crackable.",
    remediation: "Migrate to password_hash() with PASSWORD_BCRYPT or Argon2id.",
  },
  {
    id: "v3",
    title: "Missing CSRF protection on state-changing routes",
    severity: "High",
    file: "src/api/Invoice.php",
    line: 87,
    cwe: "CWE-352",
    description: "POST endpoints accept requests without verifying CSRF tokens.",
    remediation: "Add anti-CSRF tokens and validate origin/referer headers.",
  },
  {
    id: "v4",
    title: "Insecure deserialization of user payload",
    severity: "High",
    file: "src/api/Webhook.php",
    line: 23,
    cwe: "CWE-502",
    description: "unserialize() is called on data from untrusted webhook source.",
    remediation: "Switch to JSON parsing with a strict schema validator.",
  },
  {
    id: "v5",
    title: "XSS in rendered cart items",
    severity: "Medium",
    file: "public/js/cart.js",
    line: 112,
    cwe: "CWE-79",
    description: "Item names are rendered via .innerHTML without escaping.",
    remediation: "Use textContent or a templating library with auto-escaping.",
  },
  {
    id: "v6",
    title: "Outdated dependency: jQuery 1.9.1",
    severity: "Medium",
    file: "public/js/vendor/",
    line: 1,
    cwe: "CWE-1104",
    description: "Bundled jQuery has multiple known prototype-pollution CVEs.",
    remediation: "Upgrade to jQuery 3.7+ or remove in favor of native APIs.",
  },
];

export const modernizations: ModernizationItem[] = [
  {
    id: "m1",
    title: "Replace mysql_query with PDO prepared statements",
    file: "src/db/Queries.php",
    severity: "Critical",
    before: `$result = mysql_query(
  "SELECT * FROM users WHERE email='" . $_POST['email'] . "'"
);`,
    after: `$stmt = $pdo->prepare(
  "SELECT * FROM users WHERE email = :email"
);
$stmt->execute(['email' => $request->input('email')]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);`,
    rationale:
      "Eliminates SQL injection, removes deprecated mysql_* API (removed in PHP 7), and enables connection pooling.",
  },
  {
    id: "m2",
    title: "Modernize callback hell to async/await",
    file: "public/js/checkout.js",
    severity: "High",
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
    rationale: "Improves readability, enables structured error handling via try/catch, and removes nesting.",
  },
  {
    id: "m3",
    title: "Replace MD5 password hashing with Argon2id",
    file: "src/auth/Login.php",
    severity: "Critical",
    before: `if (md5($password) === $row['password']) {
  login_user($row);
}`,
    after: `if (password_verify($password, $row['password'])) {
  login_user($row);
}
// On signup:
$hash = password_hash($password, PASSWORD_ARGON2ID);`,
    rationale: "MD5 is cryptographically broken. Argon2id is memory-hard and the OWASP-recommended default.",
  },
  {
    id: "m4",
    title: "Migrate jQuery DOM manipulation to native APIs",
    file: "public/js/cart.js",
    severity: "Medium",
    before: `$('.cart-item').live('click', function(){
  $(this).fadeOut(300, function(){ $(this).remove(); });
});`,
    after: `document.addEventListener('click', (e) => {
  const item = e.target.closest('.cart-item');
  if (!item) return;
  item.animate({ opacity: [1, 0] }, 300)
      .onfinish = () => item.remove();
});`,
    rationale: "Removes 90KB jQuery dependency and uses event delegation that survives DOM updates.",
  },
];

export const edgeCases: EdgeCase[] = [
  {
    id: "e1",
    category: "Null & Undefined",
    name: "createInvoice handles null line items",
    framework: "Jest",
    code: `test('createInvoice rejects null lineItems', async () => {
  await expect(createInvoice({ lineItems: null }))
    .rejects.toThrow(/lineItems must be an array/);
});`,
  },
  {
    id: "e2",
    category: "Injection",
    name: "Login resists SQL injection in email field",
    framework: "Jest",
    code: `test("login is safe against SQLi payloads", async () => {
  const res = await api.post('/login', {
    email: "' OR 1=1 --",
    password: 'x',
  });
  expect(res.status).toBe(401);
});`,
  },
  {
    id: "e3",
    category: "Oversized Payload",
    name: "Upload rejects > 25MB body",
    framework: "Pytest",
    code: `def test_upload_rejects_oversized(client):
    big = b"a" * (26 * 1024 * 1024)
    r = client.post("/upload", data=big)
    assert r.status_code == 413`,
  },
  {
    id: "e4",
    category: "Unicode",
    name: "Username accepts emoji & RTL combining marks",
    framework: "Jest",
    code: `test('username supports emoji + RTL', () => {
  expect(validateUsername('شيرين🌸')).toBe(true);
  expect(validateUsername('a\\u0301'.repeat(50))).toBe(false);
});`,
  },
  {
    id: "e5",
    category: "Race Condition",
    name: "Concurrent charge attempts settle once",
    framework: "Jest",
    code: `test('double-submit charges only once', async () => {
  const [a, b] = await Promise.all([
    charge(order), charge(order),
  ]);
  expect([a.ok, b.ok].filter(Boolean)).toHaveLength(1);
});`,
  },
  {
    id: "e6",
    category: "Auth",
    name: "Expired JWT is rejected",
    framework: "Postman",
    code: `pm.test("expired token -> 401", () => {
  pm.response.to.have.status(401);
  pm.expect(pm.response.json().error).to.eql("token_expired");
});`,
  },
  {
    id: "e7",
    category: "Malformed JSON",
    name: "Webhook returns 400 on broken JSON",
    framework: "Pytest",
    code: `def test_webhook_bad_json(client):
    r = client.post("/webhook", data="{not json", headers={"Content-Type":"application/json"})
    assert r.status_code == 400`,
  },
  {
    id: "e8",
    category: "XSS",
    name: "Cart escapes <script> in product name",
    framework: "Jest",
    code: `test('cart escapes script tags', () => {
  document.body.innerHTML = render({ name: '<script>x</script>' });
  expect(document.querySelector('script')).toBeNull();
});`,
  },
];

export const graphNodes = [
  { id: "ui", label: "Web UI", group: "frontend" },
  { id: "api", label: "Express API", group: "backend" },
  { id: "auth", label: "Auth Service", group: "backend" },
  { id: "billing", label: "Billing Module", group: "backend" },
  { id: "db", label: "MySQL 5.6", group: "data" },
  { id: "queue", label: "Job Queue", group: "infra" },
  { id: "mailer", label: "Mailer", group: "infra" },
  { id: "stripe", label: "Stripe", group: "external" },
];

export const graphEdges = [
  { from: "ui", to: "api" },
  { from: "api", to: "auth" },
  { from: "api", to: "billing" },
  { from: "auth", to: "db" },
  { from: "billing", to: "db" },
  { from: "billing", to: "queue" },
  { from: "queue", to: "mailer" },
  { from: "billing", to: "stripe" },
];