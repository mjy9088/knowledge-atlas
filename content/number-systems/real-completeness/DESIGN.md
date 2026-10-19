# Real completeness figure design and scene plan

This is retrospective proposed authoring intent for the current six-scene correction. It is not an original human decision, observed learner attainment, independent mathematical review, or publication approval. Canonical article blocks, claims, and `quality.json` remain authoritative.

**Brief and reader:** support a Korean reader who knows rational arithmetic and `√2∉Q` but may conflate density, boundary membership, and completeness. Keep every quantified condition visible for readers with limited working-memory bandwidth; do not require color perception, timed recall, hovering, or a hidden answer.

## 1. Visual contract

The figures inherit the shared reader's quiet mathematical-workbook surface. Their signature is one **common order line**: authored coordinates preserve the order relations used by the proof, while semantic groups state the exact inequalities independently of rendered measurement.

| Role | Token | Value | Use |
| --- | --- | --- | --- |
| Canvas | `figure-canvas` | `#f6f8f0` | Figure background |
| Surface | `figure-surface` | `#ffffff` | Proof branches and ambient panels |
| Ink | `figure-ink` | `#293f35` | Main formulas and labels |
| Muted ink | `figure-muted` | `#526b58` | Conditions and scope notes |
| Order | `figure-order` | `#365c42` | Common line, arrows, valid conclusions |
| Order fill | `figure-order-soft` | `#e1eee3` | Established upper-bound regions |
| Boundary | `figure-boundary` | `#d5dfcc` | Neutral outlines and dividers |
| Exclusion | `figure-exclusion` | `#a56d30` | Missing rational boundary and rejected candidates |
| Exclusion fill | `figure-exclusion-soft` | `#f3dcb0` | Case assumptions and scope warnings |

Use `'Noto Sans CJK KR', 'Malgun Gothic', sans-serif`. The base spacing unit is 4px; use 8, 12, 16, 24, and 32px steps. Figures use a `600 × 360` view box, a 16px canvas radius, and at least 16px outer inset. Essential labels use at least 22px at the 560px figure width, or 24px at 600px, so the rendered mobile size remains at least 13 CSS px. Korean words and mathematical units remain intact; paragraph explanation belongs in prose, alt text, and captions rather than tiny SVG labels.

## 2. Reusable figure primitives

### Common order line

- One horizontal affine scale owns every marked value in a figure.
- Authored `data-order`, `data-value`, and `data-x` attributes expose the intended order independently of pixel measurement.
- A missing point such as `√2∉Q` uses an open boundary marker plus text; color is never the only distinction.

### Proof branch

- A labeled semantic `<g>` owns one exhaustive case, its premise, witness, and conclusion.
- Directed connectors state which inequality licenses the next step.
- All branches are visible simultaneously; no reveal, animation, hover dependency, or quiz gate is introduced.
- The dense `gap` proof uses three full-width stacked branches rather than narrow columns. Each branch keeps its complete condition and consequence inside its own border; the shared order line remains below all three branches.

### Ambient comparison panel

- Side-by-side `Q` and `R` panels reuse the same cut and order line.
- Each panel explicitly states the candidate universe and result; membership and leastness are separate labels.
- The `R` panel preserves both leastness cases: `r≤0` is exceeded by `1∈A`, while `0<r<√2` uses density to obtain `r<q<√2` with `q∈A`. A generic density point below `√2` is not sufficient unless its positivity and membership in `A` are established.

### Topic text and scope cards

- Keep Korean words intact in all scene prose, captions, and cards with `word-break: keep-all`, emergency `overflow-wrap: anywhere`, and `text-wrap: pretty`.
- At narrow widths, the three `scope` statements form a compact vertical stack with 8px gaps and at least 17px card text. Omit decorative dot connectors; these are parallel distinctions, not a temporal sequence.

Depth is borders-only: no shadow, decorative gradient, or geometry presented as evidence. Static figures have no hidden state; shared navigation owns reset and restoration.

## 3. Six-scene content and representation plan

