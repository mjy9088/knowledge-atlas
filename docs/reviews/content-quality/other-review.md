# Critical reader audit: ten other readers

## Review identity, evidence, and limits

- **Date:** 2026-10-18
- **Reviewer:** OpenAI GPT-5.6-SOL, provisional editorial/runtime review; not an independent subject-matter expert
- **Origin:** user feedback that recent quality was overestimated
- **Reviewed scope:** 10 registered articles, 70 scenes
- **Source composite SHA256:** `d990c5a8b023af66610af321fdd91027cad3b469297f0ac1a44783a5d7c3118b`
- **Rendered build-manifest SHA256:** `b4ae9daa844c699d63553eac5fea0bca10b629decfc98b96c3b98417feca57d1`
- **Runtime evidence SHA256:** `98e55d969de14058ce50df5ce3d1a4eae7ee3e19b212e4114082c821b9974a5a`
- **Runtime:** existing static review build at `http://localhost:4174`; no rebuild, port change, source edit, or publication action

This review evaluates the retrospective purposes in [other-plan.md](other-plan.md). A verdict is about the current scene's ability to meet that proposed purpose, not scientific approval. Stable IDs, assumptions, fixtures, review states, and accepted human edits remain authoritative; fixes require explicit diffs. No source revision, rights clearance, expert review, reader comprehension, narration timing, or publication approval is claimed.

### Evidence notation

- **D/N:** standalone Node Playwright Chromium capture and geometry inspection at 1920×1080 and 390×844. Every row has two screenshots named `test-results/content-quality/other/<slug>--<scene>--{desktop,narrow}.png`.
- **NAV:** direct scene state, Next/Previous where applicable, and reset were exercised. Across all 140 scene/viewport observations: 0 document horizontal overflows, 0 document vertical overflows, and 0 console/page errors. This establishes fit only, not explanatory success.
- **INT-TC/MH/BR/BS/SS/BA/AO:** respectively two-children, Monty Hall, binary-relations, binary-search, sphere-slices, base-rates, and atomic-orbitals changed-state checks recorded in `audit.json`. State persisted across navigation and reset returned the declared baseline. BS and BA displayed invalid drafts and recovered; AO rejected an unsupported orbital state atomically.
- **RI:** screenshot was among the representative images inspected for explanatory and visual value, not just captured.

The automated target scan counted many rendered elements under 24 CSS px (305 desktop instances and 310 narrow instances across scene captures). It did not distinguish text links from manipulation targets, so this is a **review lead**, not an accessibility failure count. Keyboard-only traversal, screen readers, contrast computation, focus-state inspection, multiple lab seeds, animation timing, touch accuracy, and browser engines other than bundled Chromium were not tested.

## Cross-reader findings

1. **The probability lab often hides the exact representation behind an initial stage-0 state.** In representative `two-children/filter` and `monty-hall/compare` captures, a very large panel contains only a short heading until the reader unfolds or samples. Controls exist, but the reasoning object is not visible when the scene first makes its claim. This is a blocking issue for the exact conditional-weight comparisons.
2. **Several physics readers are accurate-looking prose sequences without inspectable reasoning representations.** `field-quanta` has only a few isolated cards; `particle-interactions` lacks the cumulative coupling matrix its comparison needs; `quark-confinement` gives no potential, string-breaking, hadronization, or scale-regime representation. Correct static prose can be valid, but these particular relations are the promised explanation and remain asserted rather than worked.
3. **Transfer is commonly prompted rather than evaluated.** The closing scenes often ask a changed question without showing a counterexample, preserving a baseline comparison, or giving explanatory feedback. A prompt is not evidence that the same principle can be applied.
4. **The strongest current explanatory tools are the base-rate table, binary-search stepper, sphere-slice dual view, and orbital viewer.** They synchronize current input and narration and survived changed input/navigation/reset. Their remaining problems are comparison support, small/tightly packed controls or annotations, and missing worked transfer—not state correctness in the exercised paths.
5. **Fit was over-weighted previously.** All scenes fit both requested viewports, but several use most of the fixed scene area as blank space. The absence of clipping does not compensate for missing causal, deductive, or comparison structure.

