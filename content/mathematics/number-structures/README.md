# Why these number systems?

This long-form Korean article follows one repeated question: which operation or property fails in the current system, and what must an extension preserve? Its 14-scene mainline moves through `ℕ→ℤ→ℚ→ℝ→ℂ` by working `2−5`, `2x=1`, `1/2+1/3`, the unit-square diagonal, a bounded rational gap, and `i²=−1`. It is not a taxonomy and does not claim that the sequence is inevitable or ends in a largest number system.

The convention is `ℕ={0,1,2,…}`; other conventions are acknowledged. Each transition names a selected goal and a preservation condition. Integers add additive inverses, rationals add multiplicative inverses for nonzero values, reals supply the least-upper-bound property for an ordered field, and complex numbers solve `x²=−1` while giving up any total order that both extends the real order and makes the result an ordered field.

## Scene and navigation contract

[DESIGN.md](DESIGN.md) is the approved authoring plan. [article.ko.json](article.ko.json) gives exactly one canonical block to each of 25 scenes, and [page.ts](page.ts) exposes three mainline chapters plus five optional detour chapters. Normal Next navigation follows only the 14 mainline scenes. Every detour has identical parent and return scene IDs, so direct entry and restoration require no hidden navigation history.

The detours are:

- `fraction-construction`: defines the nonzero-denominator expression domain and proves cross-product transitivity using integer cancellation rather than rational division;
- `irrationality-proof`: completes both parity branches of the reduced-fraction contradiction while keeping real existence of `√2` separate;
- `complete-order`: names the ambient universe and treats every rational candidate for the `√2` boundary;
- `why-real-field`: proves the Archimedean consequence, sketches the rational-cut uniqueness argument, and gives a larger non-Archimedean ordered field;
- `complex-order`: closes both trichotomy branches in the ordered-field contradiction and compares the chosen property bundles.

[slide-plan.json](slide-plan.json) records purposes and success checks but no duration. This is self-paced long-form content; narration timing, audio, and video projection remain unmeasured and unapproved.

## Claims and mathematical boundaries

The page reuses existing claims from the eight number-system topics rather than copying their definitions into a new claim store. [new-claims.json](new-claims.json) contains only five new records: the extension-choice bridge, the completeness terminology boundary, the Archimedean consequence, complete-ordered-field uniqueness, and the larger-system example.

The article keeps these distinctions explicit:

- rational midpoint density is a theorem about two rational endpoints; density of `ℚ` in `ℝ` is a stronger, separately sourced theorem;
- decimal approximation does not prove irrationality;
- existence of the positive real `√2` and irrationality of `√2` are separate claims;
- least-upper-bound/Dedekind completeness is the completeness notion used here; Cauchy completeness is not silently substituted without the additional hypotheses and equivalence theorem;
- complete ordered fields are unique up to an order-preserving field isomorphism, not literal identity of underlying sets;
- larger fields exist. The rational-function example gives up the Archimedean consequence and hence least-upper-bound completeness, while `ℂ` gives up compatible ordered-field structure.

The uniqueness scene is labeled as a proof sketch but performs the central argument: identify the rational copies, assign each element its lower rational cut, take the corresponding supremum in the other field, use rational density for injectivity, use completeness for surjectivity, and identify the addition/multiplication preservation checks. It does not present omitted algebra as independently completed.

## Original and reused figures

Three original SVGs are owned here:

- `figure-obstruction-map.svg` maps each failed question to a selected extension goal;
- `figure-property-ledger.svg` records the gained, preserved, and surrendered properties;
- `figure-cut-isomorphism.svg` visualizes the rational-cut uniqueness proof sketch.

They use independently authored explanatory geometry and reproduce no external artwork, data, or measured diagram. The page also reuses existing owned number-system SVGs where those assets already express the exact simultaneous relation. Static diagrams have no hidden state. Their alternative text and captions carry the mathematical relation; screenshots cannot establish correctness or learner understanding.

## New source consultations and registry proposals

[source-proposals.json](source-proposals.json) contains proposed source records only. The shared registry was not edited. Four live PDFs were consulted on 2026-10-20:

1. **Leo Goldmakher, “R Is the Only Complete Ordered Field.”** Theorem 1.1 and §§2–4 were read for the rational embedding, the supremum-defined map, bijectivity, and operation preservation.
2. **Tobias Holck Colding, MIT 18.100B/18.1002 Spring 2025 Lecture 3.** The opening completeness definition, positive `√2` existence theorem, and Archimedean proof that the natural numbers are unbounded above were read.
3. **Harold P. Boas, Math 409 class notes.** The rational-function ordered field and the calculation `x>n` for every natural number were read as the concrete larger non-Archimedean example.
4. **Lawrence W. Baggett, “Existence and Uniqueness of a Complete Ordered Field.”** The Dedekind-cut definitions and Theorem A.6 on uniqueness up to isomorphism were read to corroborate the cut construction and hypotheses.

The PDFs are live resources. Exact provider revisions, immutable source bytes, hashes, item-level licenses, and publication rights were not established. Local working downloads are not approved source snapshots. All Korean prose and all three new figures are independently authored; no external quotation, figure, table, dataset, media, or code is included.

## Pending review and publication state

The article remains `needs-content-review`; new claims remain `draft-source-aligned`. Independent mathematical review must still work every example and proof branch, especially the uniqueness sketch and rational-function ordering. Independent content-value review must test whether each transition answers the opening question without unnecessary formalism. Korean copy review, learner comprehension evidence, exact source revision verification, rights review, rendered desktop/narrow review, accessibility review, catalog and concept registration, narration/audio, publication authorization, and publication are pending. A successful parser, typecheck, build, test, or screenshot does not satisfy those reviews.
