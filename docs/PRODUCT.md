# Reader experience

## Information and navigation

A concept identifies a subject; an article explains subjects; typed relations connect them in context; sources supply evidence; scenes present states; projections fix paths. These entities need not be one-to-one. External IDs or matching names do not establish concept identity.

Readers may enter through links or the catalog, inspect evidence, change useful conditions and follow meaningful related links without compulsory prerequisites. Search, multilingual aliases, filtering and richer graph browsing remain planned; a large force-directed graph is not required. Use authored short titles on compact surfaces with full-title fallback and canonical share metadata. Catalog cards are text-only; optional title artwork is separate from thumbnails and preserves real headings/alternatives.

The catalog offers equal possible starting points across subjects. Newtonian-to-quantum development and number-system structure are useful examples, not two flagship products or a limit on future content. All active explanations use the same card, typography, available width, opening question and payoff treatment; topic identity, length or chapter support does not grant prominence or a different approval badge. Chaptered explanations include the central argument and deeper worked sections in one default reading sequence without making other subjects secondary. Every manuscript remains subject to the same content and evidence review. Article/scene counts are not reader benefits and should not substitute for a concrete question and payoff on the index.

## Reading and interaction

- Reading is self-paced, with Previous/Next, direct scene selection and keyboard navigation; no playback waits or compulsory extra expansion action. Every authored slide belongs to the default Previous/Next sequence. Deeper proofs and experiments appear at their relevant context; they are never omitted behind a separate entry/return path.
- Ordinary scenes have no minimum dwell or disabled navigation while an animation runs. Replay/pause and reduced-motion treatment support understanding; decorative motion and a fixed duration are not reasons to keep a reader on a scene.
- Show skip only for a meaningful forward jump beyond Next. Name the skipped topic/scope and destination accessibly. Content owns its authored destinations.
- Preserve reader edits across navigation. Reset suggested examples only explicitly. Dialogue, diagrams, proof rows and availability must follow the same current input/model result or invalidate together.
- Keep scene identity stable during errors/counterexamples. Show a separate status, clear stale results and keep editing/navigation available. Do not choose a different reader goal to obtain a successful result.
- Report bounded search failure within its limits; never equate it with falsity, consistency, unprovability or independence. Distinguish an actual countervaluation from absent search output.
- Use explicit subject adapters, not a universal proof engine or a copied page per topic. Preserve readable static content and meaningful alternatives; accessibility, transcripts and reduced-motion behavior require independent review.

## Viewport and controls

Desktop readers use one 960×540 CSS composition. At a larger desktop viewport, the complete CSS/DOM surface uses the uniform fit scale `min(viewport width / 960, viewport height / 540)` and remains horizontally centered; unused space is letterboxed. Do not crop, stretch axes independently, enlarge only typography, or activate a different wide-screen layout. Viewport units and width/height media rules resolve against the 960×540 logical composition while scaled. Fitting applies when both desktop dimensions meet the base and either exceeds it, including scale-one letterboxing at 1920×540 or 960×1080; smaller desktop windows retain their existing responsive behavior. Test the base at 960×540, the scaled baseline at 1920×940, and narrow reading separately at 390×844. Future landscape YouTube output uses the [1920×1080/200% baseline](DEVELOPMENT.md#local-media-production). Topic specifications declare their mobile layout, disclosure and bounded-scrolling exceptions.

Measure real scroll extents, content bounds, control access and hit targets. Hiding overflow is not a fit solution. Normal source text, diagrams, proof/dialogue and navigation must fit. Long reader-created collections, unusually long expressions/results, and opened evidence/navigation/configuration/reference panels may scroll within bounded areas while retaining reachable close/navigation/editing controls. Unenhanced static documents and the narrow catalog may scroll normally. Do not expand an article-specific scrolling exception into a universal rule.

Navigation-enabled explanations are the long-form exception. Their enhanced reader owns normal document scrolling, shows one complete selected scene at its authored reading size, and does not impose an internal height cap or prose scrollbar. Space and Enter retain their native document/link/button behavior; only explicit Previous/Next controls and Left/Right arrows change scenes. Scene progress uses `본문 k/n` over the complete authored sequence. The contents panel lists every slide in the same order. A named forward skip is an explicit reader action over an included multi-slide section; normal Next never takes that skip automatically. Previous from a skip destination reaches the preceding slide in the complete sequence. Direct entry and restoration continue from the selected slide without a hidden return path. Readers without chapter navigation retain the bounded scene layout and keyboard contract above.

Uniform desktop fitting does not change scroll ownership. A bounded reader remains a complete 960×540 frame before scaling; a chaptered reader keeps natural document scrolling in the same logical width, with its full document extent scaled uniformly. Fixed and modal panels stay inside the logical frame and may use their documented internal scrolling. Canvas backing stores follow the scaled displayed rectangle and direct pointer coordinates; scaling must not replace live DOM, keyboard behavior, state restoration or deterministic rendering.

Keep chrome small. Detailed evidence/connections belong on demand; assumptions, result status and representation limits remain visible. Navigation should remain reachable across scenes/restoration. Never intercept editing/menu/dialog keys or native link/button activation. Topic-specific focus frames and geometry belong in the [owning content specification](../content/formal-logic/weekday-worlds/README.md), not platform-wide pixel rules.

## Explanation design

Identify the opening question, intended explanation and minimum background before introducing terminology. Each control should make clear what changes, what to observe and what the observation supports. Optional predictions/reveals must not gate progress. The primary path independently answers its question; proofs, observations and uncertainty need appropriate forms rather than one compulsory narrative template. A static explanation is valid when manipulation adds little.

Explain unfamiliar field-specific words in the visible first-use sentence with a concrete example, not only in a glossary or tooltip. Present a simple operation or mechanism with its meaningful visual comparison while the short explanation is in view; do not make a reader traverse a large summary image before discovering the scene's question. Longer proofs may remain optional depth without withholding the mainline's necessary reasoning.

Use changed-condition/transfer questions with explanatory feedback where useful. Preserve essential conditions and declare authored analogies. Observed comprehension requires reader research; clicks, elapsed time and geometry checks cannot establish it.

## Representation correspondence

Where authored alignment exists, hover/focus exposes the entire nested root-to-selected path in both representations, including repeated/discontinuous fragments. Preserve semantic roles, identity colors and geometry; refresh clears stale emphasis. Use direct emphasis without native fragment tooltips, teach the interaction briefly in prose and expose the path accessibly. Keep partial formalization distinct from complete translation. The [alignment component](../apps/web/components/alignment/README.md) owns its API; topics own their forests and mappings.

## Video and evidence

Web reading is self-paced; video fixes one path through the same claims/models. Portrait projection and narrow web reading are separate layouts. Short explanations have a 180-second ceiling, not a duration target; do not add filler or compress a proof to meet it. Production controls and review belong in [Development](DEVELOPMENT.md). Video must be independently useful and may invite deeper web exploration as described in [Vision](VISION.md).

Evidence panels expose claim IDs, scopes, assumptions, exact locators, review and rights states. Source consultation/revision dates and content review dates are distinct. Suggestions enter review rather than silently changing scientific content. Keep unresolved review evidence when needed; routine implementation/test history belongs to Git and task reports.
