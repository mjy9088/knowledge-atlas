# Rational Representations Figure Design System

This topic uses the shared static reader's quiet workbook surface. Its signature is a persistent three-node relation chain: verified inner edges, a deliberately unresolved or failed outer edge, and algebraic ledgers that show exactly which integer operation licenses the next edge.

## 1. Atmosphere & Identity

The figures should read like inspectable mathematical working, not decorative formula cards. Warm paper, dark green text, restrained amber premises, and green verified results inherit the number-systems reader. The memorable element is correspondence: every relation edge is paired with the cross-products or integer step that establishes it.

## 2. Color

| Role | Token | Value | Usage |
| --- | --- | --- | --- |
| Canvas | `figure-canvas` | `#f6f8f0` | Figure background |
| Surface | `figure-surface` | `#ffffff` | Nodes and proof rows |
| Text | `figure-text` | `#293f35` | Formulas and primary labels |
| Text secondary | `figure-text-secondary` | `#526b58` | Conditions and rule labels |
| Border | `figure-border` | `#d5dfcc` | Neutral boundaries |
| Verified | `figure-verified` | `#365c42` | Valid relation edges and conclusions |
| Verified surface | `figure-verified-surface` | `#e1eee3` | Established equality/result |
| Premise | `figure-premise` | `#a56d30` | Given equalities and active conditions |
| Premise surface | `figure-premise-surface` | `#f3dcb0` | Given/conditional regions |
| Failure | `figure-failure` | `#9b3f35` | Invalid outer edge and unequal products |

Color never carries meaning alone: every edge has a visible status label, and every proof transition has a rule label. Proof arrowheads use explicit `markerUnits="userSpaceOnUse"` with a 12-unit viewport, never the stroke-scaled default; changing a connecting stroke must not enlarge a head into a neighboring panel or label.

## 3. Typography

| Level | Size | Weight | Usage |
| --- | ---: | ---: | --- |
| Figure title | 24px | 700 | One relationship or proof-stage heading |
| Formula large | 28px | 700 | Central equality or relation |
| Formula | 24px | 700 | Products, pairs, and implications |
| Label | 24px | 700 | Edge, operation, and condition labels |
| Note | 18px | 500 | Scope wording that remains readable but secondary |

Use `'Noto Sans CJK KR', 'Malgun Gothic', sans-serif`. Every text element that carries a formula, condition, edge status, operation, or conclusion has `data-essential-label="true"` and is at least 24 source units in the 600-wide view box. Only supplementary scope notes may omit the attribute and use 18px. At the narrow reader width, every marked label must render at 13 CSS pixels or larger. Tests and browser inspection must measure all marked labels; they may not filter the set by an assumed safe font size.

## 4. Spacing & Layout

The base unit is 4px. Figure spacing uses 8, 12, 16, 20, 24, and 32px steps. Figures normally use a `600 × 400` view box and a 24px outer inset. The property-role comparison may use `600 × 440` so its role labels and summary panel have separate vertical bands. Relation chains read left-to-right; algebra ledgers read top-to-bottom. Because `~` is symmetric, relation and grouping links are plain undirected paths; arrowheads are reserved for proof steps whose premise-to-conclusion order matters. On narrow readers the SVG scales as one static reference with no internal scrolling, so short Korean labels and formulas occupy separate lines and connectors never cross text. Every text bounding box must remain inside the root view box and at least 12 source units inside its owning panel. Distinct essential-label boxes must not overlap. Logical paths must remain non-degenerate and keep at least 8 source units from unrelated essential-label boxes; branch connectors route around the central rule label, and supplementary notes occupy a separate row rather than crossing a condition panel.

Topic-owned prose, captions, and concept cards use `word-break: keep-all`, `overflow-wrap: anywhere`, and `text-wrap: pretty`. The four card-only scenes stack cards at full available width so Korean terms reflow at spaces rather than inside `추이성`, `관계`, `등식만으로`, `확장`, or `불가능`; their existing font floors remain unchanged. Canonical prose may join compact relation expressions and their adjacent Korean particles or endings with invisible word joiners. Keep each complete mathematical relation intact without changing the generic renderer or forcing whole paragraphs onto one line. The local stylesheet may suppress only the reader's decorative dot connectors in `cross-product-domain`, `equivalence-name`, `proof-setup`, and `counterexample-scope`, where no actual logical edge is encoded; authored SVG arrows remain visible.

## 5. Components

