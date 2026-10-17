# Knowledge Atlas

A source-grounded knowledge atlas for freely exploring science through connected explanations, visualizations, and experiments. The web is the canonical source; video is a fixed projection of the same claims, models, and scenes. Formal logic is the pilot, not the platform's subject boundary.

## Start locally

Use Node.js 22+ and pnpm (or prefix commands with mise exec -- in a mise environment).

~~~sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm dev
~~~

Open http://127.0.0.1:4173/ for the knowledge catalog, or /lesson.html for the self-paced explosion explanation. Premises and goals are editable inside explanations; dialogue and diagrams follow the selected model or invalidate unsupported input.

Explore `/knowledge/weekday-worlds/` to compare the hidden calendar contexts behind the Korean yesterday/tomorrow riddle. Start with an optional real 20-second attempt and reflection within the same first page. Simplify the sentence for explanation, offer a skippable review of symbols and classical rules, work through a nonmodal weekday derivation, then reveal possible worlds, compare P with ◇P/□P and briefly introduce modal inference, compare K/D/T/B/S4/S5, and inspect the current accessibility conditions. The arbitrary-relation editor uses K as its baseline; the default frame meets S4 conditions. The scene determines the interpretation; there is no mode checkbox. Calendar deductions use explicit constraints; the modal example evaluates the weekday proposition, not the complete original utterance. Add up to four worlds, edit direct accessibility, change reference choices and distinguish conditional answers from an unspecified literacy judgment.

Try the question-led comparisons at `/knowledge/binary-search/`, `/knowledge/sphere-slices/`, and `/knowledge/base-rates/`: step through a search, move a cutting plane, or compare a fictional detector's expected counts. Predictions are optional; changing a condition updates the explanation and preserves your edits across scenes.

~~~sh
pnpm typecheck    # strict TypeScript contracts
pnpm check        # types, content validation, unit tests, Chromium regressions
pnpm build        # validated static review build in dist/
pnpm preview      # serve dist/ at localhost:4174
~~~

The public web has no npm runtime dependencies. TypeScript (strict), tsx, esbuild, Node types and Playwright are development dependencies. See [Development](docs/DEVELOPMENT.md) for viewport coverage, artifacts, build constraints, and troubleshooting. MP4 conversion is a separate local CLI: pnpm render:mp4 -- input.webm output.mp4, using mise FFmpeg. The development-only WebM helper is not part of the static site.

## Documentation

| Document | Responsibility |
| --- | --- |
| [Vision](docs/VISION.md) | Platform purpose, knowledge-first priorities, non-goals |
| [Product](docs/PRODUCT.md) | Reading, inline experiments, viewport and navigation contracts |
| [Content structure](docs/CONTENT-STRUCTURE.md) | Topic ownership, folders, registration, and authoring steps |
| [Architecture](docs/ARCHITECTURE.md) | Entities, module boundaries, deterministic state, build/media boundary |
| [Logic and types](docs/LOGIC-TYPES.md) | Function proofs, substitution, typed experiment scope |
| [Particle physics](docs/PARTICLE-PHYSICS.md) | Free-field quanta and interaction comparison |
| [Quark confinement](docs/QCD.md) | QCD explanation, evidence and limitations |
| [Orbitals](docs/ORBITALS.md) | Hydrogenic content, source readings, scientific limits |
| [Spatial fields](docs/SPATIAL-FIELDS.md) | Reusable scalar-field sampling and interactive viewer |
| [Pilot](docs/PILOT.md) | Explosion episode, related model scopes, scientific guardrails |
| [Source review](docs/SOURCE-REVIEW.md) | Recorded readings, exclusions, exact review limits |
| [Sources and rights](docs/SOURCES-AND-RIGHTS.md) | Evidence, reuse, and publication policy |
| [Development](docs/DEVELOPMENT.md) | Setup, commands, browser tests, static build, local media |
| [Roadmap and status](docs/ROADMAP.md) | Implemented capabilities, unfinished lifecycle, next priorities |
| [ADRs](docs/adr/README.md) | Numbered design decisions and superseding choices |
| [Agent instructions](AGENTS.md) | Required working and documentation practices |

Documentation is English; the pilot's reader-facing content remains Korean. Durable feedback decisions are integrated into these documents; task history is retained in Git rather than duplicate per-turn JSON logs.

## Review and publication status

This is a local review implementation. Claims and articles retain draft/review-required states. Source-byte snapshots, exact revision verification, independent expert review, rights clearance, audio production, and approved publication manifests remain incomplete. Building a site or rendering a silent video does not imply publication approval. No project-wide open-source license has been selected; external source licenses remain separate.
