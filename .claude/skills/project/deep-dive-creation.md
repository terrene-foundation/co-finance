# Deep-Dive Educational Content Creation

Templates, quality standards, and checklists for creating pedagogically structured deep-dive materials for International Finance classroom use. Derived from the 2026 Oil-Trade-Monetary Policy Triangle project.

## Document Progression Pattern

A complete deep dive follows this sequence:

```
01 — Theoretical Framework    (concepts + analogies + trilemma mapping)
02 — Primary Shock Channel    (step-by-step transmission + worked example)
03 — Secondary Shock Channel  (compounding effects + dollar paradox)
04 — Central Bank Analysis    (5 banks compared + Volcker vs Burns debate)
05 — Country Case Studies     (5 countries + comparative summary table)
06 — Historical Comparison    (5 parallels + "what's genuinely new")
07 — Discussion Guide         (50-75 min session: questions, debates, activities)
08 — Interconnection Map      (causal webs + reinforcing/offsetting effects)
```

Each document builds on prior documents. Prerequisites must link to ALL prior docs individually.

---

## Document Templates

### Template: Theoretical Framework

```markdown
# [Framework Name]: [Subtitle]

## Learning Objectives

- **Define** [key concept] (Remember)
- **Explain** [why it matters] (Understand)
- **Apply** [framework to classify countries] (Apply)
- **Analyze** [how the crisis creates a parallel dilemma] (Analyze)

## Prerequisites

- [List specific prior knowledge needed]

> **Disclaimer**: This content is for educational and informational purposes only...

---

## Part 1: [Core Concept]

### What It Is

[Plain-language definition]

### Why It Works This Way

[Logical explanation with worked example]

### Real-World Analogy

[Relatable analogy anchoring the abstract concept]

### How Major Economies Are Positioned

[Table: Country | Choice | What they sacrifice]

### Why This Matters Right Now

[Connect theory to current events with specific examples]

## Part 2: [Adapted Framework for Current Crisis]

[Show how theory maps to the specific situation]

### Worked Example

[Step-by-step with specific data]

## Part 3: Key Concepts Students Need

[Define each technical term with analogy]

## Key Takeaways

[Numbered list, 4-5 points]

## Sources

[Named sources with dates]
```

### Template: Discussion Guide

```markdown
# Class Discussion Guide: [Topic]

_Ready-to-use discussion materials for a [50-75] minute class session_

> **Disclaimer**: [Educational disclaimer]

---

## Session Structure

| Time      | Activity                        | Purpose              |
| --------- | ------------------------------- | -------------------- |
| 0-10 min  | Opening questions (whole class) | Warm up              |
| 10-25 min | Conceptual questions (pairs)    | Connect to theory    |
| 25-45 min | Group activity                  | Deep engagement      |
| 45-60 min | Debate                          | Synthesize positions |
| 60-75 min | Wrap-up (whole class)           | Key lessons          |

## 1. Opening Questions (Accessible)

[Questions requiring no prior theory — get students thinking from human/business perspective]

_Purpose_: [Why this question works]

## 2. Conceptual Questions

[Questions connecting events to theory, with expected answer directions]

## 3. Analytical Questions

[Harder questions requiring synthesis across multiple concepts]

## 4. Debate Prompts

### Debate A: [Title]

**Resolved**: "[Clear proposition]"
**For**: [3-4 bullet arguments]
**Against**: [3-4 bullet arguments]

## 5. Group Activities

### Activity A: [Title] ([duration])

**Setup**: [How to organize]
**Task**: [What students do]
**Debrief**: [Discussion after]

## 6. Further Reading

[Academic concepts + accessible sources]
```

---

## Quality Checklist

Run this checklist against every deep-dive document before publishing:

### Content Quality

- [ ] Learning objectives use Bloom's taxonomy verbs at 3+ levels
- [ ] Prerequisites link to each prior document individually (not a range)
- [ ] Educational disclaimer present after prerequisites
- [ ] Every major concept has a real-world analogy
- [ ] At least one worked example with step-by-step calculation
- [ ] "Why" explained before "how" for every concept
- [ ] Progressive difficulty: simple before complex
- [ ] Key takeaways section summarizes main points

### Data Integrity

- [ ] All figures consistent across documents (check oil %, tariff rates, market moves)
- [ ] Data ranges noted with explanation when multiple sources disagree
- [ ] Spot vs. average vs. peak values clearly distinguished
- [ ] All acronyms expanded on first use (BRICS, IEEPA, BOJ, etc.)

### Source Quality

- [ ] Sources named with publication and date
- [ ] No anonymous attributions ("a strategist") — use names
- [ ] Wikipedia citations supplemented with primary sources
- [ ] Self-reported figures noted as such (e.g., BRICS settlement claims)

### Pedagogical Completeness

- [ ] Discussion questions have expected answer directions
- [ ] Debate prompts include arguments for BOTH sides
- [ ] Group activities include setup, task, AND debrief
- [ ] Counterarguments and limitations acknowledged

### Compliance

- [ ] Educational disclaimer on every document
- [ ] No language implying investment advice
- [ ] Past tense for historical performance
- [ ] Hypothetical scenarios clearly labeled

---

## Common Mistakes to Avoid

### 1. Inconsistent Data Across Documents

**Problem**: Oil price stated as "25-35%" in one doc and "50-70%" in another.
**Fix**: Reconcile before writing. Pick one authoritative figure and use it everywhere. Note the range once.

### 2. Broken Prerequisite Links

**Problem**: "[01-04](01-theoretical-framework.md)" — links to only one file.
**Fix**: Link to each document individually with titles.

### 3. Ambiguous Vote Descriptions

**Problem**: "5-4 (cut vs. hold)" — which side won?
**Fix**: "5 voted to hold, 4 voted to cut" — explicit.

### 4. Jargon Without Definition

**Problem**: "BRICS de-dollarization trend" — what is BRICS?
**Fix**: "BRICS (Brazil, Russia, India, China, South Africa) de-dollarization trend"

### 5. Anonymous Attribution

**Problem**: "A veteran Wall Street strategist raised stagflation odds..."
**Fix**: "Barry Bannister, chief equity strategist at Stifel, raised stagflation odds..."

### 6. Missing Disclaimers

**Problem**: Educational financial content without disclaimer.
**Fix**: Add after prerequisites in every document:

```
> **Disclaimer**: This content is for educational and informational purposes only and does not constitute financial advice, investment advice, or a recommendation to buy, sell, or hold any security. All market data, prices, and scenarios discussed are for classroom analysis. Past performance is not indicative of future results.
```

---

## Workspace File Organization

```
workspaces/<project>/
├── briefs/
│   └── 01-product-brief.md          # User input
├── 01-analysis/
│   ├── 01-research/
│   │   ├── 01-[event-name].md       # Individual event research
│   │   ├── 02-[event-name].md
│   │   └── ...
│   ├── 02-summary.md                # Master summary with themes
│   └── 03-deep-dive/
│       ├── 01-theoretical-framework.md
│       ├── 02-[primary-channel].md
│       ├── 03-[secondary-channel].md
│       ├── 04-[policy-analysis].md
│       ├── 05-country-case-studies.md
│       ├── 06-historical-comparison.md
│       ├── 07-discussion-guide.md
│       └── 08-interconnection-map.md
├── 02-plans/                         # Implementation plans
├── 03-user-flows/                    # User flow descriptions
├── 04-validate/
│   └── 01-redteam-report.md         # Red team findings
└── todos/
    ├── active/                       # Remaining work
    └── completed/                    # Finished tasks
```
