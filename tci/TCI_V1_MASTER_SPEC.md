# TCI V1 — MASTER SPECIFICATION

Version: V1.0-CALIBRATION-V2.2
Status: Calibration specification

## 1. Objective

TCI measures the practical complexity of an administrative procedure for citizens/organizations. It is not a document-count index only.

## 2. Criteria and working weights

| Code | Criterion | Weight |
|---|---|---:|
| C1 | Thành phần hồ sơ | 20% |
| C2 | Quy trình | 25% |
| C3 | Điều kiện | 20% |
| C4 | Thời gian | 15% |
| C5 | Khả năng tiếp cận và thực hiện | 10% |
| C6 | Phối hợp | 10% |

These are current V1 working weights for calibration and remain adjustable during Golden Case calibration. The legacy calibration matrix on branch `tci-calibration` used 20/20/15/15/10/20 and must not overwrite this V1 specification.

## 3. Processing architecture

RAW TTHC JSON + DVC mapping → EXTRACT → NORMALIZE → FEATURE ENRICHMENT → CLASSIFY → SCORE → AUDIT.

Unknown must never silently become zero or false, except where an explicit business rule below defines the value.

## 4. C1 — Thành phần hồ sơ

Primary source: `executionCases[].profileComponents[]`.

Important fields: `name`, `required`, `originalQty`, `copyQty`, `hasElectronicForm`, `isProcessingResult`, `attachments`.

Exclude `isProcessingResult=true` from input-dossier burden. Distinguish required, conditional/optional and invalid/missing information. Exact scoring coefficients remain calibration-required.

## 5. C2 — Quy trình

Primary source: `executionSteps[]`, especially `description`.

Do not use `executionSteps.length` as the score. Extract explicit steps, actions, decisions, branches, verification, assessment, consultation, approval and dialogue signals. Exact scoring coefficients remain calibration-required.

## 6. C3 — Điều kiện

Primary source: `requirementsAndConditions`; secondary evidence may come from `description`, subject type and case-specific text when semantically relevant.

Do not count keywords mechanically. Count semantic condition units, branches and exceptions. Exact scoring coefficients remain calibration-required.

## 7. C4 — Thời gian

Sources: `executionMethods[].processingTime`, `processingTimeUnit`, method descriptions and available case-level processing-day data.

Keep all legal time variants. Classify legitimate case/route differences as `TIME_VARIANT`; only same-scope contradictory values are `CONFLICT`.

Do not select the first time in an array. Canonical scoring requires calibrated normalization, preferably percentile based. Exact thresholds remain calibration-required.

## 8. C5 — Khả năng tiếp cận và thực hiện

C5 has independent data dimensions. The JSON TTHC dataset does not contain the authoritative Toàn trình/Một phần field. Therefore those values must come from the DVC mapping source, not be invented from unrelated JSON fields.

### A. Xác định có DVC trực tuyến — JSON source

Source: `executionMethods[].submissionMethod`.

- At least one `ONLINE` → `hasOnlineSubmission = true`.
- No `ONLINE` → `hasOnlineSubmission = false` and `implementLevel = NONE`.

Thus the absence of an ONLINE submission method in the TTHC JSON is sufficient to conclude that the procedure has no online execution route for this C5 dimension.

`DIRECT` does not imply `isOfflineOnly=true`; `isOfflineOnly` remains an independent audit signal.

### B. Mức độ cung cấp DVC — DVC mapping source — 40 points

Only when `hasOnlineSubmission=true`, match the TTHC code (`JSON.code`) to `DVC mapping.MaTTHC`, then use `MucDo` for the corresponding `MaDVC`.

- `Toàn trình` → `FULL` → 40 points
- `Một phần` → `PARTIAL` → 30 points
- configured NONE equivalents such as `Chưa cung cấp` → `NONE` → 0 points
- mapping not found → `UNKNOWN`
- conflicting levels for the same MaTTHC → `UNKNOWN` + audit
- invalid/unrecognized `MucDo` → `UNKNOWN` + audit

Never infer FULL/PARTIAL from `isFullProcess`, `returningMethods`, `submissionMethod`, `formalityType`, or `formalityTargetType`.

A MaTTHC can have multiple mapping rows because of multiple MaDVC, agencies or records. Identical levels across rows are compatible; conflicting levels are not resolved by picking the highest or first value.

### C. returningMethods — 10 points

ONLINE = 10; ONLINE + OFFLINE/BOTH = 10; OFFLINE = 0; missing/invalid = UNKNOWN.

This component never determines FULL/PARTIAL/NONE.

### D. isFullProcess — 20 points

true = 20; false = 0; missing/invalid = UNKNOWN.

Independent from the DVC `MucDo` classification.

### E. Authorization — 10 points

ALLOWED or ALLOWED_CONDITIONAL = 10; NOT_ALLOWED = 0; UNKNOWN = UNKNOWN.

Use relevant citizen-delegation evidence in `requirementsAndConditions`, `description`, execution steps and profile-component wording. Do not use agency authorization fields to infer citizen delegation.

### F. isNonTerritorial — 20 points

true = 20; false = 0; missing/invalid = UNKNOWN.

User-facing label: `Không phụ thuộc địa giới hành chính.`

### G. isOfflineOnly

Audit/diagnostic signal only; not a scoring input.

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
`UNKNOWN`: authoritative evidence absent.
`INVALID`: evidence present but malformed/unrecognized.
`CONFLICT`: multiple authoritative mapping values disagree.
`PARTIAL`: some components scored, some unresolved.

## 12. Calibration rule

Reference judgments are anchors, not immutable truth. Any change to a rule must be justified at rule level and rerun against the complete regression set.

## 13. Golden-set principles

Golden cases must be based primarily on real TTHC records, with synthetic edge cases only for logic guards. Selection must be deterministic and explainable.

When the external DVC mapping is unavailable, do not fabricate FULL/PARTIAL. TTHC records without ONLINE can still form valid NONE cases; ONLINE records without mapping must retain `UNKNOWN` for the DVC level dimension until enriched.
