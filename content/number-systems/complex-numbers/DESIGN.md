# Complex-number figures design system and scene plan

This topic preserves the shared static reader's quiet workbook surface. Its signature is a coordinate-and-proof sequence: algebra defines the operation, common-scale vectors expose the quarter-turn, and a two-branch proof tree keeps every ordered-field condition visible.

## 1. Atmosphere and identity

Figures should look like inspectable mathematical work, not decorative formula cards. Warm paper and dark green notation inherit the number-systems reader. Blue identifies an input vector or assumption, rust identifies its transformed vector or contradiction, and violet is reserved for the directed quarter-turn. The memorable relation is one operation seen in algebra, geometry, and a changed worked case.

## 2. Color

| Role | Token | Value | Usage |
| --- | --- | --- | --- |
| Canvas | `complex-canvas` | `#f6f8f0` | Figure background |
| Surface | `complex-surface` | `#ffffff` | Proof and equation panels |
| Ink | `complex-ink` | `#293f35` | Primary labels and formulas |
| Muted ink | `complex-muted` | `#526b58` | Conditions and secondary labels |
| Boundary | `complex-boundary` | `#d5dfcc` | Axes, guides, and panel borders |
| Input | `complex-input` | `#2563a6` | Original vector and first branch |
| Transform | `complex-transform` | `#b54a1b` | Rotated vector and contradiction |
| Turn | `complex-turn` | `#7047a8` | Counterclockwise quarter-turn arc |
| Result surface | `complex-result-soft` | `#e1eee3` | Shared conclusion |
| Assumption surface | `complex-assumption-soft` | `#edf3fb` | Ordered-field assumption |

Standalone SVG literals must match this table. Color is always repeated by labels, arrows, and semantic `data-*` attributes.

## 3. Typography

Use `'Noto Sans CJK KR', 'Malgun Gothic', sans-serif`. The 600-unit figures use 24px as the minimum essential label size and 28–30px for primary formulas; the 560-unit proof figure uses at least 22px. This keeps essential labels near or above 13 CSS px in the 390px reader slot. Paragraph explanations remain in canonical prose and alternative text rather than being miniaturized inside SVGs.

## 4. Spacing and layout

The base unit is 4px. Use 8, 12, 16, 24, and 32px spacing steps. Geometry figures use a `600 × 360` view box and one affine coordinate scale for both vectors being compared. Do not widen a plot to solve crowding. Labels remain inside the canvas and clear of arrowheads, axes, points, and the turn arc. Proof branches read top-to-bottom and converge on one contradiction.

At the 390 × 844 supported viewport, the `definition` scene must give its complete canonical prose the height it needs instead of inheriting the shared mobile copy cap. This exception remains scoped to that scene and topic: the prose stays at or above 13 CSS px, its width and wording do not change, and the scene grid may recover the small difference from the nonessential whitespace around the existing algebra cards. Success means `scrollHeight <= clientHeight` and `scrollWidth <= clientWidth` for the definition copy, with the whole reader still within the viewport document bounds. Other topics and complex-number scenes retain the shared layout.

Every `data-essential-label` is part of the authored figure geometry. Its browser-rendered bounding box, including the selected fallback font, must be wholly inside the SVG view box on all four sides. Repair labels by repositioning or anchoring them without reducing the minimum sizes in §3, clipping text, or changing the mathematical statement.

At 390px, authored Korean prose may break at sentence boundaries, equality signs, or tuple commas between complete operations. It must not strand a Korean predicate fragment or split a binary subtraction operator from its following operand. Use narrow, local no-break characters only around the vulnerable operator/operand or phrase; never bind an entire worked formula that cannot fit at the 13px minimum. In the symbolic rotation figure, the negative imaginary-axis stem must end at least 8 view-box units above the browser-rendered `length-and-zero` label bounds so the axis cannot read as part of the footer.

## 5. Components

### Common-scale complex plane
- **Structure**: accessible SVG with title, description, named vector groups, explicit origin/axis groups, and coordinate metadata.
- **Variants**: symbolic `z→iz` and worked `(2,-1)→(1,2)`.
- **States**: static only; no hover, focus, reveal, loading, empty, or error state.
- **Accessibility**: visible coordinate labels, redundant vector names, and `data-*` endpoints permit independent geometry checks.
- **Layout**: one shared origin and one scale; no inset or second plot.

### Ordered-field proof tree
- **Structure**: one assumption panel, explicit `i≠0` step, trichotomy split, one positive-product step per branch, and a shared contradiction with the inherited real order.
- **States**: static only.
- **Accessibility**: each branch and dependency has a semantic ID and directed rule metadata; branch meaning never depends on color alone.
- **Layout**: the two branches remain visually separate until they converge on `-1>0`, then conflict with `-1<0` in the standard real order.

## 6. Motion and interaction

No interaction is introduced. The worked algebra, simultaneous vector comparison, and complete case split are reconstructable static exposition. A timed reveal or quiz would hide dependencies without adding a meaningful variable. Zero's fixed-point statement remains visible in prose and figure labeling; this episode explicitly adopts its own convention of not assigning zero a direction angle. Shared reader navigation owns initial, reset, restored, and invalid-state behavior.

## 7. Depth and surface

