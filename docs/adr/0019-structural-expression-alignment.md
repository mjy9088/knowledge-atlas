# ADR 0019: Authored structural alignment between representations

Date: 2026-10-17. Status: implemented locally; content and publication approval remain separate.

## Decision

Use a domain-neutral declared forest to align natural-language fragments and symbolic expressions. Stable node IDs identify semantic roles independently of their visible spelling or current values. Each node has at most one parent. Repeated or discontinuous DOM fragments may share an ID, but two identically spelled terms with different roles use different IDs.

The pure `packages/experiments/semantic-alignment.ts` model validates IDs, parent references, cycles, bounded depth and detached state. The delegated `apps/web/components/alignment/semantic-alignment.ts` controller and its stylesheet own pointer/focus interaction and nested visual emphasis. Topic adapters own the authored forest and markup; they do not add topic rules to the shared controller.

Hovering or focusing a fragment emphasizes every node on its root-to-selected path on both sides, including repeated representations. Descendants and siblings outside that path remain unselected. Outline offsets expose nested ancestors without changing layout or replacing world identity colors. A textual breadcrumb and accessible descriptions expose the same path. Keyboard focus works without hover; Enter/Space retain the selection and do not advance the reader; Escape clears it.

## Reuse contract

Declare `AlignmentNode[]` with `id`, optional `parent`, and a descriptive `label`. Wrap each authored fragment with `markAlignment(element, id, 'source' | 'symbol')`, preserving nested semantic containment. Mount once with `mountSemanticAlignment(container, nodes, statusElement, options)`. Instructions and breadcrumb prefix are configurable. All participating fragments must be descendants of the container, which scopes events and state independently of other instances.

Call `refresh()` after replacing markup or changing interpretation. This validates fragment IDs/sides, updates accessible paths and clears transient emphasis. `getState()`, validated `setState()`, `reset()` and `destroy()` support detached snapshots, deterministic restoration and listener cleanup. Invalid states leave the previous state intact. Highlighting does not modify the domain model or persist as a scientific input. This component supplies no text parser, automatic equivalence proof or inference rule.

## Weekday adapter scope

`weekday-alignment.ts` supplies separate A/B-structure and question roots. Yesterday/tomorrow terms have distinct base-day and offset leaves, while consequent today, target weekday and queried today retain their own identities. The source, left calendar formulas and right calendar premises share these IDs. Edited world assignments update their values without changing roles. The two discontinuous connective fragments share a conditional-connective ID mapped to the arrow in an explicit `A → B` simplification; A and B also map to the corresponding sentence clauses. Selecting the arrow highlights the root and connective, without selecting the antecedent/consequent descendants.

The material-conditional reading deliberately abstracts away wish/counterfactual content. It is presented as a chosen simplification, not a complete translation. Keep `A → B` distinct from the solver's simultaneous constraints Γ={A,B}. Both modes retain separate calendar clauses and the question, while the active translation changes. [ADR 0021](0021-source-modal-translation.md) supersedes the earlier additive modal block: modal mode maps the wish to `Wishₛ` and the counterfactual connective to `□→`. Derived answers remain distinct from literal source fragments. The mode checkbox shares the Symbols heading row rather than taking a separate row.

## Verification

Pure tests exercise ancestry, ambiguous repeated labels, detached data and malformed forests/states. Standalone Playwright exercises bidirectional full paths, parent-only selection, keyboard behavior, edited contexts, modal scope, independent component instances, refresh/reset/restoration and cleanup. Viewport and content-bound checks remain necessary because correspondence styling must not shift controls or conceal overflow.
