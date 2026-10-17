# Architecture decisions

ADRs record significant project-wide architecture choices and their rationale. They are not API manuals, content specifications, implementation plans, task logs or test reports. Reuse by several consumers alone does not make a component an architecture decision.

Before adding an ADR, identify its project-level structural/dependency/storage/deployment/security/lifecycle impact, a real alternative and the tradeoff. If the change is confined to a topic, component API, wording or layout, update that owner's specification instead. Update an existing ADR only when its architecture decision is actually revised; normal implementation evolution does not require a new record.

Every active ADR requires Context, Project impact, Alternatives, Decision and Consequences. The documentation validator checks those sections and local Markdown link targets; scope/significance still require human judgment. Architecture acceptance never grants content, rights or publication approval.

## Active decisions

| ID | Decision |
| --- | --- |
| [0001](0001-web-canonical-projection.md) | Shared web/video source |
| [0002](0002-file-first-provenance.md) | File-first provenance |
| [0006](0006-local-video-renderer.md) | Local Canvas/WebCodecs rendering |
| [0009](0009-static-related-pages.md) | Static articles with progressive enhancement |
| [0010](0010-local-media-cli.md) | Public web and local media boundary |
| [0011](0011-viewport-and-rule-adapters.md) | Explicit domain adapters |
| [0012](0012-browser-regression-and-documentation.md) | Documentation ownership and browser verification |
| [0014](0014-topic-layout-and-prototype-retirement.md) | Topic ownership and shared catalog |
| [0016](0016-typescript-source.md) | Strict TypeScript source and static JavaScript delivery |
| [0020](0020-article-titles-and-vector-artwork.md) | Canonical titles and optional compact presentation |

## Reserved historical identities

These numbers are not reused. Their former files are available in Git at the recorded commit; current requirements live at the destination below. This map preserves identity/provenance without maintaining obsolete implementation narratives. It is not a completion log.

| ID | Current owner | Git reference for former record |
| --- | --- | --- |
| 0003 | [content/formal-logic/explosion/README.md](../../content/formal-logic/explosion/README.md) | `a17c2e5:docs/adr/0003-bounded-inference-html-preview.md` |
| 0004 | [docs/ARCHITECTURE.md](../ARCHITECTURE.md) | `a17c2e5:docs/adr/0004-slide-scene-navigation.md` |
| 0005 | [docs/DEVELOPMENT.md](../DEVELOPMENT.md) | `a17c2e5:docs/adr/0005-portrait-and-iframe-preview.md` |
| 0007 | [docs/PRODUCT.md](../PRODUCT.md) | `89d8f62:docs/adr/0007-dialogue-reading.md` |
| 0008 | [docs/ARCHITECTURE.md](../ARCHITECTURE.md) | `157db13:docs/adr/0008-inline-shared-experiments.md` |
| 0013 | [apps/web/components/reader/README.md](../../apps/web/components/reader/README.md) | `ae6427d:docs/adr/0013-evaluation-feedback.md` |
| 0015 | [content/quantum-physics/atomic-orbitals/README.md](../../content/quantum-physics/atomic-orbitals/README.md) | `8c62715:docs/adr/0015-orbitals-and-scalar-fields.md` |
| 0017 | [docs/CONTENT-STRUCTURE.md](../CONTENT-STRUCTURE.md) | `14bc9cd:docs/adr/0017-question-led-comparisons.md` |
| 0018 | [content/formal-logic/weekday-worlds/README.md](../../content/formal-logic/weekday-worlds/README.md) | `366f253:docs/adr/0018-weekday-world-contexts.md` |
| 0019 | [apps/web/components/alignment/README.md](../../apps/web/components/alignment/README.md) | `9a7710e:docs/adr/0019-structural-expression-alignment.md` |
| 0021 | [content/formal-logic/weekday-worlds/README.md](../../content/formal-logic/weekday-worlds/README.md) | `b0806e8:docs/adr/0021-source-modal-translation.md` |
| 0022 | [content/formal-logic/weekday-worlds/README.md](../../content/formal-logic/weekday-worlds/README.md) | `ce5f427:docs/adr/0022-inferred-calendar-and-inline-contexts.md` |
| 0023 | [docs/DEVELOPMENT.md](../DEVELOPMENT.md) | `ce5f427:docs/adr/0023-focus-reader-and-scaled-capture.md` |
| 0024 | [content/formal-logic/weekday-worlds/README.md](../../content/formal-logic/weekday-worlds/README.md) | `ce5f427:docs/adr/0024-continuous-reader-and-inline-choices.md` |
| 0025 | [content/formal-logic/weekday-worlds/README.md](../../content/formal-logic/weekday-worlds/README.md) | `b0806e8:docs/adr/0025-weekday-modal-introduction.md` |
| 0026 | [content/formal-logic/weekday-worlds/README.md](../../content/formal-logic/weekday-worlds/README.md) | `1484bbe:docs/adr/0026-compact-reader-actions.md` |
| 0027 | [content/formal-logic/weekday-worlds/README.md](../../content/formal-logic/weekday-worlds/README.md) | `1442833:docs/adr/0027-weekday-challenge-and-modal-foundations.md` |
| 0028 | [content/formal-logic/weekday-worlds/README.md](../../content/formal-logic/weekday-worlds/README.md) | `1442833:docs/adr/0028-single-page-weekday-opening.md` |
| 0029 | [content/formal-logic/weekday-worlds/README.md](../../content/formal-logic/weekday-worlds/README.md) | `98a0421:docs/adr/0029-classical-review-and-weekday-derivation.md` |
| 0030 | [content/formal-logic/weekday-worlds/README.md](../../content/formal-logic/weekday-worlds/README.md) | `144f95e:docs/adr/0030-modal-systems-and-frame-conditions.md` |
| 0031 | [content/formal-logic/weekday-worlds/README.md](../../content/formal-logic/weekday-worlds/README.md) | `560a26b:docs/adr/0031-explicit-calendar-inference.md` |
| 0032 | [content/formal-logic/weekday-worlds/README.md](../../content/formal-logic/weekday-worlds/README.md) | `116be1d:docs/adr/0032-early-worlds-and-modal-expansion.md` |
| 0033 | [content/formal-logic/weekday-worlds/README.md](../../content/formal-logic/weekday-worlds/README.md) | `367841f:docs/adr/0033-automatic-challenge-and-sentence-lines.md` |
| 0034 | [content/formal-logic/weekday-worlds/README.md](../../content/formal-logic/weekday-worlds/README.md) | `7f2ade4:docs/adr/0034-example-only-modal-introduction.md` |
