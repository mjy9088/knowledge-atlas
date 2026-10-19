# Retrospective scene-purpose inventory: ten other readers

## Status and provenance

- **Date:** 2026-10-18
- **Reviewer:** OpenAI GPT-5.6-SOL acting as a provisional editorial/runtime reviewer
- **Origin:** user feedback that prior quality estimates were too generous
- **Scope:** the 10 registered readers and 70 scenes listed below
- **Source composite SHA256:** `d990c5a8b023af66610af321fdd91027cad3b469297f0ac1a44783a5d7c3118b` (the 30 scoped `page.ts`, `article.ko.json`, and `claims.json` files plus the shared controller and five applicable adapters, sorted by path before hashing)
- **Rendered build-manifest SHA256:** `b4ae9daa844c699d63553eac5fea0bca10b629decfc98b96c3b98417feca57d1` (`dist/build-manifest.json`, served at `http://localhost:4174`)
- **Evidence SHA256:** `98e55d969de14058ce50df5ce3d1a4eae7ee3e19b212e4114082c821b9974a5a` (`test-results/content-quality/other/audit.json`)

This is a **retrospective proposal** of what each already-authored scene needs to accomplish. It is not evidence that these purposes were approved before authoring, not an approval of the present content, and not a replacement for the canonical articles, claims, topic specifications, or accepted human edits. Proposed changes must preserve stable IDs, scientific assumptions, source/review status, and accepted prose unless a human accepts an explicit diff.

## Evaluation frame

“Observable success” means behavior or reasoning that an evaluator could ask a reader to demonstrate; it is not a claim that comprehension was observed in this audit. “Necessary representation/interaction” names the least representation that makes the reasoning inspectable. Static prose is allowed when manipulation adds nothing, but fit and factual correctness alone do not establish explanatory value.

## `article:statistics.two-children.ko` — 6 scenes

| Scene ID | Subject | Retrospective proposed purpose | Observable success | Necessary representation or interaction, with justification |
| --- | --- | --- | --- | --- |
| `question` | Ambiguous “at least one boy” information | Create the need to ask how the information was produced before assigning a conditional probability. | Reader names at least two plausible information procedures and withholds a unique numerical answer. | Side-by-side procedure paths ending in the same sentence; the contrast, not a numerical reveal, establishes the ambiguity. |
| `model` | Equiprobable independent two-child teaching model | Declare the four ordered outcomes and separate this model from population data. | Reader lists BB, BG, GB, GG with equal prior weights and states the assumptions. | Four equally weighted branches with visible model caveat; interaction may unfold branches but must show the baseline immediately. |
| `filter` | Family-level filtering | Work the 1/3 result by retaining families that answer yes. | Reader identifies BB, BG, GB as the denominator and computes one favorable case out of three. | A visible prior-to-filter-to-normalize flow; seeded trials may reinforce it but cannot replace the exact enumeration. |
| `child` | Uniformly selected-child observation | Show why observation likelihoods reweight BB, BG, GB and produce 1/2. | Reader assigns likelihoods 1, 1/2, 1/2, 0 and explains why the survivors are not equiprobable. | Likelihood-weighted branches next to the family-filter case; direct process switching is meaningful because the same sentence yields different weights. |
| `missing` | Unspecified voluntary-report policy | Establish that truthful reporting alone does not determine the posterior. | Reader identifies the missing family-dependent report probabilities and refuses to set them equal without a rule. | A symbolic table with unknown report probabilities; no fabricated simulation is appropriate because the policy is unknown. |
| `transfer` | General observation-process workflow | Transfer the sequence “prior population → process → observation → normalized denominator” to Monty Hall and alarms. | Reader applies all four steps to one new case and names which denominator changes. | A reusable process diagram plus one changed-case prompt with rationale; links alone do not test transfer. |

## `article:statistics.monty-hall.ko` — 7 scenes

