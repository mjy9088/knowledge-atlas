# Content and code organization

## Ownership

Store each topic under `content/<domain>/<topic>/`. The domain is an organizational category, not a requirement that every explanation use the same scientific model. Cross-topic relationships belong in the knowledge graph and article metadata; do not nest an independent topic under the first episode that happened to mention it.

```text
content/
  catalog.mjs                    # Registered article paths and presentation metadata
  collections/                   # Named editorial group metadata, with stable IDs
  formal-logic/
    explosion/                   # Focused episode and original pilot contracts
    consistency/
      article.ko.json            # Canonical prose and block/claim references
      claims.json                # Claims owned by this topic
      page.mjs                   # Route, scene ranges, optional model, labels
    paraconsistent-logic/         # Same article structure
  set-theory/
    zfc/                         # Same article structure
    continuum-hypothesis/        # Same article structure
  quantum-physics/
    atomic-orbitals/              # Hydrogenic article, claims and spatial interaction metadata
knowledge/                       # Shared concept IDs and typed relations
sources/                         # Shared source registry and rights/revision status
```

An article owns its blocks and topic-specific claims. Reference shared claims by stable ID rather than copying their records into another topic. The loader rejects duplicate claim ownership and mismatched article identities. Scientific source locators and review states remain in the claim/source records. A file move is not a scientific revision or a new approval.

Use language suffixes for prose (`article.ko.json`, later `article.en.json` where actually authored). The current route chooses one explicit article filename; automatic language negotiation and translation are not implemented. Internal IDs are independent of folders and public slugs. Preserve existing IDs even when their historical name includes another topic.

The explosion pilot retains its `episode.mjs`, original content/scene/storyboard contracts, inference claims, and narration data. These are distinct source representations with established IDs and tests, not duplicate demo pages. Its original 30-second storyboard remains a draft; the focused episode is 134 seconds. Do not delete source evidence merely because a prototype screen was retired.

## Adding an article

1. Choose a domain/topic directory. Create canonical prose with stable article/block IDs, claim references, conceptual connections, and an honest review state. Register new source metadata and scoped claims before using them.
2. Add `claims.json` for claims owned here. Reuse IDs for existing claims without repeating their definitions. Shared pilot claim files are explicitly listed in `CLAIM_FILES`; normal topic claim files are derived from catalog entries.
3. Add `page.mjs`, using an adjacent existing page as the concrete format reference: `slug`, `articleId`, `label`, `category`, optional `model` or `interactive`, and `scenes`. Each scene has a stable ID, title, block index, sentence range, conceptual cards, and skip scope. Scene ranges must cover the original prose exactly once; the validator checks this.
4. Add one import and entry in `content/catalog.mjs`: `directory`, `article`, `claims`, and the imported page metadata. The shared loader, index, static page builder, and browser reader consume that registry. Do not add a separate HTML/controller copy for each topic.
5. Use no model (omit `model` or set it to null) when an experiment adds no value. The reader then shows conceptual cards and dialogue with the same navigation/reset contract. An interactive article must select a registered, validated adapter; an unknown adapter is an error, not a fallback to classical logic.
6. For a new kind of experiment, add its pure scientific model under `packages/models/` and its domain-specific UI configuration under `apps/web/topics/`. Reuse generic reader/status components. The existing premise editor is specifically a symbolic/formal-reasoning editor, not a universal physical-unit or dataset input component. Add an appropriate input adapter rather than relabel it.
7. Run `pnpm check` and inspect the new article at the supported viewports. Extend meaningful semantic fixtures and browser cases for its boundaries. Review source alignment and rights independently of these checks.

The current public article route is `/knowledge/<slug>/`. Slugs must be unique across the catalog. The home page `/` and `/knowledge/` render the catalog. `/lesson.html` remains the established custom explosion reader. Nested domain URLs, automatic redirects, and a general custom-experience registry are not implemented.

## Code boundaries

```text
apps/web/
  components/
    reader/                      # Navigation/state, panels, availability feedback, frame CSS
    experiment/                  # Symbolic premise editor DOM/CSS
    spatial/                     # Domain-neutral scalar-field Canvas viewer
    inference/                   # Proof/countervaluation DOM visualization
  pages/
    article/                     # Shared catalog article controller and styling
    lesson/                      # Existing custom explosion page and reading state
  styles/                        # Small shared visual foundation
  topics/quantum/                # Orbital controls and state-dependent explanation
  topics/registry.mjs            # Explicit allowlist of interactive adapters
  topics/formal-reasoning/       # Scientific presets, model-specific narration, pilot adapter
packages/
  content/                       # I/O-injected catalog loading and identity checks
  experiments/                   # Shared input/state/notation contracts
  models/                        # Scientific calculations; no page ownership
  spatial/                       # Grid sampling, seeded clouds, isosurface geometry
  projection/                    # Frozen timelines and shared proof presentation data
  site/                          # Static HTML generation
tools/media/                     # Development-only Canvas/WebCodecs UI and encoder/muxer
scripts/                         # Build/validation/server/media commands
tests/                           # Semantic/state/build tests and browser behavior
```

Keep page wiring out of models. Shared projection modules must not import page controllers or a browser DOM adapter. `proof-view.mjs` provides the same presentation data to DOM and Canvas, and `premise-state.mjs` provides input state without depending on its DOM editor. The original proof adapter remains a tested reference contract, although its old standalone screen is retired.

The builder publishes CSS/modules only from the selected reader asset roots (`components`, `pages`, `styles`, `topics`), maps the custom lesson HTML explicitly, and generates index/article HTML from the catalog. Content/model/spatial/experiment/projection/catalog data are copied under their matching paths. New local tools belong outside `apps/web`; do not add production tools to public asset roots.

## Retired prototypes and retained tools

The three-iframe comparison, old slide laboratory shell, standalone portrait playback page, their controllers/styles, and their screen-only tests have been removed. Historical ADRs retain their identities and point to the superseding decision. Git preserves old implementations; do not keep an archive tree of obsolete executable screens.

Local media work remains at `/tools/media/` on the development server. MP4 conversion remains the local CLI. Projection timelines, caption generation, scientific fixtures, source IDs, review limits, and video output profiles are preserved. Retiring a screen does not imply a new media render or publication.

## Spatial experiments and collections

An article may select an explicit `interactive` adapter from `apps/web/topics/registry.mjs`, with stylesheet paths in `styles`. The adapter supplies scene suggestions, current-input descriptions, detached state, validated restoration, reset, seek, and inspection. Use [Spatial fields](SPATIAL-FIELDS.md) for the generic viewer contract and [Orbitals](ORBITALS.md) for the first scientific adapter. Omit symbolic `model` when its premise editor is inappropriate.

Named collections own explicit `articleRefs`; catalog registration does not imply membership in an existing topic collection. The explosion evidence panel selects its four related articles through that list. Knowledge relations and related-concept links require their own scoped evidence; adding an orbital article does not assert a relation to explosion.
