# Hydrogenic orbitals: content and implementation scope

## Scientific source and limits

Implement normalized, real hydrogenic bound orbitals for n=1..4 and l=0..min(2,n-1), with Z=1..3. Coordinates use the electron-mass Bohr radius, energies use Hartree. This is a nonrelativistic Coulomb model with a fixed point nucleus; reduced-mass, spin, relativistic, many-electron and molecular effects are excluded. Real p/d functions are a chosen real basis of degenerate angular states, not individual complex magnetic-quantum-number eigenfunctions. The overall sign convention is arbitrary; relative sign within a plotted state is meaningful to its wavefunction representation.

The radial implementation follows NIST DLMF 18.39.35/37 (generalized Laguerre convention), cross-checked against MIT 8.04 Lectures 20–21 §§3–4 and Lecture 22 §2. Introductory probability/quantum-number/node explanations are cross-checked against OpenStax Chemistry 2e §6.3. This is recorded reading, not immutable-byte capture, independent expert approval, or rights clearance. No external prose, figures, mesh data or code were copied.

## Presentation contract

Implemented `/knowledge/atomic-orbitals/` through the existing article catalog. Explain probability density before asking readers to interpret shapes. Provide state selection, Z, 3D rotation/zoom, a density cloud, a planar slice and a density isosurface. Keep titles stable and dialogue tied to the selected state. Preserve edited state across scenes and expose validated getState/setState/reset; seek must be independent of prior interactions.

Points are deterministic, finite-grid density samples, not electron paths or recorded measurements. Surface thresholds are fractions of the sampled grid's maximum density, not enclosed probabilities or physical boundaries. Slice color/brightness displays signed amplitude and density respectively. Clearly label truncation, resolution, coordinate units, and auto-framing; a reframed Z change does not imply a constant physical size.

## Reuse boundary

The pure orbital model supplies an evaluate(point) scalar field. Generic sampling, density-weighted points, tetrahedral isosurface extraction, and a Canvas 3D/slice viewer accept arbitrary scalar fields and caller-supplied weights/colors/labels. They contain no quantum mechanics. The topic adapter owns orbital controls, scientific descriptions and claims. Existing formal-reasoning adapters remain separate.

## Verification

Use independent closed-form 1s/2s/2p checks, radial/angular numerical normalization and orthogonality, nodal planes/spheres, Z scaling, and the Coulomb Schrödinger residual. Generic viewer tests use non-orbital fields, deterministic seeds, empty fields, linear planes and spheres. Browser tests cover every scene, several states, each display mode, input persistence/reset, camera interaction, unsupported state, and supported desktop/narrow viewports. Test success is distinct from scientific/rights/publication approval.

## Recorded source reading: 2026-10-16

- [OpenStax Chemistry 2e §6.3](https://openstax.org/books/chemistry-2e/pages/6-3-development-of-quantum-theory): Born interpretation, quantum numbers and radial nodes. The [preface](https://openstax.org/books/chemistry-2e/pages/preface) currently states CC BY-NC-SA 4.0; do not assume an earlier license applies. Registry ID: `source:openstax-chemistry-2e-quantum`.
- [MIT OCW 8.04 notes](https://ocw.mit.edu/courses/8-04-quantum-physics-i-spring-2016/pages/lecture-notes/): Lectures 20–21 §§3–4, spherical harmonics, separation and volume normalization; Lecture 22 (May 4, 2016), §§1–2, reduced mass, Coulomb model and energy. The OCW license link points to CC BY-NC-SA 4.0. Registry ID: `source:mit-804-hydrogen-2016`.
- [NIST DLMF §18.39](https://dlmf.nist.gov/18.39): Eqs. 18.39.35/37 for charge scaling and normalized radial functions; discussion after 18.39.41 for arbitrary overall phase. The [notices](https://dlmf.nist.gov/about/notices) display version 1.2.8, release 2026-09-15, and copyright/reproduction restrictions. NIST authorship does not make this work automatically public domain. Registry ID: `source:nist-dlmf-coulomb`.

These are observed live pages/PDF readings, not frozen source snapshots. No exact-byte hash, independent scientific review, reuse clearance or publication approval is claimed. Claims `claim:quantum.*` remain draft-source-aligned. Spectral database values are not used to calibrate this Hartree-unit model.

## Representation limits and pending work

The reader covers trajectories/distributions, density, quantum numbers, nodes, phase, representations, charge scaling and limits. Rendering uses a finite 30-cell grid and approximate geometry; scientific function normalization does not imply exact finite-box sampling. See [Spatial fields](../../../apps/web/components/spatial/README.md) for the viewer contract. An orbital narration/video projection remains planned.
