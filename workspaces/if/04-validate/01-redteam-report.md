# Red Team Validation Report

**Project**: International Finance Deep Dive — The Oil-Trade-Monetary Policy Triangle
**Date**: March 12, 2026
**Documents validated**: 8 deep-dive sections + 12 research files
**Red team rounds**: 2

---

## What Was Tested

A class of International Finance students will read 8 interconnected deep-dive documents covering how the Iran war (oil shock), tariff upheaval, and central bank dilemmas interact. We tested whether:

- The information presented is factually consistent across all documents
- Key terms are defined before use
- Students can follow the prerequisite chain without broken links
- The materials comply with educational disclaimer requirements
- Discussion questions and activities are structured clearly enough for classroom use

---

## Issues Found and Fixed

### Critical (Fixed)

1. **No educational disclaimers** — All 8 documents lacked the required educational disclaimer. Fixed: added disclaimer after prerequisites in every document.

2. **Oil price math error** — Research file 01 stated a "25-35% increase" for oil moving from $71 to $110+, but the actual math yields ~55%. Deep-dive documents correctly used "50-70%". Fixed: research file updated to "~55% increase."

3. **IEEPA refund range inconsistency** — Research file 02 used both "$142-166 billion" and "$142-175 billion." Deep-dive documents consistently used $142-175B. Fixed: standardized to "$142-175 billion."

4. **BRICS never defined** — Used across 4 documents without expanding the acronym. Fixed: defined as "Brazil, Russia, India, China, South Africa" on first use in document 03.

5. **Broken prerequisite links** — Documents 05 and 06 linked "[01-04](01-theoretical-framework.md)" — the link only pointed to document 01. Fixed: expanded to individual links to all prior documents.

6. **BOE vote framing ambiguity** — "5-4 (cut vs. hold)" was unclear about which way the majority voted. Fixed: clarified to "five voted to hold, four voted to cut."

7. **Anonymous strategist** — "A veteran Wall Street strategist" was vague. Fixed: attributed to Barry Bannister, chief equity strategist at Stifel (Fortune, March 2026).

### Medium (Noted for future improvement)

8. **Source citations lack URLs/dates** — Most source citations give publication names but not specific URLs or access dates. Acceptable for classroom handouts but not ideal for academic rigor.

9. **Wikipedia citations** — Document 06 (historical comparison) cites Wikipedia for Smoot-Hawley and Plaza Accord. Acceptable for background context but should be supplemented with primary sources for formal use.

10. **BRICS 90% settlement claim** — The claim that BRICS conduct "90% of settlements in local currencies" appears in docs 03 and 08. This is a self-reported figure from the 2025 BRICS Kazan summit and should be treated as aspirational rather than verified.

### Low (Style preferences, not errors)

11. **Coverage gaps** — Topics like corporate hedging strategies, futures curve analysis, and commodity currency effects (AUD, CAD, NOK) are not covered. These are beyond the stated scope of the deep dive but could be added in future iterations.

12. **Instructor meta-guidance** — The discussion guide (doc 07) could benefit from tips on handling common student misconceptions, but functions well as-is.

---

## What Works Well

- **Progressive structure**: Documents build naturally from theory (01) through analysis (02-06) to application (07-08)
- **Worked examples**: The IMF multiplier calculation (doc 02) and Fed decision matrix (doc 01) are strong pedagogical anchors
- **Real-world analogies**: Restaurant/kitchen analogy for demand vs. supply inflation, landlord/rent analogy for legal uncertainty — effective for students
- **Comparative tables**: Country comparison tables in docs 05 and 06 enable quick cross-referencing
- **Discussion materials**: Doc 07 provides a complete 50-75 minute session with opening questions, conceptual questions, debates, and group activities — ready to use
- **Causal web diagrams**: Doc 08's ASCII causal chains effectively visualize systemic interconnections

---

## Overall Confidence

**8 out of 8 documents are ready for classroom use.** All critical issues have been fixed. The remaining medium-priority items (source URLs, Wikipedia citations, BRICS settlement sourcing) are standard for classroom handouts and do not affect the educational value or accuracy of the materials.

The deep-dive successfully covers the Oil-Trade-Monetary Policy Triangle from theoretical foundations through country-specific analysis to interactive class discussion — a complete teaching package.
