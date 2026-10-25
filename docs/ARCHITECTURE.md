# Architecture and contracts

## Shared source

The intended dependency path is source snapshot/span → claim/model → explanation → scene/narration → projection/publication. The reader's concept graph is a separate structure: a conceptual relationship does not by itself imply a build dependency or require regeneration.

Git plus JSON and TypeScript modules currently hold the source. Stable logical IDs survive URL or storage changes. A publication should eventually lock claim, model, scene, audio, projection, and source/rights versions. Current build manifests record hashes for local review; they are not approved publication manifests.

## Boundaries

| Location | Responsibility |
| --- | --- |
| `sources/registry.json` | Source identity, retrieval/revision notes, locators, rights status |
| `knowledge/` | Concepts and typed, contextual relationships |
| `content/<domain>/<topic>/` | Topic-owned claims, localized articles, presentation metadata, optional episode source |
| `content/catalog.ts` | Canonical source records, explicitly active readers, and curated front doors |
| `packages/spatial/` | Domain-neutral finite-grid sampling and isosurface geometry |
| `packages/models/` | Pure calculations and explicit limitations |
| `packages/contracts/` | Preliminary JSON Schemas; not a complete runtime validator |
| `packages/site/` | Shared static HTML generation |
| `apps/web/` | Shared components, page controllers, styles, and domain adapters |
| `packages/experiments/`, `packages/projection/` | Input/state contracts and frozen timeline/presentation data |
| `tools/media/` | Local Canvas/WebCodecs renderer UI and muxer |
| `tools/studio/` | Local-only manuscript editing, revision-bound external-agent handoffs, review imports and feedback |
| `tools/feedback/` | Separate capability-scoped asynchronous question/answer inbox; never included in the static site |
| `scripts/` | Validation, build, preview, impact analysis, local media CLI |
| `tests/` | Cross-module integration contracts and shared browser support; owner-specific checks live with their source |

The browser application has no runtime npm dependencies. TypeScript, tsx, esbuild, Node declarations and Playwright are development dependencies. Astro/React, Remotion, TTS, graph databases, and job orchestration are not installed adapters.

## Entity contracts

- **Source:** canonical identity, author/title, provider revision, retrieval date, content hash when actually captured, exact spans/locators, license and separate rights review. A new source revision should create a new immutable snapshot rather than overwrite evidence history. Snapshot storage is not yet implemented.
- **Claim:** stable ID, kind, statement, scope, assumptions, source references with locators, and review status. Generated analogies and inferred links are separate proposals.
- **Concept/relation:** stable concept IDs and a relation type, context, evidence, and review state. `mentions`, `relatedTo`, `derivesFrom`, `contrastsWith`, and `analogousTo` have different strengths; a hyperlink is not proof of a prerequisite.
- **Model:** pure input/output logic, supported syntax, bounds, limitations, and independent semantic fixtures.
- **Article/experience:** stable block IDs, claim/concept references, alternative descriptions, and scene references. Related scenes reference sentence ranges in original blocks rather than maintain a second prose copy.
- **Scene:** validated state and actions, semantic inspection, reset, and independent time seeking for projections. Presentation state is separate from scientific state.
- **Projection:** source identity, complete scene snapshots, ordered timing/captions/highlights, and output profile. It may edit pacing but cannot silently change claims.
- **Review/publication:** evidence about what was checked, by whom and within what scope; explicit authorization and rollback identity. These remain only partly modeled.

## State and adapters

Canonical provenance does not imply a public product. `CONTENT_ENTRIES` retains article/claim ownership and identities; `CONTENT_PAGES` alone selects public readers, and the flat `INDEX_PAGES` list supplies equal catalog entrances without topic tiers. A retired reader is not emitted as an executable archive. Each explanation has one canonical ordered scene array covering every authored slide. Chapter membership groups the contents but never excludes scenes or changes adjacency. Authored forward skips are explicit actions over that array; direct entry and restoration continue from the selected scene without a hidden navigation stack. See [ADR 0035](adr/0035-curated-works-and-source-provenance.md).