| Scene ID | Subject | Retrospective proposed purpose | Observable success | Necessary representation or interaction, with justification |
| --- | --- | --- | --- | --- |
| `question` | Apparent 1/2 after one door opens | Create uncertainty about the host policy rather than reveal the answer. | Reader asks what the host knows and is required to do. | Three-door state with policy deliberately marked unknown; avoid prize revelation. |
| `protocol` | Standard Monty protocol | Make every assumption needed for the 2/3 switching result explicit. | Reader states uniform prize placement, informed host, forced goat reveal, and switch offer. | Protocol checklist connected to a branch tree so omissions visibly change the experiment. |
| `strategy` | Unconditional always-switch success | Derive 2/3 from “initially wrong” rather than slogan or sample frequency. | Reader maps the three prize placements to one loss and two wins. | Exact three-case enumeration visible before or alongside seeded trials; trials are secondary evidence. |
| `shortened` | Policy omitted from a shortened statement | Distinguish a conventional completion from what the wording entails. | Reader explains why “a goat was opened” does not imply “the host always opens a goat.” | Two causal protocols ending in the same observation; unknown policy must remain unknown. |
| `compare` | Informed versus blind reveal | Show that conditioning on a goat reveal gives 2/3 or 1/2 under different likelihoods. | Reader compares accepted-run weights and computes both denominators. | Side-by-side exact weighted trees, with optional policy switch and seeded frequencies; a blank stage is insufficient. |
| `specific` | Any goat versus a particular door | Separate unconditional strategy success from a posterior conditioned on a numbered reveal. | Reader states when tie-breaking affects the posterior and when it does not affect always-switch success. | Event labels for “some goat” and “door 3 goat” plus host tie probabilities; no unqualified door diagram. |
| `close` | Procedure-first conditional reasoning | Consolidate the workflow without forcing a number when policy is absent. | Reader can specify a policy, observation event, and resulting denominator for a fresh variant. | Compact process checklist and changed variant; a recap sentence alone does not demonstrate transfer. |

## `article:mathematics.binary-relations.ko` — 6 scenes

| Scene ID | Subject | Retrospective proposed purpose | Observable success | Necessary representation or interaction, with justification |
| --- | --- | --- | --- | --- |
| `question` | Directed connections between two sets | Ground a relation in concrete directed links. | Reader recovers all three links and preserves direction. | Editable bipartite arrows with immediate visible edges; direction is the concept. |
| `pairs` | Ordered-pair and matrix encodings | Establish correspondence among arrows, ordered pairs, and table cells. | Reader toggles one edge and updates the pair set and exactly one matrix cell. | Synchronized graph, pair set, and matrix; the current lab exposes graph/pairs but needs explicit correspondence. |
| `functions` | Functions as special relations | Explain the exactly-one-output condition without implying all relations are functions. | Reader constructs one function and one non-function and identifies the violating input. | Per-input out-degree highlighting with editable edges; binary status alone hides the reason. |
| `properties` | Reflexive, symmetric, transitive predicates | Turn definitions into universal checks over a same-set relation. | Reader identifies a witness for each failed property or confirms every required case. | Editable same-set graph/matrix with witness highlighting; mnemonic cards alone test vocabulary, not checking. |
| `transfer` | Counterexample to symmetry of ≤ | Demonstrate why one counterexample refutes a universal property while examples cannot prove it. | Reader points to 1≤2 and ¬(2≤1), and explains the proof burden difference. | Small ≤ matrix with highlighted witness and a separate “all cases” requirement. |
| `close` | Representation invariance | Consolidate that arrows, pairs, and table entries encode the same subset of A×B. | Reader translates a changed relation across all three forms without losing order. | Linked highlighting or an editable translation task; a static recap should still expose correspondence. |

## `article:computing.binary-search.ko` — 6 scenes

| Scene ID | Subject | Retrospective proposed purpose | Observable success | Necessary representation or interaction, with justification |
| --- | --- | --- | --- | --- |
| `question` | Search in 1,000 sorted even values | Elicit a comparison-count prediction and define the counted operation and sorted precondition. | Reader predicts optionally, then reports the observed maximum as 10 comparisons under the stated scope. | Stepper with candidate count and comparison history; prediction must not gate progress. |
| `observe` | One comparison eliminates one side | Make the order-based exclusion inference visible. | After comparing with the midpoint, reader identifies the retained side and justifies deletion of the other side. | Bar must distinguish retained, probed, and eliminated ranges after one step. |
| `explain` | Repeated invariant | Explain that the target, if present, remains inside the candidate interval until equality or emptiness. | Reader narrates the invariant across at least two steps. | Step history with midpoint and relation at each step; current controls are meaningful. |
| `double` | Logarithmic worst-case growth | Compare 16→32 and 1,000 without suggesting doubled work. | Reader reports 5→6 and maximum 10 for 1,000 and states sorting cost is excluded. | Size presets or editable size with computed maximum and a compact comparison table. |
| `missing` | Certified absence | Distinguish exhausted candidates from “not found yet.” | Reader steps to an empty interval for target 25 and explains why that certifies absence. | Empty-range terminal state and full comparison history; no early failure wording. |
| `transfer` | Necessity of sorted order | Test whether the elimination rule transfers to a shuffled list. | Reader gives a counterexample showing the discarded half may contain the target. | A small shuffled-list counterexample or reorder control; the present sorted-only bar cannot demonstrate failure. |

