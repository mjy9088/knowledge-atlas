# Reader component contracts

## Static scene routes and authored motion

Chaptered explanations have materialized `/knowledge/<slug>/<scene>/` documents with one server-selected visible scene, layout class and intrinsic SVG dimensions before the controller loads. The base route selects the opening. Existing scene fragments normalize to the route; evidence/connections fragments retain panel semantics. The bounded weekday reader retains its fragment behavior and timed-challenge scope. Progressive scene links use browser history without discarding scientific input; reload and no-JavaScript scene entry remain readable.

`presentation-contract.ts`, `presentation-state.ts` and `presentation.ts` separate authored explanatory motion from scientific adapters. Registered factories own absolute `renderAt(timeMs)` geometry and disposal; the shared runner owns playback and validated detached position snapshots. `relatedAPI` optionally adds `presentation` state, validates it before changing scene/input, and seeks active scientific and presentation projections independently. Old snapshots without this field remain valid. No arbitrary executable path is loaded from content. Every motion scene needs a static figure and a caption that survives enhancement.

## Availability feedback

`mountEvaluationFeedback({content, message})` in [evaluation-feedback.ts](evaluation-feedback.ts) accepts `{available, summary, detail}`. The caller owns scientific evaluation and wording. Keep topic/scene headings stable when an input is invalid, unavailable or a counterexample; show its outcome separately. The component hides/disables only dependent content and renders a polite live status. Editing/navigation and useful counterexample views remain available; valid recovery restores content. Default conceptual prose need not depend on a customized evaluation.

Expose detached `getState()`, validated `setState()` and `reset()`. Reject nonboolean availability, nonstring copy and unavailable state without a summary before mutation. No domain rules, alternative-goal selection or scientific interpretation belong here. Verify recovery/reset, invalid-state atomicity, a non-logic caller and unchanged topic identity.

## Topic lifecycle and skip integration

The shared [topic registry](../../topics/registry.ts) explicitly selects adapters. Optional activity, pre-Next and scene-request hooks let an adapter pause work, consume a navigation action or request a declared scene; other adapters need not implement them. Validate requested scene identity. Restore the chosen scene before the interaction snapshot so suggestions do not overwrite saved input/selection. Focus the resulting heading for requested navigation. Do not intercept typing or native control activation with global reader shortcuts.

Every registered topic adapter supplies a mutation-free `validateState(unknown)` preflight before its `setState(unknown)` boundary. The reader treats a saved domain snapshot as opaque untrusted data until that adapter validates it; an arbitrary object is not asserted to be a `TopicState`. Never use a setter as a trial validator before choosing the scene, since that can fire callbacks or rebuild a scientific view prematurely.

An optional `afterRender` hook synchronously commits presentation that depends on the reader's final geometry after prose, control visibility and navigation update. It must not change scientific state, reset input or notify another change. The spatial adapter uses it to redraw the static field at its final canvas size, rather than leave a stale backing store until a later ResizeObserver callback. External resizes still use the viewer's observer.

In long-form works, customized domain feedback supplements rather than removes the canonical worked explanation. An adapter reporting `available: false` for the selected scene must not replace its manuscript, even when a different scene left customized input in that adapter. Preserve the edited input for a return to its applicable detour, but restore the inactive scene's original prose, claim references, and visual treatment.

Treat saved reader state as untrusted input. Accept only a non-array record with the declared reader keys and exact nested experiment/visual shapes; reject unknown keys, present-but-invalid optional fields and fields that do not apply to the current page. Validate the final target state before mutation: scene presets and the experiment `customized` flag determine the proof against which a saved visual step is checked. After preflight succeeds, restore the declared scene before explicit experiment or interaction state so scene suggestions cannot silently replace saved user input. Any rejection leaves the complete reader, experiment, visual and interaction snapshot unchanged.

An authored skip names a forward nonadjacent scene. Reject missing, backward and adjacent destinations. Hide skip when it would duplicate Next. Derive skipped scope from covered scenes' `known` descriptions, expose destination/scope in help/accessibility copy and preserve experiment state. Content owns skip targets and labels. Verify normal/skip navigation, editing, restoration, key handling and fixed control access against [Product](../../../../docs/PRODUCT.md).

## Static scene figures

A reading scene may declare `figure: {src, alt, caption}` with a topic-owned `/content/<domain>/<topic>/<name>.svg` path. The shared renderer escapes all attributes and captions, validates the path and nonempty alternative/caption, and displays it in the same scene slot as conceptual cards. The controller must preserve figure visibility when there are no cards. Experiment/topic-adapter views continue to own their own visuals. Static figures have no hidden interaction state; scene navigation, independent restoration and reset use the shared reader. Keep numerical conditions and alternative text aligned with owned claims. Fit image, caption, prose and navigation together at supported narrow and recording viewports; hiding overflow is not a fitting strategy.
