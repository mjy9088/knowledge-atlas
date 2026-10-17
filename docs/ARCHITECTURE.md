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
| `content/catalog.ts` | Registered data paths and shared article routes |
| `packages/spatial/` | Domain-neutral finite-grid sampling and isosurface geometry |
| `packages/models/` | Pure calculations and explicit limitations |
| `packages/contracts/` | Preliminary JSON Schemas; not a complete runtime validator |
| `packages/site/` | Shared static HTML generation |
| `apps/web/` | Shared components, page controllers, styles, and domain adapters |
| `packages/experiments/`, `packages/projection/` | Input/state contracts and frozen timeline/presentation data |
| `tools/media/` | Local Canvas/WebCodecs renderer UI and muxer |
| `scripts/` | Validation, build, preview, impact analysis, local media CLI |
| `tests/` | Model/state/build unit tests and browser regression tests |

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

Scene APIs expose `getState`, validated `setState`, and `reset`; time-based adapters expose `seek` or `frameAt`. Return detached snapshots and reject invalid state without partially mutating the previous state. Seeking must not depend on hidden prior clicks; randomness, if introduced, needs a recorded seed.

`topics/formal-reasoning/proof-scene.ts` wraps the original explosion model and its separate 30-second storyboard. Web reset restores both premises/Q; storyboard `seek(0)` restores its own initial state with no premises. These are intentionally different baselines.

`components/experiment/premise-editor.ts` normalizes `{premises:[{formula,enabled}],goal,customized}` and accepts a `derive` adapter. The editor handles up to eight premises and 512 characters per formula. Reader edits remain draft input even when syntax is incomplete. Suggestions change scene defaults without replacing customized input; explicit reset restores the current suggestion.

`components/inference/explorer.ts` renders the selected row of the adapter's proof, references, or countervaluation. `topics/formal-reasoning/experiments.ts` supplies model-specific presets and deterministic narration. Related reader state includes scene, experiment, and selected visual row. The original lesson uses the shared editor and `topics/formal-reasoning/dialogue.ts` to adapt its explanation to the same proof. Unsupported input invalidates previous dialogue and diagram together.

Active browser inspection hooks include `window.__atlasLesson`, `window.__atlasLessonExperiment`, and `window.__atlasRelated`. The original proof adapter remains a tested module, but its former standalone page/global hook is retired. See the implementations for their concrete state shape. These hooks support inspection; they do not grant publication approval.

`components/reader/frame.css` allocates viewport space; `components/reader/panels.ts` moves detailed evidence and connections into dialogs. Dialogue navigation is self-paced. Articles may omit an experiment adapter and use conceptual cards with the same navigation/state contract.

`components/reader/evaluation-feedback.ts` separates topic identity from runtime availability. The domain-neutral component receives `{available,summary,detail}`, disables/hides only the dependent explanation, and renders a separate live status. Its `getState/setState/reset` do not interpret logic, select another goal, or block unrelated navigation. Callers own evaluation and domain-specific wording. The original lesson and related readers share it; conceptual default explanations remain readable, while customized unavailable explanations cannot retain stale example copy. Inspection snapshots expose evaluation separately from the stable displayed title.

## Static build and media boundary

Article presentation separates canonical `title` from optional `shortTitle`; the catalog loader validates both, and compact display surfaces use a shared fallback helper. Optional topic-owned SVG cover artwork is consumed only on the title slide; it is independent of catalog thumbnails. The catalog stays text-only, and the static manifest hashes the SVG alongside content. See [ADR 0020](adr/0020-article-titles-and-vector-artwork.md).

`build-site.ts` and the development server share HTML generation. Fourteen catalog articles and the knowledge index are pre-rendered; client modules add navigation and experiments. Root-relative routes require deployment at the domain root; no SPA fallback is needed. The original lesson still uses client enhancement for its complete dialogue/evidence.

The builder regenerates the fixed `dist/` directory and copies modules/styles from explicit reader asset roots plus content/model/spatial/experiment/projection data. It rejects linked output directories. Local render helpers are outside that public asset list. The static server supports GET/HEAD and directory redirects, with no conversion API.

`episode.ts` is the focused explanation source; `packages/projection/explosion.ts` projects it into complete cue snapshots. Canvas/WebCodecs frames use those snapshots rather than recalculate a different narrative. MP4 encoding runs through the local `encode-mp4.ts` CLI and `mise exec -- ffmpeg/ffprobe`.

The concrete folder/ownership and authoring contract is [Content structure](CONTENT-STRUCTURE.md). The catalog loader accepts injected JSON I/O so the browser and builder use the same identity/path checks. No per-topic controller copy or prototype comparison page is needed.

