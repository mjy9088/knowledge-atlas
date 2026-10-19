# Physics-discovery scene-purpose review

## Review record

- Date: 2026-10-18
- Reviewer: OpenCode `Sisyphus-Junior` (AI editorial/UX reviewer; not a scientific expert, source-rights reviewer, or human participant)
- Origin: user feedback rejecting quantity-first production and requesting purpose-attainment, interaction, and visualization review
- Target: 10 registered physics-discovery articles, 73 authored scenes, and the existing static review build at `http://127.0.0.1:4174`
- Resolution: **unresolved**. This report is a stop-production input, not accepted design debt, content approval, or publication authority.
- Invariant: preserve claim/source scope and all existing article/block/scene IDs. Proposed representations must retain observation/inference/idealization boundaries, units, uncertainty, and review-required status.
- Source aggregate: `ba2f1057af9c0bf2338930a9badc675ce5c01d7db88ee5946cf41c046735a772`
- Static-build aggregate: `c7d617e574b9cead9f056f5cc7c1d1734a9e6d2d2d90ac8f0458df580a027690`; `dist/build-manifest.json`: `b4ae9daa844c699d63553eac5fea0bca10b629decfc98b96c3b98417feca57d1`
- Browser observation record: `test-results/content-quality/physics/browser-observations.json`, SHA-256 `a330c44ef73c3835153bb216867fc56410a503dd75713210c854496374d64a73`

## Evidence and interpretation limits

The browser run used a separate Node Playwright process with bundled Chromium, not the shared MCP browser. It exercised every scene at CSS viewports 1920×1080 and 390×844: 146 scene/viewport cases. Every case restored the requested scene after reset, rejected an invalid scene atomically, matched the stable scene ID/title, exposed reachable controls, and produced a screenshot. No page or console errors, document overflow, content overflow, clipping, or obscured controls were observed. Geometry does **not** establish pedagogical success, visual adequacy, accessibility, or scientific truth.

The shared controls miss a 44×44 target floor throughout the catalog: menu summary 140×31 desktop and 128×20 narrow; Previous/Next are 40 px high at narrow. This is a catalog-level touch/accessibility revision, not a scene-specific reasoning result.

All 73 scenes rendered as static reading scenes with no topic control. Seventy-two use only prose plus textual cards; `light-clock-time/triangle` additionally uses an authored SVG. Representative screenshots were visually inspected across all 10 articles, including narrow nuclear-constituents and light-clock cases. “Actual tested behavior” below means rendered browser behavior, not participant comprehension.

No decisive external source was opened during this audit. Topic READMEs were read as project records, not reverified evidence. Therefore all scientific and historical source alignment remains **unverified** here; existing review-required, immutable-byte, exact-revision, rights, expert, audio, comprehension, and publication limits remain unchanged.

### Browser evidence notation

- **B**: both viewports; direct scene selection, reset/restoration, invalid-state atomicity, stable heading/prose/cards, no overflow/clipping/obscuration, no runtime errors; no scene-specific controls; global hit-target issue above applies.
- Every **B** row has two screenshots: `test-results/content-quality/physics/screenshots/<slug>--<scene>--desktop-1920x1080.png` and `...--narrow-390x844.png`.
- **V**: one or more representative screenshots were manually inspected for visual/pedagogical form; named in the row.
- **RM**: `nuclear-constituents/proton` was replayed under `prefers-reduced-motion: reduce`; two screenshots were byte-identical (`dac2148…`), with zero active animations. This proves current static determinism, not the requested process animation.

Verdicts follow the requested scale. **Blocking** means the current surface cannot carry a central reasoning step without a new representation or corrected evidence boundary. **Revise** means the prose chain is usable but the slide does not yet demonstrate its proposed purpose. **Adequate** is limited to current surface/purpose, not source or reader approval. **Unverified** means attainment specifically requires participant or scientific evidence absent here.

## `article:physics-discovery.inertial-motion.ko`

