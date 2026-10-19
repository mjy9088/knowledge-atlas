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

## 5. Reusable primitives and states

- Reader menu summary: closed/open, visible keyboard focus and native activation. Increasing its hit area must not cover the title, navigation or another control.
- Previous/Next: enabled/disabled and first/last-scene behavior. Keep labels and focus rings; minimum hit area applies to both states.
- Scientific goal input: editable valid/invalid draft, current value in full for normal examples, explicit focus, preserved draft during scene changes. Do not replace the actual input with a visual-only shortened formula.
- Static teaching figure: intrinsic-ratio image followed immediately by its caption. It remains a live image with nonempty alternative text, never a background or bitmap substitute for topic-owned SVG geometry.

## 6. Responsive and motion behavior

Test desktop and 390×844 narrow against the actual static build, including the last scene, open menu, restored state and CH's full default goal. Retain native focus and the existing reduced-motion rule. These corrections add no animation.

## 7. Accessibility constraints

Measure real scroll extents, content bounds and center hit testing; capture screenshots and inspect the formula and menu area. A larger bounding box is insufficient if another element obscures it. No hidden-overflow fix, disabled zoom or scientific notation abbreviation is permitted.

## 8. Unresolved debt

The scene-by-scene [catalog assessment](../../../../docs/reviews/content-quality/README.md) remains unresolved. Dense proofs, sparse conceptual visuals, source presentation, broader accessibility and observed comprehension require their own corrective review. This scoped contract cannot certify them.