## Future evolution

Authored natural-language/symbol correspondence uses a pure alignment forest in `packages/experiments/semantic-alignment.ts` and a reusable DOM controller/style in `components/alignment/`. Topic adapters assign semantic IDs and nested fragments; shared hover/focus behavior highlights the full root-to-selected path across representations. Alignment state is transient presentation state and is invalidated after interpretation changes. Partial formalizations must expose their limits rather than imply complete linguistic equivalence. See [ADR 0019](adr/0019-structural-expression-alignment.md).

Preserve IDs, source attribution, state contracts, and accepted human edits when adding a framework or storage service. Schema migrations, atomic publication, immutable source storage, source monitoring, protected-field conflict handling, and concurrent editing remain future work. Human edits and agent patches must remain inspectable in the same source model.

## Spatial interaction boundary

The hydrogenic model is pure numerical code under `packages/models/`; `packages/spatial/` accepts arbitrary scalar evaluators and weights. `components/spatial/field-viewer.ts` supplies orthographic 3D projection, slice rendering, camera controls, and deterministic scene state without quantum terminology. The quantum topic adapter owns units, orbital selection, scientific limits, and current-input narration. The shared reader selects only explicitly registered adapters and preserves customized scientific/camera state across chapters. See [Spatial fields](SPATIAL-FIELDS.md) and [ADR 0015](adr/0015-orbitals-and-scalar-fields.md).

The typed-lambda adapter is a second, non-spatial interactive adapter. Its model parses an annotated simply typed calculus with products and reports typing derivations plus bounded, capture-avoiding full normal-order reduction. It never executes input as JavaScript. A validated interaction snapshot is restored after selecting its scene so default suggestions cannot overwrite saved rule/reduction steps. Prose-only scenes collapse the absent visual region instead of displaying an empty diagram.

Binary search, sphere slices, and base rates add three domain adapters through the same explicit allowlist. Their pure models respectively produce search traces, exact planar sections of a solid ball, and expected contingency counts with a nullable conditional probability. Sphere UI snapshots use the declared 0.1 cm control grid, while its pure model accepts continuous finite lengths within bounds. Base-rate snapshots preserve incomplete raw drafts separately from the last numerical parameters, so restoration cannot silently turn an invalid edit into a valid result. Search seeking selects a complete comparison frame independently of earlier steps and refreshes current-input narration. These are mathematical teaching models, not measured datasets or physical simulations.

Article scene ranges recognize sentence-ending punctuation followed by whitespace or the end of a block; decimal points inside numbers remain part of their sentence. Catalog cards show full question titles and scene/interaction labels; the full introductory prose belongs to the article. No truncated excerpt is required to fit the desktop catalog. See [ADR 0017](adr/0017-question-led-comparisons.md).

The weekday-world adapter compares independently assigned calendar contexts for up to four stable named worlds. Its pure enumerator supplies satisfying weekday assignments; a pure notation module supplies the matching Γ constraints and answer-extraction status. The presentation switches the original sentence between simplified material and authored wish/counterfactual forms; the reference graph does not supply the missing similarity ordering or a whole-utterance truth verdict. The legacy P/◇P/□P module remains for compatibility/frame handling and independent fixtures. No component is a Korean parser or general counterfactual prover. Domain-neutral cards render calendars; topic components own sentence/formula correspondence, inference and accessibility graph. Version-3 state restores validated deep snapshots and migrates the earlier fixed-rule/version-2 forms. Desktop stacks original text and symbols above a bounded scrolling selection panel on the left, with reasoning on the right. A checkbox inside Symbols switches the source translation as defined by ADR 0021, while general UI uses named worlds. An opt-in shared-reader cover keeps the full article title on a separate title slide, independently of source scene identity and interactive snapshots. Narrow panels and the native world-configuration dialog follow Product's bounded-layout contract. See [ADR 0018](adr/0018-weekday-world-contexts.md).

The weekday reader projects the existing calendar model set through `weekdayDeductions()` before displaying any day. Legacy sample values remain in validated version-3 snapshots for compatibility, but are neither editable nor used as premises in the UI. Inline reference controls share the expression alignment forest; the Selection pane owns presets, target-day premise and world/access configuration. See [ADR 0022](adr/0022-inferred-calendar-and-inline-contexts.md).

The weekday article opts into a focus frame with an overlay navigation reveal and a vertical action rail beside its explanation. The 200% landscape capture contract uses 960×540 CSS pixels at DPR 2 for 1920×1080 output; it does not add a DOM video encoder or change the legacy Canvas projections. See [ADR 0023](adr/0023-focus-reader-and-scaled-capture.md).