| Scene ID | Verdict | Reasoning gap | Visual / interaction gap | Actual tested behavior | Concrete acceptance criterion |
| --- | --- | --- | --- | --- | --- |
| `question` | unverified | The prompt correctly exposes the misconception, but no reader evidence shows that attention shifts from motion to velocity change. | Two text cards only; no visible stopping case or competing causal account. | B. | In reader testing, participants identify resistance as a candidate cause before the first-law statement; static prompt clearly distinguishes motion/change. |
| `comparison` | blocking | Controls and outcome are asserted rather than inspected, so causal isolation remains prose-dependent. | No surfaces, equal starts, time marks, or distance/velocity traces. V: `inertial-motion--comparison--desktop-1920x1080.png`. | B; V found text cards occupying a small central band. | One synchronized comparison shows fixed controls and different deceleration; reader can name changed and held variables from the visual alone. |
| `inference` | revise | The conditional is stated, but the bridge from comparison to net-force reasoning is compressed. | Formula cards do not show force vectors and velocity over time. | B. | A force/velocity representation makes rest and constant straight motion two outcomes of `ΣF=0`, and a changed-force case predicts acceleration. |
| `frame` | blocking | The braking-bus example introduces a frame condition without showing the two descriptions that motivate it. | No ground/bus correspondence or frame acceleration. | B. | Deterministic paired views keep one event sequence synchronized and label inertial versus accelerating descriptions; reduced-motion keyframes convey the same chain. |
| `limit` | revise | Observation, extrapolation, and balanced-force caveat are present but compete in one paragraph. | Cards restate labels rather than bind them to the comparison evidence. | B. | A three-stage evidence map visibly separates measured trend, zero-resistance idealization, and `net zero ≠ no forces`; users classify each correctly. |
| `transfer` | revise | Conditions are stated, but the transfer is already solved rather than eliciting reasoning. | No free-body diagram or prediction/reveal. | B. | Reader first predicts the net force, then a labeled four-force diagram and feedback explain cancellation without gating navigation. |

## `article:physics-discovery.atom-evidence.ko`

| Scene ID | Verdict | Reasoning gap | Visual / interaction gap | Actual tested behavior | Concrete acceptance criterion |
| --- | --- | --- | --- | --- | --- |
| `question` | unverified | The indirect-evidence question is strong, but purpose attainment needs reader explanation evidence. | Cards do not distinguish an observation channel from model prediction. | B. | Readers propose a measurable statistical consequence and do not answer “the colloid is the atom”; representation labels observation/model/prediction. |
| `observe` | revise | Proxy versus atom is explicit, but irregularity and control conditions are not inspectable. | No trajectory, interval, control, or scale caveat. | B. | A labeled illustrative trace identifies the visible colloid and marks molecules as inferred/unseen; no claim of project measurement. |
| `predict` | blocking | The crucial move from one path to ensemble statistics is only narrated. | No sample aggregation or distribution. V: `atom-evidence--predict--desktop-1920x1080.png`. | B; V found a text-only reasoning chain. | Deterministic sample batches visibly stabilize a stated statistic; reader explains why one path is insufficient and identifies the prediction being tested. |
| `measure` | revise | The 5.8% range is supplied, not made independently readable. | No common-axis plot; three values are textual. | B. | A common-axis dot/range plot preserves historical units and lets a reader derive the spread without implied error bars. |
| `uncertainty` | adequate | It explicitly blocks an unsupported error-bar claim and gives the narrower allowable statement. | A visual tie back to the three values would strengthen it but is not essential. | B. | Same plot visibly lacks uncertainty intervals; wording remains “close reported values,” and no statistical-agreement claim appears. |
| `limit` | revise | Unit and proxy distinctions are correct in prose but remain abstract. | No unit-conversion boundary or scale ladder. | B. | Historical and SI quantities are visibly non-comparable without conversion; colloid/atom/internal-structure levels are separately labeled and not drawn to scale. |
| `transfer` | revise | The answer lists controls, so no actual transfer behavior is observed. | No choice/prediction interaction or explanatory feedback. | B. | Reader selects needed controls and model comparison before reveal; feedback explains why uncontrolled dust is anecdotal rather than evidence. |

## `article:physics-discovery.nuclear-scattering.ko`