## `article:statistics.two-children.ko` — 6 scene reviews

| Scene | Verdict | Reasoning and representation/interaction critique | Actual observed tests | Actionable acceptance |
| --- | --- | --- | --- | --- |
| `question` | **adequate** | The opening correctly refuses a unique number and the static procedure contrast supports the need to ask how information arose. Interaction is appropriately withheld here. | D/N, NAV; screenshots `two-children--question--*`. | Retain the no-answer opening; accept only if a reader test can elicit two procedures without seeing later numbers. |
| `model` | **revise** | Prose and figure state the four-case model and caveat, but the interactive lab initially renders stage 0 rather than the four equal branches. The core prior is therefore hidden behind “unfold.” | D/N, NAV, INT-TC. | Show BB/BG/GB/GG and 1/4 weights on scene entry; keep trials optional and the population caveat visible. |
| `filter` | **blocking** | The exact 1/3 denominator is the scene's reasoning, yet the RI capture shows an almost blank lab until interaction. Sampling can illustrate but cannot replace enumeration/normalization. | D/N, NAV, INT-TC, RI (`two-children--filter--narrow.png`); 100 trials persisted and reset to count 0/stage 0. | Render the prior, retained BB/BG/GB branches, and exact 1/3 immediately; use trials only as a labeled empirical supplement. |
| `child` | **blocking** | The prose gives likelihoods, but the scene does not immediately juxtapose them with the filter process. Without visible weights, the move from the same sentence to 1/2 remains an assertion. | D/N, NAV, INT-TC; the 100-trial filter state persisted into this scene as designed. | Show 1, 1/2, 1/2, 0 likelihoods and normalized weights, with direct comparison to `filter`; verify current-process narration after switching. |
| `missing` | **adequate** | A static unknown-policy representation is appropriate and avoids inventing probabilities. The explanatory boundary is clear. | D/N, NAV; screenshots `two-children--missing--*`. | Retain unknown symbols; acceptance needs a reader to name the missing report policy rather than merely repeat “not enough information.” |
| `transfer` | **revise** | It names the general workflow and related topics but does not make the reader execute it or provide rationale for a changed case. | D/N, NAV; screenshots `two-children--transfer--*`. | Add one bounded changed case with an explicit denominator answer/rationale; do not require following another article. |

## `article:statistics.monty-hall.ko` — 7 scene reviews

| Scene | Verdict | Reasoning and representation/interaction critique | Actual observed tests | Actionable acceptance |
| --- | --- | --- | --- | --- |
| `question` | **adequate** | It creates the right policy question and does not leak the prize. | D/N, NAV; screenshots `monty-hall--question--*`. | Retain; reader evaluation should elicit host knowledge/obligation before a number. |
| `protocol` | **adequate** | The static protocol figure enumerates the needed standard assumptions. It would be stronger if omissions visibly altered later weights, but the scene's declarative purpose is met. | D/N, NAV; screenshots `monty-hall--protocol--*`. | Keep every assumption; add explicit linkage to the strategy tree without implying tie-breaking is needed for unconditional switching. |
| `strategy` | **revise** | The canonical prose gives the clean one-loss/two-win derivation, but the lab begins collapsed and emphasizes simulation controls before the exact three cases. | D/N, NAV, INT-MH; seeded sampling exercised. | Display all three exact prize placements on entry; trial controls may follow and must remain labeled empirical. |
| `shortened` | **adequate** | The static two-policy distinction addresses the logical gap without assigning an unknown policy. | D/N, NAV; screenshots `monty-hall--shortened--*`. | Retain policy uncertainty and conventional-completion distinction. |
| `compare` | **blocking** | This is the decisive 2/3-versus-1/2 comparison, but the RI desktop capture is mostly blank. The policy selector and trial buttons do not expose the exact accepted-run weights until action. | D/N, NAV, INT-MH, RI (`monty-hall--compare--desktop.png`); blind mode/count 10 persisted and reset to informed/count 0. | Show side-by-side exact trees/weights on entry, then let policy switching update both exact result and trial frequency. |
| `specific` | **revise** | Prose distinguishes “some goat” from a numbered reveal, but no worked numbered-door likelihood demonstrates when tie-breaking matters. | D/N, NAV; screenshots `monty-hall--specific--*`. | Add one explicit numbered-reveal calculation under a declared tie policy, contrasted with unconditional always-switch success. |
| `close` | **revise** | The recap is sound but contains no changed variant or explanatory feedback, so transfer is unobserved. | D/N, NAV; screenshots `monty-hall--close--*`. | Require the reader to specify a policy and denominator for one new host rule; reveal a rationale without blocking navigation. |