| Scene ID | Canonical references | Purpose | Prerequisite supplied earlier | Observable success check | Representation choice |
| --- | --- | --- | --- | --- | --- |
| `question` | `block:number-systems.real-completeness.question`; `claim:number-systems.completeness.rational-gap` | Establish the exact set and verify both hypotheses needed before asking for a least upper bound. | Basic rational membership, squaring positive rationals, and order notation. | Reader can show `1∈A` from `1>0` and `1²<2`, and show that `2` is an upper bound because every `q∈A` already satisfies `q²<2`, `q>0`, hence `q<√2<2`. | Existing cards are replaced by a compact static conditions ledger and common order line. The mechanism is simultaneous membership/bound comparison, so interaction adds no value. |
| `bounds` | `block:number-systems.real-completeness.bounds`; `claim:number-systems.completeness.supremum-definition` | Distinguish upper bound, least upper bound, and maximum, and make ambient membership part of each statement. | The nonempty bounded set from `question`. | Reader can state `∀q∈A, q≤u`, then add `u≤v` for every ambient upper bound `v`; reader can explain that a maximum must belong to `A`, while a supremum need only belong to the ambient ordered set. | Static definition table with separate rows for the three concepts and explicit `Q`/`R` ambient slots. Prose alone risks collapsing membership and leastness. |
| `gap` | `block:number-systems.real-completeness.gap`; density and rational-gap claims | Prove exhaustively that no `r∈Q` is the least upper bound, including why a smaller witness still bounds all of `A`. | `1∈A`, the real boundary `√2`, `√2∉Q`, and Trench's theorem that a rational lies between arbitrary reals. | Reader can reconstruct all cases: `r<√2` (first exclude `r≤0` using `1∈A`; otherwise choose `r<q<√2`, so `q∈A`), `r=√2` (not rational), and `r>√2` (choose `√2<s<r`, then every `q∈A` has `q<√2<s`, so `s` is a strictly smaller rational upper bound). | One static three-branch proof split above a shared order line. All conditions and witnesses remain visible; splitting across scenes would hide exhaustiveness. |
| `property` | `block:number-systems.real-completeness.property`; `claim:number-systems.completeness.real-lub` | Compare the same cut in two ambient systems and establish leastness in `R` rather than merely importing the failed `Q` argument. | The complete gap proof and the real least-upper-bound theorem. | Reader can explain `Q: no LUB` versus `R: sup A=√2`, and verify in `R` both upper-bound status (`q<√2` for all `q∈A`) and leastness (every real `r<√2` fails to bound `A` by density). | Two ambient panels share one authored order line. The `R` panel includes both obligations, preventing the theorem label from replacing the worked leastness argument. |
| `scope` | `block:number-systems.real-completeness.scope`; density, rational-gap, and real-LUB claims | Separate density from completeness and state the construction/theorem boundary. | Both ambient outcomes for the same set. | Reader can say that `Q` is dense in `R` yet fails this LUB case, while the episode uses—rather than constructs—the complete ordered field `R`. | Existing contrast cards suffice because this scene classifies already-worked results; another diagram would repeat rather than expose a new mechanism. |
| `transfer` | `block:number-systems.real-completeness.transfer`; supremum-definition and rational-cut claims | Work a changed rational boundary without turning boundary membership into a general criterion. | Q-relative upper-bound and leastness definitions. | Reader can show `3` bounds `B`, then for every rational `r<3` use the explicit midpoint `q=(r+3)/2` to obtain `r<q<3`, hence `q∈B`; therefore no smaller rational is an upper bound. Reader can state that this proves only the displayed `B` case. | Static worked ledger plus exact order line `r<q<3`. The complete answer is shown intentionally; learner performance is not assessed and no reveal is required. |

## 4. Evidence, interaction, and accepted debt

The decisive external references remain Hunter §1.1 Definitions 1.1 and 1.3, the maximum/supremum distinction on printed p. 2, Theorem 1.7, and Example 1.8, plus Trench §1.1 Theorem 1.1.6. The positive-square cut, all three rational-candidate branches, the `R` leastness specialization, the transfer midpoint, prose, and SVG geometry are independently authored adaptations. No external prose, figure, table, font, dataset, or code is imported.

The article is static because all needed changes are quantified candidate cases, not reader-controlled variables. Initial/reset/restored behavior is therefore the shared reader's scene identity only; invalid state must be rejected atomically by that reader. `quality.json` still records 164 planned seconds, not measured fit or speech duration.

Immutable source bytes and exact revision matching, rights clearance, independent mathematical/editorial review, observed Korean comprehension, measured narration/audio, rendered FHD/mobile inspection, and publication authorization remain pending.
