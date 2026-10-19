# Physics-discovery retrospective scene-purpose inventory

## Record and limits

- Date: 2026-10-18
- Reviewer: OpenCode `Sisyphus-Junior` (AI editorial/UX audit; not a scientific expert or human-subject researcher)
- Origin: user feedback rejecting quantity-first production and requesting a full-catalog purpose audit
- Status: unresolved retrospective proposal; not approval, publication authorization, or evidence of reader comprehension
- Scope: the 10 articles registered by `content/physics-discovery/catalog.ts`, totaling 73 scenes
- Source aggregate: `ba2f1057af9c0bf2338930a9badc675ce5c01d7db88ee5946cf41c046735a772` from `sha256sum content/physics-discovery/catalog.ts content/physics-discovery/README.md content/physics-discovery/*/{README.md,page.ts,article.ko.json,quality.json} | sha256sum`
- Static-build aggregate: `c7d617e574b9cead9f056f5cc7c1d1734a9e6d2d2d90ac8f0458df580a027690` from `sha256sum` over `dist/build-manifest.json` and the 10 scoped `dist/knowledge/<slug>/index.html` files; manifest hash `b4ae9daa844c699d63553eac5fea0bca10b629decfc98b96c3b98417feca57d1`
- Invariant: preserve existing claim/source scope, article/block/scene IDs, uncertainty, and review-required status. Representation proposals must not strengthen claims or imply that an authored illustration is measured data.

**Every purpose below is a retrospective proposed purpose inferred from the current article, page, quality record, and topic specification. None is an original approved scene plan.** Observable success means a behavior a later evaluator could ask a reader to demonstrate; this audit did not observe real readers and therefore does not claim attainment.

Representation labels: **static** when simultaneous comparison is the learning mechanism; **animated replay** only when ordered change is itself explanatory and must provide labeled steps, deterministic replay/reset/seek, and an equivalent reduced-motion state sequence; **interaction** only when changing a condition tests the same principle and adds more than navigation.

## `article:physics-discovery.inertial-motion.ko` — 6 scenes

| Scene ID | Covered content | Retrospective proposed purpose: why this slide exists | Observable learning success | Needed representation / interaction |
| --- | --- | --- | --- | --- |
| `question` | Everyday stopping; motion versus change of motion | Surface the misconception that motion needs a sustaining net force and redirect attention to causes of velocity change. | Reader names friction/drag as candidates rather than “lost motion force.” | **Static:** object/path plus explicit question; no motion needed before conditions are defined. |
| `comparison` | Same object/speed/level/time; rough, smooth, air-supported surfaces | Isolate resistance by showing what changes and what is held fixed. | Reader identifies independent variable, controls, and outcome. | **Interaction preferred:** one resistance control with overlaid distance/velocity traces; deterministic replay makes changed condition observable. Reduced motion can show three aligned final traces. |
| `inference` | Net force zero implies constant velocity in an inertial frame | Convert the comparison into the conditional first-law statement without equating force with velocity. | Reader predicts both rest and constant straight motion when net force is zero. | **Static:** force-vector sum beside velocity timeline; animation adds little once comparison is visible. |
| `frame` | Inertial versus accelerating frame; braking-bus example | Expose the reference-frame condition before transfer. | Reader explains why bus-frame apparent acceleration cannot be read as an unexplained external force. | **Animated replay useful:** synchronized ground/bus views with labeled frame acceleration; deterministic step sequence and reduced-motion keyframes. |
| `limit` | Observation versus ideal zero-resistance extrapolation; balanced forces | Prevent direct-observation and “no forces” overclaims. | Reader classifies measured trend, idealization, and force balance separately. | **Static:** three epistemic lanes (observation → extrapolation → limit), because simultaneity clarifies scope. |
| `transfer` | Constant-speed car with horizontal and vertical force balance | Test application without reversing the conditional into “no forces.” | Reader draws four forces and obtains vector sum zero under stated conditions. | **Interaction optional:** toggle drag/grade and predict acceleration; otherwise a static free-body diagram is sufficient. |

## `article:physics-discovery.atom-evidence.ko` — 7 scenes

