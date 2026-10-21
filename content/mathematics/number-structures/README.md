# Why these number systems?

This long-form Korean article asks what kind of failure is being repaired and which structure the repair must preserve. Its 11-scene mainline distinguishes three moves rather than presenting `ℕ→ℤ→ℚ→ℝ→ℂ` as an inevitable ladder: repairing an operation, generating a field from a named solution, and imposing a global structural property. In particular, `√2∉ℚ` is one premise for the independently checked construction of `ℚ(√2)` inside an already supplied real field, but it does not construct or force `ℝ`; the least-upper-bound property is a separate universal requirement.

The convention is `ℕ={0,1,2,…}`; other conventions are acknowledged. Integers add additive inverses, rationals add multiplicative inverses for nonzero values, `ℚ(√2)` locally supplies one missing root, a Dedekind-cut construction supplies one complete ordered field `ℝ`, and complex numbers solve `x²=−1` while giving up any total order that both extends the real order and satisfies the ordered-field laws. None is claimed to be a largest field.

## Scene and navigation contract

[DESIGN.md](DESIGN.md) is a prospective authoring contract, not an approved content decision. [article.ko.json](article.ko.json) gives one canonical block to each of 26 scenes, and [page.ts](page.ts) exposes three mainline chapters plus five optional detours. Normal Next navigation follows only the 11 mainline scenes; the other 15 scenes are optional proof paths. Every detour has identical parent and return scene IDs, so direct entry and restoration require no hidden navigation history.

The detours are:

- `fraction-construction`: defines the nonzero-denominator expression domain and proves cross-product transitivity using integer cancellation rather than rational division;
- `irrationality-proof`: completes both parity branches of the reduced-fraction contradiction while keeping real existence of `√2` separate;
- `complete-order`: names the ambient universe and treats every rational candidate for the `√2` boundary;
- `why-real-field`: derives natural-number unboundedness, proves the integer-part lemma and rational density in a general Archimedean ordered field, then proves cut-map definition, strict order, rational fixing, rational comparison, surjectivity, supremum transport, addition, multiplication, and sign reduction before comparing `ℝ(t)`;
- `complex-order`: closes both trichotomy branches in the ordered-field contradiction and compares the chosen property bundles.

[slide-plan.json](slide-plan.json) records purposes and success checks but no duration. This is self-paced long-form content; narration timing, audio, and video projection remain unmeasured and unapproved.

The introductory revision explains inverse operations in plain language, supplies the short irrationality contradiction on the required path, and pairs compact posters with number-line, fraction-partition and quarter-turn presentation sequences. `visual-scenes.ts` owns these bindings; the shared runner provides deterministic seeking, saved positions, replay/pause/reset, direct scrubbing and a paused reduced-motion comparison. No controls delay navigation. Every chaptered scene has its own static `/knowledge/number-structures/<scene>/` route. Existing source IDs and draft states remain unchanged.

## Claims and mathematical boundaries

The page reuses existing claims from the number-system topics rather than copying their definitions into a new claim store. [new-claims.json](new-claims.json) contains eight topic-owned records: the extension-choice bridge, general well-definedness of rational addition, the generated field `ℚ(√2)`, the completeness terminology boundary, the Archimedean consequence, the integer-part/density deduction, complete-ordered-field uniqueness, and the larger-system example.

The article keeps these distinctions explicit:

- fraction arithmetic must be independent of representatives: the concrete `5/6=10/12` check is followed by the general identity derived from `ab′=a′b` and `cd′=c′d`;
- decimal approximation does not prove irrationality, and irrationality does not construct a root or the real field;
- inside a supplied real field, `ℚ(√2)` is closed under sums, products, and nonzero inverses and properly contains `ℚ`; this is a local construction, not a construction of `ℝ` or a cardinality comparison;
- an upper bound `u` satisfies `a≤u` for every `a∈A`; a least upper bound is below every other upper bound and need not belong to `A`, unlike a maximum;
- an ordered field here has a total order, translation invariance, and positivity of products; least-upper-bound completeness is added separately;
- existence is supplied by a separate Dedekind-cut construction; uniqueness says that any two complete ordered fields are order-preserving field-isomorphic, not literally the same set;
- least-upper-bound/Dedekind completeness is the completeness notion used here; Cauchy completeness is not silently substituted without additional hypotheses and an equivalence theorem;
- `ℝ(t)` contains `ℝ` as a proper subfield, not as a cardinality claim. Nonzero rational functions have an eventual sign determined by their leading terms; eventual positivity is closed under addition and multiplication and therefore defines a compatible total order. Under it `t>n` for every natural `n`, so the field is non-Archimedean and not least-upper-bound complete;
- `ℂ(t)` is used as a separately derived field containing `ℂ` as a proper subfield; it is not attributed to the consulted real rational-function source and is not assigned the real eventual-sign order;
- complex numbers retain a field structure, including the nonzero inverse `(a,-b)/(a²+b²)`, but admit no ordered-field total order extending the real order.

