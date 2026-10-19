# Irrational Numbers Figure Design System

This topic uses the shared static reader's quiet workbook surface. The signature is an explicit proof ledger: assumptions, derived equations, and discharged contradictions occupy distinct bordered regions, while directional arrows state exactly which earlier result licenses each next line.

## 1. Atmosphere & Identity

The figures should feel like a careful proof written large enough to inspect, not like decorative formula cards. Warm paper, dark green text, restrained amber assumptions, and green conclusions inherit the existing number-systems reader. The memorable element is the dependency ledger: every important inference has a visible incoming arrow and a short rule label.

## 2. Color

| Role | Token | Value | Usage |
| --- | --- | --- | --- |
| Canvas | `figure-canvas` | `#f6f8f0` | Figure background |
| Surface | `figure-surface` | `#ffffff` | Proof rows and ledgers |
| Text | `figure-text` | `#293f35` | Formulas and primary labels |
| Text secondary | `figure-text-secondary` | `#526b58` | Rule and scope labels |
| Border | `figure-border` | `#d5dfcc` | Neutral row boundaries |
| Dependency | `figure-dependency` | `#365c42` | Arrows and established results |
| Result surface | `figure-result-surface` | `#e1eee3` | Conclusions proved in the scene |
| Assumption surface | `figure-assumption-surface` | `#f3dcb0` | Conditional or global assumptions |
| Assumption border | `figure-assumption-border` | `#a56d30` | Assumption scope and contradiction emphasis |

Only these topic tokens may appear in the authored SVGs. Color carries semantic ownership: amber means assumed, white means derived, and green means discharged conclusion.

## 3. Typography

| Level | Size | Weight | Line height | Usage |
| --- | ---: | ---: | ---: | --- |
| Figure title | 22px | 700 | 1.3 | One question or proof-stage heading |
| Formula large | 25px | 700 | 1.35 | One algebraic equality or conclusion per line |
| Formula | 21px | 700 | 1.4 | Supporting equality or parity statement |
| Label | 17px | 700 | 1.4 | Assumption, rule, and result labels |
| Note | 15px | 400 | 1.45 | Scope/discharge explanation |

Use `'Noto Sans CJK KR', 'Malgun Gothic', sans-serif`. Formula lines stay short and large; paragraph explanations remain in article prose, alt text, and captions rather than being compressed into SVG text.

## 4. Spacing & Layout

The base unit is 4px. Figure spacing uses 8, 12, 16, 20, 24, and 32px steps. Authored figures use a `720 × 420` view box so the reader can scale them consistently. A 24px outer inset and 16px rounded rows match the existing reader. Directed proof flows run top-to-bottom; side-by-side regions are reserved for two premises that visibly converge. At narrow widths the whole SVG scales as one static reference, so text must remain at least 15px in source coordinates and no line may depend on tiny annotations.

## 5. Components

### Proof row
- **Structure**: labeled `<g>` containing one rounded rectangle and one or two text lines.
- **Variants**: assumption, derivation, established result, contradiction.
- **Spacing**: 16px internal vertical spacing; 20–24px between rows.
- **States**: static only; no hover, focus, loading, empty, or error state.
- **Accessibility**: semantic group ID and machine-readable `data-*` dependency attributes; complete `<title>` and `<desc>`.
- **Motion**: none.
- **Layout**: vertical stack or two-column convergence; no internal scroll.

### Dependency arrow
- **Structure**: visible path with arrow marker and adjacent rule label.
- **Variants**: derives, substitutes, contradicts, discharges.
- **Spacing**: label remains clear of arrowhead and proof-row borders.
- **States**: static only.
- **Accessibility**: `data-from`, `data-to`, and `data-rule` preserve directed meaning independently of pixel geometry.
- **Motion**: none.
- **Layout**: arrow direction follows reading order and never serves decoration.

### Assumption ledger
- **Structure**: bounded region naming the assumption and every conclusion it owns.
- **Variants**: scene-global reduced-fraction assumption; local oddness assumption.
- **Spacing**: 12px label inset and 16px content inset.
- **States**: static only.
- **Accessibility**: `data-owner` and `data-assumption` identify scope; discharge is represented by a directed contradiction edge.
- **Motion**: none.
- **Layout**: enclosing group; no hidden or revealed content.

## 6. Motion & Interaction

These are static reference diagrams. The proof must be readable without prior clicks, timed reveal, animation, or hover. Navigation remains the shared reader's responsibility. No decorative animation is allowed; reduced-motion behavior is therefore identical to default behavior.

## 7. Depth & Surface

Use a borders-only strategy. Neutral derivations use the default border; assumptions and final results use their semantic border/surface tokens. No shadows, gradients, glass effects, or geometry presented as mathematical evidence.

## 8. Accessibility Constraints & Accepted Debt