| Scene ID | Verdict | Reasoning gap | Visual / interaction gap | Actual tested behavior | Concrete acceptance criterion |
| --- | --- | --- | --- | --- | --- |
| `question` | revise | “Full angular distribution” is named but not shown, leaving rare/common balance rhetorical. | No angular distribution or event counts. | B. | An explicitly illustrative polar/count view shows majority forward and rare large-angle events without fabricating historical values. |
| `apparatus` | blocking | Source, foil, detector, and measured angle cannot be reconstructed from the current cards alone. | No apparatus, angular acceptance, or detection process. V: `nuclear-scattering--apparatus--desktop-1920x1080.png`. | B; V found an “apparatus” slide with only labels. | Labeled source → thin foil → detector arc → scintillation/count process is legible at both viewports; detector acceptance can be identified. |
| `pattern` | blocking | Competing diffuse/concentrated accounts are asserted without a visible prediction comparison. | No model-linked angular patterns or thickness effect. | B. | Switching model and foil-thickness condition changes a clearly illustrative normalized pattern; labels preserve multiple-scattering caveat. |
| `inference` | blocking | Impact parameter is the causal bridge but is absent; sign evidence remains a sentence-level caveat. | No near/far trajectories, scale statement, or observation/inference lanes. | B. | Deterministic near/far replay connects trajectory class to angle while separately labeling charge concentration inference and positive-sign evidence from elsewhere. |
| `empty-space-limit` | revise | Scope repair is good but depends on parsing a negation. | No probe-dependent probability or scale representation. | B. | Visual states “low probability of strong deflection for this probe,” retains electrons, and includes a nonliteral-scale warning. |
| `history-limit` | revise | Milestones are listed but collaboration, model revision, and later tests are visually equivalent. | No evidence-status timeline. | B. | Timeline distinguishes observation, model construction, prediction tests, and later discoveries with dates/participants and no inevitable-march arrow. |
| `transfer` | revise | The prose solves the detector-coverage problem instead of testing it. | No adjustable acceptance wedge or visible missed events. | B. | Reader changes acceptance and sees which angular bins/events disappear; feedback states why the inference weakens. |

## `article:physics-discovery.electron-evidence.ko`

| Scene ID | Verdict | Reasoning gap | Visual / interaction gap | Actual tested behavior | Concrete acceptance criterion |
| --- | --- | --- | --- | --- | --- |
| `question` | revise | Competing explanations are named but no discriminating prediction is elicited. | No hypothesis/prediction matrix. | B. | Reader predicts path behavior under changed E/B fields for each account before seeing evidence. |
| `apparatus` | blocking | Force cancellation and sign inference cannot be reconstructed without field orientation. | No tube, E/B directions, force vectors, or paths. V: `electron-evidence--apparatus--desktop-1920x1080.png`. | B; V found formulas presented as the apparatus. | An interactive or stepwise apparatus shows E/B toggles, straight condition, force cancellation, and sign from direction; reset is deterministic. |
| `ratio` | blocking | The radial-force equation is detached from measured curvature and selected speed. | No radius, center, velocity, or field geometry. | B. | A linked curvature diagram and algebra let readers derive `|q|/m` and explicitly leave `|q|` and `m` unresolved. |
| `repeat` | revise | Similarity across tested cases is asserted with no visible scope or values. | No comparison matrix. | B. | Matrix names changed gas/release method, repeated outcome, and tested scope; it does not universalize beyond consulted evidence. |
| `limit` | adequate | It clearly distinguishes ratio, independent charge measurement, and mediated beam evidence. | A measurement-chain diagram would aid load but is not required for the narrow purpose. | B. | Surface continues to state calibration/model mediation and the exact additional quantity needed, with no “electron photo” language. |
| `transfer` | revise | The answer is given; underdetermination is not experienced. | No remove-field comparison. | B. | With B removed, feedback identifies sign information retained and speed/ratio information lost; reader explains why E-only is insufficient. |

## `article:physics-discovery.nuclear-constituents.ko`

