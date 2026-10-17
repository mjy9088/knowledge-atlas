# Logic, types, and computation

## Two bounded questions

The `computing/curry-howard` article asks how one function can represent a proof. It introduces propositions, types, assumptions, identity, application, composition, and pairs through worked expressions. It uses only the constructive implication/product fragment. It does not present classical logic as identical to this calculus or claim that every type-checked application satisfies every requirement.

The `computing/lambda-calculus` article asks how function application becomes computation. It separates abstraction from application, then explains substitution, binding, type mismatch, self-application, and the distinction between type safety and termination. It is not a survey of programming languages or the history of computation.

Both articles use the shared reader and the explicit `typed-lambda` adapter. Scene suggestions are starting examples; edited input and current evaluation must replace or invalidate example-specific dialogue. Each article owns its prose and claims. Related-concept links connect these two questions without making either a compulsory prerequisite.

## Scientific and explanatory boundaries

- Atomic types are uninterpreted names. A declared variable is an assumption, not a fabricated closed proof of an atomic proposition.
- Function introduction discharges its input assumption. Open terms retain their free-variable assumptions.
- Product introduction and projections supply the conjunction correspondence. Product types are ordered, while logical equivalences require actual mappings.
- Type mismatch rejects the submitted derivation in this calculus. It does not establish that its target proposition is false or uninhabited by every other term.
- Bound variables require scope-aware substitution. Capture-avoiding renaming is necessary when substituting open arguments; literal string replacement is not a semantic implementation.
- The experiment's reduction strategy is normal-order full beta reduction, including under abstractions, plus pair projections. Software Foundations' displayed STLC uses call-by-value and stops at abstractions; its evaluation order is not claimed as the implementation's strategy. The shared substitution/type rules, rather than copied evaluator code, inform the model.
- Self-application is excluded for a variable with one finite simple type. This says nothing universal about recursion in other type systems.
- Progress and preservation describe a specified absence of stuck states. Termination is a separate result. A finite evaluator's step limit does not prove divergence.
- General recursion, recursive types, polymorphism, subtyping, implicit coercions, exceptions, effects, and dependent specifications are outside the implemented teaching fragment.

The type derivation and reduction trace are the useful representation here. Decorative diagrams or generic illustrations are unnecessary. Cards in the static fallback preserve the actual expression/type relationship or a binding example.

## Source-reading record

Read on 2026-10-16. These are live readings, not captured immutable source snapshots or independent theorem verification. The wording and implementation are independently authored; no source prose, artwork, or implementation code was imported.

| Source ID | Source and actual reading | Version and rights observation |
| --- | --- | --- |
| `source:wadler-propositions-as-types` | Philip Wadler, [Propositions as Types, author-hosted PDF](https://homepages.inf.ed.ac.uk/wadler/papers/propositions-as-types/propositions-as-types.pdf). Introduction for the three levels of correspondence; §1 for the typed/untyped distinction, self-application, and recursion/termination; §2 for introduction/elimination; §3 for implication, products, and proof simplification; §4 for intuitionistic scope. | PDF cover explicitly says Version V10, 29 November 2014, submitted for publication, and copyright Philip Wadler 2014. Do not label this PDF as the later journal edition. No reuse license was established. |
| `source:plfa-connectives` | Philip Wadler, Wen Kokke, Jeremy G. Siek, [PLFA: Connectives](https://plfa.github.io/Connectives/). Introductory correspondence, “Conjunction is product” (pair constructor and both projections), and “Implication is function” (abstraction/application). | [PLFA index](https://plfa.github.io/) footer lists these authors and links CC BY 4.0. Live page revision not locked. The license observation does not authorize separately owned assets by assumption. |
| `source:plfa-lambda` | Same authors, [PLFA: Lambda](https://plfa.github.io/Lambda/), “Substitution”: free occurrences, restriction to closed arguments, and example requiring a fresh bound name to avoid capture. | Same observed PLFA site notice; exact chapter revision not locked. This chapter has additional constructs not adopted by the experiment. |
| `source:software-foundations-stlc` | Benjamin C. Pierce and the credited Programming Language Foundations contributors, [Stlc](https://softwarefoundations.cis.upenn.edu/plf-current/Stlc.html): introductory syntax, arrow types, “Operational Semantics / Substitution”, and “Typing / Contexts / Typing Relation”. [Types](https://softwarefoundations.cis.upenn.edu/plf-current/Types.html): “Progress”, “Type Preservation”, “Type Soundness”, and the concluding exercise distinguishing nontermination. | [Preface](https://softwarefoundations.cis.upenn.edu/plf-current/Preface.html) recommended citation displays volume 2, version 7.1, year 2026; footer displays 2026-08-24 09:57. These are observed metadata, not a frozen source revision. No license was verified during this reading. |

The source registry must retain null content hashes until actual source bytes are captured. Evidence consultation and third-party asset reuse are separate statuses; no permission request is implied merely by referencing the materials. Claims are `draft-source-aligned`, articles are `needs-content-review`, and expert approval/publication have not occurred.

## Experiment limits

The parser accepts named atomic types, arrows, products, annotated lambda abstraction, application, pairs and first/second projections. It accepts up to eight explicit assumptions, 512 characters per field and 160 lexical tokens per parsed field. The evaluator displays at most 24 reductions and stops before a displayed result exceeds 1800 characters. A stop at a resource bound is reported as truncation, never as divergence or non-provability. No host-language evaluation, recursion, booleans, sums or arbitrary theorem search is implemented.

The reader exposes one typing judgment and one reduction state at a time, with independent previous/next controls. Custom input survives chapter changes; type errors clear the displayed derivation and reduction, and replace example-specific narration. Type-goal mismatch is distinct from malformed/ill-typed input.