### Relation node
- A labeled `<g>` with a rounded surface, pair or fraction expression, and representation role.
- Variants: ordinary representation, common middle representation, excluded zero pair.
- Static only; semantic ID and `data-pair` identify the node independently of geometry.

### Relation link
- A visible undirected path joining named nodes, with an adjacent check and status after the relation is defined.
- Variants: verified, target/unknown, failed.
- `data-kind="relation"`, `data-direction="undirected"`, endpoint IDs, status, and exact product attributes make meaning inspectable without implying a proof direction.

### Integer proof row
- A labeled `<g>` containing one equality and the integer operation that produces the next equality.
- Premise, common-product, zero-product branch, cancellation, and relation-callback variants.
- Directed paths use `data-rule`; arrows encode derivation, never decoration.

## 6. Motion & Interaction

All figures are complete static worked exposition. No answer is gated behind a quiz or reveal. A persistent comparison figure may show a later result during an earlier scene when keeping the same nodes and checks visible is necessary for comparison; that scene's prose, caption, and success check state which subset to inspect. This is intentional worked exposition, not an attainment quiz. Navigation remains the shared reader's only interaction. Default and reduced-motion behavior are identical.

## 7. Depth & Surface

Use borders only. Premises, verified results, and failures use their semantic fills and borders. No shadows, gradients, glass effects, or perspective imply mathematical weight.

## 8. Accessibility Constraints & Accepted Debt

Target WCAG 2.2 AA for text and meaningful strokes. Every figure has a Korean `<title>`, complete `<desc>`, visible formulas, semantic groups, and a prose caption. Meaning is redundant across geometry, labels, color, and machine-readable attributes. The corrective browser pass must inspect all sixteen scenes at 1920×1080 and 390×844, all marked SVG label bounds, captions, document/internal bounds, and logical path geometry. This scoped inspection does not establish screen-reader, cross-browser, mathematical, editorial, learner, rights, audio, or publication approval; no visual debt is accepted in this authoring plan.

## Sixteen-scene content and representation plan

This is retrospective proposed intent for this revision. Canonical blocks, sentence indices, and claims remain authoritative; ranges below use the `page.ts` zero-based `from`/exclusive `to` convention, with omitted `to` meaning the end of the block.

