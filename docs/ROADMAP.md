# Status and remaining work

Updated 2026-10-16. “Implemented,” “automatically tested,” “source-aligned,” “expert-reviewed,” and “published” are separate states.

## Implemented locally

- File-based source registry, concept graph, scoped claims, preliminary schemas, concrete validation and impact inspection.
- Deterministic explosion scene and bounded propositional inference with shared input editing, state/reset/inspection, HTML animation, and proof diagrams.
- Self-paced focused lesson, explicit skip context, inline editable assumptions/goals, synchronized or invalidated dialogue, viewport reader frames, on-demand evidence, and related links.
- Four independent related readers using classical, FDE, set-relation, or registered CH metatheorem adapters. These have different supported semantics; see [Pilot](PILOT.md).
- Static HTML generation, local preview, output hashes, functional link checking, portrait 3:4 projection, and scaled iframe comparison.
- Local silent Canvas/WebCodecs WebM helper and mise FFmpeg MP4 conversion CLI. These are separated from reader-facing static assets.
- Chromium regression tests for the supported desktop/narrow viewports, scene examples, content fitting, input editing/invalidation/reset, and control access. Full accessibility and cross-browser audits remain open.

Current content validation covers 7 sources, 9 concepts, 7 relations, and 19 claims. The original storyboard remains a separate five-segment/30-second draft. The focused episode is a separate 12-scene/134-second projection; no three-minute filler is required.

Local verification for the evaluation-feedback revision: content validation and all 65 Node tests passed; Chromium passed 47 browser cases across the four viewport projects, including stable titles, unavailable explanation content, recovery, and reuse outside logic. The desktop-only knowledge-index fit check is intentionally skipped in the mobile project, where the index may scroll. The browser report includes final-scene and evaluation-message screenshots. CI runs content validation, unit tests, and browser tests; its remote run has not been observed here.

## Next priorities

1. **Evidence and rights:** legally capture immutable source bytes/hashes; verify exact revisions and claim spans; resolve rights and repository licensing; obtain independent content review. Preserve pending statuses until performed.
2. **Reader quality:** complete accessibility, reduced-motion, screen-reader and cross-browser review; review readability and interaction discoverability with people. Expand geometry cases when supported layouts or content change.
3. **Projection integration:** compare sampled web/video states across output profiles, strengthen repeatable render diagnostics, add approved narration/audio and pronunciation handling. Do not mark the original storyboard/event schema fully integrated merely because the focused episode renders.
4. **Feedback preservation:** exercise timing-only, semantic, and accepted-edit preservation changes; record reviewable diffs and demonstrate conflict handling during regeneration. Structured job/feedback processing is not implemented.
5. **Publication lifecycle:** approved dependency/rights manifests, explicit release authorization, deploy/rollback, correction notices, and source refresh candidates. Static build support does not complete this milestone.
6. **Broader science:** add independently reviewed examples with physical units, observational uncertainty, and process models before extracting universal production templates. Introduce frameworks/databases/queues only when these needs justify them.

## Lifecycle targets

Proposed states are draft → candidate → automatically checked → review required/approved → published, with withdrawn/deprecated states for serious problems. Review evidence should name its scope rather than use one numerical confidence badge.

Source revision monitoring and external scientific reassessment are separate. A live link or unchanged source is not proof of current scientific validity. Compare versions, classify formatting/terminology/numerical/semantic/rights changes, and follow actual dependency edges. Conflicting sources remain explicit alternatives until reviewed. Failed retrieval retains the last successful version without claiming freshness.

Regeneration should produce a new candidate, preserve accepted patches, and offer a three-way diff when new evidence conflicts with a human decision. Partial invalidation must account for adjacent timing/caption changes. Shared-component changes require inspecting all affected content. Jobs should eventually record input/tool/prompt/model versions, bounded retries/cost, outputs, and checks; no orchestration service currently provides this.

Before publication, lock the reviewed source/claim/model/scene/audio/projection versions and rights notices, verify the resulting media, and authorize that exact manifest. Keep prior versions for rollback and manage corrections for already distributed videos. No external deployment or YouTube upload has been performed by this work.

## Completion criteria

A task reports changed components and relevant IDs, actual test/demo evidence, known limitations, and pending review/publication. A milestone requires executable code and the corresponding review evidence; passing structural or browser tests alone cannot certify scientific correctness or rights clearance.
