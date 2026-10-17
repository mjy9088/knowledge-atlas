# Reader component contracts

## Availability feedback

`mountEvaluationFeedback({content, message})` in [evaluation-feedback.ts](evaluation-feedback.ts) accepts `{available, summary, detail}`. The caller owns scientific evaluation and wording. Keep topic/scene headings stable when an input is invalid, unavailable or a counterexample; show its outcome separately. The component hides/disables only dependent content and renders a polite live status. Editing/navigation and useful counterexample views remain available; valid recovery restores content. Default conceptual prose need not depend on a customized evaluation.

Expose detached `getState()`, validated `setState()` and `reset()`. Reject nonboolean availability, nonstring copy and unavailable state without a summary before mutation. No domain rules, alternative-goal selection or scientific interpretation belong here. Verify recovery/reset, invalid-state atomicity, a non-logic caller and unchanged topic identity.

## Topic lifecycle and skip integration

The shared [topic registry](../../topics/registry.ts) explicitly selects adapters. Optional activity, pre-Next and scene-request hooks let an adapter pause work, consume a navigation action or request a declared scene; other adapters need not implement them. Validate requested scene identity. Restore the chosen scene before the interaction snapshot so suggestions do not overwrite saved input/selection. Focus the resulting heading for requested navigation. Do not intercept typing or native control activation with global reader shortcuts.

An authored skip names a forward nonadjacent scene. Reject missing, backward and adjacent destinations. Hide skip when it would duplicate Next. Derive skipped scope from covered scenes' `known` descriptions, expose destination/scope in help/accessibility copy and preserve experiment state. Content owns skip targets and labels. Verify normal/skip navigation, editing, restoration, key handling and fixed control access against [Product](../../../../docs/PRODUCT.md).

## Static scene figures

A reading scene may declare `figure: {src, alt, caption}` with a topic-owned `/content/<domain>/<topic>/<name>.svg` path. The shared renderer escapes all attributes and captions, validates the path and nonempty alternative/caption, and displays it in the same scene slot as conceptual cards. The controller must preserve figure visibility when there are no cards. Experiment/topic-adapter views continue to own their own visuals. Static figures have no hidden interaction state; scene navigation, independent restoration and reset use the shared reader. Keep numerical conditions and alternative text aligned with owned claims. Fit image, caption, prose and navigation together at supported narrow and recording viewports; hiding overflow is not a fitting strategy.