## `article:geometry.sphere-slices.ko` — 6 scenes

| Scene ID | Subject | Retrospective proposed purpose | Observable success | Necessary representation or interaction, with justification |
| --- | --- | --- | --- | --- |
| `question` | Largest planar section of a solid sphere | Distinguish side view from cutting-plane view and locate the maximum disk. | Reader moves h and identifies h=0 as the maximum while naming the two views. | Synchronized same-scale side and plane views with h slider. |
| `predict` | Slice shrinks away from center | Elicit and test a directional prediction. | Reader predicts then shows r decreases as |h| increases at fixed R. | h slider and live r/area output; prediction remains optional. |
| `explain` | Pythagorean derivation | Connect geometric lengths to r²+h²=R² and work R=5,h=3→r=4. | Reader labels R, |h|, r on the triangle and reproduces the calculation. | Legible right triangle over the side view plus numerical output. |
| `mirror` | h↔−h symmetry | Show that signed position changes while size does not. | Reader compares +3 and −3 and explains the h² dependence. | Mirrored plane positions with equal r/area readout. |
| `boundary` | Disk, tangent point, and empty intersection | Distinguish |h|<R, =R, and >R despite two zero-area outcomes. | Reader produces all three states and names their different intersections. | Slider crossing the boundary with explicit state labels; the current dual view is appropriate if large enough. |
| `transfer` | Non-uniqueness of sphere size from one disk | Demonstrate that different (R,h) pairs can yield the same r. | Reader constructs two pairs with equal r and rejects unique reconstruction. | Paired-state comparison or retained values; the existing reveal gives one witness but should support construction. |

## `article:statistics.base-rates.ko` — 6 scenes

| Scene ID | Subject | Retrospective proposed purpose | Observable success | Necessary representation or interaction, with justification |
| --- | --- | --- | --- | --- |
| `question` | Reverse conditional probability | Separate P(alert|defect) from P(defect|alert). | Reader states that 90% sensitivity alone does not answer the reverse question. | Labeled conditional directions and editable assumptions without revealing the result. |
| `predict` | Optional prediction under a 1% base rate | Make the likely misconception explicit before showing counts. | Reader records or skips a prediction and names the comparison to inspect next. | Optional prediction control; no progress lock. |
| `observe` | Expected 2×2 counts | Convert three rates into 90 true alerts and 495 false alerts per 10,000. | Reader locates both alert cells and distinguishes expected counts from observations. | Live contingency table with assumptions and “model, not data” caption. |
| `denominator` | Alert-conditioned denominator | Derive 90/(90+495), not 90/100 or 90/10,000. | Reader identifies all alerted products as the denominator and computes about 15.38%. | Highlighted alert row and explicit numerator/denominator assembly. |
| `common` | Base-rate shift at fixed detector rates | Show how prevalence changes the posterior. | Reader changes 1%→10%, identifies changed cells, and explains the direction. | Persistent editable rates and side-by-side or before/after counts; single current table weakens comparison. |
| `transfer` | Reduced false-alarm rate | Test changed-condition reasoning, including undefined zero-alert cases. | Reader predicts which cell falls, then explains the new denominator and handles zero alerts as undefined. | Before/after table or retained baseline plus invalid-state feedback; editable controls are essential. |

## `article:particle.field-quanta.ko` — 8 scenes

