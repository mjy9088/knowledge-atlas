# ADR 0014 — Topic ownership and shared catalog

## Context

Independent subjects must not inherit the pilot topic as their storage or runtime boundary.

## Project impact

Content registration, identity validation, page wiring, pure models and media production have distinct owners across the repository.

## Alternatives

Nest later topics under the initial episode or copy topic pages/controllers; this creates accidental coupling and duplicate identities.

## Decision

Store topic-owned prose/claims under content/<domain>/<topic> and register paths/metadata in content/catalog.ts. Share I/O-injected loading and reader rendering. Keep explicit named collections distinct from catalog membership.

## Consequences

Moves preserve IDs, claims, source/review states and accepted wording. Reject duplicate routes/claims or mismatched identities. Content structure owns the authoring procedure; Git retains obsolete prototype implementations.
