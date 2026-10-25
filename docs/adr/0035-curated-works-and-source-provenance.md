# ADR 0035 — Curated works separate from source provenance

## Context

Registering each source article automatically created an independent public product. The resulting catalog encouraged disconnected episode growth even when the reader needed one coherent explanation with optional depth. Consolidating explanations must preserve source evidence without implying that a few initial examples define the platform's scope or deserve privileged catalog treatment. Active topics are equal possible starting points; retired standalone readers need not remain executable archives.

## Project impact

The canonical catalog loader, public route generation, shared reader navigation, static asset boundary, review exports, Studio registration, and regression contracts must distinguish preserved evidence from active reader products. Removing a public route must not erase accepted manuscript edits, claim identities, source consultation, or independent scientific fixtures.

## Alternatives

Keeping every old reader behind a hidden catalog card would preserve executable products the user rejected. Deleting their article/claim evidence would destroy provenance and reusable scientific work. A general lifecycle database or arbitrary graph-navigation engine would add infrastructure beyond the current file-first need. Automatically bypassing deeper chapters makes part of an explanation undiscoverable during ordinary reading; a complete sequence with explicit skips keeps that choice with the reader.

## Decision

Keep canonical article/claim records in `CONTENT_ENTRIES`, explicitly choose routable readers through `CONTENT_PAGES`, and supply equal catalog entrances through a flat `INDEX_PAGES` list. Preserve source identities separately from route membership. Omit retired screens and their page/adaptor assets from static reader output rather than shipping executable archive pages.

Represent a chaptered explanation as one canonical article and shared-reader route. Its canonical scene order includes the central argument, deeper proofs and experiments by default. Chapter groups do not create excluded paths. Readers may explicitly skip a named forward section, while Previous/Next, direct entry, reset and restoration use the same complete order without a hidden history stack. Chapter support is a reading structure, not a catalog rank.

## Consequences

Source-impact and review tools can still inspect preserved records without making them public readers. Tests for deliberately retired screens are replaced with active-route and retirement contracts; scientific/model/claim fixtures remain evidence. Long-form works may use document scrolling rather than shortening arguments to a slide viewport. Route membership and passing navigation tests grant no content, expert, learner, rights, or publication approval. Exact current topic structure belongs to its owner, not this decision record.
