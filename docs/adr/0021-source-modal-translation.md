# ADR 0021: Switch the original sentence's translation

Date: 2026-10-17. Status: implemented locally as an explicit modeling proposal; expert/content and publication review remain pending.

The active presentation and sequence are superseded by [ADR 0027](0027-weekday-challenge-and-modal-foundations.md); this document retains the earlier decision and its provenance.

Supersedes the separate P/◇P/□P reader comparison in ADR 0018 and the additive modal display described in ADR 0019. Calendar arithmetic, classical-explosion scope, stable IDs and saved calendar/world inputs are preserved.

## Meaning of the switch

The Symbols checkbox switches the original sentence between two authored readings. Off displays the explicitly simplified material conditional `A → B`. On displays `Wishₛ(A) ∧ (A □→ B)`: the speaker wishes A, and asserts that B would hold if A held. This is a declared segmentation/reading of the Korean utterance, not a complete parser or a claim of its unique linguistic analysis.

`Wishₛ` is introduced as an opaque annotation for the speaker's wish. It is not replaced with alethic possibility or necessity and has no implemented desire semantics or truth evaluator. `□→` is a counterfactual conditional under the closest-antecedent-world reading in Schwarz §8.3, with that reading's similarity/limit assumptions. It must not be confused with the strict conditional `□(A → B)` or an arbitrary accessible P-world.

The UI supplies no similarity ordering or desire valuation. It therefore translates the structure but does not report a truth value for the whole utterance, including when no R-successor exists. The existing edited R continues to control the reference-world graph and accessible-choice filter; it does not silently become the missing similarity ordering.

## Rendering and alignment

Keep A and B's context-sensitive calendar definitions on separate lines in both modes. Remove the duplicated left Γ={A,B} row and retain the queried today beside the primary translation. The active expression replaces the preceding expression instead of appending an unrelated P/◇P/□P definition block.

The shared role-alignment forest adds a wish-marker leaf. In modal mode, “이었으면 좋겠다” maps to `Wishₛ`; “그럼 …일 텐데” maps to `□→`. The repeated A occurrences share the existing antecedent role, keeping all source/calendar references synchronized along their full root-to-selected paths. In nonmodal mode, the connective fragments map to the single simplified arrow. This is role alignment across authored fragments, not a single-parent parse of every repeated formula occurrence.

The right-hand view uses the same mapped translation and labels each world's numbered reference roles. It no longer displays unrelated atomic-P modal verdicts. The calendar deduction remains explicitly labeled as an additional Γ={A,B} assumption, not a consequence established by the counterfactual translation. The contradiction-only explosion connection applies to adopting that inconsistent Γ; it does not settle the counterfactual's truth.

## Compatibility and evidence

Version-3 state stores the same mode value, contexts, weekdays, worlds and R. Restoring an older `alethic` presentation now selects the corrected source-translation view; no scientific input is silently regenerated. The pure legacy P/◇P/□P evaluator remains available for existing exhaustive fixtures and frame validation/filtering, but is not presented as the sentence's translation.

Source locators belong to `claim:logic.weekday-worlds.modal-translation`. Browser expectations intentionally change to match the requested UI semantics; existing scientific calendar and legacy modal fixtures are preserved. Standalone browser checks exercise replacement, separate clauses, wish/conditional mappings in both directions, edited worlds/R, empty accessibility, restoration and supported viewport bounds. Tests establish implementation behavior, not linguistic/expert approval.
