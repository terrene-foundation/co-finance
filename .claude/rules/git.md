# Version Control for Academic Work

## Scope

These rules apply to students using git to manage research papers, assignments, thesis drafts, and project files. Version control helps you track changes, recover earlier drafts, and collaborate with classmates on group projects.

## MUST Rules

### 1. Meaningful Commit Messages

Commit messages MUST describe what changed in terms that make sense when you look back later.

**Format**: `type: brief description of what changed`

**Types**:

- `draft`: Writing or revising content
- `data`: Adding or updating datasets
- `analysis`: Adding or updating calculations and analysis
- `refs`: Adding or updating references and citations
- `slides`: Working on presentation files
- `fix`: Correcting errors or addressing feedback

**Examples**:

```
draft: add literature review section on EMH
draft: revise methodology to address advisor feedback
data: add monthly returns dataset from WRDS
analysis: complete portfolio optimization calculations
refs: add missing citations from Chapter 3
slides: update final presentation with new charts
fix: correct annualization formula in Section 4.2
```

**Incorrect**:

```
"update"
"changes"
"stuff"
"final version" (there is never a final version)
"FINAL final v2 REAL"
```

### 2. Don't Commit Sensitive Data

MUST NOT include sensitive information in your repository:

- API keys or passwords
- Personal financial data (real account balances, SSNs, etc.)
- Licensed data that cannot be redistributed (raw Bloomberg or WRDS downloads)
- `.env` files containing credentials

**What to do instead**:

- Add `.env` to your `.gitignore` file
- Keep licensed datasets in a separate folder excluded from version control
- Use a `.gitignore` file to prevent accidental inclusion of data files (e.g., `*.csv`, `*.xlsx` if they contain licensed data)

### 3. Use Descriptive File Names

Academic files MUST follow a clear naming convention so you (and collaborators) can find things easily.

**Recommended naming patterns**:

```
thesis/
  ch01-introduction.tex
  ch02-literature-review.tex
  ch03-methodology.tex
  ch04-results.tex
  ch05-conclusion.tex
  references.bib

assignments/
  ps01-time-value-of-money.pdf
  ps02-bond-valuation.pdf
  case-study-apple-dcf.docx

data/
  README.md  (describes data sources, not the actual licensed data)

presentations/
  midterm-presentation.pptx
  final-defense.pptx
```

**Incorrect**:

```
Document1.docx
Untitled.xlsx
final.pdf
final_final.pdf
final_REAL.pdf
```

### 4. Commit Regularly

Commit your work frequently — at least at the end of each working session. This gives you a safety net to recover earlier versions if something goes wrong.

**Good commit rhythm**:

- After completing a section or subsection
- After making significant revisions
- Before and after receiving feedback
- At the end of each work session

## RECOMMENDED Practices

### Use Branches for Major Revisions

If you are about to make a large structural change to your paper (e.g., reorganizing chapters, rewriting the methodology), consider creating a branch first. This lets you experiment without risking your stable draft.

**Example**:

```
git branch revision/restructure-methodology
git checkout revision/restructure-methodology
```

If the revision works out, merge it back. If not, you can return to your original version.

### Keep a Clean Main Branch

Your main branch should always contain your best current draft — the version you would be comfortable submitting if asked.

### Use .gitignore for Large and Licensed Files

Create a `.gitignore` file to exclude files that should not be tracked:

```
# Licensed data (do not redistribute)
data/raw/*.csv
data/raw/*.xlsx

# Credentials
.env

# Temporary files
*.tmp
*~
.DS_Store

# Compiled LaTeX output (regenerate from source)
*.aux
*.log
*.out
*.synctex.gz
```

## Pre-Commit Checklist

Before each commit, quickly verify:

- [ ] No sensitive data (API keys, personal financial info, licensed datasets) is included
- [ ] Commit message clearly describes what changed
- [ ] Files are named descriptively

## Exceptions

These guidelines are intentionally simple. If you are working on a collaborative research project with more complex needs (multiple contributors, continuous integration for LaTeX builds, etc.), adapt the workflow accordingly — but the principles of meaningful messages, no sensitive data, and regular commits always apply.
