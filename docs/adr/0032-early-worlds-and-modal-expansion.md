# ADR 0032: Early worlds and a semantic bridge to modal notation

Date: 2026-10-18. Status: implemented locally; independent content review and publication pending.

## Sequence and representations

Introduce possible worlds in `wednesday`, before symbolic notation: reality and the assumed situation are distinct situations with separately assigned today references. Keep the arithmetic/day chain and a short conceptual explanation visible together. Do not introduce access controls or modal operators there. This supersedes ADR 0027's terminology-after-classical-proof sequence, while preserving scene IDs and the optional classical review.

In `notation` and `nonmodal-proof`, define A/B directly by the interpreted date constraints, not by duplicate prose clauses. Use t for reality and h for assumption 1, with explicit labels, weekday encoding and the congruence definition. Derive the displayed constraints from the current references, including additional stable world IDs; do not relabel a deleted world or silently force the default direction. Preserve bidirectional root-path alignment between the original clauses, letters and mathematical definitions.

The later `contexts` scene is now an explicit nonmodal model: world-indexed today variables, calendar constraints and inferred world cards. No modal operators or accessibility settings are required to model distinct situations or derive the weekday. At `modal-comparison`, show the semantic connection instead of implying that possibility is unavailable without modal syntax. For the current finite successor list, expand diamond as the disjunction of P at those worlds and box as the conjunction. Empty expansions are bottom and top respectively. The compact modal operators express the same clauses while keeping notation stable as the world count changes.

## Scope and checks

An optional reference dialog supplements the compact comparison. It shows both calendar reference directions with their deduced days, then fixes the first direction and compares two declared accessibility sets. The reader's target day is reused, while the illustrative frames remain independent of saved edits. Compute answers and modal verdicts with the existing models rather than hardcoding labels. Preserve reader state, retain a fixed accessible close control with a bounded scroll body, and dismiss the sheet on state/navigation changes. This is a reference aid rather than an additional required scene.

This is a bounded expansion at a fixed evaluation point and current direct relation, not a translation of the full riddle, a change to the calendar answer, or an expressiveness claim against classical first-order logic. Formula notation P(w) denotes evaluating the weekday proposition at w. Existing deduced-modal clauses and review limits remain in force.

Check early disclosure, concrete A/B definitions, preserved edited contexts, hover/focus correspondence, finite expansion with changed and empty accessibility, restored state, and all scene geometry. Use standalone Playwright on the static build at desktop/narrow and the 200% capture baseline. Maintain deterministic scene/state contracts and keep source/expert/publication review separate from tests.