## `article:mathematics.binary-relations.ko` — 6 scene reviews

| Scene | Verdict | Reasoning and representation/interaction critique | Actual observed tests | Actionable acceptance |
| --- | --- | --- | --- | --- |
| `question` | **adequate** | Concrete directed links ground the subject, and the editable relation survives navigation. | D/N, NAV, INT-BR. | Preserve direction labels and ensure initial edges are visible before unfolding. |
| `pairs` | **revise** | Pair and matrix prose is correct, but the active lab shows graph/status rather than synchronized graph–pair–matrix correspondence. | D/N, NAV, INT-BR; toggled edge mask 11→10 persisted. | Toggling one edge must update and highlight the arrow, ordered pair, and matrix cell together. |
| `functions` | **revise** | The lab reports function/non-function, but it does not identify the input with zero or multiple outputs. | D/N, NAV, INT-BR. | Highlight each violating input and let the reader repair it; acceptance includes one valid and two distinct invalid cases. |
| `properties` | **blocking** | The RI narrow capture provides mnemonic cards only. There is no same-set relation to inspect, no universal check, and no witness generation; this teaches labels rather than the property reasoning promised. | D/N, NAV, RI (`binary-relations--properties--narrow.png`). | Add an editable same-set relation and explicit reflexive/symmetric/transitive witnesses or confirmations. |
| `transfer` | **adequate** | The ≤ matrix and 1≤2/¬(2≤1) witness support the counterexample and universal-claim distinction. Interaction is not necessary for this small worked case. | D/N, NAV; screenshots `binary-relations--transfer--*`. | Preserve the highlighted witness and explicitly contrast refutation by one case with proof over all cases. |
| `close` | **revise** | The recap states representational equivalence but does not require translation; the lab still lacks synchronized pair/matrix editing. | D/N, NAV, INT-BR. | Provide one changed relation and verify the reader can translate it across arrows, ordered pairs, and cells. |

## `article:computing.binary-search.ko` — 6 scene reviews

| Scene | Verdict | Reasoning and representation/interaction critique | Actual observed tests | Actionable acceptance |
| --- | --- | --- | --- | --- |
| `question` | **adequate** | Optional prediction, bounded input, sorted-list scope, and stepper create a concrete question. | D/N, NAV, INT-BS. | Keep prediction optional and expose the final 10-comparison maximum only through stepping or an explicit reveal. |
| `observe` | **adequate** | The bar, endpoints, midpoint text, relation, and one-step control support elimination. The RI initial frame is sparse and cannot yet distinguish eliminated/retained regions until clicked. | D/N, NAV, INT-BS, RI (`binary-search--observe--desktop.png`); valid 16/26 step advanced to 1. | After one comparison, visually retain the eliminated region in a muted state and mark the probe; reader must justify the retained side. |
| `explain` | **adequate** | The history and repeated step control expose the invariant and synchronized current narration. | D/N, NAV, INT-BS; changed step persisted into this scene. | Keep full comparison history and verify two-step invariant narration. |
| `double` | **adequate** | The worked 16→32 and 1,000 bounds answer the growth question and state that sorting cost is excluded. | D/N, NAV; screenshots `binary-search--double--*`. | Add a compact side-by-side maximum comparison without overstating asymptotics beyond the bounded model. |
| `missing` | **adequate** | Odd target and terminal empty interval distinguish certified absence from temporary failure. | D/N, NAV; screenshots `binary-search--missing--*`. | Acceptance requires stepping to empty range and preserving “absent” rather than generic failure language. |
| `transfer` | **revise** | The prompt asks about shuffled input, but the representation only generates sorted even lists, so the required counterexample cannot be observed. | D/N, NAV; screenshots `binary-search--transfer--*`. | Add a small shuffled-list counterexample or explicit worked trace showing an incorrectly discarded target. |

