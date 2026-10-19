# Photoelectric-evidence episode

## Question, conditions, and distinction

This episode asks why increasing brightness need not eject electrons when the light frequency is below the ordinary photoelectric threshold. Its conclusion is deliberately conditional: a clean, uniform metal surface in vacuum, monochromatic illumination, and the low-intensity single-photon regime. It separates three layers:

- **Measured pattern:** below a material-dependent cutoff frequency no photocurrent is observed; above it, intensity changes the saturation photocurrent at fixed frequency, collection geometry, and adequate collection voltage, while the stopping-potential magnitude stays constant.
- **Model inference:** for `hf<φ`, the single-photon emission condition fails and the model does not assign a physical negative kinetic energy. At `hf=φ`, the ideal maximum kinetic energy is `Kmax=0`, but that equality does not guarantee a measurable photocurrent. For `hf>φ`, emission is possible and `Kmax=hf−φ`; this does not guarantee that every incident photon produces a collected electron. The cutoff satisfies `hfc=φ`. This model supports quantized light-energy exchange; it is not itself a raw measurement.
- **Excluded regimes:** sufficiently intense short laser pulses can produce multiphoton or strong-field emission. Thermal emission, semiconductor response, surface contamination, and spatially varying work functions are also outside this short episode.

The episode does not say that every form of classical electromagnetic theory was refuted by one experiment or that the photoelectric effect alone proved all of quantum mechanics.

## Consulted passages and exclusions

The following live pages were read on 2026-10-18. Source bytes and revisions were not frozen. The Korean explanation, numerical example, cards, and transfer problem are independently authored; no external prose, figures, tables, datasets, or code are included.

1. **Ling, Sanny, and Moebs, OpenStax, _University Physics Volume 3_, §6.2 “Photoelectric Effect.”** The apparatus paragraphs define photocurrent and reversed stopping potential. Under “The intensity of incident radiation and the kinetic energy of photoelectrons,” Figure 6.9's discussion distinguishes saturation photocurrent from unchanged stopping potential and equation (6.12) gives `Kmax=eΔVs`; Example 6.6 explicitly maps a measured `−0.80 V` to the positive magnitude `ΔVs=0.80 V`. “The presence of a cut-off frequency” states the observed cutoff and linear frequency dependence. “The Work Function,” equations (6.13)–(6.15), supplies `Ef=hf`, `Kmax=hf−φ`, and `fc=φ/h`. The page does not analyze contact potentials or space charge, so the candidate explicitly treats the exact external stopping voltage as an idealization with contact potentials corrected and space charge negligible. Its statements that photons above threshold “always” produce photoelectrons and that below-threshold emission does not occur are used only inside the stated single-photon regime, not at arbitrary intensity. The live page displayed CC BY-NC-SA 4.0 plus additional AI/commercial-use restrictions; this proposal is reference-only and does not infer reuse permission.
2. **Nobel Foundation, 1921 Physics Prize presentation speech, delivered 10 December 1922.** The paragraphs beginning “A third group of studies” and “Similarly, when a quantum of light falls” report the historical intensity/frequency pattern and the threshold-energy account. Award rhetoric and the later statement that the law “passed the test brilliantly” are not used as modern expert review, proof of all quantum mechanics, or evidence for multiphoton limits. The page identifies the speech and displays Nobel Foundation copyright; rights review remains pending.
3. **Gy. Farkas, “Multiphoton Photoemission from Solid State, with Special Regards to Metals,” KFKI-73-58 (1973).** The exact title uses singular “Solid State” and plural “Regards.” A complete PDF was downloaded from the registered URL to `/tmp/opencode/KFKIreports_73-058.pdf` (SHA-256 `bb117696364708dc5ae4b84a3273e71ddcecba1bc6549f801b80336c3b18119b`). In §I, printed p.3 / PDF file p.7 of 36, the passage beginning “The perturbations which can be achieved” says that a sufficiently strong laser field produces simultaneous absorption of `n` quanta. The next passage replaces the linear relation with `nhν=A+½mv²` and `j∼Iⁿ`, then identifies optical tunnel emission at extremely large perturbations. These precise passages, not repository metadata, support the high-intensity exception. The working download is verification evidence, not a canonical immutable snapshot; `contentHash` remains null. Detailed barrier models, old numerical estimates, and the historical survey are not adopted, and no license was established.

Candidate sources found but not used include a 1995 Physical Review B theory whose accessible abstract did not supply the episode's basic measurement chain, HyperPhysics early-data notes that added no needed support beyond the inspected sources, and NobelPrize.org's modern Q&A page, whose broad popular-language claims were unnecessary.

## Independently derived worked example

For an illustrative—not historical—surface with `φ=2.30 eV`, use `h≈4.136×10⁻¹⁵ eV·s`:

- `f=4.00×10¹⁴ Hz`: `hf=1.6544 eV≈1.65 eV`; the deficit is `2.30−1.6544=0.6456 eV≈0.65 eV`, so the single-photon model predicts no emission.
- `f=8.00×10¹⁴ Hz`: `hf=3.3088 eV≈3.31 eV`; `Kmax=3.3088−2.30=1.0088 eV≈1.01 eV`.
- If contact potentials are corrected and space charge is negligible, a collector negative relative to the emitting surface has ideal retarding voltage `−1.01 V`; its magnitude satisfies `|Vs|=Kmax/e≈1.01 V`.

Doubling intensity at the second frequency changes the photon arrival rate and may increase saturation photocurrent at fixed geometry and adequate collection voltage, while `hf`, `Kmax`, and the idealized `|Vs|` remain unchanged under the stated conditions.

## Current presentation

The reader uses seven scenes. The worked block is presented by exact sentence ranges: `below-threshold-case` uses sentences `[0,2)`, and `above-threshold-case` uses `[2,end)`. The planned segment allocations remain 180 seconds in total.

The scoped visual system, source-to-representation boundary, and retrospective proposed seven-scene pre-production plan are in [DESIGN.md](DESIGN.md). The plan requires original static apparatus, qualitative current–voltage, energy-ledger, polarity, scope, and matched-condition figures; it preserves full worked exposition without a quiz or topic adapter. It is authoring intent, not learner evidence, scientific approval, or a measured narration result.

The 180-second narration budget is planned, not measured; 58 seconds are reserved across the two worked-example scenes so arithmetic and units need not be rushed. The article, concept, and consulted-source identities are registered in the canonical [series catalog](../catalog.ts), [concept registry](../../../knowledge/concepts.json), and [source registry](../../../sources/registry.json). Independent source critique, physics review, exact revision capture, rights review, narration/audio, comprehension review, and publication authorization remain pending.
