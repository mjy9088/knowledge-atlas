# ADR 0020 — Canonical titles and optional compact presentation

## Context

Compact display text and title artwork must not redefine scientific identity or canonical share metadata.

## Project impact

The shared Article/ContentPage schema, catalog validation, metadata builder and reader consume one title/artwork contract.

## Alternatives

Overwrite the canonical title with a shorter label or reuse a cover automatically as a thumbnail; both conflate distinct presentation purposes.

## Decision

Keep Article.title canonical and optional shortTitle with full-title fallback for compact display. Validate nonempty strings (full ≤300, short ≤160). Optional coverArtwork uses a validated local content SVG path and meaningful alt; render only on an opted-in title slide. Catalog cards remain text-only.

## Consequences

Document/Open Graph metadata retains the full title. Reader cover state is separate from scientific scene identity; static content retains a real heading. Content owns artwork/reference/rights notes. The builder copies/hashes content SVG assets without importing external URLs or scripts as artwork configuration.
