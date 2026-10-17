# Preliminary entity contracts

This folder contains preliminary JSON Schema files for Source, Claim, Scene, Projection, and Feedback. The schemas provide human and tool-readable structure. `scripts/validate.ts` checks concrete registered content, source/claim references, model metadata, episode constraints and documentation; the catalog loader also validates input identities and paths. These checks do not implement general JSON Schema 2020-12 validation for arbitrary entities.

When adopting a schema validation library, validate every entity with the appropriate schema, version the contracts, migrate data explicitly, and keep ID semantics and source attribution intact.

The Feedback schema is a preliminary contract for a future review workflow. There is no requirement to create a feedback file for each task, and no synthetic examples or hardcoded per-turn records are consumed by validation. Durable accepted decisions belong in the [project documentation](../../README.md); unresolved structured review records should follow [AGENTS.md](../../AGENTS.md).

The `.schema.json` `$id` values use the reserved `example.invalid` domain as placeholders. Replace with the project's stable schema URL when hosting is decided. They are NOT resolvable endpoints.
