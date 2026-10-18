# Local content studio

Run `pnpm studio` and open `http://127.0.0.1:4180`. Studio is a private, loopback-only authoring/review tool outside the public reader asset roots and catalog. It has no publication action and does not launch Codex or another agent runtime. `STUDIO_PORT` and `STUDIO_DATA_DIR` configure the server.

## Working contract

The initial manuscripts are binary relations, Monty Hall with an abbreviated statement missing the host policy, and the two-child observation problem. They are editable draft manuscripts/storyboards, not approved publications. [examples.ts](examples.ts) owns their initial goals, source locators, bounded claims, concept introductions, planned video durations and visual descriptions. Source consultation is not frozen-byte verification, rights clearance or expert approval.

Edit the overall brief or selected slide, then save before changing content, exporting a packet or starting a build action. Optimistic revisions reject stale saves. Initial-draft restoration is explicit. The editor can clone a draft under a new stable content/domain ID, edit full brief/source/claim JSON and policy selection, and add, reorder or delete slides while preserving references. Existing export still returns the complete local topic state; it does not publish or overwrite canonical article content.

## External-agent handoff

Studio uses files rather than an embedded chat:

1. Prepare the isolated workspace. Studio displays its absolute directory and branch.
2. Export an **implementation packet**. It binds the saved plan and feedback to the current revision and includes the exact workspace directory, branch and reader route. Give that JSON file to OpenCode or another external agent and instruct it to work only in that directory.
3. Return to Studio, inspect the worktree changes, and import the packet’s completed implementation-result JSON. Studio validates the exact current topic revision/workspace and computes a source fingerprint at import. This user acknowledgement does not prove the reported checks ran and is not review, approval or publication evidence. Later source changes no longer inherit that revision linkage.
4. Export an **independent review packet** for a separate reviewer. It contains every required target (`overall` plus each slide), reusable policy checks, the saved plan/feedback and a result contract.
5. Import the reviewer’s JSON result with reviewer identity, review time, evidence notes and artifact references. Studio records these as user-supplied provenance and rejects unknown protocols, another topic/revision, missing or duplicate targets, invalid slide references, invalid severities and malformed timing evidence. A plan edit makes an older result stale.

The packet protocol is `studio-external-handoff-v1` in [handoff.ts](handoff.ts). Imported reports distinguish blockers from warnings and timing remains estimated/unverified without actual audio/video observation. Studio validates and displays supplied provenance but does not establish that an independent run occurred. The reviewer cannot resolve human feedback. Imported review readiness remains separate from content/expert/rights approval and publication.

The retired embedded-chat source and HTTP actions are absent. Existing ignored `chats.json` files are deliberately left untouched so prior local histories are not destroyed; Studio no longer reads, displays or modifies them. Historical review jobs in `state.json` remain visible. Pending jobs from an older runtime are marked interrupted on restart and are never replayed.

## Review and state safeguards

[contracts.ts](contracts.ts) owns reusable narrative/claims/timing, formal-model and observation-process policies. Review revisions cover the complete plan, policy set, packet protocol and related base-rates source. Readiness requires a current imported report for every target, no blocking findings, no unresolved user feedback/questions and a slide total within the shared video budget. Warnings remain visible.

Validated plans, feedback and imported reports live in ignored `artifacts/studio/state.json` through atomic replacement. The server binds only to loopback, rejects foreign Host/Origin writes, bounds JSON payloads, validates typed actions and exposes no shell or agent endpoint. One server owns one data directory.

## Production workspace and build

The production pane creates one isolated Git worktree per content from committed `HEAD` under ignored `artifacts/studio-workspaces/`, on a `studio/…` branch. Uncommitted host edits are not copied. Preparation projects a new manuscript once into topic-owned article/claims/page sources or retains an already registered topic’s canonical sources. Existing workspace sources are never overwritten by plan saves or repeated preparation.

Studio itself only performs bounded host-owned actions: prepare the worktree, install the registered topic figures, install the registered interactions, inspect Git status/diff, and build. Arbitrary implementation is done externally from the exported packet. The build action runs strict type checking, repository validation and the actual static builder. It fingerprints sources before/after, rejects linked output, preserves the last successful snapshot after failure and never changes the host catalog or public build output.

Snapshots are immutable local artifacts served from separate loopback origins and shown in a sandboxed iframe. Build feedback records snapshot ID, source fingerprint and Studio-selected slide. The preview origin has no Studio write API. Worktrees, snapshots and logs remain local; automatic archival and quotas remain future work.

## Metadata, figures and interaction

Format, depth and purpose are independent. Shared video budgets begin at 180 seconds for short and 900 seconds for long content; they apply only to video playback. Web reading and interaction are self-paced. Existing plans missing metadata receive the narrow legacy migration; malformed edited metadata is rejected.

[visuals.ts](visuals.ts) and the versioned figure patches install original topic-owned SVG teaching artwork without overwriting changed human assets. [install-interactions.ts](install-interactions.ts) installs registered deterministic reader adapters while preserving prose, scene IDs and artwork. Neither action establishes independent content review, source/rights verification or measured narration pacing. Build remains a separate explicit action.

## Layout and verification

[DESIGN.md](DESIGN.md) records the extracted design system. The document owns vertical scroll; logs, slide navigation and the preview own only their bounded directions. Narrow layouts stack, and navigation, packet controls, save, feedback and build actions remain reachable.

Run `pnpm typecheck`, `pnpm validate`, `pnpm test` and `pnpm test:studio`. The normal `pnpm test:ui` also includes Studio. Browser tests exercise packet export/import, removed chat endpoints, authoring persistence, real isolated builds and desktop/narrow/960×540 layouts. Controlled review JSON is a protocol fixture, not editorial evidence. Public static build tests must continue to exclude Studio assets, manuscripts and runtime state.