| Scene ID | Verdict | Reasoning gap | Visual / interaction gap | Actual tested behavior | Concrete acceptance criterion |
| --- | --- | --- | --- | --- | --- |
| `question` | adequate | The scope boundary—finding a compact nucleus versus identifying constituents—is direct and necessary. | A boundary diagram would help but text is sufficient for this framing purpose. | B. | Readers state the two questions separately before proceeding; IDs and claim scope remain unchanged. |
| `proton` | blocking | Incident alpha, nitrogen target, emitted hydrogen nucleus, observation, and tentative constituent inference are compressed into three labels. This risks implying a complete reaction pathway despite the prose caveat. | No process, detector observation, scale caveat, or observation/inference separation. V: desktop and narrow screenshots; narrow card chain wraps ambiguously. RM: static, deterministic, zero animations; no animation was added. | B; V: `nuclear-constituents--proton--desktop-1920x1080.png`, `...--narrow-390x844.png`; RM paths `...--reduced-motion-a/b.png`. | Add labeled deterministic process visualization with alpha → nitrogen → emitted positive hydrogen nucleus, “observed” versus “tentative inference,” explicit partial-path/not-to-scale caveat, replay/reset/seek, and an equivalent reduced-motion storyboard. Independent source/expert review must approve exact labels before adequacy. |
| `neutral` | blocking | Equal-mass/equal-speed comparison and gamma alternative are not jointly visible, so penetration can be misread as identification. | No penetration-depth comparison or competing explanation. | B. | A controlled comparison shows equal assumptions and stopping difference, while gamma remains an explicit live alternative. |
| `collision-model` | blocking | Formula conditions are numerous and central; cards name variables but do not show why this is maximum recoil. | No stationary target, head-on geometry, or elastic before/after states. | B. | Deterministic replay/frames show the conditioned 1D collision, labels all variables, and visibly distinguishes maximum from arbitrary recoil. |
| `recoil` | revise | The ratio result is shown but arithmetic and sensitivity are not inspectable. | No aligned two-target derivation. | B. | Reader can reproduce `uH/uN=(M+14)/(M+1)`, cancel `V`, and obtain approximately `0.89` from displayed values. |
| `limit` | revise | Combined-evidence logic is present, but observation, alternative, discrimination, and later model are visually flat. | No converging-evidence map. | B. | Representation explicitly traces charged recoil observation → gamma alternative → two-target mass inference → later nuclear model without calling recoil a neutron track. |
| `transfer` | revise | Unknown counting and identifiability are answered in prose. | No one-target/two-target comparison. | B. | Reader first sees one equation/two unknowns, then adds the second target and explains why common `V` enables cancellation. |

## `article:physics-discovery.quark-evidence.ko`

| Scene ID | Verdict | Reasoning gap | Visual / interaction gap | Actual tested behavior | Concrete acceptance criterion |
| --- | --- | --- | --- | --- | --- |
| `question` | revise | Measurement-to-probability framing is sound but abstract. | No event record or aggregation pipeline. | B. | A diagram maps measured outgoing angle/energy to an event bin and distribution without depicting a quark photograph. |
| `measurement` | blocking | Beam energy, event `Q²`, and DIS selection are three different conditions but appear as definitions. | No kinematics or region map. | B. | Changing angle/outgoing energy changes computed `Q²` and event-region label; available beam energy remains visibly distinct. |
| `factoring` | blocking | The central analytical transformation is merely stated, so readers cannot distinguish measured cross section from extracted structure information. | No equation/pipeline or epistemic roles. V: `quark-evidence--factoring--desktop-1920x1080.png`. | B; V found a text-card pipeline with no data or equation. | Visual pipeline labels measured quantity, Mott model factor, operation, and resulting structure quantity; no claim that raw cross section scaled. |
| `factored-pattern` | blocking | “Weaker dependence” cannot be judged without a comparison. | No axes, trend, range, or elastic/resonance comparator. | B. | A cleared-data plot or explicitly schematic plot shows the limited comparative dependence with axes and range labels. |
| `conditional-extraction` | blocking | Underdetermination of `W₁/W₂` and conditional `R` bounds are high-load concepts presented as vocabulary. | No equation count, bound band, or assumption control. | B. | Representation shows why 6°/10° data do not separate both functions and how `R` assumptions bound `W₂`. |
| `conditional-pattern` | blocking | The qualified `νW₂` result is impossible to inspect and easy to misremember as exact/bare `W₂` scaling. | No plot, uncertainty, kinematic scope, or `ν` distinction. | B. | Plot explicitly labels `νW₂`, measurement uncertainty, and covered kinematics; text never substitutes bare `W₂`. |
| `parton-inference` | blocking | Pattern-to-pointlike-center inference is asserted without competing-model consequences. | No diffuse versus hard-center comparison. | B. | Labeled model comparison connects the processed pattern to charged point-like partons and marks the result as inference, not observation. |
| `quark-identification` | revise | Converging evidence is listed but its distinct roles are not explained. | No evidence map. | B. | Map names at least two independent evidence classes and what each constrains in identifying partons with quarks. |
| `gluon-limit` | adequate | The direct-photon-charge versus separate-gluon evidence boundary is explicit and appropriately narrow. | A coupling diagram would help but the purpose is achieved textually. | B. | Readers state that gluons are partons but not direct electric-charge scattering centers and name separate inference evidence. |
| `transfer` | revise | The answer lists unavailable analyses; no variable-loss reasoning is performed. | No removable-variable interaction. | B. | Removing angle/outgoing-energy records visibly disables `Q²`, region separation, and matched Mott factoring with explanatory feedback. |