| Scene ID | Covered content | Retrospective proposed purpose: why this slide exists | Observable learning success | Needed representation / interaction |
| --- | --- | --- | --- | --- |
| `question` | Indirect evidence for unseen atoms | Frame an epistemic problem rather than promise a direct image. | Reader proposes a measurable consequence rather than “look harder.” | **Static:** observed proxy → model → predicted statistic scaffold. |
| `observe` | Irregular colloid motion; colloid is not an atom | Establish exactly what was observed and what remained unseen. | Reader identifies colloid path as observation and molecular collisions as interpretation. | **Animated replay useful:** labeled visible colloid path over fixed interval, with molecules explicitly marked “model/not observed”; reduced-motion trail. |
| `predict` | Single path versus ensemble displacement/equilibrium statistics | Move from anecdotal irregularity to quantitative prediction. | Reader explains why many-particle distribution, not one zigzag, tests the model. | **Interaction preferred:** sample-size slider or repeated deterministic batches showing a distribution stabilize; disclose synthetic illustration. |
| `measure` | Three historical estimates and their simple range | Make convergence inspectable while preserving historical units. | Reader computes/reads the 5.8% spread and names the shared unit. | **Static:** common-axis dot/range plot; no invented error bars. |
| `uncertainty` | No error bars; proximity is not statistical agreement | Bound what the three numbers can establish. | Reader refuses “agreement within uncertainty” while allowing “close reported values.” | **Static:** supported/not-supported claim split tied to the same plot. |
| `limit` | Historical versus SI units; proxy versus atom; no internal structure | Prevent invalid numerical and ontological equivalence. | Reader states the conversion problem and names what further evidence would be needed. | **Static:** two unit cards plus scale ladder; scale must be labeled, not pictorially literal. |
| `transfer` | Dust motion; controls and converging methods | Test whether the evidence criteria transfer to a new irregular-motion observation. | Reader requests airflow/vibration/temperature controls, quantitative prediction, and independent convergence. | **Interaction:** choose controls/evidence and receive explanatory feedback; no random decorative dust. |

## `article:physics-discovery.nuclear-scattering.ko` — 7 scenes

| Scene ID | Covered content | Retrospective proposed purpose: why this slide exists | Observable learning success | Needed representation / interaction |
| --- | --- | --- | --- | --- |
| `question` | Majority forward events and rare large-angle/back events | Make the full distribution—not one dramatic event—the explanatory target. | Reader says both common and rare outcomes must be explained. | **Static:** angular histogram/polar count sketch labeled illustrative, not historical data. |
| `apparatus` | Alpha source, thin foil, rotatable scintillation detector, angle counts | Show how invisible internal structure becomes an angular measurement and why coverage matters. | Reader traces source → foil → detector and identifies measured angle/count. | **Animated replay useful:** labeled alpha paths and detector sweep; deterministic counts, no fake historical dataset; reduced-motion apparatus with sampled rays. |
| `pattern` | Thin-foil control; diffuse versus concentrated charge; follow-up variables | Connect observed angular pattern to competing models while keeping multiple scattering explicit. | Reader predicts which model better permits rare large angles and names foil thickness as a control. | **Interaction preferred:** switch charge distribution/foil thickness and compare normalized illustrative angle patterns with caveat. |
| `inference` | Impact parameter, charge concentration, sign from other evidence | Show how near/far passages support concentration without claiming angle data determine sign. | Reader separates concentration inference from positive-sign assignment. | **Animated replay useful:** near/far trajectories with observation/inference labels and nonliteral atomic scale; deterministic seek. |
| `empty-space-limit` | “Mostly empty” means low strong-deflection probability for this probe | Repair a common literal-vacuum interpretation. | Reader restates the phrase in probe/probability terms and does not erase electrons. | **Static:** probe-dependent probability/scale annotation; no empty cartoon atom. |
| `history-limit` | 1908–1913 observation, model, prediction tests; later unknowns | Prevent single-genius/single-moment and hindsight narratives. | Reader orders measurement, model, tests, and later discoveries without collapsing them. | **Static:** evidence-status timeline with people and stages; animation unnecessary. |
| `transfer` | Forward-only detector misses discriminating large-angle events | Test measurement-coverage reasoning. | Reader predicts the weakened inference and identifies missing angular acceptance. | **Interaction:** change detector acceptance wedge and reveal which events are measurable; deterministic, with static summary. |

