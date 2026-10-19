# Corrective surface re-review: selected repairs

## Review record and verdict

- Date: 2026-10-19.
- Reviewer: OpenCode `Sisyphus-Junior` using repository-local Node Playwright Chromium; no subagent or MCP browser was used.
- Runtime: the already-running static review build at `http://127.0.0.1:4174`. The server was ready on the first request (HTTP 200). No build, source edit, server restart, port change, shared suite or commit was performed.
- Reviewed build identity: SHA-256 of `dist/build-manifest.json` is `b41108fefe3aa07f27513112f4f209fb4532db05f40f3a0b49af51df0b140a74`. The original catalog reports reference the older manifest hash `b4ae9daa844c699d63553eac5fea0bca10b629decfc98b96c3b98417feca57d1`; their rendered and 44 px findings were not inherited as current evidence.
- Evidence: 51 fresh viewport screenshots and runtime/state measurements under ignored `test-results/content-quality/corrective-surface/`; machine-readable details are in `observations.json`.
- Viewports: 1920×1080 CSS px, 390×844 CSS px, and compact 960×540 CSS px at DPR 2.
- **Selected-corrections verdict: FAIL.** Counting-zero, CH goal visibility, probability exact trees, and the exercised state/keyboard contracts pass their selected checks. The nuclear proton scene is not usable at compact 960×540, and the ZFC compact rendering removes the direct extensionality relation that the correction was meant to expose. This is not a verdict on the whole catalog.

The review separates rendered fit from purpose attainment. A surface can fit and still fail to show the reasoning object; conversely, a correct state transition does not establish scientific accuracy or learning.

## Selected correction results

| Correction | Fit and behavior | Purpose attainment | Verdict |
| --- | --- | --- | --- |
| `counting-zero` figures (`question`, `empty-set`, `identity`) | All three scenes fit all three viewports with no measured document or internal overflow. The nine screenshots were visually inspected. | Three objects are countable before `3`; the empty box maps to `0`; `∅` is a separate object with a directional cardinality mapping to numeral `0`; and five objects plus an explicitly empty group remain five. Narrow diagram annotations are small but still readable and unambiguous. | **PASS** |
| `nuclear-constituents/proton` four stages | Desktop and narrow show setup → contact → emission → inference without clipping. Manual previous/next, replay, play/pause, scrub, unordered seeks, reset/restoration, invalid-state atomicity and reduced-motion manual states worked. At compact, `.reader-workbench` exceeds its client height by 331 px, the menu summary is above the viewport (`y=-50…-6`), the dialogue overlays the process, and the Blackett/history line is cut off. | Desktop/narrow clearly separate emitted positive hydrogen nucleus as observation from the constituent proposal as tentative inference, with the unresolved-reaction and not-to-scale caveats persistent. The clean incoming/outgoing path still carries some risk of implying a specific direct mechanism, mitigated but not erased by the `?` region and caveats. Compact overlap materially obscures the process and scope evidence. | **FAIL** |
| Other six nuclear scenes | `question`, `neutral`, `collision-model`, `recoil`, `limit`, and `transfer` remain static at every viewport; none inherited proton timeline controls. All 18 captures fit. | The static cards correspond to their authored topics, but prior educational gaps remain: penetration is asserted rather than compared, collision conditions are not diagrammed, the recoil calculation is not worked, and the transfer cancellation is stated rather than shown. These were not selected corrections and remain open catalog findings. | **PASS for isolation; not cleared educationally** |
| `zfc/extensionality` | Direct desktop/narrow entry shows goal `A = B` with premises `A ⊆ B`, `B ⊆ A`. Custom goal `A = C` survived navigation; “장면 예시로” explicitly restored the authored example; reset/restoration and invalid-scene atomicity worked. Compact has 18 px workbench overflow and suppresses the relation diagram/derivation. | Desktop/narrow visibly converge both inclusions on equality. Compact leaves only editable premise/goal fields, so the corrected explanatory relationship is no longer directly represented. | **FAIL** |
| `continuum-hypothesis/metaproof` normal goal | Narrow `Ind(CH,ZFC)` measures `clientWidth=scrollWidth=146` and is fully visible. Enter on Previous and Space on Next moved `metaproof → branches → metaproof`. Compact keeps the full goal readable but has 44 px workbench overflow and omits the branch-combination diagram/derivation. | The selected old blocker—narrow target truncation—is resolved. Desktop/narrow show the two nonprovability directions combining into independence. Compact retains the answer but weakens the reasoning representation; the broader old representation-purpose concerns remain open. | **PASS for full-goal correction** |
| `two-children/filter` | Every viewport enters at branch stage 3/3 and trial count 0. Keyboard changed the native process select, activated the 10-trial button, changed the native range, reset to the scene baseline, and restored the saved state. | Before any trial, BB/BG/GB/GG, four `1/4` priors, likelihoods `1,1,1,0`, and exact conditioned result `1/3` are visible. Narrow labels are small but legible. Sampling remains visibly secondary. | **PASS** |
| `monty-hall/compare` | Every viewport enters at branch stage 3/3 and trial count 0. Keyboard changed the native policy select from blind to informed, activated trials/range, reset to blind/count 0, and restored informed/count 10. | Before any trial, three `1/3` prize branches, likelihoods `1,1/2,1/2`, and exact blind-host conditioned result `1/2` are visible. Narrow labels are small but legible. The screenshot and state are for the authored blind comparison, not the standard informed `2/3` strategy scene. | **PASS** |
| Shared controls | Fresh dimensions are: menu 140×44, Previous 82.5×44 and Next 120×44 at desktop/compact; menu 128×44, Previous 52.7×44 and Next 80×44 at narrow. Keyboard activation was exercised on CH navigation and native probability controls. | The stale original finding that menu/navigation controls were 20–40 px high is resolved on the current build. This does not excuse the nuclear compact menu being moved completely above the viewport by that scene's layout. | **PASS generally; FAIL in nuclear compact context** |

