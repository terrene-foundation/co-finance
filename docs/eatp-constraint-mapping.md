# EATP Constraint Mapping for Finance Education

EATP's five constraint dimensions map to COL-F guardrails:

| EATP Dimension | Finance Education Guardrails | Enforcement |
|---------------|------------------------------|-------------|
| Financial | No investment recommendations; disclaimers on performance data | `validate-disclaimer.js` (hard) |
| Operational | Allowed data sources, required frameworks per course, scope boundaries | `data-sourcing.md` rule (soft) |
| Temporal | Assignment deadlines, exam schedules, semester boundaries | Workspace context (soft) |
| Data Access | Authoritative sources only; FRED/Bloomberg preferred over web scraping | `data-sourcing.md` rule (soft) |
| Communication | Academic integrity disclosure; no presenting AI analysis as student's own | `academic-integrity.md` rule (soft+) |

EATP is NOT required for COL-F. This mapping shows how COL-F guardrails align with the formal constraint taxonomy for organizations that want to integrate EATP trust lineage.