## `article:physics-discovery.electron-evidence.ko` — 6 scenes

| Scene ID | Covered content | Retrospective proposed purpose: why this slide exists | Observable learning success | Needed representation / interaction |
| --- | --- | --- | --- | --- |
| `question` | Cathode-ray wave versus charged-particle interpretations | Frame deflection under controlled fields as the discriminating evidence. | Reader names a changed field and predicted path, not beam appearance alone. | **Static:** competing explanations with discriminating observation column. |
| `apparatus` | Opposed electric/magnetic fields; straight condition; charge sign | Make the crossed-field control and force directions intelligible. | Reader labels E, B, both forces, straight path, and sign evidence. | **Interaction preferred:** independently toggle E/B and tune to straight path; deterministic reset and vector labels. |
| `ratio` | Magnetic curvature and derivation of `|q|/m` | Show why radius plus selected speed yields a ratio, not separate charge and mass. | Reader derives `|q|/m=v/(Br)` and names unresolved quantities. | **Static:** apparatus-linked force/curvature diagram with algebra steps. |
| `repeat` | Gas/release method changed; similar `e/m` | Support the common-component inference through controlled repetition. | Reader identifies changed conditions and the repeated quantity. | **Static:** comparison matrix with scope limited to tested gases/methods. |
| `limit` | Calibration, vacuum/geometry, independent charge measurement | Mark the apparatus/model mediation and what `e/m` cannot establish. | Reader states why beam trace is not a particle photograph and what additional measurement is needed. | **Static:** measurement chain and unresolved-variable box. |
| `transfer` | Electric field alone conflates speed and deflection | Test the role of the magnetic-field control. | Reader explains why sign may be inferred but `e/m` remains underdetermined. | **Interaction:** remove B and identify lost information; explanatory feedback. |

## `article:physics-discovery.nuclear-constituents.ko` — 7 scenes

| Scene ID | Covered content | Retrospective proposed purpose: why this slide exists | Observable learning success | Needed representation / interaction |
| --- | --- | --- | --- | --- |
| `question` | Compact positive nucleus versus its constituents | Break the false continuity from nuclear scattering to proton/neutron identification. | Reader names “where/charge concentration” and “what constituents” as different questions. | **Static:** evidence-scope boundary diagram. |
| `proton` | Alpha bombardment of nitrogen/light elements; emitted positive hydrogen nucleus; tentative constituent inference | Show the experimental process and separate emitted observation from Rutherford's provisional proton interpretation without inventing a complete reaction pathway. | Reader labels incident alpha, nitrogen target, emitted hydrogen nucleus, observed charge, and tentative inference; says the full 1919 reaction path was not demonstrated. | **Animated replay required for process comprehension:** labeled before/during/after states, detector observation versus inference, explicit “not to scale/partial pathway” caveat, deterministic replay/reset/seek, and equivalent reduced-motion storyboard. Do not claim this exists now. |
| `neutral` | Penetrating beryllium radiation versus same-mass/speed proton stopping | Establish neutral-or-nearly-neutral behavior as one clue, not identification by penetration alone. | Reader states the controlled comparison and retains gamma-ray alternative. | **Static:** equal-mass/equal-speed penetration comparison with unknown-radiation label. |
| `collision-model` | Stationary target; head-on elastic maximum recoil; variables `M,A,V,u` | Define the narrow model before using historical speeds. | Reader identifies every variable and all conditions under which the formula applies. | **Animated replay useful:** one-dimensional collision with momentum markers; deterministic steps and reduced-motion frames. |
| `recoil` | Hydrogen/nitrogen recoil speeds; ratio cancels `V`; `M≈0.89` | Make the mass inference reproducible rather than declarative. | Reader forms the ratio, cancels `V`, and recomputes the approximate mass. | **Static:** aligned two-target equations and ratio; optional step reveal must not gate access. |
| `limit` | Charged recoil tracks; gamma alternative; combined evidence and later model | Distinguish indirect detection and converging inference from direct neutron tracks. | Reader explains why penetration alone is insufficient and what recoil comparison adds. | **Static:** observation → alternatives → discriminating comparison → inference map. |
| `transfer` | One target leaves `M,V` unknown; two targets at same `V` identify `M` | Test experimental-design reasoning. | Reader counts unknowns and explains why same-`V` two-target ratio is necessary. | **Interaction:** choose one/two targets and see identifiability, with algebraic feedback. |

