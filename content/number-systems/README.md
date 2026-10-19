# Number systems: eight question-led episodes

This local series follows eight questions rather than a taxonomy: how an empty collection can have a count, why subtraction leads left of zero, when fractions name the same number, why the cross-product rule forms consistent representation classes, why `√2` is not a fraction, how an integer grid finds a rational between arbitrary real endpoints, how real completeness repairs a rational gap, and why multiplying by `i` rotates the complex plane. Each article uses the shared static reader, has no topic-specific controller or runtime model, and is planned below the 180-second projection ceiling. The web article remains the canonical prose; timings in `quality.json` are editorial plans, not audio measurements.

## Series conventions and scope

- Throughout this series, **`ℕ = {0, 1, 2, …}`**. Other books may start `ℕ` at 1, so the convention is stated rather than presented as universal.
- Zero as a count, zero as an additive identity, and zero as a positional placeholder are related uses but not interchangeable claims.
- Historical debt, loss, temperature, and placeholder examples motivate extensions of number language. They do not define the modern sets. The articles define the integer set `Z` and rational-number set `Q` mathematically after the motivation.
- A rational number is represented by an integer pair `(a,b)` with `b ≠ 0`; different pairs represent the same rational exactly when cross-products agree. This makes equivalence part of the definition rather than a visual coincidence.
- On the domain of integer pairs with nonzero second component, the cross-product rule is an equivalence relation. Its independently authored transitivity proof uses integer cancellation rather than assuming rational division.
- Density inside `Q` follows from rational midpoints. The stronger statement that a rational lies between any two distinct reals uses the Archimedean property and a sufficiently fine integer grid. Neither statement says that every point or every least upper bound is rational. `Q` is dense but not complete.
- Division by zero is excluded. No historical rule or infinity shorthand is substituted for an allowed denominator.
- The `√2` episode proves irrationality from a reduced fraction and parity contradiction. Decimal approximations are motivation, not proof, and existence of the positive real square root is stated as a separate assumption.
- Completeness claims always name the ambient universe. The standard `√2`-boundary set has no supremum in the rational-number set `Q` but has supremum `√2` when considered in the real-number set `R`.
- Complex numbers are defined as real pairs with field operations. Multiplication by `i` is a quarter-turn in the complex plane; `ℂ` cannot be made into an ordered field extending the standard real order.

## Episode map

| Directory | Opening question | Planned duration | Reader outcome |
| --- | --- | ---: | --- |
| `counting-zero` | “아무것도 없는데, 개수는 무엇일까요?” | 116 s | Explain zero as the count of an empty collection and use the declared natural-number convention. |
| `negative-numbers` | “높이 좌표 2에서 다섯 칸 내려가면 어디일까요?” | 132 s | Explain integers through additive inverses and carry out subtraction across zero. |
| `rational-numbers` | “1/2와 2/4는 두 수일까요?” | 147 s | Test fraction equivalence, find a rational midpoint, and distinguish density from completeness. |
| `rational-representations` | “서로 다른 분수 표기를 어떻게 한 수로 일관되게 묶을까요?” | 170 s | Prove that the cross-product relation consistently groups nonzero-denominator integer pairs and identify why the domain restriction matters. |
| `irrational-numbers` | “√2를 분수로 정확히 쓸 수 있을까요?” | 150 s | Reconstruct the coprime/parity contradiction and separate proof from decimal approximation. |
| `rational-density` | “두 실수 사이의 유리수는 어떻게 찾을까요?” | 174 s | Use an Archimedean integer grid to construct a rational strictly between arbitrary real endpoints and explain the strict mesh condition. |
| `real-completeness` | “유리수의 빈틈을 실수는 어떻게 메울까요?” | 164 s | Name the ambient universe and contrast a missing rational supremum with the real least-upper-bound property. |
| `complex-numbers` | “i를 곱하면 왜 90도 돌아갈까요?” | 160 s | Compute with the ordered-pair model, interpret multiplication by `i`, and reject an ordered-field extension of the real order. |

## Optional reader paths

The related-question panel offers forward questions as well as background: zero → integers → rationals; rationals branch to representation grouping or irrationality; representation grouping links to rational density; real completeness links to complex arithmetic. Existing links connect irrationality/density to completeness. These are optional editorial connections between the existing explanations, not imposed prerequisites, derivation claims, new source theorems or additional content units. Every article still supplies its own promised explanation without requiring the next page.

## Source and rights boundary

`sources/registry.json` records the integrated references for all eight episodes, and `knowledge/concepts.json` owns their canonical concept records. Source revision bytes and hashes were not captured. All Korean prose, examples, cards, scene organization, and the complex-rotation SVG are independently authored; no external prose, figures, tables, media, data, or code are included. External rights notices remain observations, not project reuse clearance. Independent mathematical/editorial review, rights review, narration recording and publication authorization remain pending.

Claims stay `draft-source-aligned`, articles stay `needs-content-review`, and every `quality.json` stays `review-required`. A successful structural check can establish catalog compatibility, not expert approval or reader comprehension.
