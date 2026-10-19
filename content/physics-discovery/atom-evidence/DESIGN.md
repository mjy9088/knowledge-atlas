# Atomic-evidence figure design contract

## 1. Scope and direction

Extend the shared paper-and-ink reader with three original static schematics for `observe`, `predict`, and `measure`. The memorable sequence is epistemic: a visible colloid acts as a proxy for unseen molecular impacts; a worked translational bridge connects measured one-coordinate mean-square displacement to `D`, `k_B`, and `Nₐ`; and three distinct historical methods place estimates on one common historical-unit axis. No figure is a photograph, source adaptation, measured trajectory, stochastic simulation, reconstructed dataset, or validation experiment.

The seven stable scene IDs and order, three claim IDs, `needs-content-review` article status, `planned` 164-second timing, and `review-required` status remain unchanged. Figures add no trajectory batches, histogram bins, error bars, standard deviations, confidence intervals, modern-value reference line, or claim that Brownian motion reveals atomic internal structure.

## 2. Reader and accessibility constraints

- Primary reader: a Korean-speaking learner who may mistake the visible particle for an atom or one irregular path for the prediction target.
- Every distinction carried by color is repeated through labels, grouping, line style, or geometry.
- Every SVG has a Korean title and description; page metadata supplies nonempty Korean alternative text and a caption naming the authored representation and its limit.
- Every essential SVG label and caveat uses at least 24 units at weight 600 in its 600-unit-wide view box. Labels remain horizontal and clear panels, paths, markers, and root edges; no caveat is shrunk to recover space.
- Topic-scoped Korean prose uses `word-break: keep-all`, `overflow-wrap: anywhere`, and `text-wrap: pretty`; narrow copy remains at least 13 CSS px.
- All arrow markers use `markerUnits="userSpaceOnUse"` and dimensions no greater than 12 units, preventing stroke width from magnifying arrowheads into labels.

## 3. Existing visual system

Reuse the shared reader palette and borders-only material: paper `#f6f8f0`, surface `#ffffff`, ink `#293f35`, structure green `#365c42`, observation amber `#a56d30`, line `#d5dfcc`, muted ink `#526b58`, and comparison fill `#e1eee3`. Coordinates and spacing follow a 4-unit rhythm; panels use 12–16-unit radii and no shadows. Type inherits the reader's Korean-capable stack.

The historical common-axis figure uses `viewBox="0 0 600 380"`; the proxy figure uses `600 × 420` to keep model/observation caveats outside its field; the worked translational bridge uses `600 × 480`. The bridge's compact coordinate bands are header `28`, measurement panel `40–112`, derivation panel `126–210`, quantity panel `214–318`, and assumption panel `330–462`, with four caveat baselines at `352/384/416/448`. At the shared narrow figure limits, scaling is `min(390/600, 276/480) = 0.575`, so every 24-unit essential label renders at `13.8 CSS px`, above the 13 px floor; the former 608-unit height would have rendered it at only about 10.9 px. All figures scale fluidly from their intrinsic ratios, retain at least 16 units of horizontal root inset, and keep at least 12 units marker-to-label clearance. Nothing relies on hidden overflow, tiny type, or horizontal scrolling.

## 4. Figure primitives and scientific boundaries

### Visible proxy and authored path

A proxy panel contains one labeled visible colloid and smaller symbols for unseen water molecules outside any heading that could classify them as microscope observations. A single dashed irregular line crosses behind the colloid but not its central label and is explicitly marked `저자 설명 경로` and `측정값·확률 모형 검증 아님`. Collision cues remain visible, terminate at the colloid boundary, and carry `분자충돌 모형 · 관찰 아님`. The figure is not to scale and does not claim this authored path follows Einstein's distribution or reproduces Perrin's data.

### Worked translational model bridge

The `predict` figure works one route rather than asking three authority boxes to stand in for an explanation. For one sampled coordinate and lag `Δt`, measured many-particle displacement statistics give `D=⟨(Δx)²⟩/(2Δt)`. Müller derives `D=k_BT/γ` as Eq. (17), then gives Stokes drag for a solid sphere, `γ=6πηa`, and `R=Nₐk_B`; substitution yields `Nₐ=RT/(6πηaD)`. The figure defines `D` (m²/s), `T` (K), `η` (Pa·s), `a` (m), `R` (J·mol⁻¹·K⁻¹), `k_B` (J/K), and `Nₐ` (mol⁻¹). It uses no fictional numerical inputs or historical-value conversion.

The visible assumption band distinguishes what the consulted note states from applicability limits: one coordinate; chosen diffusive time scale with statistically independent successive shifts; thermal equilibrium; no mean drift; no boundaries for the displayed MSD relation; a solid sphere in an incompressible fluid of viscosity `η`; and the dilute-solution van't Hoff comparison behind Eqs. (15)–(17). Using uncorrected Stokes drag additionally requires a low-Reynolds-number Newtonian-fluid regime and negligible wall/confinement corrections; these are shown as model applicability conditions, not as claims that the URI note separately derives them. Sedimentation and rotation remain named historical methods, not parallel derivations on this page.

### Common-axis historical estimates

One horizontal axis spans `64–70 ×10²² / 수소 2g`, with equal numeric spacing and markers at `65`, `68.2`, and `68.8`. The speech describes sedimentation, translation, and rotation in that order and then lists the three values in that order; the labels explicitly say this is an ordered-text correspondence rather than an independently labeled source table. Unit heading, method labels, and leaders occupy separate baselines with at least 12 units clearance. A visible range bracket states `68.8−65=3.8`; a separate arithmetic line states `3.8/65≈5.846%≈5.8%`. There are no uncertainty glyphs or modern `6.022… mol⁻¹` line because the source gives no error bars and the modern unit/material basis has not been converted.