## `article:physics-discovery.quark-evidence.ko` — 10 scenes

| Scene ID | Covered content | Retrospective proposed purpose: why this slide exists | Observable learning success | Needed representation / interaction |
| --- | --- | --- | --- | --- |
| `question` | Scattered-electron angle/energy; probability pattern, not photograph | Frame the evidence as processed event distributions. | Reader identifies measured variables and rejects “quark photo.” | **Static:** event-record-to-distribution pipeline. |
| `measurement` | Beam energy versus event `Q²`; inelastic final state `X` | Define resolution/event selection before pattern claims. | Reader distinguishes available beam energy, event momentum transfer, and DIS selection. | **Interactive kinematics helpful:** vary angle/outgoing energy and observe `Q²`/region; deterministic examples. |
| `factoring` | Raw cross section, Mott factor, structure functions | Expose the model-dependent processing between counts and target information. | Reader orders raw measurement → known factor → extracted structure quantity. | **Static:** factorization equation/pipeline with epistemic labels. |
| `factored-pattern` | Weaker `Q²` dependence in deep continuum than elastic/resonance | Make the actual post-factor pattern inspectable. | Reader compares slopes/variation only within the stated range. | **Static plot required:** schematic or sourced/cleared data; label illustrative if schematic. |
| `conditional-extraction` | 6°/10° cannot separate `W₁,W₂`; `R` bounds | Prevent unconditional presentation of early `W₂`. | Reader states what data could not separate and where `R` enters. | **Static:** underdetermined-equation diagram and `R=0…∞` bound band. |
| `conditional-pattern` | `νW₂` scaling-compatible within kinematics/errors | State the limited empirical pattern without turning it into exact scaling. | Reader names quantity, range, and uncertainty qualifier. | **Static plot/band:** same axes as prior scene; no bare `W₂` substitution. |
| `parton-inference` | Hard scattering from charged point-like partons | Connect limited pattern to the parton-model interpretation, not direct sight. | Reader distinguishes processed pattern from inferred scattering centers. | **Animated replay useful:** diffuse versus hard-center schematic labeled model comparison, not event footage. |
| `quark-identification` | Neutron, charge/spin, hadron-classification evidence | Show that parton-to-quark identification is convergent. | Reader names at least two independent evidence classes. | **Static:** converging-evidence map; no forced interaction. |
| `gluon-limit` | Photon couples to electric charge; gluons inferred separately | Prevent “DIS directly saw gluons” overclaim. | Reader explains why neutral gluons need scaling-change/other evidence. | **Static:** coupling/evidence boundary map. |
| `transfer` | Total counts without angle/energy cannot form kinematic pattern | Test why multidimensional measurement is necessary. | Reader lists unavailable `Q²`, region separation, and Mott comparison. | **Interaction:** remove recorded variables and display which analyses become impossible. |

## `article:physics-discovery.proton-charge-ledger.ko` — 7 scenes

| Scene ID | Covered content | Retrospective proposed purpose: why this slide exists | Observable learning success | Needed representation / interaction |
| --- | --- | --- | --- | --- |
| `question` | Proton charge `+1e`, `uud`, ledger versus literal count | Surface the three-classical-beads misconception. | Reader asks what `uud` records before counting objects. | **Static:** ledger/state contrast. |
| `valence` | Net flavor `u−ū=2`, `d−d̄=1`; pairs cancel | Define valence notation as conserved net bookkeeping. | Reader computes net flavor after adding a pair. | **Interactive ledger helpful:** add/remove flavor pairs while net entries update. |
| `charge` | Fractional charges sum to `+1e` | Work the calculation and delimit what it verifies. | Reader sums charges and states that this is consistency, not particle imaging. | **Static:** aligned arithmetic with signs and units. |
| `sea-gluons` | Sea pairs cancel electric/net flavor; gluons electrically neutral but color charged | Show additional content compatible with unchanged ledger. | Reader explains why extra pair/gluon leaves electric charge unchanged without calling gluon inert. | **Animated replay useful:** add pair/gluon to a ledger, not a literal proton portrait; reduced-motion before/after. |
| `limit` | `uud` is not instantaneous layout or equal thirds; EM DIS limit | Block overinterpretation of the shorthand. | Reader rejects exact count, bead layout, and equal-momentum claims. | **Static:** “ledger says / does not say” matrix. |
| `qcd-scope` | Multiple scattering data, QCD, confinement are separate | Route unresolved questions without pretending the charge sum proves them. | Reader names what requires QCD/additional evidence. | **Static:** scope boundary and related-evidence links. |
| `transfer` | Add `uū` pair and gluon; charge remains `+1e` | Demonstrate non-uniqueness of constituent count from one additive observable. | Reader calculates unchanged charge and states the inverse inference fails. | **Interaction:** add constituents and watch charge/net-flavor ledgers; deterministic reset. |

