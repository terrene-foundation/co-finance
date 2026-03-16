#!/usr/bin/env node
/**
 * Hook: user-prompt-rules-reminder
 * Event: UserPromptSubmit
 * Purpose: Inject critical academic rules into conversation on EVERY user message.
 *          This is the PRIMARY mechanism that survives context compression,
 *          because it runs fresh on every turn (independent of memory).
 *
 * Framework-agnostic — works with any academic finance project.
 *
 * Exit Codes:
 *   0 = success (continue)
 */

const fs = require("fs");
const path = require("path");
const {
  parseEnvFile,
  checkApiKeys,
  buildCompactSummary,
  ensureEnvFile,
} = require("./lib/env-utils");
const { buildWorkspaceSummary } = require("./lib/workspace-utils");

const TIMEOUT_MS = 3000;
const timeout = setTimeout(() => {
  console.log(JSON.stringify({ continue: true }));
  process.exit(0);
}, TIMEOUT_MS);

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  clearTimeout(timeout);
  try {
    const data = JSON.parse(input);
    const result = buildReminder(data);
    console.log(JSON.stringify(result));
    process.exit(0);
  } catch {
    console.log(JSON.stringify({ continue: true }));
    process.exit(0);
  }
});

function buildReminder(data) {
  const cwd = data.cwd || process.cwd();
  const userMessage = (data.tool_input?.user_message || "").toLowerCase();

  // ── Always inject env summary (brief, 1-2 lines) ─────────────────
  const envPath = path.join(cwd, ".env");
  let envSummary = "No .env found";

  if (fs.existsSync(envPath)) {
    const env = parseEnvFile(envPath);
    const apiKeyStatus = checkApiKeys(env);
    const discovery = { validations: [] };
    for (const entry of apiKeyStatus.configured) {
      discovery.validations.push({ ...entry, status: "ok" });
    }
    for (const entry of apiKeyStatus.missing) {
      discovery.validations.push({ ...entry, status: "MISSING_KEY" });
    }
    envSummary = buildCompactSummary(env, discovery);
  } else {
    // Try to create .env
    ensureEnvFile(cwd);
  }

  // ── Build the reminder lines ──────────────────────────────────────
  const lines = [];

  // Line 1: Always show data API key status (compressed, 1 line)
  lines.push(`[DATA] ${envSummary}`);

  // Line 2: Core academic rules (always present, survives compression)
  lines.push(
    "[RULES] Cite all sources. Complete all analysis (no placeholders). " +
      "Verify data accuracy. Follow assignment formatting requirements. " +
      "Disclose AI assistance per institutional policy.",
  );

  // Line 3: Workspace context (survives compaction — primary anti-amnesia mechanism)
  try {
    const wsSummary = buildWorkspaceSummary(cwd);
    if (wsSummary) {
      lines.push(`[WORKSPACE] ${wsSummary}`);
    }
  } catch {}

  // ── Contextual reminders based on user message content ────────────
  const citationKeywords = [
    "cite",
    "citation",
    "reference",
    "bibliography",
    "apa",
    "chicago",
    "harvard",
    "source",
  ];
  const writingKeywords = [
    "thesis",
    "paper",
    "essay",
    "draft",
    "write",
    "argument",
    "evidence",
  ];
  const examKeywords = [
    "exam",
    "test",
    "quiz",
    "study",
    "practice",
    "formula",
  ];

  const mentionsCitation = citationKeywords.some((kw) =>
    userMessage.includes(kw),
  );
  const mentionsWriting = writingKeywords.some((kw) =>
    userMessage.includes(kw),
  );
  const mentionsExam = examKeywords.some((kw) => userMessage.includes(kw));

  if (mentionsCitation) {
    lines.push(
      "[REMINDER] Use proper citation format (APA 7th, Chicago, or as specified). " +
        "Include all required fields: author, year, title, source. Verify DOIs and URLs.",
    );
  }

  if (mentionsWriting) {
    lines.push(
      "[REMINDER] Follow academic writing standards: clear thesis statement, " +
        "evidence-based arguments, proper structure (intro, body, conclusion). " +
        "Cite all claims. Disclose AI assistance.",
    );
  }

  if (mentionsExam) {
    lines.push(
      "[REMINDER] Focus on understanding concepts, not memorizing answers. " +
        "Show work for calculations. Use proper financial notation and units.",
    );
  }

  return {
    continue: true,
    hookSpecificOutput: {
      hookEventName: "UserPromptSubmit",
      suppressOutput: false,
      message: lines.join("\n"),
    },
  };
}
