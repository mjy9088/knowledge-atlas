# ADR 0012 — Browser regression and documentation lifecycle

- Date: 2026-10-16
- Status: Implemented locally

## Decision

Add pinned Playwright as a development-only dependency. Test a fresh static build in Chromium at the agreed desktop and narrow viewports. Check actual scroll extents, visible content, control bounds/access, and user interactions rather than only CSS declarations or screenshots. Keep meaningful model and static build tests. Do not add assertions that merely list removed files or strings.

Write repository documentation in English. Korean reader-facing content, scientific IDs, and source metadata retain their language and identity. Maintain a small topic-based documentation set and numbered ADRs, with current implementation and pending review stated separately.

Consolidate durable decisions from the historical `feedback/` records into Vision, Product, Architecture, Pilot, and ADRs. Delete resolved per-turn records and synthetic examples; Git retains their history. Remove the validator's hardcoded dependency on those records. Keep the preliminary Feedback schema as a future contract, not as a requirement to generate files for every task. Create structured feedback only when an unresolved review or real consumer needs version, captured state, requested change, invariants, scope, and resolution.

## Consequences

Development now requires installing locked test dependencies and Chromium; the public web remains runtime-dependency-free. Browser artifacts are ignored, reproducible local evidence. Documentation no longer repeats chronological implementation notes as current contracts. This does not translate product content, certify full accessibility, verify source bytes, clear rights, or authorize publication.
