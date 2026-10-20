# Knowledge Atlas

A source-grounded knowledge atlas for freely exploring science through connected explanations, visualizations, and experiments. The web is the canonical source; video is a fixed projection of the same claims, models, and scenes. Formal logic is the pilot, not the platform's subject boundary.

## Start locally

Use Node.js 22+ and pnpm (or prefix commands with mise exec -- in a mise environment).

~~~sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm dev
~~~

Open http://127.0.0.1:4173/ for the knowledge catalog. Every active explanation is an equal possible starting point, not a flagship or secondary product. `/knowledge/newton-to-quantum/` and `/knowledge/number-structures/` are examples of chaptered explanations with a self-contained mainline and optional detours; they do not define the platform's subject scope or receive special catalog treatment.

Other current starting points include `/knowledge/weekday-worlds/`, `/knowledge/monty-hall/`, and `/knowledge/two-children/`. The [weekday topic specification](content/formal-logic/weekday-worlds/README.md) owns its narrative, interpretation limits, world editor, and timed opening.

The Newton-to-quantum orbital detour reuses the deterministic hydrogenic spatial viewer. Reader state, optional interaction state, reset, and direct scene restoration remain validated contracts; retired topics remain available as source records rather than public routes.

Run `pnpm studio` for the [private content studio](tools/studio/README.md) at `http://127.0.0.1:4180`: edit manuscripts, export revision-bound implementation/review packets for OpenCode or another external agent, acknowledge external work against a computed source fingerprint, import review results with user-supplied provenance, and track feedback. No embedded chat or Codex executable is required. Workspaces, legacy chat history, feedback and build snapshots stay local and ignored; imported reports do not certify independent execution or publication approval.

The [content quality contract](docs/CONTENT-QUALITY.md) requires content value and whole-flow coherence as well as reasoning, source, representation, interaction, and rendered review. [Newton to quantum](content/physics/newton-to-quantum/README.md) and [number structures](content/mathematics/number-structures/README.md) demonstrate optional depth, not a privileged content tier; older episode records preserve evidence rather than automatically create public products. Use `pnpm content:review -- <slug>` to export a revision-bound manuscript and unverified assessment contract. A green test, source-aligned draft, or attractive image is not content approval or evidence that the work is worth a reader's time.

For asynchronous questions and current review-preview addresses, consult ignored `.local/README.md` in the active workspace. The [answer-only feedback service](tools/feedback/README.md) is separate from Studio and the public static build.

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
| [Logic and types](content/computing/README.md) | Function proofs, substitution, typed experiment scope |
| [Particle physics](content/particle-physics/README.md) | Free-field quanta and interaction comparison |
| [Quark confinement](content/particle-physics/quark-confinement/README.md) | QCD explanation, evidence and limitations |
| [Orbitals](content/quantum-physics/atomic-orbitals/README.md) | Hydrogenic content, source readings, scientific limits |
| [Spatial fields](apps/web/components/spatial/README.md) | Reusable scalar-field sampling and interactive viewer |
| [Pilot](content/formal-logic/explosion/README.md) | Explosion episode, related model scopes, scientific guardrails |
| [Source review](docs/SOURCE-REVIEW.md) | Recorded readings, exclusions, exact review limits |
| [Sources and rights](docs/SOURCES-AND-RIGHTS.md) | Evidence, reuse, and publication policy |
| [Development](docs/DEVELOPMENT.md) | Setup, commands, browser tests, static build, local media |
| [Roadmap](docs/ROADMAP.md) | Remaining work, unresolved review, lifecycle plans |
| [ADRs](docs/adr/README.md) | Project-wide architecture rationale and reserved historical identities |
| [Agent instructions](AGENTS.md) | Required working and documentation practices |

Documentation is English; the pilot's reader-facing content remains Korean. Durable feedback decisions are integrated into these documents; task history is retained in Git rather than duplicate per-turn JSON logs.

## Review and publication status

This is a local review implementation. Claims and articles retain draft/review-required states. Source-byte snapshots, exact revision verification, independent expert review, rights clearance, audio production, and approved publication manifests remain incomplete. Building a site or rendering a silent video does not imply publication approval. No project-wide open-source license has been selected; external source licenses remain separate.