| Scene | Stable content | Purpose and prerequisite | Observable success check | Representation choice |
| --- | --- | --- | --- | --- |
| `opening-case` | `opening-case` sentences `0..1`; cross-product claim | Establish three expressions as representations of one intended value before relation vocabulary; requires familiar fractions. | Reader distinguishes three written expressions from one intended group. | A static convergence figure makes many-representations/one-group visible; prose alone currently asserts it. |
| `stable-grouping` | `opening-case` sentences `1..end`; cross-product claim | Make the two-link chain create the need for an outer link before defining `~` or cross-products; requires the opening distinction. | Reader can state why grouping would depend on the intermediary if the outer link were optional. | A neutral three-node grouping figure labels the two given same-value groupings and the needed outer grouping without unexplained products or relation notation. |
| `cross-product-domain` | `cross-product-chain` sentences `0..2`; domain and cross-product claims | Declare integer-pair representations, nonzero second coordinates, and `ad=bc` before proof. | Reader locates `b≠0` in `D` and says pairs are representations, not yet rational quotients. | Static notation cards are sufficient because this scene defines the boundary rather than showing a process. |
| `cross-product-chain` | `cross-product-chain` sentences `2..end`; cross-product claim | Verify both inner edges and turn the outer edge into a general proof target. | Reader reconstructs `1×4=2×2`, `2×6=4×3`, and names `1×6=2×3` as the target. | The concrete chain labels each edge with its products and leaves the endpoint relation visibly pending. |
| `self-and-direction` | `grouping-checks` sentences `0..2`; equivalence claim | Connect self-membership and direction independence to reflexivity and symmetry without introducing the later transitivity term or equivalence-relation name; requires the concrete grouping problem. | Reader matches `A~A` to no excluded representation and the direction-free `A~B` link to symmetric membership. | A dedicated two-role figure contains only reflexivity and symmetry. |
| `middle-link` | `grouping-checks` sentence `2`; equivalence claim | Introduce intermediary independence as the distinct transitivity step; requires the two earlier roles and unresolved chain. | Reader maps premises `A~B` and `B~C` to conclusion `A~C`. | A separate premise-to-conclusion ledger uses a directed arrow because it depicts logical derivation, not the direction of `~`. |
| `equivalence-name` | `grouping-checks` sentences `3..end`; equivalence claim | Compress the three motivated roles into the term equivalence relation without treating the label as proof. | Reader recalls each role and condition, not merely the name. | Static role-to-name recap is adequate; another diagram or animation would add no inference. |
| `proof-setup` | `cancellation-proof` sentences `0..3`; equivalence claim | Close reflexivity and symmetry using integer commutativity and mark transitivity as the remaining case; no rational division. | Reader verifies `ab=ba`, reverses `ad=bc` to `cb=da`, and identifies integer algebra as the only proof tool. | A static property checklist keeps two completed cases and one active case distinct. |
| `proof-products` | `cancellation-proof` sentences `3..5`; equivalence claim | Explain factor choice: `ad=bc` times `f` and `cf=de` times `b` expose the same `bcf`; requires only integer multiplication. | Reader derives `adf=bcf` and `bcf=bde` and says why `f` and `b` were selected. | A vertical equation ledger aligns the two multiplications on the common product `bcf`; directed arrows replace neutral dots. |
| `integer-cancellation` | `cancellation-proof` sentence `5`; equivalence claim | Use the integer zero-product split without assuming division in `Q`; requires `d(af−be)=0` and domain fact `d≠0`. | Reader names branches `d=0` or `af−be=0`, excludes only the first, and reaches `af=be`. | A branching proof figure makes the excluded branch and non-circular integer cancellation explicit. |
| `proof-result` | `cancellation-proof` sentences `6..end`; equivalence claim | Call back to the relation definition and then the opening example. | Reader maps `af=be` to `(a,b)~(e,f)` and checks `1×6=2×3`. | A short definition-callback ledger plus example is sufficient; no interaction needed. |
| `zero-pair-links` | `zero-pair-limit` sentences `0..2`; boundary claim | Preserve the same chain after dropping the domain restriction and verify both zero-product inner edges. | Reader computes both sides as zero without inferring the endpoints are related. | The persistent full counterexample remains visible to support comparison; this scene's prose and caption focus inspection on the two inner links even though the worked outer result is already present. |
| `zero-pair-failure` | `zero-pair-limit` sentences `2..4`; boundary claim | Contradict the exact transitivity implication by testing the same chain's outer edge. | Reader computes `1×2=2` and `1×1=1`, then identifies valid+valid but invalid outer edge. | The same full chain remains visible, with the outer edge crossed and both unequal products shown; complete answer is worked exposition. |
| `counterexample-scope` | `zero-pair-limit` sentences `4..end`; boundary claim | Prevent overgeneralization from this failed relation to every possible number extension. | Reader states exactly what failed and the stronger impossibility claim not established. | A static “this construction / not every extension” comparison is clearer than another figure. |
| `transfer-checks` | `transfer-case` sentences `0..2`; equivalence claim | Rebuild both verified links for `(2,3),(4,6),(10,15)`; requires the cross-product definition. | Reader verifies `2×6=3×4` and `4×15=6×10`. | The complete transfer comparison stays static so all products can be checked together; this scene's prose and caption focus on the two inner checks rather than hiding the already worked outer result. |
| `transfer-result` | `transfer-case` sentences `2..end`; equivalence claim | Apply the same proof condition and independently confirm the outer relation; worked exposition, attainment not assessed. | Reader identifies middle denominator `6≠0`, applies transitivity, and verifies `2×15=3×10=30`. | The transfer chain adds the verified outer edge, a visible `6≠0` condition, and the independent `30=30` check. |

## Evidence and scope limits

All planned SVG geometry and Korean labels are independently authored and import no external artwork, font, dataset, quotation, proof diagram, or code. The decisive consulted source is Richard Hammack, *Book of Proof*, third edition, Edition 3.4: §11.2 Definition 11.2, printed p. 205 (PDF p. 217); §11.3 Definition 11.3, printed p. 210 (PDF p. 222); equivalence-class discussion, printed p. 211 (PDF p. 223); and fraction expressions/cross-product relation, printed pp. 213–214 (PDF pp. 225–226). Hammack checks reflexivity and symmetry and assigns transitivity as Exercise 16; the common-product/cancellation proof and zero-pair counterexample here are independently authored, not copied or source-provided. Immutable source bytes, exact revision matching, rights clearance, independent mathematical/editorial and learner review, audio timing, browser-rendered inspection, publication approval, and publication remain pending.