## `article:physics-discovery.quantum-spectra.ko` — 7 scenes

| Scene ID | Covered content | Retrospective proposed purpose: why this slide exists | Observable learning success | Needed representation / interaction |
| --- | --- | --- | --- | --- |
| `question` | Low-pressure excited hydrogen emits discrete wavelengths | Establish the observed pattern needing explanation. | Reader distinguishes line spectrum from continuous rainbow. | **Static spectrum required:** labeled wavelength axis and discrete lines; color is supplementary, not sole encoding. |
| `pattern` | Balmer wavelengths and Rydberg organization | Make the numerical pattern and convergence inspectable. | Reader orders wavelengths and recognizes that a fitted rule is not yet a mechanism. | **Static:** scale-accurate line spectrum plus series relation/limit; no animation. |
| `energy` | `E=hν`, vacuum/air relation, `n≈1` approximation | Translate wavelength to energy while keeping exact versus approximate steps visible. | Reader computes/compares energies and states the refractive-index approximation. | **Static:** conversion ladder with exact/approximate styling. |
| `transition-limit` | Transition type/probability and upper-state population affect visibility/brightness | Prevent “energy difference alone fixes every line/brightness.” | Reader names `Aki` and `Nk` as additional factors and does not erase forbidden transitions. | **Static:** energy-level possibilities with probability/population gates. |
| `bohr` | Bohr quantization reproduces hydrogen series | Credit the historical model's bounded explanatory success. | Reader connects allowed energies/transitions to hydrogen lines without claiming observed circular paths. | **Animated replay optional:** transition arrows and emitted wavelength; static levels are likely clearer. |
| `limit` | Failure for multi-electron atoms; modern quantum states | Separate retained energy-difference principle from discarded orbit literalism. | Reader states one success, one failure, and what survives. | **Static:** model comparison table; avoid decorative orbit animation. |
| `transfer` | 410 versus 656 nm energy; brightness underdetermined | Test inverse wavelength-energy reasoning and brightness caveat. | Reader picks 410 nm for larger energy and refuses brightness conclusion. | **Interaction:** compare chosen lines with energy calculation and separate intensity controls. |

## `article:physics-discovery.photoelectric-evidence.ko` — 7 scenes

