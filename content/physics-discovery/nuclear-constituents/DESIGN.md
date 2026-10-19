# Nuclear constituents reader design contract

## 1. Scope and direction

This contract extends the existing reader for the interactive `proton` process and three static neutron-reasoning figures. The visual language remains the reader's quiet paper-and-ink system: warm paper, white evidence surfaces, green structure, amber observation emphasis, and no imported imagery. The memorable moments are explanatory rather than decorative: the proton observation remains separate from its tentative inference, while the neutron sequence makes conditions, charged-recoil observations, and the unseen-projectile inference inspectable at once.

Every schematic is original explanatory geometry, not an apparatus reconstruction, neutron-track or cloud-chamber photograph, simulation, measured trajectory, quantified penetration-thickness display, or scale drawing. The proton process must not show a complete alpha-capture-to-oxygen pathway as established in 1919. The neutron figures must not depict force arrows as velocity arrows, use an arbitrary collision angle, or replace the historical `0.89` estimate with a modern precision mass.

## 2. Reader and accessibility constraints

- Primary reader: a Korean-speaking reader who understands basic charge but may conflate evidence for a nucleus with evidence for its constituents.
- Screen-reader and keyboard users must receive the same ordered stages, current observation, controls, and caveats as sighted pointer users.
- Motion-sensitive readers get the same four still states through step buttons and the scrubber; automatic playback is disabled under `prefers-reduced-motion: reduce`.
- Color never carries stage or evidence status alone. Labels, shape differences, and the live current-observation text duplicate every color distinction.
- The existing article dialogue remains authored prose. Animation progress changes only presentation labels and geometry, never the scientific dialogue.
- Korean status and dialogue copy wrap at word boundaries (`word-break: keep-all`) so a syllable is not orphaned from its word at narrow widths.

## 3. Existing tokens and layout

The scoped stylesheet defines aliases only from the established article palette and 4 px spacing rhythm:

- `--nuclear-ink`: `#293f35`; `--nuclear-muted`: `#526b58`.
- `--nuclear-line`: `#d5dfcc`; `--nuclear-surface`: `#ffffff`; `--nuclear-paper`: `#f6f8f0`.
- `--nuclear-structure`: `#365c42`; `--nuclear-observation`: `#a56d30`; `--nuclear-observation-soft`: `#f3dcb0`.
- Spacing: 4, 8, 12, 16, 24 px. Radius: 8 and 16 px. Type uses the inherited reader stack and its existing 11/12/15/20 px hierarchy.

The proton workbench uses one bounded process panel. Above 640 px it uses a horizontal target → impact → emitted-particle → inference path. At 640 px and below it uses an equivalent wrapped two-row path rather than shrinking the desktop coordinates: source, target, and emission occupy the first row, with the inference directly below. Both geometries receive the same frame and shared vocabulary; breakpoints change placement only, never scientific content or timing.

Each neutron figure uses a `560 × 360` view box, 16 px outer inset, 4 px coordinate rhythm, horizontal Korean labels of at least 17 px, and rows rather than dense columns. The `neutral` lanes align the same incident direction and distinguish a stopped proton from continuing beryllium radiation without encoding thickness as a measurement. The `collision-model` before/after rows share one collision axis and put the target at rest before impact. The `recoil` rows align the two target cases and reserve a lower algebra band for the ratio and solved historical estimate. SVG positions are schematic, not physical distances or times.

At landscape surfaces no taller than 600 CSS px and wider than the shared 720 px narrow breakpoint, the proton scene becomes a deliberate two-column reading frame. The process occupies the left track and the complete canonical dialogue occupies the right track; shared navigation spans both below. Inside the process, the wrapped schematic occupies its own left track while stage legend, status, controls, scrubber, scope, and history form a second track. The process/dialogue split is `11fr / minmax(360px, 9fr)`; the process split is `6fr / minmax(200px, 4fr)`. This is the 960 × 540 CSS-pixel, DPR 2 projection baseline, not a reason to shrink text, hide prose, or add a scrolling exception.

## 4. Proton process states

| State | Visible process | Current status | What the reader should infer |
| --- | --- | --- | --- |
| `setup` | Alpha source, beam direction, nitrogen target | 설정 | The changed condition is alpha bombardment of nitrogen/light elements. |
| `contact` | Beam reaches a bounded unresolved-interaction region | 관찰 전 단계 | The drawing does not specify capture, oxygen production, or internal reaction details. |
| `emission` | A distinct positively marked hydrogen nucleus leaves the target region | 관찰 | The reported outcome used here is an emitted positive hydrogen nucleus. |
| `inference` | Observation remains visible; a separate inference panel appears | 잠정 해석 | Rutherford treated the hydrogen nucleus as possible evidence of a nuclear constituent; later Blackett evidence addressed the unresolved reaction process. |

Every state keeps this scope line visible: `개념도 · 궤적·장치·축척 재현 아님 · 반응 세부는 1919년에 미해결`. The history note naming later Blackett evidence is always visible rather than revealed only at the end.

## 5. Primitives and states

- **Process schematic:** semantic SVG groups for alpha beam, nitrogen target, unresolved interaction, emitted hydrogen nucleus, and inference. Each group has an authored label; opacity/transform encode stage without removing labels from the accessible summary.
- **Observation status:** a polite live region containing exactly one stage name and one current observation. It never claims a photograph, track, or measured path.
- **Timeline controls:** previous stage, play/pause, next stage, replay, and a labelled range scrubber. Disabled endpoints remain legible. Replay returns to `setup`; in reduced motion it does not start playback.
- **Scope/history notes:** persistent plain text below the schematic. They are not tooltips or optional disclosures.

### Static neutron figures

