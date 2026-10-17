# ADR 0025: A short modal-logic introduction through the weekday riddle

Date: 2026-10-17. Status: implemented locally; content review and publication pending.

## Audience and narrative

The user changed the editorial goal to an entertaining introduction that leaves readers aware of modal logic. Classical logic is recommended background, not an enforced prerequisite. Retain the nine stable scene IDs, title and route, but order scenes as question, Sunday, Wednesday, contexts, notation, alethic, transfer, literal and conclusion. Possible worlds are named after the ordinary examples; the notation scene bridges the nonmodal and modal readings, and subsequent scenes use the modal reading by default. The assessment criticism remains a scoped editorial claim in evidence rather than the narrative's main outcome.

Use only necessary visible notation. Replace Γ, Mod and entailment notation in the primary UI with descriptions of simultaneous calendar conditions and their result; retain exact independent model fixtures and evidence-level formal definitions. Two separate A/B lines, day congruence and the source/formula root-to-leaf mapping remain. On the bridge scene both conditional readings are visible and mapped. Explain ◇ and □ briefly by some/all accessible worlds; do not conflate these with the authored counterfactual or opaque desire notation. This is not a new truth evaluator for the utterance. Counterfactual truth still requires a similarity model, and the graph's reference arrows do not supply it.

## Deterministic presentation state

Add validated `modeSource: scene | manual` to version-3 snapshots. Fresh sessions use scene defaults. Direct links and forward/back navigation deterministically select calendar mode before the alethic scene and modal mode thereafter. Changing the mode explicitly sets manual ownership; navigation preserves that choice. Presets restore calendar conditions without overriding the current scene's presentation. Explicit scene reset resumes scene ownership and restores its example. Older snapshots without the field migrate as manual, preserving their existing mode. Reject unknown ownership values atomically. This additive migration preserves world/sample validation and the existing calendar model.

The comparison stage follows the active scene, independently of preserved custom calendar examples. Reader edits are never silently replaced by the new sequence. Customized narration explains the current computed result and its assumptions. This supersedes the earlier authored ordering in ADR 0018 and presentation-heavy notation in ADRs 0021/0024, while preserving their semantic distinctions and interaction contracts.

## Verification scope

Verify ordinary-to-comparison-to-modal navigation, direct entry, back navigation, manual override, explicit reset, old snapshots, invalid ownership, preserved custom inputs and restored comparisons. Existing model tests retain their mathematical expectations. Browser geometry must cover all scenes in desktop, narrow and 1920×1080/200% capture profiles against the static build. Passing these checks does not establish audience enjoyment, comprehension, expert review, or video production.
