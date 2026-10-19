# Quantum-spectra figure design contract

## 1. Scope and direction

This contract extends the shared paper-and-ink reader with five independently authored static schematics for `pattern`, `energy`, `transition-limit`, `bohr`, and `transfer`. The explanatory path is selected tabulated transitions → individual-line energy difference → transition probability and upper-level number density → historical model success → modern scope. No figure is a copied NIST/OpenStax plot, measured intensity record, uncertainty estimate, photograph, classical electron trajectory, or claim that energy difference alone guarantees an observed line.

The seven stable scene IDs, three claim IDs, `needs-content-review` article status, planned 168-second timing, and `review-required` status remain unchanged. The figures add no brightness values or invented observations.

## 2. Existing visual system

Reuse the shared reader's restrained palette and borders-only material:

| Role | Token | Use |
| --- | --- | --- |
| Paper | `#f6f8f0` | Figure background |
| Surface | `#ffffff` | Bounded comparison panels |
| Ink | `#293f35` | Primary labels and geometry |
| Structure | `#365c42` | Axes, energy levels, and necessary links |
| Observation | `#a56d30` | Observed wavelength markers |
| Accent | `#c2410c` | Emitted photon and dependency emphasis |
| Line | `#d5dfcc` | Panel borders and guides |
| Muted ink | `#526b58` | Scope notes and secondary labels |

Coordinates and spacing follow a 4-unit rhythm. Panels use 12–16-unit radii, 2-unit borders, and no shadows. Type inherits the shared Korean stack. Topic CSS introduces no global selector or new palette.

## 3. Typography and accessibility

- Every SVG has Korean `<title>` and `<desc>`, original-art metadata, nonempty page alternative text, and a caption naming its scope.
- Every essential SVG label uses at least 24 units in a `600 × 380` view box. Labels stay horizontal and few.
- All marker definitions use `markerUnits="userSpaceOnUse"` and a marker box no larger than 12 × 12 units.
- Color is redundant with wavelength text, transition labels, arrows, grouping, and line style.
- Topic prose, cards, and captions use `word-break: keep-all`, `overflow-wrap: anywhere`, and `text-wrap: pretty`; essential narrow copy remains at least 13 CSS px.
- All four wavelength labels use leaders; the crowded 410.2/434.0 and 434.0/486.1 pairs use staggered rows. Their wavelength positions remain determined by one linear axis rather than equally spaced categories.

## 4. Figure primitives

### Linear air-wavelength spectrum

A common horizontal axis maps 400–670 nm linearly. Four equal-height markers sit at 410.2, 434.0, 486.1, and 656.3 nm. Equal height explicitly means “position only,” not measured brightness. A visible label states that these are four selected NIST atomic-hydrogen transitions with rounded air wavelengths; no completeness inference is attached to the selection.

### Wavelength-to-energy comparison

Two aligned rows compare 410.2 and 656.3 nm. The exact individual-line chain is `E=hν`, `E=hc/λvac`, and the same-frequency phase-index deduction `λvac=n_air λair`, followed by the declared approximation `n_air≈1` and `E≈hc/λair`. The independently checked results are approximately 3.02 and 1.89 eV. NIST equation (25) is kept in its barred weighted-multiplet scope rather than used as the source of an unbarred individual-line equation. Reader-facing surfaces display the canonical air-index variable `n_air` as `nₐᵢᵣ`, keeping it distinct from principal `n_k`/`n_i`; `h`, `ν`, `c`, and `eV` are defined before use.

### Necessary-but-not-sufficient dependency map

An energy-gap box feeds a photon-energy match, while separate transition-type/probability (`E1`, `M1`, `E2`, `Aki`) and upper-state number-density (`Nk`) boxes also feed local line emissivity `εline=(4π)⁻¹hνAkiNk`. `Aki` is a transition rate in `s⁻¹`; `Nk` is a number density in `m⁻³`; local emissivity has units `W m⁻³ sr⁻¹`. The geometry makes `ΔE=hν` necessary for a one-photon line but not sufficient for observed brightness, which also depends on opacity, source geometry, and instrument response. M1/E2 remain present as radiative “forbidden” transition types rather than being erased.

### Idealized hydrogen energy levels

Horizontal levels for principal quantum numbers 2, 3, 4, 5, and 6 use the declared idealized relation `E_n≈−13.6 eV/n²`. Their vertical positions are proportional to those independently computed energies. Downward arrows `n_k=3→n_i=2` and `n_k=6→n_i=2` predict approximate vacuum wavelengths of 656 and 410 nm and place them beside the corresponding rounded NIST air-table values 656.3 and 410.2 nm. The model outputs are rounded to match the precision of the approximate energy formula. No circle, orbit, or path is drawn.

### Transfer comparison

The same two wavelengths and computed energies reappear beside unquantified local-emissivity inputs, `Aki` and `Nk`, and a separate observed-brightness boundary naming opacity, source geometry, and instrument response. The energy ordering is explicit; brightness ordering is deliberately unresolved. Line width/height carries no brightness data.

## 5. Primitives and states