Target WCAG 2.2 AA for authored text and meaningful strokes. Every figure has Korean title, complete alternative description, visible formulas, and semantic IDs/attributes used by fixtures. Meaning cannot depend on color alone: each region is also labeled, and every dependency has a directional arrow plus rule text. The shared reader's rendered desktop and narrow viewport inspection remains pending for the parent browser handoff; no visual or accessibility debt is accepted by this plan.

## Six-scene content and representation plan

This is a retrospective proposed intent for the current revision, not an original author decision, learner evidence, mathematical approval, or publication authorization. Canonical blocks and claims remain authoritative.

| Scene | Canonical content | Purpose | Prerequisite supplied earlier | Observable success check | Representation choice |
| --- | --- | --- | --- | --- | --- |
| `question` | `block:number-systems.irrational-numbers.question`; `claim:number-systems.irrational.sqrt2` | Separate increasingly close rational approximations from exact equality and pose the rationality question. | Finite decimals can be written as fractions; the positive real square root is assumed to exist as stated by the article scope. | Reader can explain why `1.414²≈2` does not establish `√2∈Q`. | Existing two-card comparison is sufficient: this is a distinction between approximation and equality, not a hidden deduction. No geometry, motion, or quiz is needed. |
| `assumption` | `block:number-systems.irrational-numbers.assumption`; reduced-form and `√2` claims | Establish the contradiction assumption and the owned conditions `p,q∈Z`, `q≠0`, and `gcd(p,q)=1`, then derive `p²=2q²`. | Rational representation and basic equality operations. | Reader can name which facts are assumed and which equation follows after squaring and multiplying by `q²`. | Existing large formula cards keep the setup readable. Their ordered list is adequate because no branching dependency is yet at risk of being hidden. |
| `first-parity` | `block:number-systems.irrational-numbers.first-parity`; parity lemma | Prove conditionally that odd `p` would force odd `p²`, contradict the prior even equation, discharge the local assumption, and conclude `p=2k`. | Prior `p²=2q²`, hence `p²` even; integer parity classification. | Reader can trace `p²=2q² → p² even`, local assumption `p=2j+1 → p²=2(2j²+2j)+1 → p² odd`, the contradiction, and discharge to `p even`, `p=2k`. | New static proof ledger with an amber local-assumption region, two incoming branches to an explicit contradiction, and a discharge arrow to the green conclusion. This directed structure is necessary because dot connectors and independent cards hide conditional ownership. |
| `second-parity` | `block:number-systems.irrational-numbers.second-parity`; parity lemma and `√2` claims | Substitute the first parity result into the original equation, derive `q` even, and combine both even conclusions against the original coprime condition. | Global reduced-fraction assumption `gcd(p,q)=1`, original `p²=2q²`, and established `p=2k`. | Reader can perform `p=2k` substitution to get `4k²=2q²`, simplify to `q²=2k²`, infer `q` even, and identify that `p,q` share factor 2, specifically contradicting `gcd(p,q)=1`. | New static convergence ledger: a substitution chain feeds `q even`; a separate retained `p even` result and the global coprime assumption converge on the explicit gcd contradiction. No generic “wrong formula” symbol is allowed. |
| `conclusion` | `block:number-systems.irrational-numbers.conclusion`; `claim:number-systems.irrational.sqrt2` | Identify the discharged top-level assumption and state the theorem's exact scope, including assumed real existence and the inadequacy of decimal tables as proof. | The coprime contradiction completed in the preceding scene. | Reader can say the contradiction rejects `√2∈Q`, not the algebra or existence of a positive real square root. | Existing conclusion cards are sufficient because the proof dependency has already been made visible; this scene owns scope and interpretation rather than another algebraic mechanism. |
| `transfer` | `block:number-systems.irrational-numbers.transfer`; `√2` and `√8` claims | Give a complete worked corollary that reuses, rather than repeats, the preceding proof. This is exposition; learner attainment remains unassessed. | Established `√2∉Q`, identity `√8=2√2`, and closure of `Q` under division by nonzero rational `2`. | Reader can trace `√8∈Q → √8/2∈Q → √2∈Q`, cite why division by `2` preserves rationality, and identify the contradiction with the just-proved result before concluding `√8∉Q`. | New static dependency ladder with the nonzero-rational closure condition attached to the division arrow and the prior theorem shown as a separate established-result ledger. Showing the full answer is intentional; no quiz or forced reveal is required. |

## Evidence and scope limits

The three new figures are original explanatory SVG geometry and contain no external artwork, font, dataset, quotation, or imported proof diagram. They visualize deductions; they are not independent mathematical evidence or learner-comprehension evidence. The canonical Hammack record remains `source:hammack-book-of-proof`, Chapter 6, §6.1, printed pp. 137–143. The author-hosted PDF URL opened only as raw PDF bytes in this work session, so its decisive passage was not newly text-verified; immutable source bytes, revision matching, source review, rights clearance, expert/learner review, audio, publication approval, and browser-rendered inspection remain pending.
