#!/usr/bin/env node
/**
 * Hook: pre-compact
 * Event: PreCompact
 * Purpose: Save critical context before compaction
 *
 * Exit Codes:
 *   0 = success (continue)
 *   2 = blocking error (stop tool execution)
 *   other = non-blocking error (warn and continue)
 */

const fs = require("fs");
const path = require("path");
const {
  resolveLearningDir,
  ensureLearningDir,
  logObservation: logLearningObservation,
  countObservations,
} = require("./lib/learning-utils");
const { detectActiveWorkspace } = require("./lib/workspace-utils");

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  try {
    const data = JSON.parse(input);
    savePreCompactState(data);
    // PreCompact hooks don't support hookSpecificOutput in schema
    console.log(JSON.stringify({ continue: true }));
    process.exit(0);
  } catch (error) {
    console.error(`[HOOK ERROR] ${error.message}`);
    console.log(JSON.stringify({ continue: true }));
    process.exit(1);
  }
});

function savePreCompactState(data) {
  // Sanitize session_id to prevent path traversal
  const session_id = (data.session_id || "").replace(/[^a-zA-Z0-9_-]/g, "_");
  const cwd = data.cwd;
  const homeDir = process.env.HOME || process.env.USERPROFILE;
  const checkpointDir = path.join(homeDir, ".claude", "checkpoints");
  const learningDir = resolveLearningDir(cwd);

  // Ensure directories exist
  [checkpointDir].forEach((dir) => {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch {}
  });
  ensureLearningDir(cwd);

  const checkpoint = {
    session_id,
    cwd,
    compactedAt: new Date().toISOString(),
    preservedContext: {
      // Critical items to preserve
      projectType: detectProjectType(cwd),
      activeDocuments: findActiveDocuments(cwd),
      recentlyModified: findRecentlyModified(cwd),
      academicPatterns: extractAcademicPatterns(cwd),
    },
  };

  try {
    // Save checkpoint
    const checkpointFile = path.join(
      checkpointDir,
      `${session_id}-${Date.now()}.json`,
    );
    fs.writeFileSync(checkpointFile, JSON.stringify(checkpoint, null, 2));

    // Log enriched connection_pattern observation for learning
    logLearningObservation(
      cwd,
      "connection_pattern",
      {
        projectType: checkpoint.preservedContext.projectType,
        active_documents: checkpoint.preservedContext.activeDocuments,
        academic_patterns: checkpoint.preservedContext.academicPatterns,
        recently_modified_count:
          checkpoint.preservedContext.recentlyModified.length,
      },
      {
        session_id,
      },
    );

    // --- Auto-checkpoint learning state (Phase 3) ---
    try {
      if (countObservations(learningDir) > 0) {
        const checkpointManager = require("../learning/checkpoint-manager");
        checkpointManager.saveCheckpoint(
          `pre-compact-${Date.now()}`,
          learningDir,
        );
      }
    } catch {}

    // ── Workspace: remind to save session notes before compaction ──────
    try {
      const ws = detectActiveWorkspace(cwd);
      if (ws) {
        console.error(
          `[WORKSPACE] Context compacting. Before losing context, write session notes to workspaces/${ws.name}/.session-notes (or run /wrapup).`,
        );
      }
    } catch {}

    // Clean up old checkpoints (keep last 10 per session)
    cleanupOldCheckpoints(checkpointDir, session_id, 10);

    return { checkpointed: true, path: checkpointFile };
  } catch (error) {
    return { checkpointed: false, error: error.message };
  }
}

/**
 * Detect the academic project type by checking for characteristic files.
 *
 * @param {string} cwd - Project root directory
 * @returns {string} Project type identifier
 */
function detectProjectType(cwd) {
  try {
    const files = fs.readdirSync(cwd).map((f) => f.toLowerCase());

    for (const file of files) {
      if (file.includes("thesis")) return "thesis";
      if (file.includes("paper") && file.endsWith(".md")) return "paper";
      if (file.includes("assignment")) return "assignment";
      if (file.includes("case-study") || file.includes("casestudy"))
        return "case-study";
      if (file.includes("presentation") || file.endsWith(".pptx"))
        return "presentation";
    }

    const hasSourcesDir = fs.existsSync(path.join(cwd, "sources"));
    const hasResearchDir = fs.existsSync(path.join(cwd, "01-research"));
    if (hasSourcesDir || hasResearchDir) return "research";

    return "academic";
  } catch {
    return "unknown";
  }
}