The uniqueness detour is intended as a reconstructable argument rather than an allusion to a proof. It derives an integer-part lemma from natural-number unboundedness plus the standard well-ordering principle, uses it for rational density, establishes cut eligibility, separates ordered elements with two rationals, proves `φ(aF)=aG` and `qF<x ⇔ qG<φ(x)`, constructs a preimage from the target's lower cut, proves that order isomorphisms preserve suprema, and treats rational sums and positive products as cofinal below their targets against arbitrary elements of `F` and `G`, not merely rational targets. It then derives `φ(-x)=-φ(x)` and reduces zero and every negative-sign case to the positive case. Independent mathematical review is still required; this description is not approval.

## Original and reused figures

Current compact owned figures are selected by `visual-scenes.ts`:

- `figure-choices.svg` frames the distinct questions rather than an inevitable successor ladder;
- `figure-undo.svg`, `figure-fractions.svg` and `figure-rotation.svg` are static alternatives to the operation sequences;
- `figure-diagonal.svg` aligns the exact length with the reduced-fraction contradiction;
- `figure-boundary.svg` distinguishes a least ceiling from a largest member;
- `figure-cut-overview.svg` orients the optional proof's dependencies without claiming to prove them by arrows.

The earlier `figure-obstruction-map.svg`, `figure-property-ledger.svg` and `figure-cut-isomorphism.svg` remain source provenance, not the current bound artwork or evidence of this revision's rendered quality.

They use independently authored explanatory geometry and reproduce no external artwork, data, or measured diagram. The page also reuses existing owned number-system SVGs where those assets already express the exact simultaneous relation. Static diagrams have no hidden state. Their alternative text and captions carry the mathematical relation; screenshots cannot establish correctness or learner understanding.

## Source consultations and provenance limits

The eight distinct source IDs referenced by [new-claims.json](new-claims.json) are already represented in the shared source registry: two OpenStax sources, Beck, Hammack, MIT, Goldmakher, Boas, and Baggett. Four live PDFs were newly consulted for this article on 2026-10-20: MIT, Goldmakher, Boas, and Baggett. This folder does not retain a duplicate proposal file, and this revision did not change the shared registry.

1. **Leo Goldmakher, “R Is the Only Complete Ordered Field.”** Theorem 1.1 on PDF p. 1; cut eligibility on p. 2; the two-rational order step and exercise-only surjectivity on p. 3; addition on pp. 3–4; and positive-only multiplication on pp. 4–5 were read. Because the note leaves surjectivity as an exercise and treats multiplication first for positive elements, it is not cited as if those omitted details were supplied there.
2. **Tobias Holck Colding, MIT 18.100B/18.1002 Spring 2025 Lecture 3.** The least-upper-bound formulation on PDF p. 1, positive `√2` existence on pp. 2–3, and the Archimedean theorem on p. 4 were read. Page 4 supplies the natural-number unboundedness premise; the generic ordered-field integer-part and rational-density derivations are independently authored from that premise plus standard well-ordering of the natural-number copy.
3. **Harold P. Boas, Math 409 class notes.** PDF slide 2 was read for the eventual-sign order on the real rational-function field and the conclusion `t>n` for every natural `n`. The separate statement that `ℂ(t)` contains `ℂ` as a proper subfield follows independently from the same formal rational-function construction and is not attributed to Boas.
4. **Lawrence W. Baggett, “Existence and Uniqueness of a Complete Ordered Field.”** Theorem A.6 on PDF pp. 6–7 / printed pp. 228–229 was read for the actual surjection argument, addition, and sign reduction. Printed p. 229 says the multiplication argument is analogous; it does not print the full positive-product cofinality proof now supplied independently in the article. Goldmakher prints the positive case but not the later sign reduction. The opening cut construction and existence result were consulted separately from the uniqueness theorem.

The Cauchy-completeness distinction is an independently authored scope boundary. The MIT citation supports the least-upper-bound formulation, and the uniqueness sources support the complete-ordered-field hypotheses; none is represented as a source for a metric/order completeness equivalence theorem.

The source-only catalog loads all eight topic claims from [new-claims.json](new-claims.json). The canonical Baggett source record distinguishes the printed addition/sign arguments from the positive-product argument merely described as analogous. The article independently supplies that positive-product cofinality proof; source registration and structural claim resolution do not constitute approval.

The PDFs are live resources. Exact provider revisions, immutable source bytes, hashes, item-level licenses, and publication rights were not established. Local working downloads are not approved source snapshots. All Korean prose and all three new figures are independently authored; no external quotation, figure, table, dataset, media, or code is included.

## Pending review and publication state

The article remains `needs-content-review`; new claims remain `draft-source-aligned`; [DESIGN.md](DESIGN.md) remains prospective. Revision-bound manuscript and proof critiques must independently reconstruct the fraction, boundary, cut, cofinality, sign, rational-function, and complex-inverse steps and assess whether they earn the local/global thesis. Their scoped judgments are not expert approval or learner evidence. Korean copy review, learner comprehension, exact source revision verification, rights, rendered desktop/narrow usability, accessibility, narration/audio, and publication authorization remain separate pending obligations. A successful parser, typecheck, build, test, or screenshot cannot substitute for those reviews.
