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
      frameworkInUse: detectFramework(cwd),
      activeWorkflows: findActiveWorkflows(cwd),
      recentlyModified: findRecentlyModified(cwd),
      criticalPatterns: extractCriticalPatterns(cwd),
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
        framework: checkpoint.preservedContext.frameworkInUse,
        active_workflows: checkpoint.preservedContext.activeWorkflows,
        critical_patterns: checkpoint.preservedContext.criticalPatterns,
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

function detectFramework(cwd) {
  try {
    const files = fs.readdirSync(cwd).filter((f) => f.endsWith(".py"));

    for (const file of files.slice(0, 10)) {
      try {
        const content = fs.readFileSync(path.join(cwd, file), "utf8");
        if (/import pandas/.test(content) || /import yfinance/.test(content))
          return "market-data";
        if (/import numpy/.test(content) || /import scipy/.test(content))
          return "quantitative";
        if (
          /import backtrader/.test(content) ||
          /import QuantLib/.test(content)
        )
          return "backtesting";
        if (/import matplotlib/.test(content) || /import plotly/.test(content))
          return "visualization";
      } catch {}
    }

    return "financial";
  } catch {
    return "unknown";
  }
}

function findActiveWorkflows(cwd) {
  try {
    const workflows = [];
    const files = fs.readdirSync(cwd).filter((f) => f.endsWith(".py"));

    for (const file of files.slice(0, 10)) {
      try {
        const content = fs.readFileSync(path.join(cwd, file), "utf8");
        if (/import pandas|import yfinance|import backtrader/.test(content)) {
          // Extract analysis pipeline name if possible
          const match = content.match(/(?:def|class)\s+(\w+)/);
          workflows.push({
            file,
            name: match ? match[1] : "unnamed",
          });
        }
      } catch {}
    }

    return workflows;
  } catch {
    return [];
  }
}

function findRecentlyModified(cwd) {
  try {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const recentFiles = [];

    const files = fs
      .readdirSync(cwd)
      .filter((f) => f.endsWith(".py") || f.endsWith(".md"));

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

function extractCriticalPatterns(cwd) {
  const patterns = {
    hasMarketDataPipeline: false,
    hasPortfolioAnalysis: false,
    hasBacktesting: false,
    hasVisualization: false,
    hasRiskMetrics: false,
  };

  try {
    const files = fs.readdirSync(cwd).filter((f) => f.endsWith(".py"));

    for (const file of files.slice(0, 10)) {
      try {
        const content = fs.readFileSync(path.join(cwd, file), "utf8");
        if (/import yfinance|import pandas_datareader/.test(content))
          patterns.hasMarketDataPipeline = true;
        if (/import cvxpy|portfolio.*optim/.test(content))
          patterns.hasPortfolioAnalysis = true;
        if (/import backtrader|import QuantLib/.test(content))
          patterns.hasBacktesting = true;
        if (/import matplotlib|import plotly|import mplfinance/.test(content))
          patterns.hasVisualization = true;
        if (/sharpe|volatility|var.*confidence/.test(content))
          patterns.hasRiskMetrics = true;
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
