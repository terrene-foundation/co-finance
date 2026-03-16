# Academic Agent Orchestration Rules

## Scope

These rules govern when and how specialized academic agents are used to support finance students in their studies, research, and writing.

## RECOMMENDED Delegations

### Rule 1: Peer Review After Writing

After completing or significantly revising academic writing (essays, reports, paper sections), you SHOULD:

1. Delegate to **peer-reviewer** for academic writing review
2. Wait for review completion before proceeding
3. Address any findings (clarity, argument structure, evidence gaps) before moving to the next section

**Exception**: Student explicitly says "skip review"

### Rule 2: Citation Check Before Submission

Before finalizing any paper, thesis chapter, or assignment for submission, you SHOULD:

1. Delegate to **citation-specialist** for citation and reference audit
2. Verify all in-text citations have corresponding reference list entries
3. Confirm citation format consistency (APA, Chicago, or as required by the course)
4. Flag any claims that lack supporting references

**Exception**: Student may skip citation check for informal drafts or personal notes

### Rule 3: Course Tutor for Domain Work

When working on subject-specific questions, calculations, or analysis, you SHOULD consult the appropriate tutor:

- **fnce101-tutor**: For introductory finance concepts (time value of money, basic valuation, financial statements)
- **corporate-finance-tutor**: For capital budgeting, capital structure, dividend policy, M&A
- **international-finance-tutor**: For exchange rates, international capital markets, sovereign risk, trade finance
- **fmi-tutor**: For financial markets and investments (portfolio theory, asset pricing, derivatives, fixed income)

**Applies when**:

- Answering conceptual finance questions
- Working through problem sets or calculations
- Explaining theory for essays or research papers
- Analyzing case studies

### Rule 4: Analysis Chain for Complex Assignments

For assignments requiring multi-step analysis or research design, follow this chain:

1. **deep-analyst** → Understand the full scope of the assignment and identify potential pitfalls
2. **assignment-analyst** → Break down requirements, identify deliverables, and plan the structure
3. Then the appropriate tutor for subject-matter guidance

**Applies when**:

- Research papers or thesis chapters requiring original analysis
- Multi-part assignments spanning several finance topics
- Case studies with ambiguous or open-ended questions
- Group projects requiring a division of work

### Rule 5: Parallel Execution for Independent Operations

When multiple independent research tasks are needed, you SHOULD:

1. Launch agents in parallel using Task tool
2. Wait for all to complete
3. Aggregate results

**Example independent operations**:

- Searching multiple academic databases simultaneously
- Reviewing several source documents at once
- Checking citations across different sections of a paper

## Examples

### Correct: Sequential with Review

```
Student asks for help drafting a literature review
   → Agent helps draft the section
   → Agent delegates to peer-reviewer for writing quality
   → Agent addresses review findings (argument flow, missing sources)
   → Agent delegates to citation-specialist for reference check
   → Only then moves to next section
```

### Suboptimal: Skipping Review

```
Student asks for help drafting a literature review
   → Agent helps draft the section
   → Agent moves to next section (skipped peer review and citation check)
```

## RECOMMENDED Practices

### Peer Review

Peer review after writing is strongly recommended for catching unclear arguments, weak evidence, and structural issues early.

### Citation Check Before Submission

Citation review before finalizing is strongly recommended to avoid accidental plagiarism, missing references, or inconsistent formatting.

### Tutor Consultation

When a well-established concept, formula, or framework exists in the finance literature, refer students to the authoritative source rather than improvising an explanation.

### Parallel When Possible

If research tasks are independent, run them in parallel for efficiency.

## Quality Gates

### Checkpoint 1: After Planning

- [ ] Assignment requirements understood
- [ ] Research question or thesis articulated
- [ ] Outline or structure approved

### Checkpoint 2: After Drafting

- [ ] Peer review completed
- [ ] Arguments supported by evidence
- [ ] Appropriate use of financial terminology

### Checkpoint 3: Before Submission

- [ ] Citation check passed
- [ ] All references properly formatted
- [ ] Disclaimers included where required (see `disclaimer-compliance.md`)

### Checkpoint 4: Final Review

- [ ] Paper reads coherently from introduction to conclusion
- [ ] All assignment requirements addressed
- [ ] Ready for instructor submission
