# Reusable scalar-field visualization

## Contracts

`packages/spatial/scalar-field.ts` contains generic grid quadrature, seeded weighted cloud sampling, and marching-tetrahedra level-set geometry. `apps/web/components/spatial/field-viewer.ts` draws the result with Canvas 2D using a 3D orthographic camera, or draws a direct planar slice. No quantum terminology or orbital equations belong in these modules. No graphics/runtime dependency is added.

The caller supplies an evaluator, a nonnegative finite weight function, three finite increasing bounds, and a grid resolution (4–64 cells per axis). A value may be signed; the weight chooses how density/brightness is represented. Orbital use supplies amplitude and its square; another domain can supply a different scalar and weight without claiming probability.

```js
import {mountFieldViewer} from '/components/spatial/field-viewer.ts';

const viewer = mountFieldViewer(container, {label: 'Example scalar field'});
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

The container must have available width and height; include `field-viewer.css`. The viewer returns detached state containing yaw, pitch, zoom, mode, plane, slice and iso. Unsupported/nonfinite camera state throws before changing the current view. `setField` samples a valid new grid before replacing the previous field. `reset` changes the view, not the caller's scientific input. Topic adapters own their input/reset policy.

## Display and approximation

- **Cloud:** 6,500 deterministic points sampled from trapezoid-weighted grid cells with seed 17 and subcell jitter. Sampling approximates the caller's weight, conditional on the finite box. Colors evaluate the signed field at the sampled positions. Points are neither trajectories nor empirical measurements.
- **Slice:** 110×110 direct evaluator samples in xy/xz/yz, with an offset along the omitted axis. Brightness is a nonlinear visual mapping of weight relative to the grid maximum. It is not a quantitatively calibrated image or an integral over a slab.
- **Surface:** linear interpolation in six tetrahedra per cell at `iso × sampled maximum weight`. Transparent triangles are depth sorted. This is an approximate level set, not a probability-content surface, physical boundary, or exact topology guarantee.

Drag or focus the canvas and use arrow keys to rotate. Wheel/+/- adjust zoom. There is no automatic motion. Canvas size follows its container with a device-pixel-ratio cap of two. Resize redraws the same scientific state. `inspect` exposes resolution, bounds, grid integral, sampled maximum, point count, triangle count and camera state.

The initial implementation is synchronous software rendering. Large grids/surfaces can cost CPU time; the orbital adapter fixes a 30-cell grid and bounds the supported states. Tails beyond the finite box and subgrid features are not resolved. Camera framing and renderer colors are presentation choices and must be explained by each topic. These APIs do not provide arbitrary time-dependent simulation, WebGL volume rendering, mesh export, or video encoding.

## Reader integration

An article may name an `interactive` adapter in `page.ts`; `apps/web/topics/registry.ts` maps known IDs to code. The reader continues to own stable scene titles, navigation, evidence panels and state restoration. The topic owns controls, suggestions, current-input narration, and scientific claim references. This is separate from the symbolic premise/proof adapter.

The orbital adapter is the first consumer; the browser suite also renders a non-orbital spherical field, restores state, rejects a bad camera, and disposes the viewer. Geometry tests use constant volume, a linear plane, and a spherical level set. These check implementation behavior, not independent scientific approval of a consuming model.
