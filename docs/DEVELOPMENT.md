# Development and verification

## Setup

Use Node.js 22 or later and pnpm. `mise.toml` records the local tool choices; where needed, prefix commands with `mise exec --`. Install the locked development dependencies and Chromium once:

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm dev
```

For Linux review containers, install real CJK and Latin/math sans fonts (for example `sudo apt-get install fonts-noto-cjk fonts-dejavu-core`). Check mathematical symbols such as floor/ceiling brackets as well as Korean text. Missing glyphs or an accidental monospaced fallback are environment defects, not acceptable screenshot evidence.

The GitHub Actions browser job uses Ubuntu 24.04 and explicitly installs these fonts after Chromium's system dependencies. Playwright's dependency installer alone does not establish the project's Korean/math font environment. Layouts must also tolerate differing installed CJK font metrics; a developer's user-local variable font is not a CI prerequisite. Keep overflow and full-proof checks rather than weakening them to accommodate a missing font or an artificial content-height cap.

For page-bounded PDF source consultation, optional Poppler tools (`poppler-utils`) can extract a selected page with `pdftotext -f N -l N source.pdf -`. Check the actual page when extraction loses mathematical glyphs; text extraction alone does not verify a source revision, scientific argument, or reuse permission.

The development server defaults to `http://127.0.0.1:4173`; set `PORT` to choose another port. It serves the working tree, including local media helpers. Opening a local server or building files does not publish content.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm studio` | Private manuscript editor, external-agent packets, review imports and feedback at port 4180 |
| `pnpm test:studio` | Private studio browser checks at desktop, narrow and 200% capture sizes |
| `pnpm typecheck` | Strict TypeScript contracts across source, scripts and tests |
| `pnpm validate` | Source/claim/content references, semantic metadata, series quality records and 100-unit ceiling |
| `pnpm content:review -- <slug>` | Export revision-bound canonical content/evidence for independent critique |
| `pnpm test` | Discover owner-local Node checks plus root integration contracts |
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

`playwright.config.ts` builds and serves the actual static output on dedicated port 4190, with two Chromium workers. It also starts the development server on port 4191 for the local media smoke test. Stop unrelated services on these ports before running; the runner does not reuse an existing server. General browser projects use the 1920×940 scaled-desktop baseline, the 960×540 base desktop composition, and the separate 390×844 mobile regression. The desktop compositor uses `min(viewport width / 960, viewport height / 540)`, centers the whole logical surface and leaves unused space as letterboxing; it does not crop or stretch one axis. The dedicated `youtube-200` project remains a different DPR/capture role: it tests the weekday focus reader at 960×540 CSS pixels and DPR 2, producing a 1920×1080 physical screenshot. DPR alone does not change layout: a 1920×1080 CSS viewport at DPR 2 is not this target.

Tests follow their [source owner](CONTENT-STRUCTURE.md#test-ownership). Topic checks live under `content/<domain>/<topic>/tests/`; models, components, projections and tools keep their own `tests/`. Root `tests/` retains catalog/build/review integration and shared browser support rather than per-topic scientific checks. Browser suites cover authored scene behavior, current-input correspondence, navigation, reset/restoration and unsupported input where relevant. Generic spatial contracts include a non-orbital field, while topic fixtures retain their independently derived mathematics. Measure document and internal extents, content bounds and hit targets; hiding overflow is not a fitting solution. Use the normal and long-form scrolling contracts in [Product](PRODUCT.md).

`pnpm test` passes six separately quoted recursive `*.test.ts` patterns to Node, for `apps`, `content`, `packages`, `scripts`, `tests` and `tools`. This uses native test discovery rather than a hand-maintained content test list. Public Playwright discovers owner-local `tests/browser/**/*.spec.ts` across the repository, explicitly excluding generated output, ignored workspaces and the private Studio browser tree. Studio uses `tools/studio/tests/browser/` with its own configuration. The weekday capture basename remains exclusive to `youtube-200`. TypeScript already includes all source-owner roots. Tests and helpers are never public build assets or development HTTP modules.

Run a focused project or inspect failures:

```sh
pnpm exec playwright test --config=playwright.config.ts --project=desktop
pnpm exec playwright test --config=playwright.config.ts --project=youtube-200
pnpm exec playwright show-report
pnpm exec playwright show-trace test-results/public/<failure>/trace.zip
```

Failures save screenshots and traces under ignored `test-results/public/` and `test-results/studio/`; HTML reports are under `playwright-report/public/` and `playwright-report/studio/`. The suites use separate artifact directories so starting one does not delete the other’s traces. Chromium geometry tests are not cross-browser certification, physical-device testing, screen-reader review, or scientific verification. Preserve meaningful model fixtures separately. Do not add tests that merely enumerate removed filenames or obsolete UI strings.

Studio browser tests default to port 4192. If another local review service owns that port, use `STUDIO_TEST_PORT=4193 pnpm check` (or `pnpm test:studio`) rather than terminating someone else's preview or reusing it as the test server. The override changes both the test base URL and the owned fixture server; CI keeps the default.

## Static review build

The home page `/` and `/knowledge/` present equal starting points from the active catalog; `CONTENT_PAGES` selects routable explanations independently of preserved source records. Chaptered readers use a self-contained mainline, with directly addressable detours and declared returns where authored. The weekday focus reader retains its separate bounded layout. Browser regressions exercise scene/state contracts rather than assume that format makes one topic a flagship. Retired article URLs return the static 404 page; their source records and scientific/model fixtures remain available for review. See [Content structure](CONTENT-STRUCTURE.md) to add a topic.

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
