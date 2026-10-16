# Hydrogenic orbitals: content and implementation scope

## Scientific source and limits

Implement normalized, real hydrogenic bound orbitals for n=1..4 and l=0..min(2,n-1), with Z=1..3. Coordinates use the electron-mass Bohr radius, energies use Hartree. This is a nonrelativistic Coulomb model with a fixed point nucleus; reduced-mass, spin, relativistic, many-electron and molecular effects are excluded. Real p/d functions are a chosen real basis of degenerate angular states, not individual complex magnetic-quantum-number eigenfunctions. The overall sign convention is arbitrary; relative sign within a plotted state is meaningful to its wavefunction representation.

The radial implementation follows NIST DLMF 18.39.35/37 (generalized Laguerre convention), cross-checked against MIT 8.04 Lectures 20–21 §§3–4 and Lecture 22 §2. Introductory probability/quantum-number/node explanations are cross-checked against OpenStax Chemistry 2e §6.3. This is recorded reading, not immutable-byte capture, independent expert approval, or rights clearance. No external prose, figures, mesh data or code will be copied.

## Presentation contract

Add `/knowledge/atomic-orbitals/` through the existing article catalog. Explain probability density before asking readers to interpret shapes. Provide state selection, Z, 3D rotation/zoom, a density cloud, a planar slice and a density isosurface. Keep titles stable and dialogue tied to the selected state. Preserve edited state across scenes and expose validated getState/setState/reset; seek must be independent of prior interactions.

Points are deterministic, finite-grid density samples, not electron paths or recorded measurements. Surface thresholds are fractions of the sampled grid's maximum density, not enclosed probabilities or physical boundaries. Slice color/brightness displays signed amplitude and density respectively. Clearly label truncation, resolution, coordinate units, and auto-framing; a reframed Z change does not imply a constant physical size.

## Reuse boundary

The pure orbital model supplies an evaluate(point) scalar field. Generic sampling, density-weighted points, tetrahedral isosurface extraction, and a Canvas 3D/slice viewer accept arbitrary scalar fields and caller-supplied weights/colors/labels. They contain no quantum mechanics. The topic adapter owns orbital controls, scientific descriptions and claims. Existing formal-reasoning adapters remain separate.

## Verification

Use independent closed-form 1s/2s/2p checks, radial/angular numerical normalization and orthogonality, nodal planes/spheres, Z scaling, and the Coulomb Schrödinger residual. Generic viewer tests use non-orbital fields, deterministic seeds, empty fields, linear planes and spheres. Browser tests cover every scene, several states, each display mode, input persistence/reset, camera interaction, unsupported state, and supported desktop/narrow viewports. Test success is distinct from scientific/rights/publication approval.
