# ADR 0025: A short modal-logic introduction through the weekday riddle

Date: 2026-10-17. Status: implemented locally; content review and publication pending.

## Audience and narrative

The user changed the editorial goal to an entertaining introduction that leaves readers aware of modal logic. Classical logic is recommended background, not an enforced prerequisite. Retain the nine stable scene IDs, title and route, but order scenes as question, Sunday, Wednesday, contexts, notation, alethic, transfer, literal and conclusion. Possible worlds are named after the ordinary examples; the notation scene bridges the nonmodal and modal readings, and subsequent scenes use the modal reading by default. The assessment criticism remains a scoped editorial claim in evidence rather than the narrative's main outcome.

Use only necessary visible notation. Replace Γ, Mod and entailment notation in the primary UI with descriptions of simultaneous calendar conditions and their result; retain exact independent model fixtures and evidence-level formal definitions. Two separate A/B lines, day congruence and the source/formula root-to-leaf mapping remain. On the bridge scene both conditional readings are visible and mapped. Explain ◇ and □ briefly by some/all accessible worlds; do not conflate these with the authored counterfactual or opaque desire notation. This is not a new truth evaluator for the utterance. Counterfactual truth still requires a similarity model, and the graph's reference arrows do not supply it.

## Deterministic presentation state

The active scene owns interpretation. Before the introduction, display ordinary nonmodal reasoning. The notation scene displays both the material-conditional simplification and authored wish/counterfactual interpretation together, with corresponding ordinary-language readings; subsequent scenes proceed with the latter. Remove the modality checkbox completely. Previous/Next and direct scene links select the phase deterministically.

Retain validated `logicMode` and `modeSource: scene | manual` fields in version-3 snapshots for backward compatibility, detached restoration and old-fixture validation. These fields no longer override the effective visible interpretation; they are not scientific premises. Invalid values still reject atomically. This supersedes the earlier manual-mode ownership policy in ADR 0021 and the original version of this ADR. Calendar edits and world/access settings continue to survive navigation and hiding.

The comparison stage follows the active scene, independently of preserved custom calendar examples. Reader edits are never silently replaced by the new sequence. Customized narration explains the current computed result and its assumptions. This supersedes the earlier authored ordering in ADR 0018 and presentation-heavy notation in ADRs 0021/0024, while preserving their semantic distinctions and interaction contracts.

## Progressive disclosure

Scene identity determines visibility, not visit history or the currently saved example. The first three scenes show an ordinary-language source and a plain weekday chain derived from the same calendar solution. Question entry displays only the riddle, without its answer. The contexts scene reveals the existing original-expression world references and inferred calendar cards; it does not yet reveal symbolic equations, presets, access filters, the graph or modal explanations. The notation scene reveals the complete editor and the two formal readings. From there the existing modal progression continues. The cover removes its modal-concept badge and uses a neutral weekday-riddle category label. The prose introduces hover correspondence only when the notation becomes visible.

A topic-owned `weekday-intro.ts` DOM projection supplies the ordinary sentence and result chain. It delegates deduction to the existing pure calendar model and falls back to a plain undetermined/impossible result for non-preset restored inputs. It adds no claims, arithmetic fixtures or scientific state. Derive the effective interpretation from the scene even for a saved legacy manual mode; do not reintroduce a mode selector or let legacy values bypass the narrative. Hide controls with actual hidden semantics and close open popovers/dialogs when their stage is left. Blur hidden focused controls. State restoration, back navigation and source narration obey the same policy; hidden configurations remain validated and unchanged.

This supersedes the always-visible Original/Symbols/Selection requirement of ADRs 0018/0024 for the introductory stages only. The full editor remains simultaneous after its introduction. Tests for advanced editing enter that stage explicitly; introduction tests separately verify the absence of premature concepts and controls, correct Sunday/Wednesday results, direct entry and preservation across hidden stages.

## Verification scope

Verify ordinary-to-comparison-to-modal navigation, direct entry, back navigation, legacy modes unable to override the progression, absence of mode controls, explicit reset, old snapshots, invalid legacy ownership, preserved custom inputs and restored comparisons. Existing model tests retain their mathematical expectations. Browser geometry must cover all scenes in desktop, narrow and 1920×1080/200% capture profiles against the static build. Passing these checks does not establish audience enjoyment, comprehension, expert review, or video production.
