# Architecture and contracts

## Shared source

The intended dependency path is source snapshot/span → claim/model → explanation → scene/narration → projection/publication. The reader's concept graph is a separate structure: a conceptual relationship does not by itself imply a build dependency or require regeneration.

Git plus JSON and JavaScript modules currently hold the source. Stable logical IDs survive URL or storage changes. A publication should eventually lock claim, model, scene, audio, projection, and source/rights versions. Current build manifests record hashes for local review; they are not approved publication manifests.

## Boundaries

| Location | Responsibility |
| --- | --- |
| `sources/registry.json` | Source identity, retrieval/revision notes, locators, rights status |
| `knowledge/` | Concepts and typed, contextual relationships |
| `content/formal-logic/explosion/` | Scoped claims, explanation blocks, article/scene metadata, episode source |
| `packages/models/` | Pure calculations and explicit limitations |
| `packages/contracts/` | Preliminary JSON Schemas; not a complete runtime validator |
| `packages/site/` | Shared static HTML generation |
| `apps/web/` | DOM adapters, readers, experiments, HTML projection, local media helpers |
| `scripts/` | Validation, build, preview, impact analysis, local media CLI |
| `tests/` | Model/state/build unit tests and browser regression tests |

The browser application has no runtime npm dependencies. Playwright is a development dependency. Astro/React, Remotion, TTS, graph databases, and job orchestration are not installed adapters.

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

`proof-scene.mjs` wraps the original explosion model and its separate 30-second storyboard. Web reset restores both premises/Q; storyboard `seek(0)` restores its own initial state with no premises. These are intentionally different baselines.

`premise-experiment.mjs` normalizes `{premises:[{formula,enabled}],goal,customized}` and accepts a `derive` adapter. The editor handles up to eight premises and 512 characters per formula. Reader edits remain draft input even when syntax is incomplete. Suggestions change scene defaults without replacing customized input; explicit reset restores the current suggestion.

`inference-explorer.mjs` renders the selected row of the adapter's proof, references, or countervaluation. `related-models.mjs` supplies model-specific presets and deterministic narration. Related reader state includes scene, experiment, and selected visual row. The original lesson uses the shared editor and `experiment-dialogue.mjs` to adapt its explanation to the same proof. Unsupported input invalidates previous dialogue and diagram together.

Browser inspection hooks include `window.__atlasScenes.proof`, `window.__atlasLesson`, `window.__atlasLessonExperiment`, and `window.__atlasRelated`. See the implementations for their concrete state shape. These hooks support inspection; they do not grant publication approval.

`reader-frame.css` allocates viewport space; `reader-panels.mjs` moves detailed evidence and connections into dialogs. Dialogue navigation is self-paced. The legacy lab's automatic step emphasis is presentation only, using the same proof object.

`evaluation-feedback.mjs` separates topic identity from runtime availability. The domain-neutral component receives `{available,summary,detail}`, disables/hides only the dependent explanation, and renders a separate live status. Its `getState/setState/reset` do not interpret logic, select another goal, or block unrelated navigation. Callers own evaluation and domain-specific wording. The original lesson and related readers share it; conceptual default explanations remain readable, while customized unavailable explanations cannot retain stale example copy. Inspection snapshots expose evaluation separately from the stable displayed title.

## Static build and media boundary

`build-site.mjs` and the development server share HTML generation. Four related articles and the knowledge index are pre-rendered; client modules add navigation and experiments. Root-relative routes require deployment at the domain root; no SPA fallback is needed. The original lesson still uses client enhancement for its complete dialogue/evidence.

The builder regenerates the fixed `dist/` directory and copies explicitly selected public web assets plus content/model data. It rejects linked output directories. Local render helpers are outside that public asset list. The static server supports GET/HEAD and directory redirects, with no conversion API.

`episode.mjs` is the focused explanation source; `explosion-episode.mjs` projects it into complete cue snapshots. HTML portrait and Canvas/WebCodecs frames use those snapshots rather than recalculate a different narrative. MP4 encoding runs through the local `encode-mp4.mjs` CLI and `mise exec -- ffmpeg/ffprobe`.

## Future evolution

Preserve IDs, source attribution, state contracts, and accepted human edits when adding a framework or storage service. Schema migrations, atomic publication, immutable source storage, source monitoring, protected-field conflict handling, and concurrent editing remain future work. Human edits and agent patches must remain inspectable in the same source model.
