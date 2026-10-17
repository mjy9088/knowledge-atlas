# ADR 0011 — Explicit domain adapters

## Context

Scientific subjects have different supported input, calculation and uncertainty semantics.

## Project impact

The shared reader hosts explicitly registered pure-model/DOM adapters while keeping navigation/state independent of subject rules.

## Alternatives

Build one universal inference/numeric-input engine or copy a controller per topic; both obscure model limits and ownership.

## Decision

Separate pure bounded models, topic-owned inputs/narration and shared reader/status components. Preserve detached validated state, reset, independent seek and synchronized invalidation.

## Consequences

Each adapter declares its limits and evidence, and receives independent semantic fixtures. Reuse interaction primitives without presenting unlike models as the same calculus.
