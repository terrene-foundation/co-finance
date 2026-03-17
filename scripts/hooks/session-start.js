#!/usr/bin/env node
/**
 * Hook: session-start
 * Event: SessionStart
 * Purpose: CO for Finance (COF) — Academic Finance Education
 *          Discover env config, validate data API keys, create .env if
 *          missing, detect academic project type.
 *
 * Framework-agnostic — works with any academic finance project.
 *
 * Exit Codes:
 *   0 = success (continue)
 *   2 = blocking error (stop tool execution)
 *   other = non-blocking error (warn and continue)
 */

const fs = require("fs");
const path = require("path");
const {
  parseEnvFile,
  ensureEnvFile,
  buildCompactSummary,
  checkApiKeys,
} = require("./lib/env-utils");
const {
  resolveLearningDir,
  ensureLearningDir,
  logObservation: logLearningObservation,
} = require("./lib/learning-utils");
const {
  detectActiveWorkspace,
  derivePhase,
  getTodoProgress,
  getSessionNotes,
} = require("./lib/workspace-utils");

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  try {
    const data = JSON.parse(input);
    initializeSession(data);
    console.log(JSON.stringify({ continue: true }));
    process.exit(0);
  } catch (error) {
    console.error(`[HOOK ERROR] ${error.message}`);
    console.log(JSON.stringify({ continue: true }));
    process.exit(1);
  }
});

function initializeSession(data) {
  const session_id = (data.session_id || "unknown").replace(
    /[^a-zA-Z0-9_-]/g,
    "_",
  );
  const cwd = data.cwd || process.cwd();
  const homeDir = process.env.HOME || process.env.USERPROFILE;
  const sessionDir = path.join(homeDir, ".claude", "sessions");
  const learningDir = resolveLearningDir(cwd);

  // Ensure directories exist
  [sessionDir].forEach((dir) => {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch {}
  });
  ensureLearningDir(cwd);

  // ── .env provision ────────────────────────────────────────────────────
  const envResult = ensureEnvFile(cwd);
  if (envResult.created) {
    console.error(
      `[SETUP] Created .env from ${envResult.source}. Add your data API keys if needed (e.g., FRED_API_KEY).`,
    );
  }

  // ── Parse .env ────────────────────────────────────────────────────────
  const envPath = path.join(cwd, ".env");
  const envExists = fs.existsSync(envPath);
  let env = {};
  let apiKeyStatus = { configured: [], missing: [] };

  if (envExists) {
    env = parseEnvFile(envPath);
    apiKeyStatus = checkApiKeys(env);
  }

  // ── Detect academic project type ────────────────────────────────────
  const projectType = detectProjectType(cwd);

  // ── Log observation ─────────────────────────────────────────────────
  try {
    const observationsFile = path.join(learningDir, "observations.jsonl");
    fs.appendFileSync(
      observationsFile,
      JSON.stringify({
        type: "session_start",
        session_id,
        cwd,
        timestamp: new Date().toISOString(),
        envExists,
        projectType,
        keyCount: apiKeyStatus.configured.length,
      }) + "\n",
    );
  } catch {}

  // ── Load previous session ─────────────────────────────────────────────
  try {
    const sessionFile = path.join(sessionDir, `${session_id}.json`);
    const lastSessionFile = path.join(sessionDir, "last-session.json");
    if (fs.existsSync(sessionFile)) {
      /* loaded */
    } else if (fs.existsSync(lastSessionFile)) {
      /* loaded */
    }
  } catch {}

  // ── Output workspace status (human-facing, stderr only) ──────────────
  try {
    const ws = detectActiveWorkspace(cwd);
    if (ws) {
      const phase = derivePhase(ws.path, cwd);
      const todos = getTodoProgress(ws.path);
      const notes = getSessionNotes(ws.path);
      console.error(
        `[WORKSPACE] ${ws.name} | Phase: ${phase} | Todos: ${todos.active} active / ${todos.completed} done`,
      );
      if (notes) {
        const staleTag = notes.stale ? " (stale)" : "";
        console.error(`[WORKSPACE] Session notes${staleTag}: ${notes.age}`);
      }
    }
  } catch {}

  // ── Output API key summary ──────────────────────────────────────────
  if (envExists) {
    const discovery = { validations: [] };
    for (const entry of apiKeyStatus.configured) {
      discovery.validations.push({ ...entry, status: "ok" });
    }
    for (const entry of apiKeyStatus.missing) {
      discovery.validations.push({ ...entry, status: "MISSING_KEY" });
    }
    const summary = buildCompactSummary(env, discovery);
    console.error(`[DATA] ${summary}`);

    // Detail each API key status
    for (const entry of apiKeyStatus.configured) {
      console.error(`[DATA]   ✓ ${entry.provider} key configured (${entry.key})`);
    }
    for (const entry of apiKeyStatus.missing) {
      console.error(`[DATA]   ✗ ${entry.provider} key not set (${entry.key})`);
    }
  } else {
    console.error(
      "[DATA] No .env file found. Data API keys not configured.",
    );
  }
}

/**
 * Detect the academic project type by checking for characteristic files
 * in the workspace.
 *
 * @param {string} cwd - Project root directory
 * @returns {string} Project type identifier
 */
function detectProjectType(cwd) {
  try {
    const files = fs.readdirSync(cwd).map((f) => f.toLowerCase());

    // Check for specific academic document types
    for (const file of files) {
      if (file.includes("thesis")) return "thesis";
      if (file.includes("paper") && file.endsWith(".md")) return "paper";
      if (file.includes("assignment")) return "assignment";
      if (file.includes("case-study") || file.includes("casestudy"))
        return "case-study";
      if (file.includes("presentation") || file.endsWith(".pptx"))
        return "presentation";
    }

    // Check for research indicators
    const hasSourcesDir = fs.existsSync(path.join(cwd, "sources"));
    const hasResearchDir = fs.existsSync(path.join(cwd, "01-research"));
    if (hasSourcesDir || hasResearchDir) return "research";

    return "academic";
  } catch {
    return "unknown";
  }
}
