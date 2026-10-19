# Electron-evidence figure design contract

## 1. Scope and direction

This contract extends the shared paper-and-ink reader with original static schematics that make the six-scene inference chain reconstructable: orient the fields and forces, select speed by cancellation, read magnetic curvature, infer `|q|/m`, and expose why a ratio does not determine charge and mass separately. Every path is a classical model schematic, not a measured historical trajectory, apparatus reconstruction, beam photograph, simulation, or scale drawing.

The six stable scene IDs, three existing claim IDs, canonical claim coverage, `needs-content-review` article status, planned 166-second timing, and `review-required` status remain unchanged. No historical numerical values, tested materials beyond the registered gases and release methods, or universal claim about every wave-like phenomenon is added.

## 2. Reader and accessibility constraints

- Primary reader: a Korean-speaking learner who knows that charge responds to electric fields but may conflate a force direction, a velocity direction, and a visible beam trace.
- Every SVG has a Korean title and description. Page metadata supplies nonempty alternative text and a caption that identifies the drawing as an original model schematic.
- Color is redundant with arrow labels, arrow direction, line style, sign, and grouping. Velocity arrows and force arrows have distinct marker shapes and explicit labels.
- Essential SVG labels use at least 24 units at weight 600, or 22 units at weight 560, in a bounded `600 × 380` view box. Labels, paths, axes, and panels occupy separate bands.
- Every marker declares `markerUnits="userSpaceOnUse"` with a bounded marker box no larger than 12 units in either dimension.
- Topic-scoped Korean prose and captions retain words with `word-break: keep-all`, use `overflow-wrap: anywhere` only as fallback, and use `text-wrap: pretty`. No shared CSS changes.
- The six scenes must fit the shared FHD reader and the 390 px narrow slot without clipped conditions, hidden overflow, or copy below 13 px.

## 3. Existing visual system

Reuse the shared reader's borders-only system: paper `#f6f8f0`, surface `#ffffff`, ink `#293f35`, structure green `#365c42`, comparison amber `#a56d30`, line `#d5dfcc`, muted ink `#526b58`, and focus green `#648a4c`. Coordinates and spacing follow a 4-unit rhythm; panels use 12–16-unit radii and no shadows. Type inherits the Korean-capable system stack.

## 4. Physical and representational conventions

The shared coordinate choice is fixed across figures: beam velocity `v` points right (`+x`), electric field `E` points up (`+y`), and magnetic field `B` points out of the page (`+z`, dot symbol). For negative charge, `F_E=qE` points down and `F_B=q(v×B)` points up. In crossed fields these cancel when `|q|E=|q|vB`, giving `v=E/B` under `q≠0`, `B>0`, perpendicular low-speed motion, and sufficiently uniform fields. If plates appear, the top plate is negative and the bottom plate positive so `E` points upward. The `B` dot is labeled as the field direction, never as a particle.

With the electric field removed, the same negative-charge beam curves upward in the out-of-page magnetic field. A tangent velocity arrow and a separate inward magnetic-force arrow establish the radial model; a radius reaches from a center above the path to the particle. Combining `|q|vB=mv²/r` with the selected speed gives `|q|/m=v/(Br)`. Curvature direction supplies the sign under the declared orientation, while curvature magnitude supplies the magnitude ratio.

All observation language remains source-bounded. The static diagrams expose model consequences and measurement logic; they do not claim that Thomson directly photographed particles or that the drawn paths were recorded coordinates. The ratio scene and limit scene use no fabricated numbers. Distinct positive pairs with the same `|q|/m` make underdetermination visible; an independent charge measurement or calibration is needed to separate them.

## 5. Primitives and states

- **Field-and-force panel:** labeled `E`, `B`, `v`, `F_E`, and `F_B`; field directions, velocity, and forces remain distinguishable without color.
- **Model path:** solid authored centerline with an explicit `MODEL` and `측정 궤적 아님` caveat. It is never called a photograph or historical trace.
- **Radius construction:** center, radius segment, tangent velocity, and inward force are geometrically independent test targets.
- **Inference ledger:** equations and conditions occupy their own panel rather than overlaying the path.
- **Matched ratio pair:** two unequal positive `( |q|, m )` pairs sharing one ratio, followed by the additional independent datum needed to identify each quantity.
- **Static comparison:** all cases are visible simultaneously; there is no topic adapter, quiz, hidden answer, animation, or scientific input. Generic reader scene state, reset, restoration, and invalid-state rejection remain the only state contract.

