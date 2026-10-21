# Shared reader corrective design contract

## 1. Scope and direction

Preserve the existing restrained reading surface and reusable navigation/premise components. This is a measured access correction, not a new visual theme or approval of the current educational design. Content-specific representations retain their topic owners.

## 2. Existing color and material tokens

The current surface uses background `#f6f8f0`, text `#293f35`, link `#365c42`, white reading cards, borders `#d5dfcc`, and focus outline `#648a4c`. These corrections add no palette, imagery, shadow, or elevation.

## 3. Typography

Retain the existing system Korean-capable font stack and Georgia symbolic-input stack. Do not shrink a scientific formula to make it fit. Normal registered targets must be readable in full; long reader-created expressions may retain the documented bounded input scrolling.

Standard-reader keyboard hints show compact key names (`← → · Space/Enter`) with the complete Korean explanation in the native title. Keep the spatial reader's longer focus-dependent explanation distinct. Compact final navigation must not strand a single instruction word beside the enlarged end-link targets.

Topic-owned teaching figures keep Korean words intact in their prose and captions with `word-break: keep-all`; `overflow-wrap: anywhere` is the emergency fallback for an otherwise unbreakable token. The same opt-in scope uses `text-wrap: pretty` and a 96% caption measure to improve the final line without reducing type size. Authors may join a short formula or semantic unit with nonbreaking spaces, but must not bind a full clause that cannot reasonably fit the 390 px reference viewport. Apply this only to the figure-bearing topic surfaces that adopt the contract, rather than changing every existing reader.

## 4. Geometry tokens

- Shared navigation and menu-summary minimum hit area: 44×44 CSS px, including narrow viewports.
- Narrow CH default-goal column: 148 CSS px. At the existing 18 px symbolic size this reserves room for `Ind(CH,ZFC)` plus the input's padding/border, instead of the current 96 px column that clips it.
- Keep the existing 720 px narrow breakpoint and desktop/narrow container insets. A change must not hide overflow or reduce body copy to recover space.
- Static teaching-figure images use their intrinsic aspect ratio and a 6 px image-to-caption gap. The image box must not stretch to fill the figure slot because `object-fit` letterboxing separates the artwork from its caption.
- Narrow Explosion dialogue budget: 176 CSS px, retaining the bounded long-input exception. Its normal invalid-input explanation needs 162 px with the installed fonts and must not be clipped by the older 160 px cap.
- For standard narrow readers with a visible authored multi-scene Skip, the keyboard hint owns a complete first row and Previous/Skip/Next share the second row. Keep 4px gaps, full labels and 44px targets; the hint must not collapse into a one-character-wide column. Focus-reader rails retain their separately owned layout.
- For standard narrow readers on the final scene, Previous, the bounded keyboard hint, side-by-side end links, and Next share one row in four explicit grid columns. The footer stays within 48px; hint text may wrap naturally inside its column, end links must never underlap another column, and every button or end link retains a 44×44px minimum target and center hit access. Focus-reader rails remain excluded because they own a separate action layout.
- A page with authored chapter navigation uses the long-form document primitive at desktop and narrow widths. The document, not `.reader-copy`, owns vertical scrolling; the selected scene has no viewport-height row, prose maximum height or internal overflow. Keep the established body scale and a readable line measure rather than reducing type to recover height.
- A long-form spatial detour includes the viewer and domain styles, retains spatial mode while available, and reserves the existing 620px/72dvh desktop or 560px narrow workbench budget. Its displayed canvas must remain at least 240px tall; a populated backing store does not establish a visible visualization. Return to prose hides the workbench without discarding edited scientific state.
- Long-form concept cards preserve Korean words with `word-break: keep-all` and pretty wrapping; emergency wrapping remains available for overlong formulas rather than splitting ordinary words.
- Long-form prose also preserves Korean words, with emergency `anywhere` wrapping for overlong technical tokens. Headings balance complete words; authors may bind a short auxiliary phrase, number-unit pair or formula with nonbreaking spaces or word joiners, but never an entire overlong sentence.

## 5. Reusable primitives and states

- Reader menu summary: closed/open, visible keyboard focus and native activation. Increasing its hit area must not cover the title, navigation or another control.
- Previous/Next: enabled/disabled and first/last-scene behavior. Keep labels and focus rings; minimum hit area applies to both states.
- Scientific goal input: editable valid/invalid draft, current value in full for normal examples, explicit focus, preserved draft during scene changes. Do not replace the actual input with a visual-only shortened formula.
- Static teaching figure: intrinsic-ratio image followed immediately by its caption. It remains a live image with nonempty alternative text, never a background or bitmap substitute for topic-owned SVG geometry.
- Chapter group: a labelled mainline or optional group inside the existing contents panel. Mainline groups preserve authored reading order; optional groups use the existing muted ink and never masquerade as required progress.
- Optional branch link: a compact bordered link after readable scene prose. A mainline parent names each optional chapter; every detour exposes a visible `본문 돌아가기` link to its declared return scene. Default, hover and keyboard-focus states reuse the current link, line, paper and focus colors.
- Long-form scene: one complete selected scene in document flow, identified by the read-only `data-presentation="longform"` marker derived from chapter navigation. Its eyebrow is local to the current chapter (`본문 k/n` or `선택 · k/n`), and its branch and return links remain visible after the prose. Previous/Next remain deterministic but do not replace native Space/Enter scrolling.

## 6. Responsive and motion behavior

Chaptered routes select their authored scene and layout before JavaScript. Keep initial and enhanced text, image ratio and column geometry consistent. Compact figures and nearby prose use two minmax columns above 850px and a single document-flow column below it. Normal body copy remains 17px or larger. Motion scenes reserve the 44px control row plus its 24px margins before initialization, retain their caption, and replace only the static image with an inline 600×360 visual.

Registered presentation sequences use a 4000ms explanatory sweep, not a minimum slide duration. They start paused, support direct range input and replay/pause/reset, and never disable Previous/Next. Reduced motion starts at the comparison poster and remains paused. State stores absolute positions independently of scientific input. Presentation tokens are ink `#172033`, paper `#f7f8fb`, rule `#536d7e`, teal `#087f72`, blue `#2c63b5` and amber `#b36a17`; labels use the existing Korean-capable system stack at 25 SVG units or more. Colors are redundant with labels and geometry.

Test desktop and 390×844 narrow against the actual static build, including long-form opening and longest-proof scenes, detour entry/return, restored state, the last scene, open menu and CH's full default goal. Retain native focus and the existing reduced-motion rule. These corrections add no animation. Readers without chapter navigation keep their current bounded geometry.

## 7. Accessibility constraints

Measure real document and internal scroll extents, content bounds and center hit testing; capture screenshots and inspect the formula and menu area. Long-form prose must satisfy `scrollHeight === clientHeight` internally while the document may exceed the viewport. A larger bounding box is insufficient if another element obscures it. No hidden-overflow fix, disabled zoom or scientific notation abbreviation is permitted.

## 8. Unresolved debt

The scene-by-scene [catalog assessment](../../../../docs/reviews/content-quality/README.md) remains unresolved. Dense proofs, sparse conceptual visuals, source presentation, broader accessibility and observed comprehension require their own corrective review. This scoped contract cannot certify them.

The long-form chapter treatment has not yet received rendered desktop/narrow review. It deliberately adds no hidden navigation stack: scene identity, chapter metadata and the existing saved interaction snapshot remain the complete restoration contract.
