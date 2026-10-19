# Rational-density figure and scene design

This is a retrospective proposed intent for the current correction, not an original author decision, independent review, learner evidence, or publication authorization. Canonical prose, claims, IDs, quality metadata, and the source record remain authoritative.

## 1. Direction and representation

The thirteen scenes form one inspectable construction: distinguish the weak midpoint idea, choose a sufficiently fine rational grid, select the first grid point strictly right of `x`, and carry every strict inequality to the result. Static SVGs are preferred because each comparison must remain simultaneously visible without hidden state. Cards remain only where they already expose a single scoped equation; no quiz, reveal, animation, or topic-specific interaction is needed.

Every numerical picture is an explicitly illustrative instantiation, not a proof of the general theorem. Number-line positions within a figure use one uniform affine scale. The grid and boundary diagrams must make their mechanism visible rather than restating nearby cards.

## 2. Source and proof boundary

The consulted scope is William F. Trench, *Introduction to Real Analysis*, Free Hyperlinked Edition 2.04 (December 2013), §1.1, Theorem 1.1.6 and its proof on printed p. 6 (PDF p. 14). That proof invokes Theorem 1.1.4 for the Archimedean step. This article assumes that result; it does not claim to prove the Archimedean property. The floor presentation `m=⌊nx⌋+1` is an independently authored equivalent construction, not a quotation or verbatim adaptation. No external prose, artwork, table, media, data, or code is included; immutable source capture, exact revision verification, rights review, and independent mathematical review remain pending.

## 3. Visual tokens

The figures inherit the number-system workbook language already used by the shared reader and rational-number figures.

| Role | Token | Value |
| --- | --- | --- |
| Canvas | `paper` | `#f6f8f0` |
| Surface | `panel` | `#ffffff` |
| Ink | `ink` | `#293f35` |
| Muted ink | `muted` | `#526b58` |
| Valid relation | `relation` | `#365c42` |
| Valid fill | `relation-soft` | `#e1eee3` |
| Boundary | `boundary` | `#d5dfcc` |
| Strict/failure contrast | `contrast` | `#a56d30` |
| Contrast fill | `contrast-soft` | `#f3dcb0` |

Use `'Noto Sans CJK KR', 'Malgun Gothic', sans-serif`. Figures use a `600 × 300` view box, 4px spacing base, 16px canvas radius, borders only, and no shadow or gradient. Essential labels use at least 22px/560 weight or 24px/600 weight so they scale to at least 13 CSS px in the supported narrow reader. Korean text stays horizontal and short; prose, scope qualifications, and complete alternatives remain outside the SVG.

## 4. Static figure primitive

Each original SVG contains `<title>`, `<desc>`, provenance `<metadata>`, and named semantic groups with exact-value `data-*` attributes. Color is redundant with labels, arrows, line styles, or group names. The shared reader owns navigation and restoration; the figures have no internal state, controls, scrolling, motion, or reduced-motion variant. Captions and alternative text state the mathematical observation without presenting the picture as theorem evidence.

Directed proof connectors use explicit line and arrowhead geometry in the `600 × 300` coordinate system, not SVG marker defaults that multiply arrowhead size by stroke width. A connector and its arrowhead must remain entirely between the source and target panel boundaries, with at least 4 units of clear space from each panel; neither may intersect text bounding boxes. Panel-owned text keeps at least 4 units of inset from its panel border. These constraints apply to rendered geometry, including arrowheads, rather than only to the path centerline.

The topic stylesheet applies `word-break: keep-all`, `overflow-wrap: anywhere`, and `text-wrap: pretty` to titles, prose, cards, and figure captions across all thirteen scenes. It may hide the shared card connector only where adjacent cards are parallel conditions or conclusions rather than a directional inference; actual implication chains retain their connector.

The boundary comparison keeps every label at least 4 view-box units clear of axes and marker circles. Its floor-plus-one case uses a right-pointing line and explicit polygon head between the `nx=2` and `m=3` markers, labeled `⌊nx⌋+1`; an undirected floating bar is not sufficient. The mesh comparison preserves endpoint coordinates `x=120` and `x=480` and the fine-mesh midpoint `x=300`, while placing every point label on a separate baseline with at least 4 units of clearance from its marker.

At narrow width, `irrational-lower` and `irrational-upper` use one ordered, nonwrapping column with an 8px gap and retain the existing 20px card type. Their formulas already contain `⇒`, so the generic connector is removed instead of leaving detached dots without an inference label. Canonical Korean prose remains complete; only the named short grammatical units use nonbreaking spaces, with word joiners inside `m=⌊nx⌋+1`, so line breaks do not strand particles or operators. Long clauses remain normally wrappable.

## 5. Thirteen-scene plan

