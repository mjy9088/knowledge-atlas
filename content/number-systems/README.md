# Number systems: six question-led episodes

This local series follows six questions rather than a taxonomy: how an empty collection can have a count, why subtraction leads left of zero, when fractions name the same number, why `√2` is not a fraction, how real completeness repairs a rational gap, and why multiplying by `i` rotates the complex plane. Each article uses the shared static reader, has no topic-specific controller or runtime model, and is planned below the 180-second projection ceiling. The web article remains the canonical prose; timings in `quality.json` are editorial plans, not audio measurements.

## Series conventions and scope

- Throughout this series, **`ℕ = {0, 1, 2, …}`**. Other books may start `ℕ` at 1, so the convention is stated rather than presented as universal.
- Zero as a count, zero as an additive identity, and zero as a positional placeholder are related uses but not interchangeable claims.
- Historical debt, loss, temperature, and placeholder examples motivate extensions of number language. They do not define the modern sets. The articles define the integer set `Z` and rational-number set `Q` mathematically after the motivation.
- A rational number is represented by an integer pair `(a,b)` with `b ≠ 0`; different pairs represent the same rational exactly when cross-products agree. This makes equivalence part of the definition rather than a visual coincidence.
- Density says that another rational lies between any two distinct rationals. It does **not** say that every point or every least upper bound is rational. `Q` is dense but not complete.
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
| `irrational-numbers` | “√2를 분수로 정확히 쓸 수 있을까요?” | 150 s | Reconstruct the coprime/parity contradiction and separate proof from decimal approximation. |
| `real-completeness` | “유리수의 빈틈을 실수는 어떻게 메울까요?” | 164 s | Name the ambient universe and contrast a missing rational supremum with the real least-upper-bound property. |
| `complex-numbers` | “i를 곱하면 왜 90도 돌아갈까요?” | 160 s | Compute with the ordered-pair model, interpret multiplication by `i`, and reject an ordered-field extension of the real order. |

## Source and rights boundary

`sources/registry.json` records the integrated references for all six episodes, and `knowledge/concepts.json` owns their canonical concept records. Source revision bytes and hashes were not captured. All Korean prose, examples, cards, scene organization, and the complex-rotation SVG are independently authored; no external prose, figures, tables, media, data, or code are included. External rights notices remain observations, not project reuse clearance. Independent mathematical/editorial review, rights review, narration recording and publication authorization remain pending.

Claims stay `draft-source-aligned`, articles stay `needs-content-review`, and every `quality.json` stays `review-required`. A successful structural check can establish catalog compatibility, not expert approval or reader comprehension.
