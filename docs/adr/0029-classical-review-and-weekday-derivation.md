# ADR 0029: Skippable classical review and an ordinary weekday derivation

Date: 2026-10-18. Status: implemented locally; content review and publication pending.

## Sequence and scope

Keep the opening's two phases on one page. The fourteen-page sequence now inserts `nonmodal-proof` after `inference` and before `contexts`, retaining existing scene/block IDs. Notation and inference form an optional classical-logic review. Its skip action lands on the applied proof, not past it or at the modal introduction. Normal Next still visits each scene. The rule overview briefly shows modus ponens, modus tollens, conjunction introduction/elimination and disjunctive syllogism with a minimal connective glossary; it is not a complete calculus.

The proof keeps the simplified sentence and symbols together. From the authored material conditional A→B and an explicitly added A assumption, show B by modus ponens. With explicit reality/assumed-today references t/h, substitute the target weekday into the antecedent equality and use modulo-7 arithmetic to get the actual weekday. Calendar interpretation, substitution and arithmetic are additional structure, not consequences of propositional syntax alone. This is a conditional result under A; do not assert A from A→B or translate the original wish completely.

`weekdayClassicalProof` delegates consistency and answer extraction to the existing calendar model. The short t/h calculation supports the two declared reference directions, updates Friday/Monday and other targets, and declines to fabricate those steps for incompatible or unconstrained saved references. Do not replace or silently reset reader edits. No modal/world notation is revealed in this step. Once the proof has introduced symbols, keep Symbols visible whenever the simplified sentence is subsequently shown, including contexts; Selection remains withheld until its existing introduction. This supersedes ADR 0027's symbol-hidden contexts stage.

## Skip contract

Optional scene metadata names a forward target and a descriptive label. Reject missing, backward or adjacent targets, and show no duplicate skip for a one-step move. Derive the skipped scope from the covered scenes' authored `known` descriptions and include the destination in button help/accessibility text. In the weekday focus reader place the review action in the heading row, preserving Previous/Next bounds and the compact rail. Other readers can use their existing controls. Clicking it changes only the reader scene; the topic retains its validated calendar settings and state ownership.

## Evidence

The rule synopsis cites forall x: Calgary Chapter 17 §§17.3–17.4 and Chapter 19 §§19.1–19.2. The calendar application is independently authored under the existing scoped weekday rules. Review source locators independently of tests, and retain pending expert/rights/publication status. Validate normal/skip navigation, preserved and restored edits, both supported derivations, unsupported inputs and source/formula coexistence. Use standalone Playwright against the static build, including desktop, narrow and the 960×540 CSS/DPR 2 video baseline, measuring the new table/proof and skip control rather than masking overflow.