| Scene | Canonical refs | Purpose and prerequisite | Success check | Representation |
| --- | --- | --- | --- | --- |
| `opening-gap` | `block:number-systems.rational-density.opening-gap` sentences 0–1; rational midpoint and stronger theorem claims | Separate the rational-endpoint midpoint argument from arbitrary real endpoints; requires only the definition of a rational. | Reader can explain that `(x+y)/2∈Q` follows when `x,y∈Q`, but is not guaranteed merely from `x,y∈R`. | A static two-case comparison contrasts a rational midpoint with an arbitrary-real midpoint marked “not guaranteed rational”; it does not claim no midpoint exists. |
| `grid-plan` | opening-gap sentences 2–3; theorem claim | Replace the insufficient midpoint rule with the plan “find the first `1/n` grid point right of `x`”; requires `x<y`. | Reader can identify the interval, uniform mesh, and first grid point strictly right of `x` without using the later-defined symbol `m`. | A uniform illustrative line shows `x`, `y`, adjacent grid points, and the generic selected point; exact geometry makes “first” observable. |
| `choose-mesh` | `block:…choose-mesh` sentences 0–1; Archimedean-mesh claim | From assumed Archimedean property choose positive integer `n` with `1/n<y−x`; do not present a proof of that property. | Reader states the positive premise `y−x>0`, `n∈Z`, `n>0`, and strict mesh inequality. | Existing equation cards suffice: this is an assumed-result application, and a picture must not masquerade as proof of Archimedean existence. |
| `mesh-points` | choose-mesh sentence 2; grid-construction claim | Establish that every `k/n` is rational because `k∈Z` and the chosen `n∈Z`, `n>0`. | Reader can name integer numerator, nonzero integer denominator, and rational membership. | A static uniform grid labels three adjacent points and the fixed positive denominator; spacing represents equal `1/n` steps. |
| `first-grid-point` | `block:…first-grid-point` sentence 0; grid-construction claim | Derive the strict-right integer for integer, noninteger, positive, or negative `nx`. | Reader reconstructs `⌊nx⌋≤nx<⌊nx⌋+1`, sets `m=⌊nx⌋+1`, and obtains `nx<m≤nx+1`. | A static floor strip uses one common scale and includes a negative noninteger illustration plus a separate integer-boundary marker; semantic attributes expose exact order, not pixel inference alone. |
| `divide-chain` | first-grid-point sentences 1–2; mesh and construction claims | Join the complete inequality chain; requires `n>0` so division preserves order and the earlier strict mesh choice. | Reader derives `x<m/n≤x+1/n<y` and gives the reason for each link. | A static proof chain labels “divide by positive `n`” and “`1/n<y−x`”; arrows preserve dependency rather than repeat cards. |
| `strict-result` | first-grid-point sentence 3; theorem claim | Close both obligations: open-interval membership and rational membership. | Reader states `x<m/n<y` and `m/n∈Q` from `m∈Z`, `n∈Z`, `n>0`. | A compact result panel combines the strict chain and numerator/denominator membership; no new geometry is needed after the complete chain. |
| `ceiling-boundary` | `block:…floor-boundary` sentences 0–1; construction claim | Show why ceiling can return the left endpoint when `nx` is integer. | Reader computes `⌈nx⌉=nx`, hence `⌈nx⌉/n=x`, and identifies failure of strictness. | A static integer-boundary comparison places ceiling on the same tick as `nx` and `x` after division. |
| `floor-escape` | floor-boundary sentence 2; construction claim | Show why floor-plus-one escapes every integer boundary. | Reader applies `m=⌊nx⌋+1` and obtains `nx<m` even when `nx∈Z`. | The paired static boundary line moves from the same integer tick to the next tick, sharing scale with the ceiling case. |
| `irrational-lower` | `block:…irrational-endpoints` sentences 0–1; exact-example claim | Verify the lower inequality without decimal evidence; requires all compared values nonnegative. | Reader applies `a<b ⇔ a²<b²` for `a,b≥0` to `2<9/4` and concludes `√2<3/2`. | Exact-square cards suffice because the mechanism is strict monotonicity of squaring on nonnegative reals, not spatial approximation. |
| `irrational-upper` | irrational-endpoints sentence 2; exact-example claim | Verify the upper inequality and combine both exact links; retains positive-square premises. | Reader uses `9/4<3` to conclude `3/2<√3`, then states exact `√2<3/2<√3`. | A compact exact chain is sufficient; no decimal number line may be used as proof. |
| `coarse-mesh` | `block:…transfer-mesh` sentences 0–2; mesh and construction claims | Exhibit failure when mesh width equals interval width; requires the construction rule. | Reader obtains `x=1`, `y=11/10`, `n=10`, `m=11`, and exact endpoint hit `m/n=y`. | One uniform exact-fraction line places `1`, `11/10`, and the selected `11/10` endpoint; this is an illustration, not the theorem proof. |
| `fine-mesh` | transfer-mesh sentences 3–4; mesh and construction claims | Change only the mesh and recover a strict interior point, distinguishing this example from a uniform guarantee. | Reader obtains `n=20`, `m=21`, verifies `1/20<1/10`, reads `1<21/20<11/10`, and explains that `1/n≤y−x` alone does not guarantee this outcome for every interval. | A paired line on the same interval scale shows the half-width mesh and `21/20` inside; exact fractions, not float guesses, determine coordinates. |

## 6. Accessibility and pending checks

All page alternatives and captions must remain nonempty and agree with the semantic SVG groups. Essential labels must remain at least 13 CSS px at the 390px reader slot, with Korean `word-break: keep-all` behavior supplied only through topic-scoped styling if needed. Browser inspection of all thirteen scenes at supported FHD and mobile viewports, navigation bounds, direct restoration, screenshot review, measured narration, learner comprehension, source/expert/rights review, and publication approval remain pending for downstream owners.