## `article:geometry.sphere-slices.ko` — 6 scene reviews

| Scene | Verdict | Reasoning and representation/interaction critique | Actual observed tests | Actionable acceptance |
| --- | --- | --- | --- | --- |
| `question` | **adequate** | The synchronized side/plane views and h control support locating the maximum disk. | D/N, NAV, INT-SS. | Keep same-scale views and require naming h=0 and both viewpoints. |
| `predict` | **adequate** | The slider and live r/area output let the reader test a directional prediction without gating. | D/N, NAV, INT-SS. | Preserve optional prediction; verify monotonic decrease with |h| at fixed R. |
| `explain` | **adequate** | Triangle labels and R=5,h=3 example connect geometry to r=4. | D/N, NAV; screenshots `sphere-slices--explain--*`. | Ensure R, |h|, r remain legible at narrow width and ask for the substitution, not formula recall alone. |
| `mirror` | **adequate** | Signed h changes while r stays equal, directly supporting h² symmetry. | D/N, NAV; screenshots `sphere-slices--mirror--*`. | Acceptance compares +3 and −3 in state, not only prose. |
| `boundary` | **adequate** | RI narrow capture distinguishes the sphere, outside plane, and “no section” state; current narration also distinguishes tangent point. Diagrams and sliders are small on narrow. | D/N, NAV, INT-SS, RI (`sphere-slices--boundary--narrow.png`); h=6 persisted then reset to h=0. | Verify all three states and increase narrow annotation/control legibility without hiding content. |
| `transfer` | **revise** | The reveal supplies one equal-r pair, but the reader cannot preserve two arbitrary states side by side or construct a second pair. | D/N, NAV, INT-SS. | Add paired-state comparison or a “pin current slice” action and explanatory feedback for equal-r constructions. |

## `article:statistics.base-rates.ko` — 6 scene reviews

| Scene | Verdict | Reasoning and representation/interaction critique | Actual observed tests | Actionable acceptance |
| --- | --- | --- | --- | --- |
| `question` | **adequate** | It distinguishes forward and reverse conditionals and withholds the answer. | D/N, NAV, INT-BA. | Keep assumptions editable and the reverse question explicit. |
| `predict` | **adequate** | Prediction is optional and the next observation is named. | D/N, NAV, INT-BA. | Retain no-gate behavior and preserve prediction across the reveal transition. |
| `observe` | **adequate** | The RI table directly exposes 90 true alerts and 495 false alerts and labels them expected counts, not data. | D/N, NAV, INT-BA, RI (`base-rates--observe--desktop.png`). | Preserve the live 2×2 table and make immediate-update behavior visually explicit. |
| `denominator` | **adequate** | Current narration and table assemble 90/585 and distinguish the relevant conditioning set. | D/N, NAV, INT-BA; prevalence 10% persisted into this scene. | Highlight the alert row/numerator and require a denominator explanation. |
| `common` | **revise** | Editable prevalence works, but only the current table is visible; the reader must remember the 1% baseline, weakening the claimed comparison. | D/N, NAV, INT-BA. | Retain or pin the baseline table so changed cells and posterior direction can be compared directly. |
| `transfer` | **adequate** | The inputs support the changed false-alarm case, invalid drafts clear results, and zero-alert undefined status is implemented. | D/N, NAV, INT-BA; 101% invalid draft displayed, 10% recovered, reset restored 1%. | Add before/after emphasis for the false-alert cell; test zero-alert state explicitly in the next review. |

