# Inertial-motion figure design contract

## 1. Atmosphere and identity

Extend the shared reader's quiet paper-and-ink surface only for `comparison`, `inference`, and `transfer`. The signature is causal bookkeeping made spatial: aligned position marks reveal what changes under controlled resistance, while equal and opposite arrows reveal that nonzero forces can sum to zero. This is an explanatory correction, not a new reader theme, experimental record, or approval of the article.

Primary readers are Korean-speaking learners who may assume motion needs a continuing forward net force. Narrow-width and screen-reader users must receive the same controls, ordering, force pairs, and scope caveats. Color is redundant with labels, texture, arrow direction, grouping, and geometry.

## 2. Color

The figures reuse the shared reader palette:

| Role | Value | Use |
| --- | --- | --- |
| Paper | `#f6f8f0` | Figure background |
| Surface | `#ffffff` | Comparison lanes and diagram panels |
| Ink | `#293f35` | Primary labels and object outlines |
| Structure | `#365c42` | Velocity and controlled-comparison marks |
| Force | `#c2410c` | External-force arrows |
| Line | `#d5dfcc` | Boundaries, tracks, and separators |
| Muted | `#526b58` | Secondary labels and caveats |
| Comparison fill | `#e1eee3` | Position marks and car body |
| Rough accent | `#a56d30` | Rough-surface texture and higher-resistance label |

Color never establishes time order, resistance ordering, velocity, vector direction, or force cancellation by itself. No external artwork, gradient, raster texture, or imported asset is used.

## 3. Typography

Use `'Noto Sans CJK KR','Malgun Gothic',sans-serif`. Within each `560 × 360` view box, use 17 px for caveats, 18–20 px for lane/vector labels, and 22–24 px for headings. Keep text horizontal and short. Full conditions and interpretation remain in canonical prose, alternative text, and captions rather than becoming small embedded paragraphs.

## 4. Spacing and layout

Coordinates follow a 4 px rhythm. Each SVG uses `viewBox="0 0 560 360"`, fluid intrinsic scaling, 16 px outer inset, 12–16 px radii, at least 16 px internal padding, and at least 20 px between semantic groups. Each diagram uses rows rather than dense columns so its few labels remain legible in the reader's approximately 390 px narrow slot. No geometry relies on clipping, hidden overflow, or horizontal scrolling.

## 5. Figure primitives and states

### Controlled motion lane

- **Structure:** one semantic `<g>` per resistance condition, a level track, four actual position circles at common qualitative time intervals, and a distinct surface texture.
- **Variants:** rough, smooth, and air-supported; all retain the same object, start position, first interval, level, observation intervals, and stated drag control.
- **States:** static only. Decreasing inter-position spacing indicates qualitative deceleration; the rough lane decreases most and the air-supported lane least. Geometry is illustrative, not a numeric dataset or scaled prediction.
- **Accessibility:** title, description, alt, and caption name fixed/changed variables and order the qualitative outcomes.

### Force-and-velocity case

- **Structure:** direct equal-length opposed force arrows beside actual position marks over equal time intervals.
- **Variants:** stationary positions coincide; constant straight-motion positions are equally spaced.
- **States:** static only. Both variants visibly retain nonzero external-force arrows whose vector sum is zero.
- **Accessibility:** labels and descriptions state that zero net force does not mean no forces and includes zero or nonzero constant velocity.

### Free-body cross

- **Structure:** one car treated as the system, with drive/resistance and normal/gravity arrows sharing an origin; a separate rightward velocity arrow describes the stated motion.
- **Variants:** only the fixed-direction constant-velocity, level-road, approximately inertial-frame case is authored.
- **States:** static only. Each force is nonzero, each opposed pair has equal geometric length, and the velocity arrow is not drawn as a force.
- **Accessibility:** labels, alt, and caption name all four forces, cancellation conditions, direction, and the prohibition on inferring forces from speed alone.

## 6. Motion and interaction

There is no topic-specific motion or interaction. Each objective depends on comparing simultaneous conditions or vector pairs, so a complete static view is stronger than serial reveal, replay, or a novel control. Navigation is never gated by prediction. Static figures have no hidden state and require no independent reset, restoration, or reduced-motion branch.

## 7. Depth and surface

Use the reader's borders-only strategy: paper background, white bounded panels, 2 px lines, and no shadows. Track textures distinguish resistance conditions; circles are timed position marks rather than decorative dots. Arrowheads and labels distinguish force from velocity. The diagrams should read as authored scientific schematics, not generic cards or literal apparatus pictures.

## 8. Accessibility constraints and accepted debt

- Target WCAG 2.2 AA for text and meaningful geometry; never rely on color alone.
- Every SVG includes `<title>`, `<desc>`, and original-art metadata. Page metadata supplies nonempty Korean `alt` and `caption` text.
- Keep labels few and large. Geometry tests independently verify equal starts, same first interval, qualitative deceleration ordering, equal spacing, and paired vector sums.
- Do not claim exact distance, speed, acceleration, friction magnitude, measurement uncertainty, historical reconstruction, a zero-friction observation, or proof of the first law.

Accepted handoff limitation: this scoped task does not run the shared static build or browser. The lead must inspect these exact three scenes in the actual reader at supported desktop and 390×844 narrow viewports, measure figure/prose/navigation bounds, and verify alternative text, captions, contrast, and assistive-technology order. Until then, rendered fit, learner comprehension, scientific/pedagogical approval, rights approval, audio, and publication remain unverified.
