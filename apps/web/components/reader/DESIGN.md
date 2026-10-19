# Shared reader corrective design contract

## 1. Scope and direction

Preserve the existing restrained reading surface and reusable navigation/premise components. This is a measured access correction, not a new visual theme or approval of the current educational design. Content-specific representations retain their topic owners.

## 2. Existing color and material tokens

The current surface uses background `#f6f8f0`, text `#293f35`, link `#365c42`, white reading cards, borders `#d5dfcc`, and focus outline `#648a4c`. These corrections add no palette, imagery, shadow, or elevation.

## 3. Typography

Retain the existing system Korean-capable font stack and Georgia symbolic-input stack. Do not shrink a scientific formula to make it fit. Normal registered targets must be readable in full; long reader-created expressions may retain the documented bounded input scrolling.

## 4. Geometry tokens

- Shared navigation and menu-summary minimum hit area: 44×44 CSS px, including narrow viewports.
- Narrow CH default-goal column: 148 CSS px. At the existing 18 px symbolic size this reserves room for `Ind(CH,ZFC)` plus the input's padding/border, instead of the current 96 px column that clips it.
- Keep the existing 720 px narrow breakpoint and desktop/narrow container insets. A change must not hide overflow or reduce body copy to recover space.
- Narrow Explosion dialogue budget: 176 CSS px, retaining the bounded long-input exception. Its normal invalid-input explanation needs 162 px with the installed fonts and must not be clipped by the older 160 px cap.

## 5. Reusable primitives and states

- Reader menu summary: closed/open, visible keyboard focus and native activation. Increasing its hit area must not cover the title, navigation or another control.
- Previous/Next: enabled/disabled and first/last-scene behavior. Keep labels and focus rings; minimum hit area applies to both states.
- Scientific goal input: editable valid/invalid draft, current value in full for normal examples, explicit focus, preserved draft during scene changes. Do not replace the actual input with a visual-only shortened formula.

## 6. Responsive and motion behavior

Test desktop and 390×844 narrow against the actual static build, including the last scene, open menu, restored state and CH's full default goal. Retain native focus and the existing reduced-motion rule. These corrections add no animation.

## 7. Accessibility constraints

Measure real scroll extents, content bounds and center hit testing; capture screenshots and inspect the formula and menu area. A larger bounding box is insufficient if another element obscures it. No hidden-overflow fix, disabled zoom or scientific notation abbreviation is permitted.

## 8. Unresolved debt

The scene-by-scene [catalog assessment](../../../../docs/reviews/content-quality/README.md) remains unresolved. Dense proofs, sparse conceptual visuals, source presentation, broader accessibility and observed comprehension require their own corrective review. This scoped contract cannot certify them.