| Scene ID | Covered content | Retrospective proposed purpose: why this slide exists | Observable learning success | Needed representation / interaction |
| --- | --- | --- | --- | --- |
| `question` | Clean metal/vacuum/monochromatic setup; photocurrent; brightness puzzle | Bound the phenomenon and distinguish measured current from explanation. | Reader identifies illumination variable and measured response. | **Static apparatus diagram:** source, metal, collector, ammeter, retarding voltage. |
| `observations` | Frequency cutoff, saturation current, stopping potential versus intensity | Present the multi-variable pattern the model must explain. | Reader predicts which quantity changes with intensity at fixed frequency/collection conditions. | **Interactive graphs preferred:** frequency/intensity/voltage controls driving labeled illustrative I–V and threshold views; deterministic. |
| `single-photon-model` | `hf`, work function, threshold, `Kmax` | Explain observations as a conditional model inference. | Reader applies `hf≥φ` and avoids negative kinetic energy below threshold. | **Static:** energy ledger synchronized with observed graph; optional reveal only. |
| `below-threshold-case` | `φ=2.30 eV`, `hf=1.65 eV`, 0.65 eV deficit | Work the no-emission case and keep it inside the low-intensity regime. | Reader reproduces deficit and predicts no single-photon emission. | **Static:** number line/energy ledger with units. |
| `above-threshold-case` | `hf=3.31 eV`, `Kmax=1.01 eV`, ideal `Vs` sign/magnitude | Work the emission and stopping-potential calculation with idealizations. | Reader computes `Kmax`, distinguishes `−1.01 V` setting from `1.01 V` magnitude, and states assumptions. | **Static:** energy ledger plus retarding-potential apparatus inset. |
| `regime-limit` | Multiphoton/strong-field exceptions; evidence not whole quantum mechanics | Prevent universalizing the threshold rule. | Reader states the low-intensity single-photon domain and names excluded regimes. | **Static:** regime map; no dramatic laser animation. |
| `transfer` | Double intensity above threshold; current may rise, `Kmax/|Vs|` unchanged | Test frequency-versus-intensity distinction. | Reader predicts all three outputs with conditions. | **Interaction:** intensity toggle on same frequency, graph and energy ledger update together; deterministic reset. |

## `article:physics-discovery.light-clock-time.ko` — 9 scenes

| Scene ID | Covered content | Retrospective proposed purpose: why this slide exists | Observable learning success | Needed representation / interaction |
| --- | --- | --- | --- | --- |
| `question` | Same two ticks, different frame intervals; “absolute slower” challenge | Surface the comparison paradox without promising an absolute ranking. | Reader asks which events and clocks define each interval. | **Static:** two observers/event-pair prompt. |
| `proper-time` | Same detector/worldline; `2L/c=Δτ` | Define proper time operationally before algebra. | Reader identifies same-location events and the measuring clock. | **Static:** worldline/event diagram and clock inset. |
| `triangle` | Moving-frame diagonal light path and Pythagorean relation | Make assumptions and geometry inspectable. | Reader labels all triangle sides and explains why transverse `L` is shared. | **Static at desktop; responsive step/stack at narrow:** the existing authored figure is appropriate, with enlarged labels and explicit full-trip/half-trip distinction. Animation is not required. |
| `derivation` | Substitute `L`; derive `γ`; calculate 0.6c example | Make the deduction reproducible and distinguish example from measurement. | Reader reproduces algebra and `γ=1.25`, `8 ns→10 ns`. | **Static:** equation steps with dimensional/sign checks. |
| `coordinate-time` | Different locations require synchronized coordinate clocks | Supply the operational meaning hidden by a single stopwatch metaphor. | Reader explains the light-signal synchronization convention and which clocks provide `Δt`. | **Animated replay useful:** synchronization signals and two readings in deterministic labeled steps; reduced-motion sequence. |
| `symmetry` | A ticks `E₁,E₂` versus B ticks `F₁,F₂` | Prevent reversing frame labels while silently keeping the same event pair. | Reader selects the correct new event pair when roles swap. | **Interaction:** choose event pair/frame and receive correspondence feedback; spacetime diagram preferred. |
| `reciprocity-limit` | Reciprocal inertial comparison; acceleration/reunion excluded | Resolve “both slow” without entering twin-paradox dynamics. | Reader states reciprocity and why no absolute slower clock follows here. | **Static:** paired spacetime diagrams and explicit scope boundary. |
| `observation` | Light-clock deduction versus reported fast-muon support | Separate model derivation from observational evidence. | Reader classifies the triangle as deduction and muon lifetime as separate reported support. | **Static:** evidence-type split; no unsourced muon animation/data plot. |
| `transfer` | Choose B's ticks; B proper time, A coordinate time; same `γ` | Test event-pair criterion rather than memorized frame names. | Reader assigns intervals correctly after roles reverse. | **Interaction:** event-pair selection on spacetime diagram; feedback explains worldline criterion. |

## Catalog-level stop condition

Do not start another physics-discovery article from this inventory. First resolve the blocking/revise findings in the companion review, prototype the highest-leverage representations (especially `nuclear-constituents/proton`), test them with readers, and independently review decisive scientific sources. Static prose remains valid where a graphic adds nothing, but a textual card that merely repeats prose does not count as the needed representation.
