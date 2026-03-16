/**
 * Shared utility: Workspace detection and phase derivation.
 *
 * Used by session-start.js, user-prompt-rules-reminder.js, and phase commands.
 * Framework-agnostic — works with any academic finance project.
 */

const fs = require("fs");
const path = require("path");

/**
 * Detect the active workspace under workspaces/.
 * Returns the most recently modified project directory, or null if none.
 *
 * @param {string} cwd - Project root directory
 * @returns {{ name: string, path: string } | null}
 */
function detectActiveWorkspace(cwd) {
  const wsDir = path.join(cwd, "workspaces");
  try {
    const entries = fs.readdirSync(wsDir, { withFileTypes: true });
    const projects = entries
      .filter((e) => e.isDirectory() && e.name !== "instructions")
      .map((e) => {
        const fullPath = path.join(wsDir, e.name);
        try {
          const stat = fs.statSync(fullPath);
          return { name: e.name, path: fullPath, mtime: stat.mtime.getTime() };
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .sort((a, b) => b.mtime - a.mtime);

    return projects.length > 0
      ? { name: projects[0].name, path: projects[0].path }
      : null;
  } catch {
    return null;
  }
}

/**
 * Derive the current phase from workspace filesystem state.
 *
 * Academic phases (evaluated in reverse order — latest phase takes priority):
 * - Has 05-final/ with files -> "05-final"
 * - Has 04-review/ with files -> "04-review"
 * - Has 03-drafts/ with files OR todos/completed/ with files -> "03-drafting"
 * - Has todos/active/ with files -> "02-planning"
 * - Has 01-research/ or 02-outline/ -> "01-research"
 * - Has sources/ with files -> "01-research"
 * - Empty workspace -> "not-started"
 *
 * @param {string} workspacePath - Absolute path to workspace directory
 * @param {string} cwd - Project root (for checking global artifacts)
 * @returns {string} Phase identifier
 */
function derivePhase(workspacePath, cwd) {
  // Check for phase 05 artifacts (final submission)
  if (dirHasFiles(path.join(workspacePath, "05-final"))) {
    return "05-final";
  }

  // Check for phase 04 artifacts (review/revision)
  if (dirHasFiles(path.join(workspacePath, "04-review"))) {
    return "04-review";
  }

  // Check for drafting activity (phase 03)
  const completedCount = countFiles(
    path.join(workspacePath, "todos", "completed"),
  );
  if (
    dirHasFiles(path.join(workspacePath, "03-drafts")) ||
    completedCount > 0
  ) {
    return "03-drafting";
  }

  // Check for todos (phase 02 — planning/outlining)
  const activeCount = countFiles(path.join(workspacePath, "todos", "active"));
  if (activeCount > 0) {
    return "02-planning";
  }

  // Check for research artifacts (phase 01)
  if (
    dirHasFiles(path.join(workspacePath, "01-research")) ||
    dirHasFiles(path.join(workspacePath, "02-outline")) ||
    dirHasFiles(path.join(workspacePath, "sources"))
  ) {
    return "01-research";
  }

  return "not-started";
}

/**
 * Get todo progress counts.
 *
 * @param {string} workspacePath
 * @returns {{ active: number, completed: number }}
 */
function getTodoProgress(workspacePath) {
  return {
    active: countFiles(path.join(workspacePath, "todos", "active")),
    completed: countFiles(path.join(workspacePath, "todos", "completed")),
  };
}

/**
 * Read .session-notes content if present.
 *
 * @param {string} workspacePath
 * @returns {{ content: string, stale: boolean, age: string } | null}
 */
function getSessionNotes(workspacePath) {
  const notesPath = path.join(workspacePath, ".session-notes");
  try {
    const content = fs.readFileSync(notesPath, "utf8");
    const stat = fs.statSync(notesPath);
    const ageMs = Date.now() - stat.mtime.getTime();
    const ageHours = Math.round(ageMs / (1000 * 60 * 60));
    const stale = ageMs > 24 * 60 * 60 * 1000;

    let age;
    if (ageHours < 1) age = "< 1h ago";
    else if (ageHours < 24) age = `${ageHours}h ago`;
    else age = `${Math.round(ageHours / 24)}d ago`;

    return { content: content.trim(), stale, age };
  } catch {
    return null;
  }
}

/**
 * Build a compact 1-line workspace summary for per-turn injection.
 *
 * @param {string} cwd
 * @returns {string | null}
 */
function buildWorkspaceSummary(cwd) {
  const ws = detectActiveWorkspace(cwd);
  if (!ws) return null;

  const phase = derivePhase(ws.path, cwd);
  const todos = getTodoProgress(ws.path);

  const parts = [ws.name, `Phase: ${phase}`];
  if (todos.active > 0 || todos.completed > 0) {
    parts.push(`Todos: ${todos.active} active / ${todos.completed} done`);
  }

  return parts.join(" | ");
}

// ── Helpers ────────────────────────────────────────────────────────────

function dirHasFiles(dirPath) {
  try {
    const entries = fs.readdirSync(dirPath);
    return entries.some((e) => !e.startsWith("."));
  } catch {
    return false;
  }
}

function countFiles(dirPath) {
  try {
    return fs.readdirSync(dirPath).filter((e) => !e.startsWith(".")).length;
  } catch {
    return 0;
  }
}

module.exports = {
  detectActiveWorkspace,
  derivePhase,
  getTodoProgress,
  getSessionNotes,
  buildWorkspaceSummary,
  dirHasFiles,
  countFiles,
};
