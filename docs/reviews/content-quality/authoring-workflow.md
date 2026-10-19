# Isolated authoring workflow verification

## Result and scope

**Result: supported at the recorded revision for a new private manuscript through an isolated review build.** A genuinely new QA-only manuscript was created through the Studio HTTP API, projected once into a dedicated Git worktree, passed Studio's real type-check/validation/static-build action, and was read through the resulting immutable snapshot with Chromium. The host working tree, catalog, content plans and `dist/` were not mutated. An isolated host-derived source tree and catalog were used, modified and built; the snapshot retains the base catalog as well as the QA-only entry.

This is workflow evidence, not content review. The manuscript explicitly states that it is a QA fixture, makes no scientific claim, and is not an approval or publication candidate. No review result or feedback record was imported. General canonical-article import, bidirectional manuscript synchronization, merge-back into the host catalog, publication authorization, and publication remain planned.

## Current v2 contract check

A separate actual run exercised `studio-external-handoff-v2` with QA-only manuscript `qa-authored-intent-route`. It first attempted source preparation with unplanned intent: HTTP 400, with no work or command created. After explicitly authoring both scene intents, the HTTP save/prepare/build path succeeded. The generated topic includes `slide-plan.json` beside its canonical draft, and a real 390×844 Chromium reader navigated `created → rendered` without page errors. The Studio editor displayed the authored intent and success check. No review was imported; quality readiness correctly remained false.

| Identity | Actual value |
| --- | --- |
| Studio revision | `40e7254dbecacbe7756ec2478162fbe3c56aed72b749bba429fa9ffcde0d4cea` |
| Source fingerprint | `4629e220b412c6b5b64f08f383d22ea5b76d05ebc62d99dc14e9a522d5d807e3` |
| Snapshot ID | `84c89324-56b0-4165-ba83-5a7844ccfcfb` |
| Projected intent SHA-256 | `88f71599bfebc68d287d408eb079a186f1d9a0c73242559bdcd8e355b687b79a` |
| Evidence | `test-results/content-quality/authoring-v2/result.json`, `reader-narrow.png`, `authored-intent-editor.png` |
| Retained isolated worktree | `artifacts/studio-workspaces/qa-authored-intent-route-beae87a5-2f97-428b-9bb9-62126d82c671/` |

The driver itself passed strict TypeScript checking before execution. This current check establishes the authored-intent admission boundary and prose-only projection/editor mechanics, not independent review truthfulness, educational quality, source/expert approval, a figure/interactive authoring path, synchronization, host merge-back or publication. The earlier run below remains separately identified rather than being relabeled as v2 evidence.

## Earlier mechanical run identity

- Manuscript ID: `qa-authoring-path`
- Projected article ID: `article:qa-only.qa-authoring-path.ko`
- Studio plan revision: `fcb4bcab7955b860eb04e0a2ab8046a5a6563dae33445b5b14e7581fca38cfd8`
- Isolated worktree branch: `studio/qa-authoring-path-296c616f-aabd-492b-94a1-33408e03a489`
- Worktree base commit: `9049d9fecd3060708c9c16ac9883c43252b709c5`
- Studio source fingerprint: `9df8fe46a6321e1048efc0d0df70836b08834ac5b05dd804034b172bb6f7b0bf`
- Build snapshot ID: `578ddaed-8a28-4985-a590-fdb66c1e5d2c`
- Host commit changed concurrently from `79451861aa3dbe4d33f8c89c00d25f47095199b4` at initial inspection to `29faa9a269fea3761f80cbc19a48e522d46509b3` when identity evidence was captured. Studio's prepare log and the worktree SHA above identify the actual build base; this report does not attribute the concurrent host commits to this QA run.

The isolated worktree contains only the expected projection changes relative to its base: `content/catalog.ts`, `knowledge/concepts.json`, `sources/registry.json`, and the new `content/qa-only/` topic. The source fingerprint and full status are recorded in `test-results/content-quality/authoring/identity.json`.

## Actions and observations