## `article:physics-discovery.proton-charge-ledger.ko`

| Scene ID | Verdict | Reasoning gap | Visual / interaction gap | Actual tested behavior | Concrete acceptance criterion |
| --- | --- | --- | --- | --- | --- |
| `question` | unverified | Ledger-versus-count framing is promising, but no reader evidence shows the bead misconception is activated or repaired. | No ledger/state contrast. | B. | Readers explain what `uud` records before being shown the answer and do not equate notation with instantaneous count. |
| `valence` | blocking | Net flavor is introduced through compact notation without a manipulable bookkeeping example. | No ledger updating as pairs are added. | B. | Adding `q q̄` pairs leaves displayed net flavor unchanged; reader computes `u−ū=2`, `d−d̄=1`. |
| `charge` | adequate | The fractional charge sum is explicit and correctly delimited as consistency rather than imaging. | Arithmetic cards are sufficient, though a single aligned equation would be clearer. | B. | Reader reproduces signs/units and states the inverse claim—exact constituent count—does not follow. |
| `sea-gluons` | revise | Pair cancellation and gluon role are stated, but their relation to unchanged `uud` is not demonstrated. | No ledger update; V: `proton-charge-ledger--sea-gluons--desktop-1920x1080.png`. | B; V found three explanatory cards, not a composition/ledger visualization. | Before/after ledger adds `uū` and a gluon, keeps charge/net flavor fixed, and labels gluon electrically neutral but color charged. |
| `limit` | adequate | “Does not say” boundaries directly address bead count, equal momentum, and confinement. | Static matrix would improve scanning but no dynamic representation is needed. | B. | Surface preserves all three exclusions and no artwork depicts three isolated equal beads. |
| `qcd-scope` | adequate | It correctly routes state/composition/confinement beyond the charge ledger. | Current cards suffice if links/evidence remain accessible. | B. | Reader can name additional data/theory required; no charge-sum-as-confinement claim appears. |
| `transfer` | revise | The transfer is solved in prose instead of testing non-uniqueness. | No add/remove constituent interaction. | B. | Reader adds pair/gluon, predicts unchanged charge, and receives rationale that same observable permits different content. |

## `article:physics-discovery.quantum-spectra.ko`

