# TCI V1 — MASTER SPECIFICATION

Version: V1.0-CALIBRATION-V2
Status: Calibration specification

## 1. Objective

TCI measures the practical complexity of an administrative procedure for citizens/organizations. It is not a document-count index only.

## 2. Criteria and weights

| Code | Criterion | Weight |
|---|---|---:|
| C1 | Thành phần hồ sơ | 20% |
| C2 | Quy trình | 25% |
| C3 | Điều kiện | 20% |
| C4 | Thời gian | 15% |
| C5 | Khả năng tiếp cận và thực hiện | 10% |
| C6 | Phối hợp | 10% |

These weights are the current V1 working specification. The legacy calibration matrix on branch `tci-calibration` used a different allocation (20/20/15/15/10/20) and must not overwrite this V1 specification.

## 3. Processing architecture

RAW JSON → EXTRACT → NORMALIZE → FEATURE EXTRACTION → CLASSIFY → SCORE → AUDIT.

Unknown must never silently become zero or false.

## 4. C1 — Thành phần hồ sơ

Primary source: `executionCases[].profileComponents[]`.

Important fields: `name`, `required`, `originalQty`, `copyQty`, `hasElectronicForm`, `isProcessingResult`, `attachments`.

Exclude `isProcessingResult=true` from input-dossier burden. Distinguish required, conditional/optional and invalid/missing information. Exact scoring coefficients remain calibration-required.

## 5. C2 — Quy trình

Primary source: `executionSteps[]`, especially `description`.

Do not use `executionSteps.length` as the score. The extractor should identify explicit steps, actions, decisions, branches, verification, assessment, consultation, approval and dialogue signals. Exact scoring coefficients remain calibration-required.

## 6. C3 — Điều kiện

Primary source: `requirementsAndConditions`; secondary evidence may come from `description`, subject type and case-specific text when semantically relevant.

Do not count keywords mechanically. Count semantic condition units, branches and exceptions. Exact scoring coefficients remain calibration-required.

## 7. C4 — Thời gian

Sources: `executionMethods[].processingTime`, `processingTimeUnit`, method descriptions and available case-level processing-day data.

Keep all legal time variants. Classify legitimate case/route differences as `TIME_VARIANT`; only same-scope contradictory values are `CONFLICT`.

Do not select the first time in an array. Canonical scoring requires calibrated normalization, preferably percentile based. Exact thresholds remain calibration-required.

## 8. C5 — Khả năng tiếp cận và thực hiện

### A. implementLevel — 40 points

`FULL` = 40, `PARTIAL` = 30, `NONE` = 0. Missing/invalid = UNKNOWN/INVALID.

`implementLevel` is the only source for user-facing DVC level. Never infer it from submission method, returning method or `isFullProcess`.

### B. returningMethods — 10 points

ONLINE = 10; ONLINE + OFFLINE/BOTH = 10; OFFLINE = 0; missing/invalid = UNKNOWN.

This component must never determine FULL/PARTIAL/NONE.

### C. isFullProcess — 20 points

true = 20; false = 0; missing/invalid = UNKNOWN.

It is independent of `implementLevel`.

### D. Authorization — 10 points

ALLOWED or ALLOWED_CONDITIONAL = 10; NOT_ALLOWED = 0; UNKNOWN = UNKNOWN.

Use relevant evidence such as `requirementsAndConditions`, `description`, execution steps and profile-component wording. Do not use agency authorization fields to infer citizen delegation.

### E. isNonTerritorial — 20 points

true = 20; false = 0; missing/invalid = UNKNOWN.

User-facing label: `Không phụ thuộc địa giới hành chính.`

### isOfflineOnly

Audit/diagnostic signal only in V1; not a scoring input until its semantics are verified across the dataset.

## 9. C6 — Phối hợp

Sources: department/unit group fields plus execution-step text.

Normalize actors to distinct canonical identities. Count actual actors, handoffs, coordination and authority/approval interactions. Do not score by raw array length. Exact scoring coefficients remain calibration-required.

## 10. Anti-double-counting rules

- C1 measures dossier burden; C2 measures processing-flow complexity.
- C2 must not simply convert actor count into process complexity.
- C3 must not recount procedural actions as conditions.
- C4 only measures time.
- C5 owns DVC access/execution attributes.
- C6 owns actual actor/coordination complexity.

## 11. Status semantics

`KNOWN`: enough evidence for the feature.
`UNKNOWN`: evidence absent.
`INVALID`: evidence present but malformed or contradictory.
`PARTIAL`: some components scored, some unresolved.

## 12. Calibration rule

Reference judgments are anchors, not immutable truth. Any change to a rule must be justified at rule level and rerun against the complete regression set.

## 13. Golden-set principles

Golden cases must be based primarily on real TTHC records, with synthetic edge cases only for logic guards. Selection must be deterministic and explainable.
