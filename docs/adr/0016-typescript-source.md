# ADR 0016 — Strict TypeScript source and static JavaScript delivery

## Context

Source contracts span browser components, scientific models, Node tools and projections.

## Project impact

All executable source shares strict checking while the public site remains runtime-dependency-free.

## Alternatives

Keep unchecked JavaScript or introduce a runtime application framework; neither supplies the required explicit shared contracts with the same deployment boundary.

## Decision

Use TypeScript with strict checking and concrete domain/DOM types; JSON retains prose/evidence. Imports use emitted .js specifiers. tsx executes Node entry points; esbuild transforms browser modules in build/development.

## Consequences

TypeScript/tsx/esbuild/Node declarations are development dependencies. Runtime validation remains required for JSON, user input and saved state. Do not silence incompatibilities with blanket any/suppression or change scientific fixtures to fit an implementation.