/**
 * Scan .md files for academic document structures.
 *
 * @param {string} cwd - Project root directory
 * @returns {Array} Active document descriptors
 */
function findActiveDocuments(cwd) {
  try {
    const documents = [];
    const files = fs.readdirSync(cwd).filter((f) => f.endsWith(".md"));

    for (const file of files.slice(0, 15)) {
      try {
        const content = fs.readFileSync(path.join(cwd, file), "utf8");
        const type = classifyDocument(content, file);
        if (type) {
          documents.push({ file, type });
        }
      } catch {}
    }

    return documents;
  } catch {
    return [];
  }
}

/**
 * Classify a markdown document by its content and filename.
 */
function classifyDocument(content, filename) {
  const lower = content.toLowerCase();
  const lowerName = filename.toLowerCase();

  if (lowerName.includes("thesis") || /\babstract\b/.test(lower) && /\bliterature review\b/.test(lower))
    return "thesis";
  if (lowerName.includes("paper") || /\babstract\b/.test(lower) && /\bmethodology\b/.test(lower))
    return "paper";
  if (lowerName.includes("assignment") || lowerName.includes("homework"))
    return "assignment";
  if (lowerName.includes("case-study") || lowerName.includes("casestudy"))
    return "case-study";
  if (/\bliterature review\b/.test(lower)) return "literature-review";
  if (/\banalysis\b/.test(lower) || /\bresults\b/.test(lower)) return "analysis";

  return null;
}

/**
 * Find recently modified .md files (within last hour).
 *
 * @param {string} cwd - Project root directory
 * @returns {Array<string>} Recently modified filenames
 */
function findRecentlyModified(cwd) {
  try {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const recentFiles = [];

    const files = fs.readdirSync(cwd).filter((f) => f.endsWith(".md"));

    for (const file of files) {
      try {
        const stats = fs.statSync(path.join(cwd, file));
        if (stats.mtime.getTime() > oneHourAgo) {
          recentFiles.push(file);
        }
      } catch {}
    }

    return recentFiles.slice(0, 10);
  } catch {
    return [];
  }
}

/**
 * Extract academic patterns from workspace markdown files.
 *
 * @param {string} cwd - Project root directory
 * @returns {Object} Detected academic patterns
 */
function extractAcademicPatterns(cwd) {
  const patterns = {
    hasLiteratureReview: false,
    hasMethodology: false,
    hasDataAnalysis: false,
    hasCitations: false,
    hasDraft: false,
  };

  try {
    const files = fs.readdirSync(cwd).filter((f) => f.endsWith(".md"));

    for (const file of files.slice(0, 15)) {
      try {
        const content = fs.readFileSync(path.join(cwd, file), "utf8");
        const lower = content.toLowerCase();

        if (/literature review/.test(lower)) patterns.hasLiteratureReview = true;
        if (/methodology/.test(lower)) patterns.hasMethodology = true;
        if (/\banalysis\b/.test(lower) || /\bresults\b/.test(lower))
          patterns.hasDataAnalysis = true;
        // Detect citation patterns like (Author, Year) or (Author Year)
        if (/\([A-Z][a-z]+,?\s+\d{4}\)/.test(content))
          patterns.hasCitations = true;

        // Check for "draft" in filename
        if (file.toLowerCase().includes("draft")) patterns.hasDraft = true;
      } catch {}
    }
  } catch {}

  return patterns;
}

function cleanupOldCheckpoints(checkpointDir, sessionId, keepCount) {
  try {
    const prefix = `${sessionId}-`;
    const files = fs
      .readdirSync(checkpointDir)
      .filter((f) => f.startsWith(prefix))
      .map((f) => ({
        name: f,
        path: path.join(checkpointDir, f),
        mtime: fs.statSync(path.join(checkpointDir, f)).mtime,
      }))
      .sort((a, b) => b.mtime - a.mtime);

    // Remove files beyond keepCount
    for (const file of files.slice(keepCount)) {
      try {
        fs.unlinkSync(file.path);
      } catch {}
    }
  } catch {}
}