## 5. Primitives and states

- **Figure frame:** original SVG, visible heading, concise caption, and persistent epistemic caveat.
- **Proxy field:** visible colloid, unseen-molecule symbols, authored dashed path, and collision cues; labels make scale/visibility roles redundant with color.
- **Worked bridge:** measured `⟨(Δx)²⟩` and `Δt`, inferred `D`, stated model relations, defined quantities/units, substitution to `Nₐ`, and a visible assumption band.
- **Historical-method note:** sedimentation and rotation are named as the other speech-described methods but are not falsely presented as derived by the translational equations.
- **Estimate marker:** numeric `data-value`, method identity, common axis position, and leader line. Marker order follows numeric value, not source narration order.
- **Static state:** there is no topic adapter, input, hidden state, animation, quiz gate, reset, restoration, or invalid scientific input. Generic reader scene state remains shared-reader behavior.

## 6. Retrospective proposed seven-scene plan

This plan governs the revision before figure production. It reconstructs proposed intent for existing content; it is not an original author decision, learner evidence, scientific approval, or completed review.

| Scene ID | Canonical content / question resolved | Prerequisite | Objective and observable success check | Representation choice |
| --- | --- | --- | --- | --- |
| `question` | Question block; how unseen entities can have observable consequences. | Everyday distinction between seeing an object and seeing an effect. | Reader says the task is to test quantitative consequences, not claim direct sight of atoms. | Existing cards frame hypothesis and evidential task without prematurely drawing atoms or leaking the later proxy. |
| `observe` | Observe block; proxy-observation claim. | The direct/indirect distinction from `question`. | Reader identifies the colloid as visible, water molecules as unseen, and the displayed irregular path as authored illustration rather than measurement or validated stochastic output. | Original static proxy schematic makes visibility and scale roles explicit. One path illustrates the observational question only; it is persistently labeled nonmeasurement. |
| `predict` | Predict block; quantitative-test claim plus proposed `source:uri-muller-brownian-motion-2025`. | Colloid/molecule distinction, mean-square displacement, and controlled conditions. | Reader reconstructs `⟨(Δx)²⟩→D→k_B→Nₐ`: `D=⟨(Δx)²⟩/(2Δt)`, `D=k_BT/γ`, `γ=6πηa`, `R=Nₐk_B`, hence `Nₐ=RT/(6πηaD)`; defines every quantity/unit and states the bounded model assumptions. | Original worked translational bridge shows equations and substitution without fictional numbers. It names sedimentation and rotation only as other historical methods, not as two additional derivations. |
| `measure` | First two sentences of measure block; quantitative-test and convergence claims. | One reconstructable translational route and two separately named historical methods target the same constant. | Reader maps speech order sedimentation/translation/rotation to `68.2/68.8/65` with the explicit ordered-text caveat, orders `65 < 68.2 < 68.8`, computes range `3.8 ×10²² / 수소 2g`, and computes `3.8/65≈5.846%≈5.8%`. | Original common-axis plot uses only the three speech-reported values. Separate baselines and leaders preserve actual numeric spacing; no modern line or uncertainty glyph is added. |
| `uncertainty` | Measure block from sentence 3; convergence claim. | The common-axis arithmetic. | Reader distinguishes the source-supported statement “close reported values” from unsupported error-bar, σ, confidence, or modern statistical-agreement claims. | Static caveat cards are clearer than adding visual uncertainty marks that the source does not provide. The sentence range starts at 2 so this caveat remains isolated here. |
| `limit` | Limit block; proxy-observation and convergence claims; BIPM unit distinction. | Historical axis and uncertainty boundary. | Reader distinguishes historical molecules per two grams hydrogen from modern `mol⁻¹`, refuses an unconverted modern-value comparison, and says this evidence does not reveal atomic internal structure. | Existing cards keep unit/material-basis and scope boundaries explicit; a modern numeric line would falsely imply commensurability. |
| `transfer` | Transfer block; quantitative-test and convergence claims. | Controls, statistical targets, convergence, and limits. | For moving dust, reader proposes airflow, vibration, and temperature checks, quantitative model comparison, and convergence with a distinct method; rejects “irregular path proves atoms.” | Worked static cards explicitly label the controls an authored application checklist, not a list quoted from the Nobel speech. No quiz, adapter, or forced prediction is added. |

## 7. Verification and review boundary

Independent unit fixtures reconstruct the symbolic bridge algebra and dimensions; compute the source-reported order, `68.8−65=3.8`, and `3.8/65×100≈5.846%`; derive expected marker positions from a separately declared `64–70` axis; verify monotonic geometry and text/leader clearance; enforce proxy path/label and arrow visibility; and confirm only the three planned scenes receive figures. Tests must not pin Korean prose vocabulary or manufacture scientific observations.

The lead owns build and browser execution. Browser QA should inspect all seven scenes at `390 × 844` and `1920 × 1080`, full copy, figure/caption bounds, document/internal scroll, 44 px controls, figure anchors and center hit access, and generic reader reset/restoration/invalid-state atomicity. This topic has no scientific input or topic adapter, so browser checks must not invent one.

Source checks, unit fixtures, and screenshots cannot establish physics/history correctness, statistical validation, learner understanding, assistive-technology behavior, exact source revision, rights clearance, measured timing, audio readiness, publication approval, or modern comparability. Those remain pending.
