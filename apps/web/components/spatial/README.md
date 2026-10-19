# Reusable scalar-field visualization

## Contracts

`packages/spatial/scalar-field.ts` contains generic grid quadrature, seeded weighted cloud sampling, and marching-tetrahedra level-set geometry. `apps/web/components/spatial/field-viewer.ts` always owns the visible Canvas 2D target and direct planar slices. Callers may opt into a private native WebGL2 backing canvas for 3D clouds and surfaces; each completed GPU frame is synchronously composited into the visible canvas. No quantum terminology or orbital equations belong in these modules. No graphics/runtime dependency is added.

The caller supplies an evaluator, a nonnegative finite weight function, three finite increasing bounds, and a grid resolution (4–64 cells per axis). A value may be signed; the weight chooses how density/brightness is represented. Orbital use supplies amplitude and its square; another domain can supply a different scalar and weight without claiming probability.

```js
import {mountFieldViewer} from '/components/spatial/field-viewer.js';

const viewer = mountFieldViewer(container, {label: 'Example scalar field', useWebGL: true});
viewer.setField({
  evaluate: ([x, y, z]) => Math.exp(-(x*x + y*y + z*z)),
  weight: value => value,
  bounds: [[-3, 3], [-3, 3], [-3, 3]],
  resolution: 24,
});
viewer.setState({mode: 'surface', iso: 0.1});
const state = viewer.getState();
viewer.reset();
viewer.setState(state);
viewer.seek(500); // Static field: independent of time and previous interactions.
viewer.dispose();
```

The container must have available width and height; include `field-viewer.css`. WebGL is opt-in (`useWebGL` defaults to `false`), so existing generic consumers retain Canvas 2D unless they request it. The viewer returns detached state containing yaw, pitch, zoom, mode, plane, slice and iso. Unsupported/nonfinite camera state throws before changing the current view. Partial object overrides use declared defaults, but null, arrays, primitives and unknown camera keys are invalid rather than silently resetting a saved view. `setField` samples a valid new grid before replacing the previous field. `reset` changes the view, not the caller's scientific input. Topic adapters own their input/reset policy.

## Display and approximation

- **Cloud:** 6,500 deterministic points sampled from trapezoid-weighted grid cells with seed 17 and subcell jitter. Sampling approximates the caller's weight, conditional on the finite box. GPU mode sorts the retained CPU points back-to-front for alpha blending and projects them as round sprites with a constant CSS-pixel diameter across DPR; Canvas fallback uses the same positions and caller colors. Points are neither trajectories nor empirical measurements.
- **Slice:** 110×110 direct evaluator samples in xy/xz/yz, with an offset from the bounded field center along the omitted axis. Brightness is a nonlinear visual mapping of weight relative to the grid maximum. It is not a quantitatively calibrated image or an integral over a slab.
- **Surface:** linear interpolation in six tetrahedra per cell at `iso × sampled maximum weight`. Both backends assign phase color from the existing per-face sum of the triangle's three sampled values. GPU mode depth-tests triangles and applies flat two-sided ambient/diffuse lighting. Lighting communicates orientation only; it is not density. Canvas fallback depth-sorts the same triangles. This is an approximate level set, not a probability-content surface, physical boundary, or exact topology guarantee.

Drag or focus the canvas and use arrow keys to rotate. Wheel/+/- adjust zoom. There is no automatic motion. Framing subtracts the center of arbitrary translated bounds, scales x/y from their half-extents, and normalizes camera depth by the half-box vector length, so valid box geometry remains inside the clip range. Axes originate at the field center. Canvas size follows its container with a device-pixel-ratio cap of two. Resize redraws the same scientific state. `inspect` exposes resolution, bounds, grid integral, sampled maximum, point count, triangle count, camera state, and a detached `{requested, active, status}` renderer snapshot. Backend status is presentation capability and is not included in `getState`.

Grid sampling and geometry extraction remain synchronous CPU work. When requested and available, WebGL2 performs only projection, point rasterization, depth testing, and surface lighting. `active` names the backend of the frame actually composited into the visible canvas: slices always report Canvas 2D, and a 3D frame reports WebGL2 only after a successful draw. WebGL2 unavailability, shader/program/attribute initialization failure, draw error, or context loss releases owned GPU resources and switches to the usable Canvas renderer without changing view/scientific state or calling `onChange`; `onBackendChange` emits only changed detached snapshots so a topic can disclose that presentation transition. Context restoration rebuilds resources from retained CPU samples/triangles and returns to `ready` only after a successful restored frame. `dispose` removes both canvases, listeners, observer, buffers, and programs; a later restore event is harmless. Large grids/surfaces can still cost CPU time; the orbital adapter fixes a 30-cell grid and bounds the supported states. Tails beyond the finite box and subgrid features are not resolved. Camera framing and caller-supplied CSS colors are presentation choices and must be explained by each topic. These APIs do not provide arbitrary time-dependent simulation, WebGL volume rendering, mesh export, or video encoding.

Every redraw paints the entire rounded backing store, including the last physical pixel when CSS dimensions are fractional. Background alpha must not accumulate across repeated draws. A consuming reader that changes layout after setting scientific/view state must commit its final geometry through the reader's post-render hook; a later ResizeObserver callback is not a substitute for a complete synchronous restoration.

## Reader integration

An article may name an `interactive` adapter in `page.ts`; `apps/web/topics/registry.ts` maps known IDs to code. The reader continues to own stable scene titles, navigation, evidence panels and state restoration. The topic owns controls, suggestions, current-input narration, and scientific claim references. This is separate from the symbolic premise/proof adapter.

Verification should exercise a non-orbital field, camera/state restoration, invalid input and disposal, plus independent constant-volume, plane and sphere geometry fixtures. Opt-in GPU consumers additionally exercise real output, rotation, surface changes, forced unavailability, `WEBGL_lose_context` loss/restoration when available, callback/state isolation, and resource disposal. These checks establish implementation behavior, not scientific approval of a consuming model.