## `article:particle.field-quanta.ko` — 8 scene reviews

| Scene | Verdict | Reasoning and representation/interaction critique | Actual observed tests | Actionable acceptance |
| --- | --- | --- | --- | --- |
| `question` | **revise** | The prose motivates changing particle number but introduces field/state language without an inspectable roadmap. | D/N, NAV. | Add a restrained state-transition schema that previews field, state, mode, and occupation without claiming simulation. |
| `state` | **blocking** | The field-operator versus one-particle-wavefunction distinction is central and cognitively difficult, yet the scene is prose only. | D/N, NAV. | Provide a role-based comparison (object, input, output, interpretation) and a classification check. |
| `mode` | **blocking** | “Free scalar field → independent modes → one oscillator” is asserted without decomposition or worked symbolic relationship. | D/N, NAV. | Add a scoped mode-decomposition representation highlighting one fixed-ω mode and all assumptions. |
| `number` | **revise** | RI narrow capture shows three energy cards, which minimally establish equal steps, but large gaps and unexplained dots weaken the ladder and ground-energy distinction. | D/N, NAV, RI (`field-quanta--number--narrow.png`). | Replace disconnected cards with an ordered energy ladder, label ΔE and predict n=3. |
| `vacuum` | **revise** | Correct prose counters “no field,” but there is no continuity with the occupation ladder to show n=0 as a state. | D/N, NAV. | Reuse the ladder with vacuum selected and state explicitly what energy offset is omitted. |
| `fermions` | **blocking** | The boson/fermion occupancy contrast and spin-qualified orbital exception are compressed into prose with no state-level comparison. | D/N, NAV. | Add a side-by-side occupancy table and a check distinguishing one complete state from one spatial orbital. |
| `change` | **revise** | The reaction card is relevant, but no conservation ledger works the conditions; “must conserve” remains a list. | D/N, NAV. | Add initial/final charge and energy-momentum condition rows without pretending to calculate a rate. |
| `limits` | **blocking** | Virtual internal lines versus tracked particles and free-mode versus interacting-field limits are both central corrections, but no representation tests either. | D/N, NAV. | Add a calculation-term/external-observation comparison and require the reader to classify one misconception. |

## `article:particle.particle-interactions.ko` — 8 scene reviews

| Scene | Verdict | Reasoning and representation/interaction critique | Actual observed tests | Actionable acceptance |
| --- | --- | --- | --- | --- |
| `question` | **revise** | The question is specific, but no persistent comparison frame helps readers accumulate three particles × three interactions. | D/N, NAV. | Introduce an initially incomplete matrix and fill it through the sequence. |
| `electron` | **revise** | Two cards encode charge/color but omit weak participation until later, risking an incomplete profile. | D/N, NAV. | Update the persistent matrix while marking weak as “to be explained,” not absent. |
| `quark` | **adequate** | Charge and color cards plus prose establish simultaneous coupling and reject visible-color meaning. | D/N, NAV. | Integrate with the cumulative matrix and preserve the isolated-quark scope warning. |
| `neutrino` | **adequate** | The neutral-yet-weak contrast is concrete and includes a qualified process example. | D/N, NAV. | Keep “active” and “basic coupling” scope visible; do not imply equal rates. |
| `weak` | **blocking** | Participation versus process allowance/probability is an essential inference boundary, but it is prose only and no case is worked. | D/N, NAV. | Add coupling→conditions→rate stages and ask the reader to reject one invalid “all reactions equally likely” inference. |
| `bosons` | **revise** | Carrier cards provide a useful mapping, but they are disconnected from the particle coupling comparison and the spin distinction is not represented. | D/N, NAV. | Merge carrier mapping with the interaction matrix; keep spin as a quantum label rather than iconography. |
| `higgs` | **blocking** | RI desktop capture is an oversized prose card. The key elementary/composite mass distinction has no comparison and is easy to flatten into “Higgs gives mass.” | D/N, NAV, RI (`particle-interactions--higgs--desktop.png`). | Add a qualitative two-column origin comparison without percentages; require explanation of proton mass beyond valence rest masses. |
| `limits` | **revise** | The prose gives the correct final profiles and exclusions, but readers never reconstruct or apply the comparison. | D/N, NAV. | Present the completed matrix and one changed-particle classification with rationale. |

