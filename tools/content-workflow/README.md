# Native content review workflow

This local CLI builds and binds the canonical `content-review-v2` candidate to a repository-byte fingerprint, the emitted static files and build inputs named by `dist/build-manifest.json`, and two structurally validated independent review lanes. It does not run a model API, content instruction, commit, publication action, or approval step.

## Commands

In OpenCode, `/atlas-improve <slug> [focus]` runs the authoring/correction workflow with two separate `atlas-reviewer` subagent calls. `/atlas-review <content|surface> <absolute-run-directory> <reviewer-identity>` is a read-only native subtask; `/atlas-resume <absolute-run-directory>` reads the saved gate and continues only the unfinished work. Restart OpenCode after adding or updating these project-local commands and agent. Command definitions are under `.opencode/commands/`; the reviewer denies source edits, arbitrary shell actions and child tasks, with the fixed browser-evidence command below as its sole shell exception. Browser/source tools may still be used; unavailable checks remain unverified. The author saves each returned report verbatim and invokes the CLI below. No plugin, SDK service or new model credentials are required beyond the user's configured OpenCode provider.

The project also exposes the discoverable `atlas-workflow` skill through `opencode.json`. `node --import tsx tools/content-workflow/activation.ts` checks the actual loopback server's command, agent and skill registries using inherited credentials without printing them. `OPENCODE_WORKFLOW_URL` selects another loopback server; checking a fresh standalone CLI alone is not evidence about an already running hosted instance.

The project inherits the user's configured primary agent rather than pinning a stock name such as `build`: agent plugins may replace that name. Author and resume commands likewise inherit the selected primary; only the independent review command selects its registered reviewer explicitly. Native commands can fail before choosing that reviewer if the configured default is missing. Activation diagnostics therefore check that the default is an available, visible primary. `ready` means these prerequisites hold; `executionVerified: false` deliberately prevents confusing registration with actual model/subagent execution.

Reviewers retain source-edit and child-task denial. A single fixed shell command is allowlisted as a container browser fallback: `node --import tsx tools/content-workflow/browser-check.ts <registered-slug>`. Inspect it before execution. It drives installed Playwright Chromium against the local static preview, checks every scene at desktop/narrow widths, changes available select controls, exercises invalid state/reset/restoration and authored-motion seeking/scrubbing/immediate navigation, and writes only ignored `test-results/independent-reader/` evidence. It launches with the container's required no-sandbox flag; it is not a general shell or arbitrary URL runner. Its execution establishes mechanical behavior, not mathematical truth, source accuracy or learning. Reviewers must open the returned images and report unexecuted checks honestly.

```sh
pnpm content:workflow prepare <registered-slug> <author-session>
pnpm content:workflow record <absolute-run-directory> <content|surface> <reviewer-session> <report-file>
pnpm content:workflow status <absolute-run-directory>
pnpm content:workflow --help
```

`prepare` first runs the fixed shell-free `pnpm build` action, then runs the existing canonical packet exporter through `node --import tsx` and creates:

```text
artifacts/content-workflow/<slug>/<uuid>/
  packet.json
  run.json
  content.report.json  # after content record
  content.receipt.json # immutable hash/reviewer/revision receipt
  surface.report.json  # after surface record
  surface.receipt.json # immutable hash/reviewer/revision receipt
```

The ignored artifact path is fixed. Slugs, run-directory ancestry, symlinks, argument counts, and session identifiers are checked. Accepted original report bytes and their receipts are linked into place as one write-once operation and cannot be replaced through the CLI. Their hashes detect ordinary report edits or a missing receipt; they are not adversary-proof against the filesystem owner changing both files. Start a new run after any revision; earlier runs and reports remain intact.

Prepare prints JSON with absolute `runDirectory` and `packetFile`, the canonical `templateContract`, `candidateFingerprint`, `packetRevision`, and `runtimeBinding`. The candidate fingerprint hashes sorted paths and bytes for all tracked files plus nonignored untracked files, including a missing marker for tracked deletions. Ignored workflow writes do not change it. Runtime identity separately binds the manifest bytes, candidate route, every confined non-linked emitted file, and every manifest build input against its actual bytes. A changed/missing output, stale build input, path escape, link, or absent candidate route makes status stale and prevents report recording.

## Reviewer result

Begin with the printed `templateContract`. Return its exact `protocol`, `revision`, targets, and eight dimensions. Fill these required top-level fields:

```json
{
  "protocol": "content-review-v2",
  "revision": "<packet revision>",
  "provenance": {
    "origin": "external-review-assertion",
    "reviewer": "<same reviewer-session passed to record>",
    "reviewedAt": "2026-10-20T12:00:00.000Z",
    "verification": "user-assertion",
    "verificationScope": ["specific files, sources, build, and viewports actually checked"]
  },
  "approvalStatus": {
    "expert": "pending",
    "rights": "pending",
    "learner": "pending",
    "publication": "pending"
  },
  "reports": [],
  "findings": []
}
```

Every packet target must occur once. Every target report needs a nonempty `summary`, `findings`, and each of `value`, `objective`, `coherence`, `reasoning`, `representation`, `interaction`, `surface`, and `source` exactly once. Assessment rows use the canonical current fields: `dimension`, `verdict`, `expected`, `actual`, nonempty typed `evidenceRefs`, `requestedCorrection`, and `invariant`. `not-applicable` is rejected for every dimension except interaction. Interaction may use it only for a scene-specific authored static rationale, with explicit actual/correction text and manuscript or artifact evidence; `overall` interaction is never automatically not-applicable.

A finding has this shape and always blocks the gate, even when assessments are adequate:

```json
{
  "target": "overall",
  "severity": "blocking",
  "reason": "Observed mismatch",
  "requestedCorrection": "Required correction",
  "invariant": "Accepted behavior to preserve"
}
```

`severity` is `blocking` or `revise`. Findings may occur at top level or in a target report.

The content lane owns `value`, `objective`, `coherence`, `reasoning`, and `source`. The surface lane owns `representation`, `interaction`, and `surface`. Non-owned dimensions remain honest `unverified` unless actually assessed. The author session cannot review either lane, and one reviewer session cannot fill both lanes.

Identity parameters are declarations: use real session IDs when exposed, otherwise explicit unique labels and record actual task/session metadata separately. String inequality is not proof that different people or processes evaluated the material; native separate subtask calls and their returned session metadata provide execution evidence. The tool validates structure, identity consistency and byte bindings, not truthful source inspection or review conclusions. Do not invent session IDs or fill missing rows with favorable judgments.

## Status

`status` revalidates the packet, run record, current source/build identities, report receipts and all stored reports. It returns `awaiting-review`, `needs-revision`, `reviewed`, or `stale`, plus each lane's owned outstanding dimensions. Missing runtime evidence can never become reviewed. `reviewed` means only that both lane contracts are structurally complete, owned dimensions are adequate or the narrowly permitted interaction not-applicable, and no findings remain. Expert, rights, learner, and publication status always remain pending; reviewer provenance and optional task/session scope remain assertions rather than proof of independence or truth.
