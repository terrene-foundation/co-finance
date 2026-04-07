# MCP Configurations for COL-F Projects

## Context Impact Warning

MCP servers consume context tokens. Keep the number of active MCPs low.

**Safe Limits**:

- <10 MCPs enabled per project
- <80 tools active

## Available Configurations

| Configuration       | MCPs | Context Cost | Use Case                                  |
| ------------------- | ---- | ------------ | ----------------------------------------- |
| `fnce-minimal.json` | 2    | ~10k         | Basic research and writing                |
| `fnce-dev.json`     | 3    | ~17k         | Active academic projects                  |
| `fnce-full.json`    | 4    | ~25k         | Full projects with extended reasoning     |

## Usage

### Copy to home directory

```bash
cp mcp-configs/fnce-dev.json ~/.claude.json
```

### Reference in Claude session

```bash
claude --mcp-config mcp-configs/fnce-dev.json
```

## MCP Categories

### Essential (Always Needed)

- **github**: Repository management (~8k tokens)
- **memory**: Session persistence (~2k tokens)

### Academic Projects

- **filesystem**: File operations for papers and research (~4k tokens)

### Extended Analysis

- **sequential-thinking**: Extended reasoning for complex analysis (~3k tokens)