Scene APIs expose `getState`, validated `setState`, and `reset`; time-based adapters expose `seek` or `frameAt`. Return detached snapshots and reject invalid state without partially mutating the previous state. Seeking must not depend on hidden prior clicks; randomness, if introduced, needs a recorded seed.

Reader state separates scene identity, scientific input and transient visualization selection. Model adapters supply bounded evaluation and current-input narration; components present that result without choosing new premises or changing the subject. Invalidate stale narration and diagrams together. Articles may omit an experiment while retaining the same navigation/state contract. Web and projection initial states may differ explicitly in their owning specification; seeking never inherits hidden web interactions.

Browser inspection hooks expose reader state for local testing. They do not grant publication authority. Concrete component state shapes, input limits and availability behavior belong to [component contracts](../apps/web/components/reader/README.md), not this architecture overview.

## Static build and media boundary

Article presentation separates canonical `title` from optional `shortTitle`; the catalog loader validates both, and compact display surfaces use a shared fallback helper. Optional topic-owned SVG cover artwork is consumed only on the title slide; it is independent of catalog thumbnails. The catalog stays text-only, and the static manifest hashes the SVG alongside content. See [ADR 0020](adr/0020-article-titles-and-vector-artwork.md).

`build-site.ts` and the development server share HTML generation. Articles, the index and scene documents are pre-rendered. Chaptered scene paths select content and layout before JavaScript; progressive navigation retains validated input and browser history. Existing scene fragments remain compatibility links, while bounded readers retain their scoped fragment behavior. Root-relative routes require deployment at the domain root; no SPA fallback is needed. The original focused-lesson source remains available to local projection tools rather than a public lesson route.

The builder regenerates the fixed `dist/` directory and copies modules/styles from explicit reader asset roots plus content/model/spatial/experiment/projection data. It rejects linked output directories. Local render helpers are outside that public asset list. The static server supports GET/HEAD and directory redirects, with no conversion API.

`episode.ts` is the focused explanation source; `packages/projection/explosion.ts` projects it into complete cue snapshots. Canvas/WebCodecs frames use those snapshots rather than recalculate a different narrative. MP4 encoding runs through the local `encode-mp4.ts` CLI and `mise exec -- ffmpeg/ffprobe`.

The concrete folder/ownership and authoring contract is [Content structure](CONTENT-STRUCTURE.md). The catalog loader accepts injected JSON I/O so the browser and builder use the same identity/path checks. No per-topic controller copy or prototype comparison page is needed.


## Authored representations and domain adapters

Pure models supply bounded calculations; domain adapters own scientific inputs, units, presets, authored semantic roles and current-input narration. Shared reader components own navigation, state integration, availability and DOM interaction without topic-specific equations. Adapters are explicitly registered, never dynamically evaluated from content. Restore scene identity before saved interaction state. Validate optional activity/pre-Next/scene-request hooks and preserve input during navigation.

Domain-neutral modules accept caller-supplied evaluators/weights/labels rather than incorporating the first consumer's science. Component APIs belong beside their implementation: [scalar-field viewer](../apps/web/components/spatial/README.md), [alignment](../apps/web/components/alignment/README.md), [reader feedback/lifecycle](../apps/web/components/reader/README.md), and [inline choices](../apps/web/components/experiment/README.md). Content-owned models and interpretation limits belong to their topic specifications.

## Planned architecture

Preserve IDs, source attribution, state contracts and accepted edits when introducing a framework/storage service. Immutable source storage, source monitoring, schema migration infrastructure, concurrent editing, protected-field conflict handling and atomic publication remain planned. Human and agent patches must remain inspectable; publication must lock reviewed dependencies and allow correction/rollback. See [Roadmap](ROADMAP.md) for remaining work.
