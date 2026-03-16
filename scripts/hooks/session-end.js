#!/usr/bin/env node
/**
 * Hook: session-end
 * Event: SessionEnd
 * Purpose: Save session state for future resumption
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

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  try {
    const data = JSON.parse(input);
    saveSession(data);
    // SessionEnd hooks don't support hookSpecificOutput in schema
    console.log(JSON.stringify({ continue: true }));
    process.exit(0);
  } catch (error) {
    console.error(`[HOOK ERROR] ${error.message}`);
    console.log(JSON.stringify({ continue: true }));
    process.exit(1);
  }
});

function saveSession(data) {
  // Sanitize session_id to prevent path traversal
  const session_id = (data.session_id || "").replace(/[^a-zA-Z0-9_-]/g, "_");
  const cwd = data.cwd;
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

  // Collect session statistics
  const sessionData = {
    session_id,
    cwd,
    endedAt: new Date().toISOString(),
    stats: collectSessionStats(cwd),
  };

  try {
    // Save to session-specific file
    const sessionFile = path.join(sessionDir, `${session_id}.json`);
    fs.writeFileSync(sessionFile, JSON.stringify(sessionData, null, 2));

    // Save as last session for quick resume
    const lastSessionFile = path.join(sessionDir, "last-session.json");
    fs.writeFileSync(lastSessionFile, JSON.stringify(sessionData, null, 2));

    // Log enriched session_summary observation for learning
    logLearningObservation(
      cwd,
      "session_summary",
      {
        file_counts: sessionData.stats,
        projectType: detectProjectType(cwd),
        duration_estimate: estimateSessionDuration(session_id, sessionDir),
        identity: "fnce-co-claude",
      },
      {
        session_id,
      },
    );

    // --- Auto-processing pipeline (Phase 3) ---
    try {
      autoProcessLearning(learningDir);
    } catch {}

    // --- Feedback loop: render instincts to rules file (Phase 4) ---
    try {
      writeInstinctsRule(cwd, learningDir);
    } catch {}

    // Clean up old sessions (keep last 20)
    cleanupOldSessions(sessionDir, 20);

    return { saved: true, path: sessionFile };
  } catch (error) {
    return { saved: false, error: error.message };
  }
}

// Scans top-level cwd only (not subdirectories) for performance in hooks.
function collectSessionStats(cwd) {
  try {
    const stats = {
      markdownFiles: 0,
      draftFiles: 0,
      sourceFiles: 0,
    };

    // Count .md files
    const files = fs.readdirSync(cwd);
    const mdFiles = files.filter((f) => f.endsWith(".md"));
    stats.markdownFiles = mdFiles.length;

    // Count files with "draft" in the name
    for (const file of mdFiles) {
      if (file.toLowerCase().includes("draft")) {
        stats.draftFiles++;
      }
    }

    // Count files in sources/ directory
    const sourcesDir = path.join(cwd, "sources");
    try {
      const sourceEntries = fs.readdirSync(sourcesDir);
      stats.sourceFiles = sourceEntries.filter((e) => !e.startsWith(".")).length;
    } catch {}

    return stats;
  } catch {
    return {};
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

function estimateSessionDuration(sessionId, sessionDir) {
  try {
    // Check if there's a session start timestamp from the session file
    const sessionFile = path.join(sessionDir, `${sessionId}.json`);
    if (fs.existsSync(sessionFile)) {
      const data = JSON.parse(fs.readFileSync(sessionFile, "utf8"));
      if (data.startedAt) {
        const start = new Date(data.startedAt).getTime();
        const end = Date.now();
        return Math.round((end - start) / 1000); // seconds
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Auto-process instincts and auto-evolve at session end.
 * Only runs when enough observations have accumulated (>= 10).
 * Pure file I/O, ~200ms for 1000 observations.
 */
function autoProcessLearning(learningDir) {
  const observationCount = countObservations(learningDir);
  if (observationCount < 10) return;

  // Auto-process: analyze observations and generate instincts
  const processor = require("../learning/instinct-processor");
  const obs = processor.loadObservations(learningDir);

  const wp = processor.analyzeWorkflowPatterns(obs);
  if (wp.length > 0) {
    const wpInstincts = processor.generateInstincts(wp);
    processor.saveInstincts(wpInstincts, "workflow-patterns", learningDir);
  }

  const efp = processor.analyzeErrorFixPatterns(obs);
  if (efp.length > 0) {
    const efpInstincts = processor.generateInstincts(efp);
    processor.saveInstincts(efpInstincts, "error-fixes", learningDir);
  }

  const fp = processor.analyzeFrameworkPatterns(obs);
  if (fp.length > 0) {
    const fpInstincts = processor.generateInstincts(fp);
    processor.saveInstincts(fpInstincts, "framework-selection", learningDir);
  }

  // Auto-evolve: promote high-confidence instincts to skills/commands
  const evolver = require("../learning/instinct-evolver");
  const candidates = evolver.getCandidates(learningDir);
  if (candidates.skill.length > 0 || candidates.command.length > 0) {
    evolver.autoEvolve(learningDir);
  }
}

/**
 * Render learned instincts to .claude/rules/learned-instincts.md
 * so Claude Code auto-loads them on the next session.
 */
function writeInstinctsRule(cwd, learningDir) {
  const { renderInstincts } = require("./lib/instinct-renderer");
  const markdown = renderInstincts(learningDir);
  if (!markdown) return;

  const rulesDir = path.join(cwd, ".claude", "rules");
  try {
    fs.mkdirSync(rulesDir, { recursive: true });
  } catch {}

  const rulePath = path.join(rulesDir, "learned-instincts.md");
  fs.writeFileSync(rulePath, markdown);
}

function cleanupOldSessions(sessionDir, keepCount) {
  try {
    const files = fs
      .readdirSync(sessionDir)
      .filter((f) => f.endsWith(".json") && f !== "last-session.json")
      .map((f) => ({
        name: f,
        path: path.join(sessionDir, f),
        mtime: fs.statSync(path.join(sessionDir, f)).mtime,
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