## `article:particle.quark-confinement.ko` — 9 scene reviews

| Scene | Verdict | Reasoning and representation/interaction critique | Actual observed tests | Actionable acceptance |
| --- | --- | --- | --- | --- |
| `question` | **revise** | The prose corrects the three-bead model, but no representation contrasts valence shorthand with gluon/sea content. | D/N, NAV. | Add a layered, explicitly non-inventory comparison and ask what `uud` does and does not mean. |
| `color` | **adequate** | The text directly rejects visible color and bounds QCD's subject. A graphic could easily mislead, so static treatment is defensible. | D/N, NAV. | Retain the anti-paint warning and add a brief misconception check if any labels are visualized. |
| `gluons` | **revise** | It states self-interaction and correctly denies that this alone proves confinement, but the dependency boundary is easy to miss in prose. | D/N, NAV. | Add a claim map explicitly marking self-coupling as structure, not sufficient proof. |
| `singlets` | **revise** | The quantum-state caveat is strong, but no constrained representation helps distinguish singlet from classical RGB mixing. | D/N, NAV. | Add an abstract state/composition comparison reviewed for quantum accuracy; no fixed colored beads. |
| `separate` | **blocking** | RI narrow capture is prose only. The scoped approximate linear potential is the explanatory relationship but has no axes, regime, or visual boundary. | D/N, NAV, RI (`quark-confinement--separate--narrow.png`). | Add a qualitative V(r) plot with static-heavy-probe and confining-regime labels plus a visible “not all distances/proton law” caveat. |
| `breaking` | **blocking** | The causal answer—pair creation produces new singlet combinations rather than free endpoints—is only asserted. | D/N, NAV. | Add before/after state accounting and require the reader to identify why endpoints are not isolated quarks. |
| `jets` | **blocking** | Parton shower, hadronization, jet, and detector object are distinct layers; prose alone compresses model and observation into one sentence chain. | D/N, NAV. | Add a layered process/evidence diagram that labels modeled and measured stages and avoids literal trajectories. |
| `freedom` | **blocking** | Short-distance small coupling versus long-distance final-state confinement needs a scale comparison; the prose contrast is accurate but not worked. | D/N, NAV. | Add momentum/length regimes and a changed-condition question separating calculability from extractability. |
| `limits` | **revise** | The closing boundaries are careful, but it does not visually or deductively reconnect separation, breaking, hadronization, and asymptotic freedom to answer the opening question. | D/N, NAV. | Summarize the causal chain with explicit evidence/computation/proof labels and ordinary-vacuum scope. |

## `article:quantum.atomic-orbitals.ko` — 8 scene reviews