| Stage | Actual action | Observed result | Evidence |
| --- | --- | --- | --- |
| Create | `POST /api/create` with a new `qa-authoring-path` plan containing two prose scenes and explicit QA-only boundaries | HTTP 200; a stable revision was returned in isolated Studio state | `test-results/content-quality/authoring/create-valid.json` |
| Invalid input | `POST /api/create` with ID `../invalid` | HTTP 400, `Invalid ID`; no topic created | `test-results/content-quality/authoring/create-invalid.json` |
| Stale write | `POST /api/save` for the new plan with `stale-revision` | HTTP 409, `Conflict: reload before saving`; current state preserved | `test-results/content-quality/authoring/save-stale.json` |
| Content ceiling | Repeated valid `POST /api/create` calls in the same isolated QA state | The union reached 100 units after 62 additional valid cap fixtures; the next request returned HTTP 400, `Content limit reached`. Studio listed 67 private plans because registered catalog entries and the standalone episode make up the rest of the union. | `test-results/content-quality/authoring/create-cap.json` |
| Prepare | `POST /api/work` with `kind: "prepare"`, then poll `GET /api/work` | Dedicated worktree created; topic article, claims, page, concept, source record, and isolated catalog entry projected once; task completed with a source fingerprint | `test-results/content-quality/authoring/prepare-start.json`, `prepare-result.json` |
| Build | `POST /api/work` with `kind: "build"`, then poll `GET /api/work` | Studio ran strict TypeScript, repository validation, and the actual static builder. The log reports `VALID` and a 291-file static review build; the snapshot manifest includes `/knowledge/qa-authoring-path/`. | `test-results/content-quality/authoring/build-start.json`, `build-result.json`, `state/builds/578ddaed-8a28-4985-a590-fdb66c1e5d2c/site/build-manifest.json` |
| Reader | Open the snapshot route with Node Playwright's Chromium launched with `--no-sandbox`; read scene 1, click Next to scene 2, open the evidence panel, and click Previous | HTTP 200; hashes changed from `#created` to `#rendered` and back; the correct authored prose rendered; evidence remained explicitly pending; no console error, failed request, horizontal overflow, or document overflow at 1280×900 | `test-results/content-quality/authoring/browser-reader.json`, `reader-second-scene.png` |

The snapshot was served during verification from an ephemeral Studio-owned loopback port (`39801` for this run). That URL is runtime evidence, not a stable address. The retained static snapshot path above remains inspectable after the server stops.

## Defects and limits

### Product/workflow defects

No blocking defect was found in the exercised new-manuscript path. Creation, isolation, projection, validation, build, snapshot serving, reader navigation, and the three rejection boundaries behaved as their current contracts describe.

This narrow result does not show that arbitrary canonical content can be imported into Studio or synchronized back after direct editing. `tools/studio/README.md` correctly marks general canonical import, nested-catalog recognition, and bidirectional synchronization as planned. Studio also has no merge, publication, or approval action. A lead should not describe this successful private projection as host-catalog addition or publication support.

### QA tooling defect

The Playwright MCP browser attempted to launch `/opt/google/chrome/chrome` without `--no-sandbox` and failed in the container with `Failed to move to new namespace` / zygote exit 1. This is a QA-harness launch defect, not a reader defect. The required fallback used the repository's own `@playwright/test` Chromium with explicit `args: ['--no-sandbox']`; the successful launch configuration is recorded in `browser-reader.json`. No product code change was needed.

### Evidence limits

- The QA manuscript is prose-only. It does not demonstrate figure installation, an interactive adapter, state restoration, audio, timing observation, or video projection.
- One 1280×900 Chromium reader path was used. This is actual reader usage, but not the full supported-viewport, cross-browser, screen-reader, or comprehension review.
- The generated source entry deliberately says `QA fixture marker — not external evidence`, with authorship, revision, rights, and publication review pending. The build manifest remains `published: false`, `sourceSnapshotVerified: false`, and `needs-content-review`.
- Build and browser success establish mechanics only. They do not establish source accuracy, educational quality, learner comprehension, rights clearance, independent expert review, or publication approval.

## Retained ignored evidence and cleanup

The run's ignored state, immutable snapshot, API records, browser log, and screenshot are retained under `test-results/content-quality/authoring/`. The dedicated ignored worktree is retained at `artifacts/studio-workspaces/qa-authoring-path-296c616f-aabd-492b-94a1-33408e03a489/` so the exact projected diff can be inspected against the recorded base SHA. These are QA artifacts, not canonical content.

After this review no longer needs reproduction, remove only this run's worktree and branch with `git worktree remove --force artifacts/studio-workspaces/qa-authoring-path-296c616f-aabd-492b-94a1-33408e03a489` and `git branch -D studio/qa-authoring-path-296c616f-aabd-492b-94a1-33408e03a489`, then remove `test-results/content-quality/authoring/`. Do not remove other Studio workspaces or shared artifacts.
