# Nova Agro E2E Test Suite — Readiness & Verification Catalog

**Date:** 2026-10-31  
**Target Codebase:** `D:\projects\Nova-Industrial-Web`  
**Authoritative Reference:** `d:\projects\Gelesiye\.agents\teamwork\ORIGINAL_REQUEST.md`  
**Test Harness Location:** `D:\projects\Nova-Industrial-Web\tests\e2e\`  

---

## 1. Quick Execution Guide

The test harness is completely standalone and requires zero external test runners or browser driver installations. It executes on standard Node.js (>= 20) using ESM syntax.

```bash
# Run full E2E test suite (All Tiers 1 to 4)
npm test
# or directly:
node tests/e2e/runner.js

# Run individual Tiers:
node tests/e2e/runner.js --tier=1   # Feature Coverage & Smoke
node tests/e2e/runner.js --tier=2   # Boundary & Corner Cases
node tests/e2e/runner.js --tier=3   # Cross-Feature Interactions
node tests/e2e/runner.js --tier=4   # Real-World Scenarios & Regression Audit

# Machine-readable JSON output:
node tests/e2e/runner.js --json
```

---

## 2. Test Architecture & Tier Methodology

The test suite enforces the 4-tier testing hierarchy mandated by the Nova Agro engineering specification:

| Tier | Name | Focus Area | File Path | Test Count |
|---|---|---|---|---|
| **Tier 1** | Feature Coverage & Smoke | Build sanity, brand identity, 5 core services, CSS tokens, mock layer existence, backend schema | `tests/e2e/tier1-feature-coverage.test.js` | 7 |
| **Tier 2** | Boundary & Corner Cases | Desktop navbar wrapping bounds, mobile drawer toggle, numeric land area bounds, phone regex, logo transparency & WCAG contrast, mock resiliency | `tests/e2e/tier2-boundary-cases.test.js` | 7 |
| **Tier 3** | Cross-Feature Interactions | 'Teklif Al' modal decoupling from `#contact`, quote submission state flow & reference code generation (`AGRO-2026-XXXX`), service card detail inspection, full-stack API contract parity | `tests/e2e/tier3-cross-feature.test.js` | 5 |
| **Tier 4** | Real-World Scenarios | Complete end-to-end user journey, zero legacy blue regression audit (82 hex occurrences scan), high-volume lead submission idempotency, SEO & OpenGraph consistency | `tests/e2e/tier4-real-world-scenarios.test.js` | 4 |
| **Total** | | | | **23** |

---

## 3. Test Inventory & Baseline Verification Scorecard

*Current Execution Baseline (Pre-Implementation Milestones M1–M4):*

```
======================================================================
                        E2E TEST SUMMARY REPORT                       
======================================================================
Tier / Suite                               | Total |  Pass |  Fail |   Rate |     Time
-------------------------------------------+-------+-------+-------+--------+---------
Tier 1: Feature Coverage & Smoke Tests     |     7 |     2 |     5 |    29% |  11568ms
Tier 2: Boundary & Corner Case Tests       |     7 |     5 |     2 |    71% |      2ms
Tier 3: Cross-Feature Interaction Tests    |     5 |     1 |     4 |    20% |      2ms
Tier 4: Real-World Scenarios & Regression Audit |     4 |     2 |     2 |    50% |     15ms
-------------------------------------------+-------+-------+-------+--------+---------
TOTALS                                     |    23 |    10 |    13 |    43% |  11589ms
======================================================================
```

### Detailed Test Catalog:

