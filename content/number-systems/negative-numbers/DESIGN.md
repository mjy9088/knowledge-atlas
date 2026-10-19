# Negative-number figures design system

## 1. Atmosphere & identity

A calm mathematical workbench inside the existing shared reader. The signature is one continuous, evenly spaced number line whose marked geometry—not decorative cards—carries each inference.

## 2. Color

| Role | Token | Value | Usage |
| --- | --- | --- | --- |
| Figure surface | `--negative-figure-surface` | `#f8fafc` | SVG background |
| Panel surface | `--negative-panel-surface` | `#ffffff` | Symbolic transformation row |
| Primary ink | `--negative-ink` | `#172033` | Main labels and equations |
| Secondary ink | `--negative-muted` | `#526078` | Supporting labels |
| Rule | `--negative-rule` | `#8792a6` | Axis and unselected ticks |
| Positive/rightward | `--negative-positive` | `#1d4ed8` | Rightward movement and positive endpoint |
| Negative/leftward | `--negative-negative` | `#b54708` | Leftward movement and negative endpoint |
| Inverse relation | `--negative-inverse` | `#6d28d9` | Opposite-pair bridge and inverse replacement |
| Zero | `--negative-zero` | `#087f5b` | Origin marker |

Color never carries a distinction alone: direction, endpoint labels, equations, and marker shapes repeat every meaning.

## 3. Typography

- Primary stack: `'Noto Sans CJK KR', 'Malgun Gothic', sans-serif`.
- Figure title: 24 px, 700, line height 1.25.
- Equation: 26 px, 700, line height 1.2.
- Tick and explanatory label: 20 px minimum, 600, line height 1.35.
- No text smaller than 20 px in a `640 × 320` figure view box.

## 4. Spacing & layout

- Base unit: 4 px.
- Figure view box: `640 × 320`; the shared reader owns responsive scaling.
- Outer inset: 24 px; major vertical bands use 32 px multiples.
- Number-line ticks use one exact, repeated horizontal interval within each figure.
- Primary labels remain inside the safe inset and avoid dense annotation. At 390 px viewport width, the figure remains a single readable composition rather than a horizontally scrolling canvas.

## 5. Components

### Static reasoning figure

- **Structure:** accessible `<svg>` with `<title>`, `<desc>`, provenance `<metadata>`, background, equation/title, axis, ticks, path markers, and endpoint labels.
- **Variants:** five-step coordinate path; additive-inverse symmetry and order; subtraction-to-addition transformation.
- **Spacing:** 24 px outer inset, 32 px bands, equal tick interval declared by geometry.
- **States:** one complete static state only; hover, focus, loading, empty, and error states are not applicable because figures are noninteractive authored media.
- **Accessibility:** meaningful page-level alternative text and caption repeat the inference; SVG title/description identify it if opened directly; color is redundant.
- **Motion:** none. Simultaneous visibility is required for comparison and step counting.
- **Layout:** one bounded figure inside the shared reader's existing figure region; no internal scroll owner.

## 6. Motion & interaction

No controls, animation, reveal, or slider are introduced. Static paths show every step at once, avoid hidden prior state, and preserve deterministic navigation/reset behavior in the shared reader.

## 7. Depth & surface

Borders-only strategy. A light figure surface, axis rules, outlined markers, and at most one white symbolic panel establish hierarchy; no shadows, gradients, texture, or decorative elevation compete with the geometry.

## 8. Accessibility constraints & accepted debt

- Target WCAG 2.2 AA contrast for text and essential strokes.
- Korean labels use few large phrases; equations are also present in page alternative text and captions.
- The diagrams must remain understandable without color and without motion.
- Browser inspection at 390 px and supported desktop viewports is explicitly handed off; it is not established by source geometry tests.
- Learner attainment, screen-reader quality, expert/content approval, narration, rights clearance, and publication remain unassessed or pending; none is accepted as completed debt.
