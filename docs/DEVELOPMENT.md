# Development and verification

## Setup

Use Node.js 22 or later and pnpm. `mise.toml` records the local tool choices; where needed, prefix commands with `mise exec --`. Install the locked development dependencies and Chromium once:

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm dev
```

For Linux review containers, install a real CJK font (for example `sudo apt-get install fonts-noto-cjk`). Missing Korean glyphs or a monospaced fallback are environment defects, not acceptable screenshot evidence.

The development server defaults to `http://127.0.0.1:4173`; set `PORT` to choose another port. It serves the working tree, including local media helpers. Opening a local server or building files does not publish content.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm studio` | Private manuscript editor, external-agent packets, review imports and feedback at port 4180 |
| `pnpm test:studio` | Private studio browser checks at desktop, narrow and 200% capture sizes |
| `pnpm typecheck` | Strict TypeScript contracts across source, scripts and tests |
| `pnpm validate` | Source/claim/content references, semantic metadata, series quality records and 100-unit ceiling |
| `pnpm content:review -- <slug>` | Export revision-bound canonical content/evidence for independent critique |
| `pnpm test` | Node unit tests for models, state, projections, build/link/hash behavior |
| `pnpm test:ui` | Chromium regression suite against a fresh static build |
| `pnpm check` | Type checking, validation, unit tests, then browser tests |
| `pnpm build` | Type check, validate and generate `dist/` |
| `pnpm preview` | Serve `dist/` locally on port 4174 |
| `pnpm preview:manifest` | Focused episode timeline, VTT, hashes, frame diagnostics |
| `pnpm storyboard` | Original 30-second storyboard export |
| `pnpm impact` | Candidate dependency impact for a source change |
| `pnpm release:check` | Report unresolved publication prerequisites; blocking is currently expected |

Equivalent `npm run` commands work when npm is available. The dependency lockfile is `pnpm-lock.yaml`; keep one package-manager lockfile.

`pnpm validate` also checks local inline Markdown link targets/heading anchors and ADR identity/rationale sections through `scripts/documentation.ts`. Numbered identities reserved in the ADR index cannot be reused. These checks do not decide architectural significance, evaluate source truth, or fetch external references. Repository documentation belongs with its owner: global policies in `docs/`, topic specifications in `content/`, component contracts beside implementation. Keep current requirements and unimplemented plans; completed-task/test reports belong in Git and task reports.

The [private studio](../tools/studio/README.md) uses its own loopback server and ignored runtime state. `pnpm test:ui` runs the public static-reader suite followed by the separate studio configuration. A private manuscript is not a catalog entry until explicitly integrated, and review readiness never authorizes publication. Implementation and independent review take place in the current OpenCode environment or another external agent through exported packets, not an embedded chat or model subprocess. Fixture reports in tests are not actual editorial review.

## Browser regression contract

`playwright.config.ts` builds and serves the actual static output on dedicated port 4190, with two Chromium workers. It also starts the development server on port 4191 for the local media smoke test. Stop unrelated services on these ports before running; the runner does not reuse an existing server. The general projects use CSS viewports 1920×1080, 1920×940, 1920×900, and 390×844. The dedicated `youtube-200` project tests the weekday focus reader at 960×540 CSS pixels and DPR 2, producing a 1920×1080 screenshot that represents the required 200% physical capture. DPR alone does not change layout: a 1920×1080 CSS viewport at DPR 2 is not this target.

`tests/browser/readers.spec.ts` checks catalog entry navigation, optional experiments, local media preview, all focused-lesson and related-reader scenes, every related model preset, navigation, evidence panels, input invalidation, reset, and eight-premise editing. Orbital cases additionally cover eight chapters, current-state dialogue, cloud/slice/isosurface modes, camera controls, state restoration, invalid state rejection, and deterministic seeking. Typed-lambda cases cover every chapter/example, editable terms/contexts/goals, type errors with cleared results, rule/reduction navigation, and customized/default snapshot restoration. Prose-only physics scenes are checked for actual text and control fitting. A separate browser fixture exercises the same viewer with a non-orbital spherical field. It measures document extents and actual content scroll extents, plus control bounds and hit targets. Hiding overflowing content with CSS does not satisfy these checks. Default content must fit; deliberately expanded user collections and opened reference panels may scroll internally as specified in [Product](PRODUCT.md).

