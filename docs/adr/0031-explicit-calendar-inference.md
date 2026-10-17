# ADR 0031: Explicit calendar inference rules

Date: 2026-10-18. Status: implemented locally; independent content review and publication pending.

## Decision

This refines the premise wording and expands the arithmetic steps of [ADR 0029](0029-classical-review-and-weekday-derivation.md). Present symbolization as making the chosen interpretation available to explicit inference rules, not merely abbreviating prose. The simplified problem asks for the antecedent case: assume A inside that case, then apply modus ponens to A→B and A. Label A as the problem's case premise, not an arbitrary extra factual claim. The conclusion remains conditional on that case and the declared date references; A is not derived from A→B.

Define integer congruence modulo 7 by a difference that is an integer multiple of 7. State symmetry, transitivity and addition of the same integer to both sides. These are derived arithmetic properties used as inference rules, not new propositional or modal axioms. Ordinary integer arithmetic/equality rewriting remains background. Do not silently replace congruence by integer equality.

The worked proof explicitly lifts h≡₇d to h±1≡₇d±1, uses transitivity with the date correspondence (and an explicit symmetry line in the reverse interpretation), adds ±1 on both sides, then reduces the constant by multiples of 7. Every line names its referenced premises and rule. The model exposes the finite trace and affine integer terms for semantic checks; it is not an arithmetic proof search engine. Preserve the existing unsupported-input behavior and calendar solver.

## Evidence and display

Levin, Discrete Mathematics: An Open Introduction, second edition §5.2, supplies the congruence definition, equivalence properties and arithmetic compatibility. The weekday instantiation and trace are independently authored. Check all seven targets in both supported directions and truth preservation of each arithmetic step over negative and positive representative samples, separately from the existing answer fixtures.

Keep rules beside the nonmodal proof, with compact explanation copy and unchanged scene/navigation identity. Verify normal, edited and restored inputs, the longer reverse trace, alignment, and document/internal geometry using the static build at desktop, narrow and 960×540 CSS/DPR 2. Do not hide overflow to accommodate the new explanation.