| Scene ID | Subject | Retrospective proposed purpose | Observable success | Necessary representation or interaction, with justification |
| --- | --- | --- | --- | --- |
| `question` | Field/state account of changing particle number | Motivate why fixed little-ball inventories are insufficient. | Reader states the question without claiming QFT replaces quantum mechanics. | A restrained state-transition schema; prose alone may open the question but should expose the coming objects. |
| `state` | Field operator versus one-particle wavefunction | Prevent conflating two spatially described mathematical objects. | Reader categorizes “operator on states” and “single-particle amplitude” correctly. | Two-column comparison with domain/role, not decorative waves. |
| `mode` | One free scalar mode | Reduce the field to one independent oscillator-like mode under explicit assumptions. | Reader names free, scalar, one-mode, and fixed ω restrictions. | Mode-selection diagram or symbolic decomposition highlighting one mode; no simulation claim. |
| `number` | Bosonic occupation ladder | Work n=0,1,2 and equal ΔE=ℏω increments above the ground state. | Reader predicts the next level and distinguishes ΔE from absolute vacuum energy. | Ordered energy ladder with n and ΔE; three disconnected cards are only a partial representation. |
| `vacuum` | Zero occupation versus absent field | Correct the misconception that n=0 deletes the field. | Reader explains vacuum as a state and states what was subtracted in the displayed energies. | Same ladder with vacuum level and explicit “field remains” annotation. |
| `fermions` | Boson/fermion occupancy contrast | Prevent applying 0,1,2,… occupancy to one complete electron state. | Reader explains the spin-qualified two-electron orbital case without contradicting exclusion. | Side-by-side boson-mode and fermion-state occupancy table. |
| `change` | Number-changing interaction and conservation | Show that interactions connect sectors while preserving required quantities. | Reader balances the displayed e⁻+e⁺→γ+γ electric charge and names other conditions. | Initial/final ledger for charge, energy, and momentum; equation alone does not work the conditions. |
| `limits` | Internal lines and free-mode limits | Block literal virtual-particle trajectories and overgeneralization to interacting fields. | Reader distinguishes computational internal lines from detected tracks and states the model boundary. | Labeled “calculation term vs measured external state” comparison; no decorative Feynman diagram. |

## `article:particle.particle-interactions.ko` — 8 scenes

| Scene ID | Subject | Retrospective proposed purpose | Observable success | Necessary representation or interaction, with justification |
| --- | --- | --- | --- | --- |
| `question` | Coupling structure, not size | Frame electron/up-quark/active-neutrino comparison by charges and couplings. | Reader predicts that neutral need not mean noninteracting. | Empty comparison matrix whose rows are filled over subsequent scenes. |
| `electron` | Electron couplings | Establish electric charge, no color charge, and weak participation without premature omission. | Reader marks electromagnetic and weak, not direct gluon, coupling. | Persistent three-particle × interaction matrix; isolated cards hide the accumulating comparison. |
| `quark` | Up-quark couplings | Show simultaneous electromagnetic, strong, and weak participation and define color as a quantum label. | Reader fills all three couplings and rejects visible-color interpretation. | Same matrix plus charge labels; no free-isolated-quark depiction. |
| `neutrino` | Active-neutrino weak coupling | Refute “neutral means no interaction.” | Reader marks weak only within the scoped basic comparison and cites a possible weak process. | Matrix update plus one qualified process example. |
| `weak` | Participation versus process probability | State that all three participate weakly while rates require further conditions. | Reader distinguishes a coupling classification from an allowed/equally likely reaction claim. | Two-stage diagram: coupling exists → process-specific conditions/rate; prose-only distinction is fragile. |
| `bosons` | Gauge carriers versus matter fermions | Map electromagnetic/strong/weak to photon/gluon/W,Z and separate spin classes. | Reader completes the mapping and rejects literal spinning-ball imagery. | Interaction-carrier table integrated with the comparison matrix. |
| `higgs` | Elementary versus composite mass | Prevent “Higgs gives all mass” by contrasting elementary masses and proton QCD energy. | Reader explains why proton mass is not the sum of three quark masses. | Explicit two-column mass-origin comparison; no unsupported quantitative pie chart. |
| `limits` | Scoped Standard Model summary | Consolidate the three coupling profiles and exclude gravity/rates. | Reader reconstructs the matrix and states at least two boundaries. | Completed matrix with scope labels and a changed-particle prompt. |

## `article:particle.quark-confinement.ko` — 9 scenes

