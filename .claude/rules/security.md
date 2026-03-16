# Data Privacy and Academic Ethics

## Scope

These rules apply to all academic work and interactions involving financial data, research materials, and collaborative assignments.

## MUST Rules

### 1. Protect Personal Financial Information

All assignments involving personal finance topics (budgeting exercises, portfolio simulations, financial planning cases) MUST use hypothetical or anonymized data. Never include real personal financial details — yours or anyone else's.

**Applies to**:

- Investment account balances or holdings
- Bank account information
- Social Security numbers, tax IDs, or government identifiers
- Salary, income, or net worth figures of real individuals
- Credit card numbers or loan account details

**Correct**: "Assume an investor with a $100,000 portfolio allocated 60% to equities and 40% to bonds."
**Incorrect**: Including a screenshot of your actual brokerage account in an assignment.

**Enforced by**: peer-reviewer
**Violation**: Must remove before submission

### 2. Respect Bloomberg Terminal and Database Licensing

Data obtained from Bloomberg terminals, WRDS, Refinitiv, or other licensed academic databases MUST be used in accordance with the provider's terms of service.

**Key restrictions to observe**:

- **Bloomberg**: Do not redistribute raw Bloomberg data in bulk. You may include limited excerpts (tables, charts) in academic papers with proper attribution. Do not share terminal login credentials.
- **WRDS / CRSP / Compustat**: Data is licensed to your university. Do not share raw datasets outside your institution. Cite properly in your work.
- **Refinitiv / Datastream**: Similar institutional license restrictions apply. Do not upload raw data to public repositories.

**Correct**: Including a summary table of 10 stock returns in your paper, citing "Source: CRSP via WRDS."
**Incorrect**: Uploading a full CRSP dataset to a public GitHub repository or sharing it via email outside your university.

**Enforced by**: peer-reviewer
**Violation**: Must fix before submission

### 3. Keep API Keys and Credentials Private

If you use any data APIs (FRED, Yahoo Finance, Polygon, Alpha Vantage), MUST keep API keys and login credentials private.

- Never include API keys in submitted assignments or shared documents.
- Never commit API keys to version control (e.g., git repositories).
- If sharing project files with classmates, remove or redact any credentials first.

**Enforced by**: peer-reviewer
**Violation**: Must fix immediately

### 4. Maintain Academic Integrity

All submitted work MUST be your own. This applies to all aspects of academic honesty:

- **Do not submit others' work as your own**: This includes papers, analyses, spreadsheets, or presentations produced by classmates, previous students, or AI tools without proper attribution and in accordance with your institution's AI use policy.
- **Cite all sources**: Every idea, data point, formula, or argument drawn from another source must be cited. See `disclaimer-compliance.md` and your course's citation requirements.
- **Disclose collaboration**: If you worked with classmates, note their contributions. If your institution allows AI assistance, disclose it as required.
- **Do not share your work for others to submit**: Making your assignments available for others to copy is also an integrity violation.

**Enforced by**: citation-specialist, peer-reviewer
**Violation**: Must fix before submission — academic integrity violations can result in course failure or disciplinary action

### 5. Handle Sensitive Corporate Information Appropriately

If your coursework involves real company data from case studies, internship experience, or guest lectures:

- Do not disclose non-public information obtained through internships or personal connections.
- Clearly distinguish between publicly available information (SEC filings, press releases) and private information.
- If in doubt about whether information is public, treat it as confidential.

**Enforced by**: peer-reviewer
**Violation**: Must fix before submission

## MUST NOT Rules

### 1. No Real Personal Data in Assignments

MUST NOT include real personal financial information (yours or others') in any submitted academic work.

**Consequence**: Must remove immediately

### 2. No Redistribution of Licensed Databases

MUST NOT redistribute, publicly share, or upload raw data from subscription databases (Bloomberg, WRDS, Refinitiv) beyond what the license permits.

**Consequence**: Must remove and may trigger institutional review

### 3. No Sharing of Credentials

MUST NOT share Bloomberg terminal logins, WRDS credentials, API keys, or other access credentials with unauthorized individuals.

**Consequence**: Must change credentials immediately

### 4. No Submission of Others' Work

MUST NOT submit work produced by others (classmates, previous students, online sources, AI tools) as your own without proper attribution and compliance with your institution's academic honesty policy.

**Consequence**: Academic integrity violation — may result in course failure or disciplinary proceedings

## Exceptions

Exceptions to these rules may apply when:

1. An instructor explicitly requires the use of real personal data in a controlled exercise (e.g., a personal budgeting assignment with privacy protections in place)
2. The institution has a specific data-sharing agreement that permits broader use of licensed data
3. The course policy explicitly permits certain forms of collaboration or AI assistance — follow the policy as stated