| Scene ID | Verdict | Reasoning gap | Visual / interaction gap | Actual tested behavior | Concrete acceptance criterion |
| --- | --- | --- | --- | --- | --- |
| `question` | blocking | A line spectrum is the observation, yet no spectrum is shown. | Text cards cannot demonstrate discrete versus continuous output. | B. | Accessible wavelength-axis spectrum shows discrete hydrogen lines; color is not the sole encoding and source/illustration status is explicit. |
| `pattern` | blocking | Numerical wavelengths are listed, so the claimed sequence/convergence cannot be perceived. | No shared axis, spacing, or series relation. V: `quantum-spectra--pattern--desktop-1920x1080.png`. | B; V found wavelength cards rather than a spectrum. | Scale-accurate line positions and relation/limit make the pattern inspectable; reader distinguishes empirical compression from causal explanation. |
| `energy` | revise | Exact and approximate relations are present but compressed into one prose passage. | No conversion ladder or exact/approximate coding. | B. | Visual separates `E=hν`, `λvac=nλair`, and `n≈1` step; reader recomputes both energies with units. |
| `transition-limit` | blocking | Transition type, probability, and population are introduced without showing how they gate a line. | No levels, allowed/weak transitions, or brightness factors. | B. | Energy-level representation shows energy match separately from transition probability/population; M1/E2 are not erased. |
| `bohr` | revise | Success is named, but connection between quantized levels and Balmer lines remains implicit. | No level transitions or emitted wavelengths. | B. | Static level diagram reproduces hydrogen-series logic while labeling circular orbit as historical model, not observed path. |
| `limit` | adequate | Success, multi-electron failure, modern state description, and retained energy-difference relation are all explicit. | A comparison table would reduce load but no interaction is needed. | B. | Reader names one success, one failure, and the retained relation without claiming classical trajectories. |
| `transfer` | revise | The answer is supplied; energy/brightness distinction is not elicited. | No selectable lines or separate intensity factors. | B. | Reader chooses 410 nm for larger energy, calculates it, then separately marks brightness underdetermined by wavelength alone. |

## `article:physics-discovery.photoelectric-evidence.ko`

| Scene ID | Verdict | Reasoning gap | Visual / interaction gap | Actual tested behavior | Concrete acceptance criterion |
| --- | --- | --- | --- | --- | --- |
| `question` | revise | Setup conditions and measured current are present but not spatially connected. | No apparatus or controllable variables. | B. | Labeled vacuum/source/metal/collector/ammeter diagram exposes frequency, intensity, and retarding voltage as separate controls. |
| `observations` | blocking | Three coupled observations are central, but textual statements do not show how current/voltage curves change. | No I–V or threshold plot. V: `photoelectric-evidence--observations--desktop-1920x1080.png`. | B; V found all observations compressed into cards. | Deterministic graph views show below-threshold zero current, intensity-dependent saturation current, and unchanged stopping-potential magnitude under fixed conditions. |
| `single-photon-model` | revise | Energy ledger explains the pattern, but observation and model inference are visually blended. | No synchronized graph/energy relation. | B. | Representation labels measured pattern separately from `hf−φ` model and never displays negative kinetic energy below threshold. |
| `below-threshold-case` | adequate | The numerical deficit and conditional no-emission conclusion are explicit and bounded. | A number line would aid arithmetic but cards can carry this purpose. | B. | Reader recomputes 0.65 eV deficit and states the low-intensity single-photon condition. |
| `above-threshold-case` | revise | Sign versus magnitude of stopping voltage and apparatus idealizations require more support. | No retarding-potential orientation or energy ledger. | B. | Diagram shows collector polarity, `Kmax=1.01 eV`, setting `−1.01 V`, magnitude `1.01 V`, and contact-potential/space-charge assumptions. |
| `regime-limit` | adequate | Low-intensity scope, nonlinear exceptions, and non-total-proof boundary are explicit. | Static regime map would help but no animation is warranted. | B. | Readers place multiphoton/strong-field cases outside the model without reading the threshold as absolute. |
| `transfer` | revise | Current versus energy prediction is provided rather than tested. | No intensity control or synchronized outputs. | B. | Doubling intensity updates saturation current only; energy ledger and `|Vs|` remain fixed, with conditions always visible. |

## `article:physics-discovery.light-clock-time.ko`

