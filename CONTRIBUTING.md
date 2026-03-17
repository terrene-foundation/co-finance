# Contributing to CO for Finance (COF)

We welcome contributions. This document provides guidelines for contributing to the project.

COF is a domain application of Cognitive Orchestration (CO), an open methodology published by the Terrene Foundation under CC BY 4.0. This repository (the COF implementation) is licensed under Apache 2.0.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Create a new branch for your feature or bugfix

## CO Specification Compliance

All contributions must maintain conformance with the CO specification v1.1. This means:

- **Layer 1 (Intent)**: New agents must carry domain-specific institutional knowledge and have clear routing rules
- **Layer 2 (Context)**: New knowledge must fit the progressive disclosure hierarchy (CLAUDE.md -> rules -> skills -> workspace)
- **Layer 3 (Guardrails)**: Critical rules must have hard enforcement (hooks); advisory rules use soft enforcement (rule files)
- **Layer 4 (Instructions)**: New workflows must include approval gates requiring human judgment
- **Layer 5 (Learning)**: Observation mechanisms must preserve the human-approval requirement before pattern formalization
- **Principle 8**: All changes must preserve the student's authentic voice and require AI assistance disclosure

See `docs/co-conformance.md` for the current conformance checklist.

## Development Process

### Code Style

Hook scripts follow standard JavaScript conventions. Use consistent formatting with the existing codebase.

### Testing

Test hook scripts by running them with sample JSON input on stdin. Verify that:
- Hooks exit with code 0 on success
- Hooks produce valid JSON on stdout
- Timeout handling works correctly

### Architecture Decision Records

For significant changes (new agents, new hooks, workflow modifications), please document them:

1. Describe the change in your pull request
2. Explain the rationale and trade-offs
3. Update relevant documentation (CLAUDE.md, docs/)

## Pull Request Process

1. Update CLAUDE.md if you add agents, skills, rules, or commands
2. Update `docs/co-conformance.md` if your change affects CO conformance
3. Ensure all hooks exit cleanly
4. Update documentation as needed
5. Request review from maintainers

## License

This project is licensed under the Apache License, Version 2.0. Copyright 2026 Terrene Foundation. By submitting a contribution, you agree that your contribution will be licensed under the same terms. See the [LICENSE](LICENSE) file for details.

## Code of Conduct

Be respectful and professional in all interactions. We strive to maintain a welcoming environment for all contributors.
