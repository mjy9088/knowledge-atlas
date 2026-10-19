# Orbital spatial representation contract

## Scope and intent

This is a retrospective scene plan for the existing eight-scene reader and a prospective GPU-rendering correction. It is not evidence of original author approval or observed learning. Canonical blocks, claims, state selections, and scientific fixtures remain unchanged. The existing pure hydrogenic model and finite-grid sampler supply all positions, values, and level-set geometry; shaders must not invent particle dynamics.

## Scene plan

| Scene / block | Content and purpose | Representation and meaningful change | Observable success check |
| --- | --- | --- | --- |
| `orbit` / 0 | Distinguish a distribution from a planetary trajectory; `claim:quantum.orbital.probability`. | Seeded 3D cloud, not moving electrons. Rotate the camera without changing the selected orbital. | The distribution changes orientation while model input, sample count, and energy remain unchanged; no paths or time evolution appear. |
| `density` / 1 | Connect sample concentration to density, not a measured electron count. | Deterministic density-weighted cloud; compare the supplied 1s suggestion with a changed state. | The cloud reflects the same bounded model used by narration; samples remain explicitly illustrative, not observed measurements. |
| `numbers` / 2 | Compare supported s/p/d orientations after the state controls introduce them. | GPU cloud of the existing sampled real basis functions. Change n and basis through supported selectors. | Distinct spatial structure is visible; unsupported bases cannot yield stale results. |
| `nodes` / 3 | Locate radial/angular zeros inside the distribution. | Keep the direct evaluator's planar Canvas 2D slice. Change plane and offset. | Zero-density regions and phase sides agree with independent model fixtures, without claiming exact finite-grid topology. |
| `phase` / 4 | Distinguish wavefunction sign from electric charge. | Depth-tested, lit GPU triangles from the existing density isosurface; rotate to inspect lobes. | Both sign colors remain distinguishable; lighting communicates surface orientation only, never density or charge. |
| `views` / 5 | Compare cloud, slice, and thresholded surface for one state. | Switch display mode while retaining scientific input and independent camera state. | The three views agree on the selected state; an isovalue fraction is not mislabeled as enclosed probability. |
| `charge` / 6 | Separate Z scaling from automatic framing. | Change Z while keeping the existing model, coordinate units, extent, and auto-frame explanation. | Reported extent and energy change appropriately; similar framing is not claimed to prove equal physical size. |
| `limits` / 7 | State model and rendering limits together. | The same reusable viewer and visible finite-grid/renderer information; no extra animation. | The reader can distinguish one-electron approximations, finite-box truncation, presentation lighting, and actual renderer availability. |

All rows require the preceding article explanations and controls, not hidden prior interactions. Navigation is not an experiment. Changing a control updates both the field and its explanation; edits survive navigation. Reset and restoration preserve the existing scientific/view-state contracts, and static seeking is independent of previous clicks.

## Rendering design

- Retain the existing dark field background `#101e29`, positive-sign teal `#65e2d5`, negative-sign orange `#ffa86b`, and orthographic axes. No external imagery, mesh, shader, or runtime dependency is imported.
- Use native WebGL2 for the existing cloud and isosurface geometry. Constant-screen-size circular point sprites represent samples, not hard particle boundaries. Flat two-sided ambient/diffuse shading makes surface orientation visible; no specular physical-material claim or smoothing changes the mesh.
- Retain direct 110×110 Canvas 2D slices. Slice brightness represents the existing nonlinear density mapping; surface lighting does not.
- Keep the visible accessible canvas and its keyboard/pointer controls. A private GPU backing target may be synchronously composited into it so final-layout redraw and pixel-stable restoration remain intact.
- GPU availability is presentation capability, not saved scientific state. Report it through inspection and visible topic feedback. Unsupported WebGL2, initialization failure, or context loss uses the existing usable Canvas 2D renderer without changing inputs or emitting a user edit. Restore GPU resources from retained CPU data when the context returns.
- Do not add automatic motion. Respect the existing bounded layout, DPR cap of two, focus ring, keyboard rotation/zoom, and alternate prose. Do not shrink prose or controls to make room for renderer status.

## Acceptance and remaining review

Exercise cloud/slice/surface, changed n/basis/Z, rotation/zoom, reset/restoration, invalid-state atomicity, deterministic seek, resize, unavailable GPU, real context loss/restoration, and disposal. Verify existing CPU sample/triangle statistics, opaque clearing of fractional backing stores, and unchanged semantic fixtures. Inspect every scene at desktop and narrow widths, plus representative changed-state surfaces and fallback.

Shaders and lighting are presentation mechanisms, not new scientific evidence. Expert/content approval, observed learner comprehension, screen-reader/cross-browser certification, exact source revisions, narration, and publication remain pending.

Known, unapproved mobile debt remains in the existing controls and annotations: some helper text is 8–10 CSS pixels and some controls are 26–30 pixels high. The GPU correction must not reduce them further, but preserving them is not an accessibility approval. Typography and touch-target redesign require a separate rendered review rather than inheriting the renderer's scoped checks.
