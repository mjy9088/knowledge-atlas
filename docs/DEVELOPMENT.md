# Development and verification

## Setup

Use Node.js 22 or later and pnpm. `mise.toml` records the local tool choices; where needed, prefix commands with `mise exec --`. Install the locked development dependencies and Chromium once:

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm dev
```

The development server defaults to `http://127.0.0.1:4173`; set `PORT` to choose another port. It serves the working tree, including local media helpers. Opening a local server or building files does not publish content.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm validate` | Concrete source/claim/content references, semantic metadata, episode bounds |
| `pnpm test` | Node unit tests for models, state, projections, build/link/hash behavior |
| `pnpm test:ui` | Chromium regression suite against a fresh static build |
| `pnpm check` | Validation, unit tests, then browser tests |
| `pnpm build` | Validate and generate `dist/` |
| `pnpm preview` | Serve `dist/` locally on port 4174 |
| `pnpm preview:manifest` | Focused episode timeline, VTT, hashes, frame diagnostics |
| `pnpm storyboard` | Original 30-second storyboard export |
| `pnpm impact` | Candidate dependency impact for a source change |
| `pnpm release:check` | Report unresolved publication prerequisites; blocking is currently expected |

Equivalent `npm run` commands work when npm is available. The dependency lockfile is `pnpm-lock.yaml`; keep one package-manager lockfile.

## Browser regression contract

`playwright.config.mjs` builds and serves the actual static output on dedicated port 4190, with two Chromium workers. It also starts the development server on port 4191 for the local media smoke test. Stop unrelated services on these ports before running; the runner does not reuse an existing server. The projects use CSS viewports 1920×1080, 1920×940, 1920×900, and 390×844.

`tests/browser/readers.spec.mjs` checks catalog entry navigation, optional experiments, local media preview, all focused-lesson and related-reader scenes, every related model preset, navigation, evidence panels, input invalidation, reset, and eight-premise editing. It measures document extents and actual content scroll extents, plus control bounds and hit targets. Hiding overflowing content with CSS does not satisfy these checks. Default content must fit; deliberately expanded user collections and opened reference panels may scroll internally as specified in [Product](PRODUCT.md).

Run a focused project or inspect failures:

```sh
pnpm test:ui --project=desktop
pnpm exec playwright show-report
pnpm exec playwright show-trace test-results/<failure>/trace.zip
```

Failures save screenshots and traces under ignored `test-results/`; the HTML report is under ignored `playwright-report/`. Chromium geometry tests are not cross-browser certification, physical-device testing, screen-reader review, or scientific verification. Preserve meaningful model fixtures separately. Do not add tests that merely enumerate removed filenames or obsolete UI strings.

## Static review build

Useful routes: `/` (knowledge catalog), `/lesson.html`, `/knowledge/`, `/knowledge/consistency/`, `/knowledge/paraconsistent-logic/`, `/knowledge/zfc/`, and `/knowledge/continuum-hypothesis/`. See [Content structure](CONTENT-STRUCTURE.md) to add a topic.

Deployable files are generated in `dist/`; `build-manifest.json` records builder inputs, output hashes, and pending review states. Hosting must support directory indexes and root-relative paths. A successful build is a local candidate, not authorization to upload it. Never deploy the repository or development server as the public site.

## Local media production

Open `/tools/media/` on the development server to generate WebM from the shared Canvas/WebCodecs timeline. This is a local helper, not a public page or an end-to-end headless CLI renderer. Supported output profiles are 1080×1440 and 1920×1080 at 24/30 fps. Current output is silent; audio/TTS production is not implemented. Packets are held in memory, so long renders and low-memory devices are limited.

Convert an existing WebM locally:

```sh
pnpm render:mp4 -- input.webm output.mp4
node scripts/encode-mp4.mjs --help
mise exec -- ffmpeg -version
```

The CLI invokes mise FFmpeg/ffprobe through argument arrays, refuses output overwrite, and records hashes and media diagnostics. H.264 MP4 is transcoded from VP8 WebM rather than lossless frames. Native WebM preview compatibility may vary; record a preview failure explicitly rather than claim successful decode. Browser preview and ffprobe checks do not establish every frame's quality or scientific correctness.

Before final media approval, generate and inspect the timeline, captions, frame samples, metadata, and audio diagnostics. Verify that changed goals and excluded premises match the displayed proof. Existing ignored artifacts are local candidates, not source-controlled publication evidence.