| ID | Tier | Title | Milestone Dependency | Current Status | Failure Rationale / Expected Resolution |
|---|---|---|---|---|---|
| **TC-1.1** | Tier 1 | Frontend Clean Build (Vite + TypeScript) | Base | **PASS** | Bundle generated in `frontend/dist` without TS errors |
| **TC-1.2** | Tier 1 | Backend Clean TypeScript Compilation | Base | **PASS** | `dist/server.js` compiled with 0 TS errors |
| **TC-1.3** | Tier 1 | Brand Name "Nova Agro" Consistency | M1 | **FAIL** | `index.html` title is still "Nova Industrial" |
| **TC-1.4** | Tier 1 | 5 Core Agricultural Services Specification (R1) | M3 / M4 | **FAIL** | 5 core services not yet seeded or configured |
| **TC-1.5** | Tier 1 | AgTech Green CSS Design Tokens (R2) | M1 | **FAIL** | `--office-green` is currently `#0ea5e9` instead of `#16a34a` |
| **TC-1.6** | Tier 1 | Standalone Mock Data Layer Availability (R5) | M3 | **FAIL** | `frontend/src/services/mockData.ts` not yet implemented |
| **TC-1.7** | Tier 1 | Backend Drizzle Schema Quote & Service Models (R5) | M4 | **FAIL** | Backend quote request routes and schema table not yet mounted |
| **TC-2.1** | Tier 2 | Navbar Desktop Anti-Wrap Flexbox Layout | M2 | **PASS** | Flexbox nowrap and container bounds verified |
| **TC-2.2** | Tier 2 | Mobile Navigation Breakpoint & Drawer Layout (< 768px) | M2 | **FAIL** | `Header.tsx` missing collapsible mobile menu toggle state |
| **TC-2.3** | Tier 2 | Quote Form Empty Required Fields Rejection | M2 | **PASS** | Validation rejects missing required fields |
| **TC-2.4** | Tier 2 | Quote Form Numeric Boundary Checks (Land Area) | M2 | **PASS** | Rejects negative, zero, and string land area; accepts positive |
| **TC-2.5** | Tier 2 | Turkish Mobile Phone Format Boundary Checks | M2 | **PASS** | Validates cellular patterns (05XX, +905XX) and rejects landlines/invalid |
| **TC-2.6** | Tier 2 | Logo Transparency & Contrast Ratio Boundary | M1 | **PASS** | SVG transparent canvas & WCAG AA contrast ratio verified |
| **TC-2.7** | Tier 2 | Offline Mock Data Resiliency & Non-Empty Contract | M3 | **FAIL** | Pending `mockData.ts` implementation |
| **TC-3.1** | Tier 3 | Decoupling: "Teklif Al" Modal Trigger vs "İletişim" #contact | M2 | **FAIL** | "Teklif Al" in Header currently links to `#contact` anchor |
| **TC-3.2** | Tier 3 | Quote Submission State Flow & Reference Code Generation | M2 / M3 | **PASS** | Generates valid `AGRO-2026-XXXX` reference codes |
| **TC-3.3** | Tier 3 | Service Card Detail Inspection & Preselection | M3 | **FAIL** | `ServiceCards.tsx` lacks detail view / modal trigger |
| **TC-3.4** | Tier 3 | Contact Section Independence (#contact) | M1 / M2 | **FAIL** | `ContactForm.tsx` still contains `info@nova-industrial.demo` |
| **TC-3.5** | Tier 3 | Full-Stack Model & API Contract Parity | M3 / M4 | **FAIL** | `QuoteRequest` interface and `quoteRequests` table pending |
| **TC-4.1** | Tier 4 | Complete User Journey Simulation | All | **PASS** | Journey logic flows from Home -> Service -> Quote -> Contact |
| **TC-4.2** | Tier 4 | Zero Legacy Blue Regression Audit across Frontend | M1 | **FAIL** | 82 legacy blue hex occurrences found in `frontend/src` |
| **TC-4.3** | Tier 4 | High-Volume Mock Quote Submission Idempotency | M3 | **PASS** | Verified sequential lead storage without data corruption |
| **TC-4.4** | Tier 4 | SEO & Social Metadata Consistency | M1 | **FAIL** | `Home.tsx` Helmet tags still reference industrial keywords |

---

## 4. Requirements Traceability Matrix

| Requirement from `ORIGINAL_REQUEST.md` | Verification Tests | Success Condition |
|---|---|---|
| **R1: Agricultural Engineering & AgTech Domain** | `TC-1.3`, `TC-1.4`, `TC-4.1`, `TC-4.4` | Brand title is "Nova Agro", all 5 services present with agronomic descriptions and specs, industrial copy eliminated. |
| **R2: AgTech Green Theme & Style Consolidation** | `TC-1.5`, `TC-4.2` | CSS tokens mapped to `#16a34a` / `#15803d`, zero occurrences of cyan/sky/purple blues across all frontend files. |
| **R3: High-Contrast Transparent Logo** | `TC-2.6` | `logo.svg` has transparent canvas (no solid rect), WCAG contrast ratio on header (white) and footer (dark) satisfies guidelines. |
| **R4: Navigation Layout & Quote Modal Decoupling** | `TC-2.1`, `TC-2.2`, `TC-2.3`, `TC-2.4`, `TC-2.5`, `TC-3.1`, `TC-3.4` | Navbar stays on 1 row without wrapping, mobile drawer toggle for `< 768px`, "Teklif Al" opens modal instead of `#contact`. |
| **R5: Full-Stack Model & Mock Data Support** | `TC-1.6`, `TC-1.7`, `TC-2.7`, `TC-3.2`, `TC-3.5`, `TC-4.3` | Standalone `mockData.ts` enables 100% frontend offline execution, backend schema has `quoteRequests`, reference code generated. |

---

## 5. Escalated Implementation Gaps (For Milestone Owners)

As an opaque-box test writer, no implementation code was altered. The following 13 implementation defects are highlighted for the respective milestone agents:

1. **Milestone M1 (Theme, Logo & Brand Identity)**:
   - `frontend/index.html`: Replace `<title>` with "Nova Agro | İleri Tarım Teknolojileri & Ziraat Mühendisliği" (`TC-1.3`).
   - `frontend/src/styles/design-system.css`: Update `:root` variables `--office-green: #16a34a;`, `--office-green-dark: #15803d;`, `--emerald: #10b981;` (`TC-1.5`).
   - `frontend/src/components/ContactForm.tsx`: Replace `info@nova-industrial.demo` and Istanbul OSB address with Nova Agro info (`TC-3.4`).
   - `frontend/src/`: Purge 82 hardcoded legacy blue hexes (`#0ea5e9`, `#667eea`, `#38bdf8`, etc.) across components (`TC-4.2`).
   - `frontend/src/pages/Home.tsx`: Update Helmet title, description, and keywords (`TC-4.4`).

2. **Milestone M2 (Navigation Layout & Quote Modal Flow)**:
   - `frontend/src/components/Header.tsx`: Implement mobile menu toggle / drawer for viewports `< 768px` (`TC-2.2`).
   - `frontend/src/components/Header.tsx`: Remove `href="#contact"` from "Teklif Al" button; replace with `onClick={() => setIsQuoteModalOpen(true)}` rendering `QuoteModal` (`TC-3.1`).

3. **Milestone M3 (Standalone Mock Data Layer & Agricultural Content)**:
   - `frontend/src/services/mockData.ts`: Create mock module exporting `mockServices` (5 core services), `mockSiteInfo`, `mockHeroSections`, etc. (`TC-1.4`, `TC-1.6`, `TC-2.7`).
   - `frontend/src/services/api.ts`: Transparent fallback to mock data when backend unreachable (`TC-1.6`).
   - `frontend/src/components/ServiceCards.tsx`: Add detail modal inspection or quote preselection trigger (`TC-3.3`).

4. **Milestone M4 (Backend Drizzle Schema & API)**:
   - `backend/src/db/schema.ts`: Define `quoteRequests` table model (`TC-1.7`, `TC-3.5`).
   - `backend/src/server.ts` & `backend/src/routes/quoteRoutes.ts`: Mount `POST /api/v1/quotes` endpoint (`TC-1.7`).
