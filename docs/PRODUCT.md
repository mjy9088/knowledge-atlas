# Reader experience

## Information and navigation

A concept identifies a subject; an article explains one or more subjects; a typed relation connects them in context; a source supplies evidence; a scene presents a state; a projection fixes a path through scenes. These entities are not necessarily one-to-one. External article IDs and matching names do not establish concept identity.

Readers can enter through a link or knowledge index, read an explanation, change meaningful conditions, inspect evidence, and continue to related topics. Links explain their relationship without imposing a course. Search, multilingual aliases, filtering, and richer graph browsing are future features; a large force-directed graph is not required as the default interface.

## Interactive reading contract

- Present a diagram and dialogue with previous/next controls, direct scene selection, and keyboard navigation. Reading must not require waiting for playback or clicking an extra “expand inference” action.
- Explain the knowledge covered by “I know this explanation” and its destination near the skip button, including an accessible description.
- Proposed premises and goals are editable starting examples. Reader edits survive navigation. Diagrams, proof rows, titles, dialogue, and status must follow the same input and model result. Unsupported or incomplete input clears stale results; inapplicable example narration is replaced or invalidated.
- A bounded search failing to find a proof does not establish falsity, impossibility, consistency, or independence. A model that finds an actual countervaluation may describe that stronger result within its stated semantics.
- Reuse the editor, state adapter, and inference visualizer. Different subjects select different verified rule adapters; they must not pretend to use a universal proof engine.
- Preserve static readable content where implemented, and provide accessible controls, captions/transcripts, reduced-motion behavior, and meaningful alternatives. Automated geometry checks do not replace a full accessibility review.

## Viewport contract

Enhanced reading scenes must fit CSS viewports of 1920×1080, 1920×940, and 1920×900. The smaller heights are representative available browser areas, not universal measurements of address bars or taskbars. Test 390×844 separately for narrow reading. Use dynamic viewport height rather than assuming physical screen dimensions.

Normal scene examples must show their title, input, diagram, proof list, dialogue, and navigation without page scrolling or internal list/text scrolling. Verify actual content dimensions, element bounds, and unobscured controls; `overflow:hidden` alone does not satisfy the contract. Keep chrome to small logo/menu controls rather than large top and bottom bars.

Explicit exceptions: long user-created premise collections, unusually long expressions/results, and opened evidence/navigation panels may scroll within their own bounded areas. These must preserve access to goal editing and scene navigation. The full static document without enhancement and the narrow knowledge index may scroll normally.

Related knowledge and detailed evidence/scope belong in an on-demand panel, with small continuation links on the final scene. Essential assumptions, model limits, and result status must remain visible in the explanation itself.

## Reading, animation, and production

The interactive reader is self-paced and should not resemble a video player. The legacy inference laboratory may automatically advance proof steps and fill the current row's background to show progress; cancel that progression on invalidation or leaving the scene. Manual selection and restored state remain deterministic.

Mobile web reading and portrait projection are separate layouts. The portrait preview uses 1080×1440 (3:4), superseding the earlier 9:16 proposal. Place the title and optional short explanation above/below the central reasoning; do not move essential conditions into optional text. `/preview.html` compares desktop, narrow web, and portrait projection in scaled iframes.

Short explanations have a project maximum of 180 seconds, not a duration target. The focused pilot is 134 seconds. Do not add filler or compress a long proof merely to fit that maximum. Production tools and MP4 conversion are separate from the reader-facing static site; see [Development](DEVELOPMENT.md).

## Evidence and feedback

Evidence panels expose claim IDs, exact scopes, assumptions, source locators, review states, and rights information. Source synchronization dates and content review dates must be distinguishable. Reader suggestions enter review rather than automatically changing scientific content. Accepted corrections should eventually link to affected web and video versions.

Durable feedback decisions live in this document, the [Vision](VISION.md), the [Architecture](ARCHITECTURE.md), or a scoped [ADR](adr/README.md). Task-local changes and their validation remain in Git. A separate structured feedback artifact is justified only by an unresolved review or an actual workflow consumer; do not produce one JSON file per conversation turn.