## Nuclear state and prose evidence

- Manual next stages were exactly `contact`, `emission`, `inference`; replay returned to `setup`.
- Play changed the control to `일시정지`; pause preserved a finite current `timeMs`.
- Scrubbing to 3200 ms selected `emission`.
- Out-of-order seeks `4800 → 0 → 3200 → 1600` yielded `inference → setup → emission → contact`, independent of prior order.
- Saving inference at 4800 ms, global reset and restoration returned the exact saved scene/interaction state. An invalid negative time left the state byte-for-byte unchanged.
- Under `prefers-reduced-motion: reduce`, autoplay was disabled while manual next selected `contact` and manual scrub selected `inference`.
- The visible canonical proton prose was identical before and after presentation changes: it names 1919–1920 alpha bombardment, emitted positive hydrogen nuclei, Rutherford's tentative constituent interpretation and the limit that a complete 1919 reaction path was not established. This is a rendered-copy consistency check, not a new source audit.

## Geometry and screenshot observations

- All 51 captures had zero document horizontal and vertical overflow and emitted no page or console errors. This alone is not a pass: fixed-height hidden overflow caused the compact nuclear failure.
- At 390×844, the nuclear workbench and process each measured 2 px of horizontal excess. Nothing was visibly clipped in the screenshots, so this is recorded as a rounding/border lead rather than a blocker.
- Counting-zero and both probability corrections fit at 960×540. Static nuclear scenes also fit there.
- The compact dynamic workbenches expose the actual current limit: nuclear content is materially overfull; ZFC and CH suppress central reasoning visuals while retaining controls/prose. The platform's declared normal enhanced-web sizes remain 1920×1080/940/900 and narrow 390×844; 960×540 is the 200% media-capture CSS baseline, not a blanket web-support promise. It was nevertheless explicitly tested here and remains a blocker for the selected nuclear correction and a purpose gap for compact ZFC.
- Shared navigation reaches 44 px height in all sampled non-broken contexts. Compact nuclear still makes the menu unreachable despite its nominal 44 px size.

### Inspected screenshot groups

The reviewer personally opened and inspected, rather than merely measured:

- all nine counting-zero figure captures;
- all 12 nuclear proton stage captures;
- all 18 static nuclear scene captures;
- ZFC extensionality and CH metaproof at all three viewports;
- two-children/filter and Monty Hall/compare at all three viewports.

Files follow `<surface>--<scene-or-stage>--<viewport>.png` under `test-results/content-quality/corrective-surface/`. Examples of the blocking evidence are `nuclear-proton--inference--compact-960x540.png` and `zfc--extensionality--compact-960x540.png`.

## Required follow-up

1. Repair compact nuclear composition without hiding overflow: keep the menu, complete process, controls, both persistent caveat lines, dialogue and navigation reachable simultaneously, then repeat all four stage captures and interaction paths.
2. Decide and document the compact ZFC/CH representation contract. If 960×540 is supported for these readers, retain the direct extensionality relation and CH branch combination instead of silently dropping the reasoning visualization; if not supported, keep the limit explicit rather than treating fit of premise fields as purpose attainment.
3. Preserve the exact pre-trial probability trees, reset baselines, native controls and current 44 px shared-control heights while fixing unrelated layouts.
4. Keep the uncorrected catalog gaps open. In particular, this scoped run does not clear the other six nuclear scenes' representation findings or the broader ZFC/CH introductory-scene mismatch.

## Untested and not approved

- No external source passage, source byte/revision, mathematical or historical claim was independently verified; there was no new source audit.
- No screen reader, accessibility tree review, contrast audit, touch-accuracy session, physical device, non-Chromium engine or hidden-tab pause test was run. Keyboard checks were limited to the named shared/native controls.
- Nuclear playback timing smoothness beyond start/pause and deterministic state boundaries was not frame-profiled. Probability animation/unfold timing and seeds other than 42 were not reviewed.
- Counting conventions beyond the three corrected figures, ZFC scenes other than extensionality, CH scenes other than metaproof, probability scenes other than filter/compare, and the rest of the catalog were not re-reviewed.
- No narration/audio timing, video export, learner-comprehension study, expert approval, rights clearance, publication approval or publication action occurred. This report grants none of them.