| Scene ID | Subject | Retrospective proposed purpose | Observable success | Necessary representation or interaction, with justification |
| --- | --- | --- | --- | --- |
| `question` | What it means to remove one proton constituent | Replace the three-bead proton premise with a partonic/QCD question. | Reader states that uud is valence shorthand and includes gluons/sea components. | Layered “valence shorthand vs fuller state” comparison; never a literal fixed inventory. |
| `color` | Color charge | Define the quantum label and QCD domain while rejecting visible-color analogy. | Reader identifies color as a basis label relevant to strong interactions. | Symbolic labels with an explicit anti-paint legend; prose may suffice only if the misconception check is explicit. |
| `gluons` | Gluon self-interaction | Distinguish non-Abelian self-coupling from a proof of confinement. | Reader states both facts without inferring the second from the first. | Claim-dependency diagram marking “important structure” but “not sufficient proof.” |
| `singlets` | Observable hadrons as color singlets | Explain singlet states without fixed RGB beads. | Reader classifies hadron examples as overall singlets and rejects classical color mixing. | Abstract combination/state representation with caveat; not a paint or bead animation. |
| `separate` | Static heavy-probe potential | Explain approximate linear energy growth only in its regime. | Reader reads a qualitative V(r) curve, identifies axes/regime, and states it is not an all-distance proton law. | Scoped qualitative potential plot; the relationship is otherwise only asserted. |
| `breaking` | Dynamical pair creation and string breaking | Show why added energy can produce new hadrons rather than isolated endpoints. | Reader follows initial probes → pair creation → two singlet combinations. | Before/after state diagram with conservation/scope labels; this is the central causal step. |
| `jets` | Hadronization and detector objects | Connect a hard parton to a jet of measured hadrons without inventing trajectories. | Reader distinguishes parton-level shorthand, hadronization model, and detector objects. | Layered process/evidence diagram with model boundary, not an event simulation. |
| `freedom` | Asymptotic freedom versus extraction | Separate short-distance weak effective coupling from long-distance final states. | Reader places asymptotic freedom and confinement on different scale regimes. | Momentum/length-scale comparison; a single prose contrast is easy to misretain. |
| `limits` | Evidence, computation, and proof boundaries | Answer the opening question while preserving ordinary-vacuum and proof limits. | Reader gives the qualitative answer and names what was not simulated or proved. | Summary chain linking the prior four mechanisms and explicit exclusions. |

## `article:quantum.atomic-orbitals.ko` — 8 scenes

| Scene ID | Subject | Retrospective proposed purpose | Observable success | Necessary representation or interaction, with justification |
| --- | --- | --- | --- | --- |
| `orbit` | Orbital versus classical trajectory | Replace an orbit path with a spatial quantum-state interpretation. | Reader states that points are not time-ordered positions and rotation changes only viewpoint. | Deterministic density view with “not a path/record” labeling and camera rotation. |
| `density` | ψ, |ψ|², and region probability | Explain what density samples mean before shape interpretation. | Reader distinguishes amplitude, density, and integrated region probability. | Cloud plus a selected region or explicit integration cue; point density alone can look like particles. |
| `numbers` | n, l, and real s/p/d bases | Relate controls to supported states without equating real directions to single m values. | Reader selects valid states and explains why pₓ/pᵧ are real combinations. | State controls and responsive shape; invalid l≥n options remain disabled. |
| `nodes` | Radial and angular nodes | Make zero-density sets visible and connect counts to n−l−1 and l. | Reader locates a node in a slice and matches it to the computed counts. | Slice mode with legible zero regions and live node metadata. |
| `phase` | Signed amplitude colors | Prevent interpreting two colors as two charges while preserving relative-sign information. | Reader changes view/overall sign conceptually and explains why density is unchanged. | Signed slice/surface legend; cloud brightness alone cannot teach phase. |
| `views` | Cloud, slice, and isosurface conventions | Compare representations and expose threshold dependence. | Reader changes the isovalue and explains why it is neither a boundary nor enclosed probability. | Mode switch, threshold control, and persistent state metadata. |
| `charge` | Z scaling and auto-framing | Show 1/Z length and −Z²/(2n²) energy scaling without visual-size deception. | Reader compares coordinates/energy for Z=1 and 2 and notes auto-framing. | Retained numerical extent/energy or side-by-side comparison; camera framing alone is misleading. |
| `limits` | Model and rendering boundary | Separate analytic normalized orbitals from finite-box/grid rendering and excluded physics. | Reader lists the one-electron fixed-nucleus scope and at least two omitted effects. | Current viewer plus explicit resolution/bounds and model checklist; no added decorative interaction. |

## Unresolved scope

- This inventory does not verify external source bytes, claim locators, rights, scientific correctness, expert approval, timing, narration, accessibility with assistive technology, or publication readiness.
- The audit did not edit canonical Korean prose, claim IDs, model fixtures, topic specifications, or accepted human changes.
- Reader comprehension, misconception frequency, and transfer success require human evaluation; the success statements above are proposed tests.
- The static build was already running and was not rebuilt. Its manifest hash identifies the reviewed artifact but does not prove that every served byte matches current source.
