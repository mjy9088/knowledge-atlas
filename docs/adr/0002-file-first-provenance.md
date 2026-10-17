# ADR 0002 — File-first provenance

## Context

Evidence and authored changes must be inspectable without a production database.

## Project impact

Sources, claims, concepts, content, scenes and projections share stable identities and reviewable diffs.

## Alternatives

Adopt a database/distributed queue immediately; defer storage infrastructure until concurrency or refresh workloads justify it.

## Decision

Use Git, JSON, Markdown and TypeScript modules. Preserve logical IDs through storage/path changes. File presence is not scientific approval.

## Consequences

Immutable capture, concurrent editing, protected-patch conflict handling and atomic publication require separate work. Current contracts remain inspectable during that evolution.