## 6. Retrospective proposed six-scene plan

This plan governs the revision before figure production. It reconstructs proposed intent for existing content; it is not an original author decision, observed learner performance, scientific approval, or completed review.

| Scene ID | Canonical content / question resolved | Prerequisite | Objective and observable success check | Representation choice |
| --- | --- | --- | --- | --- |
| `question` | Question block and crossed-fields claim; what evidence could distinguish an electromagnetic response from a beam's visible appearance. | Everyday meanings of straight and curved paths. | Reader says the evidence comes from controlled changes in deflection, not from the glow alone, without asserting that all waves can never deflect. | Existing parallel cards suffice for the competing interpretations; a particle-path drawing here would prematurely assume the later model. |
| `apparatus` | Apparatus block and crossed-fields claim; orientation, force directions, cancellation, and speed selection. | Negative charge and perpendicular directions. | Reader reconstructs `v` right, `E` up, `B` out, `F_E` down, `F_B` up; identifies the field dot rather than a particle; and derives `v=E/B` from cancellation with all conditions visible. | Original crossed-field schematic separates axes/path, plate signs, field labels, force arrows, and equation/condition ledger. It is a conceptual arrangement, not a historical reconstruction. |
| `ratio` | Ratio block and charge-mass-ratio claim; how curvature converts selected speed into a ratio and sign clue. | Selected speed and declared field orientation. | Reader identifies tangent velocity, inward magnetic force, center/radius, upward curvature for negative charge, and derives `|q|/m=v/(Br)` while keeping sign separate. | Original B-only circular-arc model plus a separate two-step equation ledger; no sourced or fabricated numerical radius. |
| `repeat` | Repeat block and repeatability claim; what was changed and how far the recurrence supports the interpretation. | Meaning of a measured ratio. | Reader states only that the consulted account reports consistent properties across tested gases and different electron-release methods, not all gases, all matter, or electrode materials. | Compact parallel cards preserve the bounded comparison more clearly than an invented apparatus montage or dataset. |
| `limit` | Limit block and charge-mass-ratio claim; why the ratio does not identify charge and mass. | `|q|/m` as the measured magnitude ratio. | Reader gives two unequal positive charge-mass pairs with one ratio and names an independent charge measurement or calibration as the missing datum; rejects a beam image as that datum. | Original matched-pair ratio schematic makes scale invariance visible without numbers claimed as historical measurements. |
| `transfer` | Transfer block; what electric-only, balanced crossed-field, and magnetic-only cases each reveal. | Force orientation, speed selection, and curvature inference. | Reader explains that reversing the electric field reverses electric deflection geometry, but E-only deflection does not identify `q/m` while speed is unknown; crossed fields select speed; B-only curvature then supplies the ratio. | Original three-case static comparison holds beam direction and declared coordinates fixed. It is worked exposition, not a quiz; case paths are model consequences rather than measured trajectories. |

## 7. Verification and review boundary

Independent fixtures compute the negative-charge electric and magnetic force directions from vectors rather than trusting labels; inspect the curvature radius and inward-force geometry; verify charge-to-mass dimensions from base units; and prove underdetermination with unequal pairs not derived from SVG output. Page wiring preserves all six IDs and assigns figures only where the plan requires them. Marker bounds, essential-label sizes, model caveats, and separate semantic groups are structural checks, not visual approval.

The lead owns the full build, browser execution, and independent physics/visual review. Browser QA should inspect every scene at 390 × 844 and 1920 × 1080, full Korean copy and captions, document/internal bounds, 44 px controls and center hit access, direct anchors, reset/restoration, and atomic invalid-state rejection. Static scenes have no topic interaction state; tests must not invent one.

Source consultation and unit fixtures cannot establish expert physics approval, historical completeness, learner understanding, assistive-technology quality, immutable source revision, rights clearance, measured narration timing, or publication approval. Those remain pending.
