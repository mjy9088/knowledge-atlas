# Authored structural alignment

Use a domain-neutral declared forest to align natural-language fragments and symbolic expressions. Stable node IDs identify semantic roles independently of their visible spelling or current values. Each node has at most one parent. Repeated or discontinuous DOM fragments may share an ID, but two identically spelled terms with different roles use different IDs.

The pure `packages/experiments/semantic-alignment.ts` model validates IDs, parent references, cycles, bounded depth and detached state. The delegated `apps/web/components/alignment/semantic-alignment.ts` controller and its stylesheet own pointer/focus interaction and nested visual emphasis. Topic adapters own the authored forest and markup; they do not add topic rules to the shared controller.

Hovering or focusing a fragment emphasizes every node on its root-to-selected path on both sides, including repeated representations. Descendants and siblings outside that path remain unselected. Outline offsets expose nested ancestors without changing layout or replacing world identity colors. Accessible descriptions expose the same path. A caller may display the status breadcrumb or keep it available only to assistive technology. Do not add native title tooltips over aligned fragments. Keyboard focus works without hover; Enter/Space retain the selection and do not advance the reader; Escape clears it.

## Reuse contract

Declare `AlignmentNode[]` with `id`, optional `parent`, and a descriptive `label`. Wrap each authored fragment with `markAlignment(element, id, 'source' | 'symbol')`, preserving nested semantic containment. Mount once with `mountSemanticAlignment(container, nodes, statusElement, options)`. Instructions and breadcrumb prefix are configurable. All participating fragments must be descendants of the container, which scopes events and state independently of other instances.

Call `refresh()` after replacing markup or changing interpretation. This validates fragment IDs/sides, updates accessible paths and clears transient emphasis. `getState()`, validated `setState()`, `reset()` and `destroy()` support detached snapshots, deterministic restoration and listener cleanup. Invalid states leave the previous state intact. Highlighting does not modify the domain model or persist as a scientific input. This component supplies no text parser, automatic equivalence proof or inference rule.

## Verification obligations

Exercise ancestry, repeated/discontinuous fragments, parent-only selection, both-direction hover/focus, keyboard behavior, edited markup, malformed forests/state, independent instances, refresh/reset/restoration and destruction. Measure layout to ensure nested outlines never move controls. Topic-specific forests and formalization limits belong to the owning content specification.
