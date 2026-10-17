# ADR 0030: Modal systems and editable frame conditions

Date: 2026-10-18. Status: implemented locally; independent content review and publication pending.

## Scope

After the modal-rule introduction, add `modal-systems` and `frame-system` without changing existing IDs. Possible-world semantics is a method shared by several systems, not a system on its own. The editor permits arbitrary direct accessibility relations and therefore uses normal K as its general baseline: classical reasoning, the K axiom, modus ponens and necessitation restricted to system theorems. Defining the possibility operator by duality does not add a frame condition.

Briefly compare K, D, T, B, S4 and S5 by added axiom schemas and frame conditions. State the B naming convention explicitly: K+T+B. S5 permits equivalence relations, including disconnected equivalence classes; it does not require every world to access every other world.

The authored default relation {(0,0),(0,1),(1,1)} is serial, reflexive and transitive, but not symmetric. It satisfies the standard K/D/T/S4 frame conditions and fails the B/S5 conditions. This is not a claim that this single finite frame has exactly the logic S4 or that the bounded editor establishes completeness for K. Frame validity quantifies over all propositional valuations; distinguish it from a particular weekday valuation or calendar consistency.

## Model and interaction

The pure frame classifier checks all existing stable world IDs and direct edges. Do not silently add closure edges or enforce a selected system. The comparison is explanatory; the next scene shows current property checks and system-condition badges beside the editable graph. Update them on relation edits, deletion, reset and restoration. Classification is derived, never persisted separately, and does not depend on the evaluation point. Preserve reader edits across scenes; distinguish the authored default from the current frame.

Reuse structural expression alignment for A/B definition lines as well as formula letters. Hovering or focusing either representation highlights every matching counterpart and its root-to-leaf ancestry, rather than replacing the reusable component with topic-specific hover handlers.

## Evidence

Schwarz, Accessibility §§3.2–3.4, supplies the system/frame correspondence and distinction between model truth and frame validity; Modal Operators §1.5 supplies the normal-K proof basis. The Korean summaries and classifier are independently authored. Pure tests exhaust all two-world relations and propositional valuations for the relevant schemas. Static-build browser tests cover edits/restoration, bidirectional definition alignment and content/control geometry at desktop, narrow and 960×540 CSS/DPR 2 sizes. Source revisions, rights review, expert review and publication remain pending.