- **Figure frame:** original SVG, intrinsic ratio, visible title, concise caption, and persistent scope line.
- **Scientific axis:** numeric endpoints, shared scale, wavelength units, and markers positioned from the authored numeric value.
- **Energy level:** `data-n` and `data-energy-ev` expose the independently checkable idealized coordinate relation.
- **Transition arrow:** downward only, carries initial/final principal quantum numbers and wavelength; it is an energy-state change, not a classical spatial path.
- **Dependency edge:** arrow from a necessary input to the emitted-line condition. No single edge is presented as sufficient.
- **Static state:** all comparisons are simultaneous. There is no topic-specific input, animation, quiz gate, or hidden scientific state. Shared reader reset/restoration and invalid-state atomicity still apply.

## 6. Responsive behavior and accepted debt

Figures scale fluidly without clipping, hidden overflow, or internal scrolling at 390 × 844 and supported FHD viewports. Cards stack on narrow screens and keep 44 px shared controls unobscured. Static simultaneous comparisons are preferable to animation because the relevant inference depends on aligned positions, energy levels, and co-present conditions.

Exact source bytes/revisions, spectroscopy and quantum-physics expert review, rights clearance, assistive-technology review, measured narration timing, learner comprehension, audio, and publication remain pending. Unit geometry and browser checks cannot establish those outcomes.

## 7. Retrospective proposed seven-scene plan

This plan governs the revision before figure production. It reconstructs proposed intent for existing content; it is not an original author decision, observed learner performance, scientific approval, or completed review.

| Scene ID | Canonical content / question resolved | Prerequisite | Objective and concrete success check | Representation choice |
| --- | --- | --- | --- | --- |
| `question` | Question block and lines claim; what does the selected NIST table establish? | Wavelength as a way to locate a spectral line. | Reader identifies four selected **atomic-hydrogen** Balmer transitions with rounded air wavelengths and does not infer low pressure, completeness, absence of continuum, or measured brightness from that table. | Static source-scope cards suffice; an early atom-orbit picture would leak a later historical model and confuse tabulated positions with explanation. |
| `pattern` | Pattern block and lines claim; are the four positions uniformly spaced? | Wavelength as a measurable horizontal coordinate. | Reader orders 410.2, 434.0, 486.1, 656.3 nm on one linear air-wavelength axis and identifies the nonuniform spacing; marker height is not read as brightness. | Original linear-axis SVG with equal-height position markers, staggered 410.2/434.0 labels, and no rainbow fill or copied spectrum plot. |
| `energy` | Energy block sentences 0–4 and energy-differences claim; how does an air wavelength encode a gap? | Pattern scene's air wavelengths and inverse wavelength intuition. | Reader defines `h`, `ν`, `c`, and `eV`, distinguishes exact individual-line `E=hν`, `E=hc/λvac`, and `λvac=n_airλair` from `n_air≈1`, independently obtains about 3.02 eV at 410.2 nm and 1.89 eV at 656.3 nm, and keeps `n_air` distinct from principal `n_k`/`n_i`. | Original two-row conversion ledger makes exact relations and symbol meanings precede the approximation; simultaneous arithmetic is clearer than a slider. |
| `transition-limit` | Energy block sentences 5 onward and energy-differences claim; why is matching energy not enough? | One-photon energy matching from the previous scene. | Reader states that `ΔE=hν` is necessary but that transition rate `Aki` and upper-state number density `Nk` separately determine local emissivity; opacity, geometry, and instrument response remain necessary for observed brightness; M1/E2 are not treated as impossible. | Original dependency map shows three local-emissivity inputs, their units, and a separate observation boundary; no invented intensities or probabilities are plotted. |
| `bohr` | Bohr block and Bohr-limit claim; what did the historical model reproduce? | Discrete energy differences and Balmer wavelengths. | Reader maps idealized hydrogen `n_k=3→n_i=2` to an approximately 656 nm model-vacuum prediction corresponding to the rounded 656.3 nm air-table value, and similarly maps `6→2` to approximately 410/410.2 nm, while rejecting the arrows as spatial trajectories. | Original energy-level SVG uses a declared hydrogen idealization, paired vacuum/air labels, and downward state-change arrows; no classical orbit circles appear. |
| `limit` | Limit block and both model-scope/energy claims; what survives the model change? | Historical Bohr success and its one-electron scope. | Reader says the precise-orbit model fails for helium/multi-electron atoms, the electron state is represented by `ψ`, `|ψ|²` is position probability density rather than an orbit, and `ΔE=hν` remains the energy link. | Static scope cards are more direct than an orbital picture, which would overload this short scene and risk presenting a new spatial model without prerequisites. |
| `transfer` | Transfer block and energy-differences claim; does higher photon energy mean a brighter observed line? | Energy conversion plus local-emissivity and observation boundaries. | Reader concludes 410.2 nm has the larger gap but cannot rank local emissivity without `Aki` and `Nk`, nor observed brightness without opacity, geometry, and instrument response; the shown line geometry is not brightness data. | Original worked comparison repeats independently computed energies beside unresolved emissivity and observation ledgers. No quiz is required because this is worked exposition, not assessed independent performance. |