Use a borders-only strategy with tokenized fills for assumptions and results. No shadow, gradient, glass, or decorative animation may imply mathematical evidence. Dashed coordinate guides are explanatory measurements, not depth cues.

## 8. Accessibility constraints and accepted debt

Target WCAG 2.2 AA for authored labels and meaningful strokes. Topic prose and captions use Korean `word-break: keep-all`, `overflow-wrap: anywhere`, and `text-wrap: pretty`. Every figure has a nonempty page alternative, caption, SVG title/description, minimum label size, and non-color semantics. The lead must still inspect the actual static build at FHD and 390×844; this handoff does not claim browser, screen-reader, expert, learner, source-revision, or publication approval.

## Six-scene content and representation plan

This is retrospective proposed intent for the current revision, not an original author decision, observed learner performance, independent mathematical review, or publication authorization. Canonical blocks and claim IDs remain authoritative.

| Scene | Canonical references | Purpose | Prerequisite supplied earlier | Observable success check | Representation choice |
| --- | --- | --- | --- | --- | --- |
| `question` | `block:number-systems.complex-numbers.question`; `claim:number-systems.complex.definition` | Explain why the real-number equation fails and why a new number system needs defined operations rather than an unexplained symbol. | For real `x`, `x²≥0`; an equation may motivate extending a number system. | Reader can distinguish “no real solution” from “impossible in every extension” and say that the extension still needs addition and multiplication rules. | Static prose and two existing premise/goal cards suffice because this is a scope distinction, not a geometric mechanism. |
| `definition` | `block:number-systems.complex-numbers.definition`; `claim:number-systems.complex.definition` | Define pair addition and multiplication, reconstruct one nontrivial product, and verify that the real embedding preserves both operations without claiming every field axiom was proved. | Real arithmetic and ordered-pair equality. | Reader can compute `(1,1)(1,-1)=(2,0)` from the pair rule and separately derive `(a,0)+(c,0)=(a+c,0)` and `(a,0)(c,0)=(ac,0)`. | Canonical prose plus ordered equation cards expose substitution line by line. A figure would merely typeset the same algebra and add no relation. |
| `i-square` | `block:number-systems.complex-numbers.i-square`; `claim:number-systems.complex.i-square` | Substitute `i=(0,1)` directly into the pair product and reconcile the result with `(1+i)(1-i)=2`. | Pair multiplication and the embedding `r↔(r,0)`. | Reader can derive `(0,1)²=(-1,0)` and compute `(1,1)(1,-1)=(2,0)`, identifying these with `-1` and `2`. | Static equation cards are sufficient; both calculations must retain coordinates so the symbolic shorthand does not replace the definition. |
| `rotation` | `block:number-systems.complex-numbers.rotation`; `claim:number-systems.complex.rotation` | Derive `(a,b)→(-b,a)`, show equal lengths and positive orientation, and delimit angle language to nonzero points modulo 360°. | Pair multiplication by `(0,1)`, coordinate-plane distance, and counterclockwise orientation. | Reader can verify equal squared lengths `a²+b²`, read the positive quarter-turn on one scale, state that zero is fixed, and identify the choice not to assign zero a direction angle as this episode's convention. | An original common-scale SVG shows both vectors from one origin, coordinate guides, a counterclockwise arc, and explicit nonzero/zero conditions. Simultaneous geometry is essential; animation is not. |
| `order` | `block:number-systems.complex-numbers.order`; `claim:number-systems.complex.not-ordered-field` | Prove the precise impossibility under a total ordered-field order extending the standard real order. | `i²=-1`, hence `i≠0`; trichotomy; positive products are positive; inherited `-1<0`. | Reader can run both exhaustive branches: `i>0⇒i²=-1>0` and `-i>0⇒(-i)²=-1>0`, then name the contradiction with the real order. | An original two-branch proof-tree SVG keeps assumptions, trichotomy, positive-product rule, and shared contradiction visible. A compressed slogan is insufficient. |
| `transfer` | `block:number-systems.complex-numbers.transfer`; `claim:number-systems.complex.rotation` | Apply the same algebraic and geometric rule to `2-i`; this is complete worked exposition, not an assessment of independent performance. | Pair product, `i²=-1`, and the quarter-turn map. | Reader can obtain `(2,-1)→(1,2)`, calculate both squared lengths as `5`, and see the positive 90° orientation on the same coordinate scale. | An original common-scale worked SVG displays actual vectors, coordinates, guides, quarter-turn, and both squared-length calculations. Showing the answer is intentional; no quiz or reveal is needed. |

## Evidence and source limits

The decisive registered source is Beck, Marchesi, Pixton, and Sabalka, *A First Course in Complex Analysis*, Chapter 1 §§1.1–1.2. Current locators use the author-hosted live HTML definition and geometric-properties pages: Geometric Property 17 supports argument addition and modulus multiplication for nonzero factors, while Geometric Property 7 permits every real angle for zero. This episode's choice not to define zero's direction angle is therefore an independently adopted exposition convention, not a Beck-backed restriction. Pair products, squared-length checks, SVG geometry, the transfer example, and the two-branch ordered-field contradiction are independently authored deductions, not copied source exercises, quotations, figures, or proof layouts. Immutable source bytes, exact revision matching, rights review, expert/learner review, measured narration/audio, browser-rendered inspection, and publication authorization remain pending.