Run a focused project or inspect failures:

```sh
pnpm test:ui --project=desktop
pnpm test:ui --project=youtube-200
pnpm exec playwright show-report
pnpm exec playwright show-trace test-results/public/<failure>/trace.zip
```

Failures save screenshots and traces under ignored `test-results/public/` and `test-results/studio/`; HTML reports are under `playwright-report/public/` and `playwright-report/studio/`. The suites use separate artifact directories so starting one does not delete the other’s traces. Chromium geometry tests are not cross-browser certification, physical-device testing, screen-reader review, or scientific verification. Preserve meaningful model fixtures separately. Do not add tests that merely enumerate removed filenames or obsolete UI strings.

## Static review build

Additional focused routes: `/knowledge/curry-howard/`, `/knowledge/lambda-calculus/`, `/knowledge/field-quanta/`, `/knowledge/particle-interactions/`, and `/knowledge/quark-confinement/`.

Question-led comparisons: `/knowledge/binary-search/`, `/knowledge/sphere-slices/`, and `/knowledge/base-rates/`. Browser regressions exercise every authored scene and default restoration, plus search completion/absence/independent seeking, sphere symmetry/tangency/empty sections/reveal, base-rate prediction/denominator/zero alerts, customized navigation, invalid drafts, rejected snapshots, reset, and actual geometry at all four supported viewports. Screenshots of initial/final scenes and changed inputs are attached to the browser report.

Useful routes: `/knowledge/atomic-orbitals/` (interactive hydrogenic orbitals), `/` (knowledge catalog), `/lesson.html`, `/knowledge/`, `/knowledge/consistency/`, `/knowledge/paraconsistent-logic/`, `/knowledge/zfc/`, and `/knowledge/continuum-hypothesis/`. See [Content structure](CONTENT-STRUCTURE.md) to add a topic.

Deployable files are generated in `dist/`; `build-manifest.json` records builder inputs, output hashes, and pending review states. Hosting must support directory indexes and root-relative paths. A successful build is a local candidate, not authorization to upload it. Never deploy the repository or development server as the public site.

## Local media production

Open `/tools/media/` on the development server to generate WebM from the shared Canvas/WebCodecs timeline. This is a local helper, not a public page or an end-to-end headless CLI renderer. Supported output profiles are 1080×1440 and 1920×1080 at 24/30 fps. Current output is silent; audio/TTS production is not implemented. Packets are held in memory, so long renders and low-memory devices are limited.

For future weekday/article YouTube production, use the landscape 1920×1080-at-200% baseline: restore each deterministic source state, lay out at 960×540 CSS pixels, and capture at DPR 2. The Playwright profile checks the layout; a DOM video capture/encoding adapter, narration and upload remain planned. The existing Canvas renderer profiles above remain separate legacy production paths. See the [weekday layout specification](../content/formal-logic/weekday-worlds/README.md#layout-controls-and-alignment).

Convert an existing WebM locally:

```sh
pnpm render:mp4 -- input.webm output.mp4
node --import tsx scripts/encode-mp4.ts --help
mise exec -- ffmpeg -version
```

The CLI invokes mise FFmpeg/ffprobe through argument arrays, refuses output overwrite, and records hashes and media diagnostics. H.264 MP4 is transcoded from VP8 WebM rather than lossless frames. Native WebM preview compatibility may vary; record a preview failure explicitly rather than claim successful decode. Browser preview and ffprobe checks do not establish every frame's quality or scientific correctness.

Before final media approval, generate and inspect the timeline, captions, frame samples, metadata, and audio diagnostics. Verify that changed goals and excluded premises match the displayed proof. Existing ignored artifacts are local candidates, not source-controlled publication evidence.

## TypeScript execution and delivery

All executable project source uses `.ts`; content/evidence prose stays JSON. Relative and browser-root imports use emitted `.js` paths. Run Node source with `node --import tsx`, normally through the package commands. The builder and development server share an esbuild transform; browsers receive JavaScript modules, never raw TypeScript. No application framework or browser npm runtime was added. Type-only contracts belong beside their modules or in `packages/content/types.ts`; browser globals are declarations used by inspection/test code. Runtime input validation remains required.
