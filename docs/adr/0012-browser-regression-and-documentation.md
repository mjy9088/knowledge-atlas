# ADR 0012 — Documentation ownership and browser verification

## Context

Project-wide contracts need maintainable documentation and reproducible browser checks.

## Project impact

Development verification and documentation lifecycle apply across all topics without turning routine changes into architecture history.

## Alternatives

Rely only on screenshots or preserve per-turn feedback/implementation documents; these obscure behavior and current ownership.

## Decision

Use pinned development-only Playwright against a fresh static build. Measure content/control bounds and behavior. Keep current requirements with their owner, plans in Roadmap and significant architecture rationale in ADRs. Routine changes/test outcomes belong to Git/task reports.

## Consequences

Geometry is implementation evidence, not scientific/accessibility approval. Structured feedback is reserved for unresolved review or a real consumer. The ADR index defines the admission criteria; API/content changes alone do not qualify.