| Scene | Verdict | Reasoning and representation/interaction critique | Actual observed tests | Actionable acceptance |
| --- | --- | --- | --- | --- |
| `orbit` | **adequate** | The live density view and camera make it possible to distinguish viewpoint change from a trajectory; the prose explicitly denies path/record interpretations. | D/N, NAV, INT-AO. | Retain “not a path/record” in visible copy and test a rotation explanation with readers. |
| `density` | **revise** | The viewer gives a density cloud, but there is no selected-region integration cue; points can still be read as many electrons or observations despite the warning. | D/N, NAV, INT-AO. | Add a bounded region/probability explanation or worked schematic while preserving deterministic finite-grid labeling. |
| `numbers` | **adequate** | Controls enforce supported n/l combinations and the adapted dialogue correctly distinguishes real p/d bases from single m states. | D/N, NAV, INT-AO; changed to 3dxy slice. | Keep invalid options disabled and add one explicit real-combination explanation without overloading the short scene. |
| `nodes` | **adequate** | RI desktop slice visibly exposes the 2s radial node; live metadata reports radial/angular counts and adapted narration follows changed 3dxy state. | D/N, NAV, INT-AO, RI (`atomic-orbitals--nodes--desktop.png`). | Increase annotation/control legibility and require locating both radial and angular examples across two states. |
| `phase` | **adequate** | Signed color legend and surface/slice modes support the charge-versus-sign correction. | D/N, NAV, INT-AO. | Ensure the signed legend remains visible in every mode and add a density-invariance check. |
| `views` | **adequate** | Cloud/slice/surface modes and isovalue control make representation dependence observable; copy explicitly rejects enclosed-probability interpretation. | D/N, NAV, INT-AO. | Acceptance changes the threshold and elicits the correct interpretation; retain grid-relative units. |
| `charge` | **revise** | Z and energy update correctly, but auto-framing makes size comparison memory-dependent; no retained coordinates or side-by-side baseline makes 1/Z visually secure. | D/N, NAV, INT-AO. | Pin extent/energy for Z=1 and changed Z or offer side-by-side numeric comparison while retaining auto-frame warning. |
| `limits` | **adequate** | Scope, grid resolution, finite bounds, and omitted effects are visible and tied to the live viewer. Unsupported n=1/dxy state was rejected without mutation. | D/N, NAV, INT-AO; atomic rejection recorded, reset restored 2pz cloud. | Retain atomic validation and require readers to distinguish analytic model normalization from finite render approximation. |

## Article-level disposition and top acceptance priorities

| Article | Scenes | Blocking | Revise | Adequate | Unverified |
| --- | ---: | ---: | ---: | ---: | ---: |
| two-children | 6 | 2 | 2 | 2 | 0 |
| monty-hall | 7 | 1 | 3 | 3 | 0 |
| binary-relations | 6 | 1 | 3 | 2 | 0 |
| binary-search | 6 | 0 | 1 | 5 | 0 |
| sphere-slices | 6 | 0 | 1 | 5 | 0 |
| base-rates | 6 | 0 | 1 | 5 | 0 |
| field-quanta | 8 | 4 | 4 | 0 | 0 |
| particle-interactions | 8 | 2 | 4 | 2 | 0 |
| quark-confinement | 9 | 4 | 4 | 1 | 0 |
| atomic-orbitals | 8 | 0 | 2 | 6 | 0 |
| **Total** | **70** | **14** | **25** | **31** | **0** |

Priority order follows prerequisite and explanatory impact, not ease of implementation:

1. Make exact probability trees/weights visible on entry for `two-children/filter`, `two-children/child`, and `monty-hall/compare`.
2. Supply the central QCD reasoning chain: scoped potential, string breaking, hadronization/evidence layers, and short-/long-distance regime contrast.
3. Build persistent comparison representations for particle couplings/mass origins and field operator/mode/occupation/fermion limits.
4. Turn relation properties into actual universal checks with witnesses.
5. Add worked changed-condition feedback for transfer scenes and retained before/after comparisons for otherwise strong interactive readers.

## Unresolved review scope

- No external source page or exact locator was opened in this pass; source alignment and scientific correctness remain pending, even where the prose appears careful.
- No rights conclusion was made. Existing rights/review statuses remain unchanged.
- No human reader, accessibility specialist, or subject expert observed the scenes. “Adequate” means the current artifact provisionally meets the proposed scene objective under this audit, not that readers learned it.
- Static-reader interactions beyond Next/Previous/reset were not applicable. The probability labs were tested with seed 42 only. Base-rate zero-alert behavior was inspected in code but not driven in the browser and remains an explicit next test.
- Screenshots establish rendered appearance, not mathematical or empirical truth. Only the 10 RI files received detailed visual interpretation; all 140 were captured and measured.
- The existing build was not regenerated. Publication, expert approval, narration/audio, video timing, and exact build-to-source provenance remain pending.