| Scene ID | Verdict | Reasoning gap | Visual / interaction gap | Actual tested behavior | Concrete acceptance criterion |
| --- | --- | --- | --- | --- | --- |
| `question` | unverified | The paradox is well posed, but there is no evidence readers ask about event pairs rather than choose a “slower” clock. | No event-pair/worldline prompt. | B. | Reader identifies missing event/clock specification before derivation; no absolute ranking is visually implied. |
| `proper-time` | revise | Same detector/worldline is described but not represented. | No worldline/events; cards alone risk making proper time a label. | B. | Diagram marks two events on one clock worldline and distinguishes same-location proper time from later coordinate readings. |
| `triangle` | revise | Desktop figure successfully exposes geometry and assumptions; narrow scaling makes labels and the full-trip/half-trip distinction too small. | Existing SVG is the sole substantive visualization; at 390 px it remains side-by-side and materially loses legibility. V: desktop+narrow screenshots. | B; V: `light-clock-time--triangle--desktop-1920x1080.png` and `...--narrow-390x844.png`. | At narrow width panels stack or step without clipping; all side labels, assumptions, and “construction, not measurement” remain readable, and full versus half trip is explicit. |
| `derivation` | revise | Algebra is complete in prose but visually dense; no step-level check connects each transformation to the triangle. | Formula cards omit intermediate correspondence/dimensional cues. | B. | Each equation step maps to labeled triangle quantities; reader independently recomputes `γ=1.25` and `8 ns→10 ns`. |
| `coordinate-time` | blocking | Synchronization is operationally central but only asserted; “several clocks” is easy to miss. | No separated clocks, light signals, or assigned readings. | B. | Deterministic synchronization sequence shows outward/return signals, equal-time convention, two locations, and resulting `Δt`; reduced-motion frames are equivalent. |
| `symmetry` | blocking | The event-pair change is the key misconception repair but appears only as four symbols. | No spacetime diagram or selectable events. | B. | Reader selects `E₁,E₂` for A and distinct `F₁,F₂` for B on a diagram before interval labels appear. |
| `reciprocity-limit` | revise | Reciprocal conclusion and excluded acceleration/reunion are explicit, but the geometric reason remains inherited from the unseen event structure. | No paired worldline comparison or scope boundary. | B. | Paired diagrams preserve distinct event pairs and visibly stop before any reunion/twin-paradox claim. |
| `observation` | adequate | It explicitly distinguishes model deduction from textbook-reported muon support. | Text is acceptable because no verified data are available; adding unsourced graph/animation would be worse. | B. | Surface keeps the evidence-type split and does not imply this audit opened primary muon data. |
| `transfer` | revise | The correct role reversal is already stated, so no transfer performance is measured. | No event-pair selection interaction. | B. | Reader chooses B's two ticks, assigns B proper time/A coordinate time, and explains the worldline criterion with feedback. |

## Cross-catalog blockers and priority order

1. **Stop new production:** 73 scenes already exceed the review bandwidth demonstrated here; only one scene has a substantive diagram, and no scene-specific interaction exists.
2. **Process/evidence visualization:** `nuclear-constituents/proton` is the highest-priority blocker. It needs the explicitly requested labeled alpha-bombardment/nitrogen/proton-emission process, observation-versus-inference split, scale caveat, deterministic replay, and reduced-motion equivalent. Current evidence proves only a static card surface; it does not prove or imply an added animation.
3. **Apparatus and variable controls:** nuclear scattering, electron crossed fields, and photoelectric observations currently call textual cards an apparatus/pattern. Build representations that show what changed, what was measured, and what the observation supports.
4. **Data/pattern visibility:** atom statistics, scattering angles, DIS factorization/scaling, and hydrogen spectra require plots or distributions. Schematic displays must be marked illustrative; sourced data require revision and rights verification.
5. **Reasoning transfer:** nearly every transfer scene reveals the answer immediately. Add optional prediction/explanatory feedback only where manipulation tests the same principle; never gate navigation.
6. **Narrow responsive representation:** the nuclear process card chain wraps ambiguously, and the light-clock figure shrinks below useful explanatory size. Reflow relationships rather than scale them down.
7. **Shared control targets:** increase menu and narrow navigation controls to at least 44×44 CSS px without hiding content or creating overflow, then rerun all cases.

## Required next evidence

- Independent physics/history/statistics reviewers must open decisive source passages; this report verifies none.
- Human reader sessions must test the observable-success statements in `physics-plan.md`; geometry and AI visual critique are not comprehension evidence.
- Representation prototypes must preserve stable IDs and claim boundaries, expose whether graphics are data, models, or authored illustrations, and pass deterministic state/reset/seek plus reduced-motion equivalence where animated.
- Re-run both viewports after revision, inspect every changed scene, and retain screenshots under the same ignored evidence root. Publication, rights clearance, expert approval, narration timing, and reader comprehension remain pending.
