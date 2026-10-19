# Inertial-motion figure design contract

## 1. Atmosphere and identity

Extend the shared reader's quiet paper-and-ink surface for `comparison`, `inference`, `frame`, and `transfer`. The signature is causal bookkeeping made spatial: aligned position marks reveal what changes under controlled resistance, equal and opposite arrows reveal that nonzero forces can sum to zero, and matched-time positions distinguish ground motion from bus-relative motion. This is an explanatory correction, not a new reader theme, experimental record, or approval of the article.

Primary readers are Korean-speaking learners who may assume motion needs a continuing forward net force. Narrow-width and screen-reader users must receive the same controls, ordering, force pairs, and scope caveats. Color is redundant with labels, texture, arrow direction, grouping, and geometry.

The six-scene reader keeps Korean words intact in every scene, not only figure scenes: `word-break: keep-all`, `overflow-wrap: anywhere`, and `text-wrap: pretty` apply under the inertial-motion page scope. This is a topic correction, not a shared-reader default.

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

Use `'Noto Sans CJK KR','Malgun Gothic',sans-serif`. Within each `560 × 360` view box, use at least 22 px for every essential lane, vector, condition, and relation label, and 26 px for figure headings. This keeps essential text at least 13 CSS px near the 390 px reader slot. Keep text horizontal and short; move repeated caveats to canonical prose, alternative text, and captions rather than shrinking them into embedded paragraphs.

## 4. Spacing and layout

Coordinates follow a 4 px rhythm. Each SVG uses `viewBox="0 0 560 360"`, fluid intrinsic-ratio scaling, 16 px outer inset, 12–16 px radii, at least 16 px internal padding, and at least 20 px between semantic groups. Each diagram uses rows rather than dense columns so its few labels remain legible in the reader's approximately 390 px narrow slot. The reader image box follows this aspect ratio instead of creating `object-fit` letterboxing. No geometry relies on clipping, hidden overflow, or horizontal scrolling.

At the 390 px narrow viewport, the `question` and `limit` card scenes use an explicit vertical stack. Their cards remain bounded and retain at least 17 px text. At every supported width these two scenes omit decorative dot connectors: those dots implied a timeline or causal sequence that the cards do not encode. Other topics and inertial figure scenes keep their existing layouts.

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

### Matched-time frame comparison

- **Structure:** labeled snapshots at `t=0,1,2 s` for the same object and bus origin, plus the subtraction `x′=x−X`. Use a common distance scale; position marks must represent the actual authored values, not equal-width categorical columns pretending to be distances.
- **Model:** ground-frame object positions `0,4,8 m`, braking-bus origin positions `0,3,4 m`, and bus-relative object positions `0,1,4 m`. The independently authored continuous definition is `x=(4 m/s)t`, `X=(4 m/s)t−(1 m/s²)t²` for `0≤t≤2 s`, so the object and bus origin share an initial `4 m/s` ground speed. Reader prose uses only the matched-time positions and subtraction; the unit-bearing continuous definition remains here and in the topic README for review precision. Horizontal net force on the object is zero, vertical forces balance, and the ground frame is approximately inertial. The bus's braking force is not transferred to this idealized free-sliding object.
- **Variants/states:** one static, simultaneous comparison. Equal ground displacements are `4,4 m`; relative displacements are `1,3 m`. Time labels identify corresponding events, including coincident starting marks. Do not depict a new physical forward-force arrow on the object or mistake changed relative velocity for a changed ground-frame velocity.
- **Layout:** retain the 560-unit width and minimum 22-unit essential labels. A height up to 440 units is allowed for this comparison if needed to keep time, origin, position, and scope labels separate. Do not solve crowding by reducing type size or hiding conditions.
- **Accessibility and scope:** visible scope plus caption/alternative text identify an original idealized example, not observations or a standing passenger. The prose supplies subtraction and the inference; color alone must not encode object versus origin or time order.

## 6. Motion and interaction

There is no topic-specific motion or interaction. Each objective depends on comparing simultaneous conditions or vector pairs, so a complete static view is stronger than serial reveal, replay, or a novel control. Navigation is never gated by prediction. Static figures have no hidden state and require no independent reset, restoration, or reduced-motion branch.

## 7. Depth and surface

Use the reader's borders-only strategy: paper background, white bounded panels, 2 px lines, and no shadows. Track textures distinguish resistance conditions; circles are timed position marks rather than decorative dots. Arrowheads and labels distinguish force from velocity. The diagrams should read as authored scientific schematics, not generic cards or literal apparatus pictures.

## 8. Accessibility constraints and accepted debt

- Target WCAG 2.2 AA for text and meaningful geometry; never rely on color alone.
- Every SVG includes `<title>`, `<desc>`, and original-art metadata. Page metadata supplies nonempty Korean `alt` and `caption` text.
- Keep labels few and large. Geometry tests independently verify equal starts, same first interval, qualitative deceleration ordering, equal spacing, and paired vector sums.
- Do not present authored distances, speeds, or accelerations as measurements, infer friction magnitude or measurement uncertainty from qualitative geometry, claim historical reconstruction or a zero-friction observation, or treat a schematic as proof of the first law. The frame comparison's exact coordinates are explicitly authored model values, not observed data.

Verification boundary: source-geometry and browser checks establish only their exercised contracts. Rendered review must name the exact build, scene states, and viewports, and distinguish inspected images from captures merely produced. Contrast and assistive-technology behavior need separate evidence; readable screenshots cannot certify either. Learner comprehension, scientific/pedagogical expert approval, rights approval, audio, and publication remain unverified.
