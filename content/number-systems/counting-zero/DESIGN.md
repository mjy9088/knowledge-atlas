# Counting-zero figure design contract

## 1. Atmosphere and identity

Extend the shared reader's quiet paper-and-ink surface for `question`, `empty-set`, `identity`, and the worked `transfer` example. The signature is a visible correspondence: collections occupy outlined containers, while counts or explicitly signed balances occupy separate number tiles. Counting, addition and a deficit are labeled as different operations. This is an explanatory correction, not a new theme or an approval of the article.

Primary readers are Korean-speaking learners who can count small collections but may treat `0` as “no answer” or identify the empty set with the numeral zero. Screen-reader users and readers at narrow widths must receive the same ordered objects, counts, mappings, and caveats. Color is redundant with labels, shape, grouping, and geometry.

## 2. Color

The figures use only extracted reader colors:

| Role | Value | Use |
| --- | --- | --- |
| Paper | `#f6f8f0` | Figure background |
| Surface | `#ffffff` | Collection containers and number tiles |
| Ink | `#293f35` | Primary labels and item outlines |
| Structure | `#365c42` | Mapping arrows and operation marks |
| Line | `#d5dfcc` | Container boundaries and separators |
| Muted | `#526b58` | Secondary labels |
| Count fill | `#e1eee3` | Number-tile distinction |
| Item fill | `#f3dcb0` | Countable marbles/items |
| Item stroke | `#a56d30` | Item boundaries |

Color never establishes cardinality, emptiness, mapping direction, or equality by itself. No external artwork, raster texture, gradient, or imported asset is used.

## 3. Typography

Use the inherited Korean-capable system stack: `'Noto Sans CJK KR','Malgun Gothic',sans-serif`. SVG labels use three sizes within a `600 × 300` view box: 16 px secondary labels, 20 px group labels, and 26–30 px counts/equations. Text remains horizontal; no sentence is reduced to fit a panel. Figure prose stays in the reader caption and canonical article rather than becoming small embedded copy.

## 4. Spacing and layout

All authored coordinates follow the reader's 4 px rhythm. Each SVG uses `viewBox="0 0 600 300"`, fluid intrinsic scaling, and no fixed rendered width. Outer inset is 16 px; principal containers use 12 or 16 px radii, at least 16 px internal padding, and at least 24 px separation between semantic groups.

The composition is wide but not a dense side-by-side text layout: each panel contains few large labels and repeated objects. At the roughly 300 px narrow reader slot, object counts remain distinguishable and labels remain at useful scaled sizes. Geometry must not rely on clipping or horizontal scrolling.

## 5. Figure primitives and states

### Collection container

- **Structure:** one semantic `<g>` with `data-collection`, a bounded rectangle, and zero or more individually authored item elements.
- **Variants:** populated and empty.
- **States:** static only; emptiness is an actual zero-item group, not a text label over hidden objects.
- **Accessibility:** figure-level title, description, alt, and caption name the collection and its count.

### Count tile

- **Structure:** separate rounded rectangle plus a large numeral; `data-count` records the represented cardinality for independent fixtures.
- **Variants:** `0`, `3`, and `5` as required by the scene.
- **States:** static only; a count tile is never drawn inside the collection it measures.
- **Accessibility:** nearby labels name it as a count or result, not as the collection object.

### Relation connector

- **Structure:** visible line or path with an arrow marker and a short operation label.
- **Variants:** counting map, cardinality map, and addition/equality progression.
- **States:** static only; direction and operation remain visible without color.
- **Accessibility:** description, alt, and caption state the relation in reading order.

### Countable item

- **Structure:** individually authored circle with `data-item` and group ownership.
- **Variants:** marble and neutral item; both are schematic tokens, not decorative generic circles.
- **States:** static only. Tests count actual geometry instead of trusting prose labels.

## 6. Motion and interaction

There is no motion or topic interaction. Every learning objective concerns a fixed correspondence that is strongest when its input and output can be inspected simultaneously. Animation would stage an already complete relation, introduce hidden temporal state, and add no inference. Shared scene navigation remains the only interaction; static figures have no independent reset or restoration state.

The `transfer` scene is worked exposition, not an independent-performance test. Its purpose is to show why including zero does not make natural numbers closed under all subtraction. Show four available items against six promised/required items, with two visibly unfilled requirements, and a separate signed ledger balance `−2`. The success check is an explanation that four actual items can have a shortage of two without a physical collection containing “negative two apples.” Keep `4−4=0` in the prose as the within-ℕ contrast. A quiz/reveal is not required for this role; learner attainment remains unassessed.

## 7. Depth and surface

Use the reader's borders-only strategy: paper background, white bounded groups, 2 px line boundaries, and no shadows. Shape differences carry ontology: large open containers are collections, small tinted tiles are numbers, and arrows are mappings or operations. The figures must read as structured diagrams rather than decorative cards.

## 8. Accessibility constraints and accepted debt

- Target WCAG 2.2 AA for text and meaningful geometry; do not encode meaning by color alone.
- Each SVG includes `<title>`, `<desc>`, and original-art metadata. Page metadata supplies nonempty Korean `alt` and `caption` strings with the full semantic relation.
- Keep labels few, large, and ordered left-to-right. Narrow rendering must preserve countable objects, mapping direction, and equation labels without requiring zoom or horizontal scroll.
- Tests verify semantic geometry independently: actual item counts, actual empty groups, separate set/number geometry, relation connectors, and unchanged result cardinality.

Accepted handoff limitation: this task does not run a static build or browser because an older audit owns that build. The lead must build after the audit captures, then inspect the exact three scenes at supported desktop and 390×844 narrow viewports, measuring figure/prose/navigation bounds and verifying alternative text/captions in the rendered document. Until that occurs, rendered fit, contrast in the final CSS context, assistive-technology reading, learner comprehension, content approval, rights approval, audio, and publication remain unverified, not passed.
