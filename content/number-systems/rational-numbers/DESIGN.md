# Rational-number figures design system

## 1. Atmosphere & identity

These figures are quiet mathematical workspaces: warm paper, dark green notation, and restrained gold emphasis. Their signature is **shared geometry**—equivalent or ordered quantities occupy the same whole, branch, or number line so the relation is visible rather than merely labeled.

## 2. Color

| Role | Token | Value | Usage |
| --- | --- | --- | --- |
| Canvas | `paper` | `#f6f8f0` | Figure background |
| Surface | `panel` | `#ffffff` | Shared whole and reasoning panels |
| Ink | `ink` | `#293f35` | Primary labels and equations |
| Muted ink | `muted` | `#526b58` | Secondary labels |
| Relation | `relation` | `#365c42` | Axes, arrows, valid steps, focus outlines |
| Relation fill | `relation-soft` | `#e1eee3` | Selected/equivalent regions |
| Boundary | `boundary` | `#d5dfcc` | Dividers and neutral outlines |
| Contrast | `contrast` | `#a56d30` | Unequal products and excluded branches |
| Contrast fill | `contrast-soft` | `#f3dcb0` | Compared regions and warnings |

Colors are embedded in standalone SVGs, but every literal must match this table. Color never carries a relation alone: labels, geometry, and semantic attributes repeat it.

## 3. Typography

| Level | Size | Weight | Usage |
| --- | ---: | ---: | --- |
| Figure title | 20px | 700 | One concise question or relation |
| Primary math | 26–30px | 700 | Fractions, equations, branch conclusions |
| Label | 18px | 700 | Whole/branch/point labels |
| Supporting | 16px | 400–700 | Conditions and explanatory steps |

Font stack: `'Noto Sans CJK KR', 'Malgun Gothic', sans-serif`. Labels remain horizontal and avoid dense paragraphs so Korean text stays readable in the shared reader's narrow figure slot.

## 4. Spacing & layout

The base unit is 4px. Figures use a `600 × 300` view box, 16px canvas radius, at least 16px exterior inset, and spacing steps of 8, 12, 16, 24, and 32px. Relational objects align to shared coordinates; number-line positions use one uniform affine scale. Narrow rendering scales the complete view box without changing relationships, so essential labels must remain at least 16px and must not overlap.

## 5. Components

### Relation figure

- **Structure**: accessible `<svg>` with `<title>`, `<desc>`, provenance `<metadata>`, a canvas, and named semantic `<g>` groups.
- **Variants**: shared-whole partition, two-branch case split, exact number line.
- **Spacing**: 16px outer inset, 24–32px between major groups.
- **States**: static only; no hover, active, loading, empty, or error state.
- **Accessibility**: page-level alternative text and caption restate the relation; SVG title/description make the standalone asset understandable; color is redundant.
- **Motion**: none. Each inference depends on a simultaneous comparison, not elapsed change.
- **Layout**: one bounded composition with no internal scroll owner.

### Semantic relation group

- **Structure**: named `<g id="…">` containing visible geometry plus `data-*` attributes for the relation it demonstrates.
- **Variants**: partition, coverage, equation branch, number-line point, arithmetic step.
- **States**: fixed authored state only.
- **Accessibility**: identifiers are test semantics, while visible labels and descriptions remain the reader-facing explanation.

## 6. Motion & interaction

No animation or manipulation is introduced. The needed observations are equality on one shared whole, exhaustive algebraic branches, and simultaneous order on one scale. Static comparison minimizes split attention and has no hidden state, reset, restoration, or reduced-motion variant.

## 7. Depth & surface

Use a borders-only strategy: 2–3px outlines separate panels and mathematical regions; no shadows or decorative gradients. Emphasis comes from a tokenized fill plus a stronger outline, never from ornamental elevation.

## 8. Accessibility constraints & accepted debt

Target WCAG 2.2 AA for text and meaningful strokes. Every figure needs nonempty page alt text and caption, SVG title/description, 16px minimum supporting labels, and redundant non-color encoding. Exact fractions remain text fractions rather than decimal approximations.

| Item | Location | Why accepted | Owner / exit |
| --- | --- | --- | --- |
| Rendered narrow/desktop inspection pending | Shared static reader | This scoped change does not run builds, ports, or browser QA; the parent will inspect the actual static build | Parent visual QA at 390px and supported desktop viewports |
