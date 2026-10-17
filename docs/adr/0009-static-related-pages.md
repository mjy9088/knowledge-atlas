# ADR 0009 — Static articles with progressive enhancement

## Context

Articles should remain readable without a running client application or SPA fallback.

## Project impact

Catalog routing, build/dev HTML generation and browser enhancement share article identity and content ranges.

## Alternatives

Require Astro/React or client-only rendering now; defer a framework until a concrete need outweighs the added dependency.

## Decision

Use a small Node static builder and shared HTML renderer, domain-root directory routes, stable block/sentence references and client enhancement.

## Consequences

Hosting needs directory indexes/root-relative paths. Static fallback remains readable; interactive state uses browser adapters. Build hashes identify review candidates, not publication approval.