- **Conditional penetration lanes:** two aligned lanes explicitly share incident mass and speed. The proton lane ends at a qualitative stop marker; the beryllium-radiation lane continues. A separate inference band says the observation supports very small or zero charge while penetration alone leaves the gamma alternative unresolved.
- **Head-on maximum-recoil setup:** before and after rows use one horizontal collision axis. `M` carries the incident velocity arrow `V`; target `A` is explicitly stationary before collision; the charged target's recoil arrow is `u_max`. The unseen projectile and observed charged recoil use different shapes and labels. No force vectors or arbitrary-angle geometry appear.
- **Two-target mass ledger:** hydrogen and nitrogen rows share projectile `M` and common `V`, with distinct `A=1` and `A=14`. Reported maximum recoil speeds appear beside the charged targets. The algebra band defines `r=u_H/u_N`, cancels `V` only under the common-speed condition, and shows `M=(14-r)/(r-1)≈0.89` proton-mass units as a historical estimate.
- **Static state:** all comparisons and algebra are visible simultaneously. There is no quiz, answer gate, fake manipulation, hidden state, topic-specific reset, or reduced-motion branch.

Focus uses the reader's existing 3 px green outline. Controls use native buttons/range input and a minimum 44 × 44 CSS px button target inside the panel. Rendered SVG labels are at least 12 CSS px at compact widths and 13 CSS px on desktop; scope and history notes are at least 12 CSS px. At 390 × 844, 960 × 540 at DPR 2, and 1920 × 1080, the process, canonical dialogue, reader controls, menu, scope, and history fit without document or normal internal scrolling.

## 6. Motion contract

Normal playback lasts 6 seconds and is a deterministic projection of time: `setup` at 0 ms, `contact` at 1,600 ms, `emission` at 3,200 ms, and `inference` at 4,800 ms. Seeking any time computes the same complete frame without prior clicks. Frame updates are immediate rather than CSS-interpolated, so a direct seek cannot inherit hidden visual state from an earlier frame. Labels and persistent caveats do not move. Playback pauses when the scene becomes inactive or the document is hidden.

This is a novel staged-process mechanism because no installed motion library or matching project primitive exists. Native `requestAnimationFrame` advances a pure time cursor. Manual step and scrub controls are the canonical fallback and remain available in all motion preferences.

## 7. Retrospective proposed seven-scene intent

| Scene | Canonical content / reasoning step | Prerequisite | Representation choice and observable success check |
| --- | --- | --- | --- |
| `question` | Question block and scope claim; separate nuclear location/charge from constituent identity. | Gold-foil scattering as evidence for a compact positive center. | Existing static cards suffice for framing; reader states that scattering alone does not identify protons or neutrons. |
| `proton` | Proton block and claim; distinguish bombardment, emitted positive hydrogen nucleus, and limited constituent proposal. | Question scene's evidence-boundary distinction. | Existing staged process remains unchanged; reader names the observation, tentative inference, and unresolved reaction details without asserting oxygen production. |
| `neutral` | Neutral block and neutron claim; condition the penetration comparison on equal mass and equal incident speed. | Charged particles lose energy in matter. | Original simultaneous two-lane figure; reader identifies the held conditions, qualitative stopping/penetration contrast, small-or-zero-charge inference, and why penetration alone does not settle the gamma alternative. |
| `collision-model` | First two sentences of the recoil block and neutron claim; define the maximum-transfer idealization. | Neutral scene motivates a particle hypothesis but does not make the projectile visible. | Original before/after head-on geometry; reader identifies an initially stationary target `A`, aligned elastic impact by unseen `M` at `V`, charged recoil at `u_max`, and the scoped equation rather than an arbitrary-angle law. |
| `recoil` | Remaining recoil block and neutron claim; compare reported H/N maximum recoil speeds and solve for projectile mass. | Collision-model variables and common-speed condition. | Original two-target ledger plus worked algebra; reader obtains `r=(M+14)/(M+1)`, `M=(14-r)/(r-1)≈0.89`, and labels it historical rather than modern precision. |
| `limit` | Limit block and scope/neutron claims; combine penetration, charged recoil, conservation reasoning, and later evidence. | Neutral contrast and two-target mass result. | Existing cards remain because they classify evidence rather than add geometry; reader distinguishes observed charged recoil from inferred unseen projectile and keeps the gamma alternative unresolved by penetration alone. |
| `transfer` | Transfer block and neutron claim; ask whether one target removes both unknowns. | Maximum-recoil equation. | Existing worked-exposition cards remain simultaneous, not a fake quiz; reader explains that one target leaves `M,V`, while two distinct `A` values with common `V` permit cancellation. Learner performance is not assessed. |

## 8. Verification and accepted debt

Source/unit verification must cover exact proton time boundaries, unordered seeking, detached outputs, atomic invalid-state rejection, reset, proton-only availability, and static figures without suggestions for the other six scenes. Independent figure fixtures must calculate geometry and algebra rather than merely search filenames or prose: equal penetration conditions, qualitative path ordering, collinear head-on roles, initial rest, common `V`, distinct `A=1/14`, exact reported speeds, ratio cancellation, and `M≈0.89`.

Fresh static-build browser QA is handed to the lead. It must inspect the three static figures with canonical prose and navigation at 390 × 844 and supported desktop viewports, plus all four proton stages at 390 × 844, 960 × 540 at DPR 2, and 1920 × 1080. It must measure bounds, inspect alternatives/captions, and test manual proton controls, restoration, invalid-state atomicity, and reduced motion. No build or browser result is claimed in this scoped handoff. Hidden-tab pause, screen-reader behavior, cross-browser rendering, learner comprehension, source-byte and exact-revision verification, content/expert review, rights, audio, and publication approval remain unverified rather than accepted debt or approval.
