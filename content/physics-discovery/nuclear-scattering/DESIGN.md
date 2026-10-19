# Nuclear-scattering figure design contract

## 1. Scope and direction

This contract extends the shared paper-and-ink reader with four original static schematics for `apparatus`, `pattern`, `inference`, and `transfer`. The memorable relationship is epistemic: the apparatus measures scintillation directions, the angular pattern is the observation, and near/far paths are a later illustrative model used to interpret that pattern. No figure is a photograph, source-figure adaptation, historical apparatus reconstruction, measured trajectory, simulation, scale drawing, or dataset.

The seven stable scene IDs, three existing claim IDs, `needs-content-review` article status, `planned` 168-second timing, and `review-required` status remain unchanged. The figures add no numerical event counts, proportions, nuclear dimensions, historical path coordinates, or claim that a detector saw a nucleus.

## 2. Reader and accessibility constraints

- Primary reader: a Korean-speaking learner who knows basic charge and angles but may mistake a drawn path for a measured microscopic trajectory.
- Every distinction carried by color is repeated through labels, arrow direction, grouping, line style, or geometry.
- Every SVG has a Korean title and description; page metadata supplies nonempty alternative text and a caption that identifies the representation as original and illustrative.
- Essential SVG labels use at least 22 units in a `560 × 360` view box, or 24 units in a `600 × 380` view box. Labels stay few, horizontal, and outside paths.
- Topic-scoped Korean prose uses `word-break: keep-all`, `overflow-wrap: anywhere`, and `text-wrap: pretty`. No shared CSS is changed.
- Static framing/history cards use 24px text with 12×16px padding on desktop and 17px text on narrow layouts, so compact event phrases remain readable rather than fragmenting inside oversized cards.
- Persistent caveats remain visible in the figure or caption. They are not hidden in hover states or optional disclosures.

## 3. Existing visual system

Reuse the shared reader palette and borders-only depth strategy: paper `#f6f8f0`, surface `#ffffff`, ink `#293f35`, structure green `#365c42`, observation amber `#a56d30`, line `#d5dfcc`, and muted ink `#526b58`. Coordinates and spacing follow a 4-unit rhythm; panels use 12–16-unit radii and no shadows. Type inherits the reader's Korean stack.

The apparatus and inference figures use `viewBox="0 0 600 380"`; pattern and transfer use `viewBox="0 0 560 360"`. All scale fluidly without clipping, internal scrolling, or hidden overflow at the reader's approximately 390 px narrow slot and supported FHD layouts.

## 4. Figure primitives

### Apparatus and angle coverage

The canonical prose separates early work from the depicted apparatus: Rutherford and Geiger counted zinc-sulfide scintillations at different dispersion angles in 1907–1908, and Geiger and Marsden investigated foil thickness and backward scattering in 1908–1909. The figure is explicitly a refined 1912–1913 follow-up example, not a composite reconstruction of all stages. A collimated alpha source points along the incident-direction baseline to a thin foil. One zinc-sulfide screen and microscope assembly is solid at 0°; translucent ghost positions at 90° and 140° plus a rotation arc show where that same assembly moves. Ghosts are labeled as alternative positions, never simultaneous detectors. The screen records scintillation counts by direction; it does not image the nucleus. A persistent note says thin foil limits, but does not eliminate, multiple scattering.

### Qualitative angular pattern and model comparison

One observation band shows many direction marks clustered near 0°, fewer sideward marks, and a rare backward-direction mark without a scale, bins, counts, percentages, or histogram axis. A separate comparison band contrasts diffuse-charge and localized-charge consequences. It states only qualitative compatibility: diffuse charge favors accumulated small deflections, while a localized strong center can also account for rare large-angle events under the thin-foil condition.

### Illustrative near/far model paths

Two labeled paths around a model center show a far pass with small deflection and a near pass with strong deflection. Dashed lines, an explicit `MODEL` label, and a persistent `측정 궤적 아님` caveat distinguish these from measured trajectories. The inference ledger states: distribution constrains charge concentration; charge sign is not fixed by these angles alone; the positive center is adopted with other evidence. No repulsive-force arrow is presented as the sole historical sign inference.

### Angular acceptance transfer

The same authored event-direction rays appear in two aligned panels. The broad panel is conceptual coverage within the depicted scattering plane, not a perfect all-solid-angle or 4π detector. It marks every authored in-plane ray as seen; narrow forward acceptance keeps only rays inside the forward wedge and renders the unchanged side/back rays as outside acceptance. Masking changes visibility only: ray directions and endpoints are identical between panels, and `unseen` never means zero events.

## 5. Primitives and states

- **Figure frame:** original SVG, visible title, concise caption, and persistent scope line.
- **Direction ray:** origin at the foil, arrowhead away from the foil, semantic `data-angle` in degrees, and unchanged geometry when reused in transfer.
- **Acceptance wedge:** a labeled angular region centered on 0°; broad coverage means the depicted scattering plane only, and the narrow wedge masks observation status rather than deleting or rotating events.
- **Epistemic band:** explicit `관찰`, `모형`, or `한계` heading. Observation and model consequences never share an unlabeled panel.
- **Static state:** all comparisons are simultaneous. There is no topic-specific input, hidden state, animation, quiz gate, reset, restoration, or invalid-input branch.

## 6. Retrospective proposed seven-scene plan

This plan governs the revision before figure production. It reconstructs proposed intent for existing content; it is not an original author decision, learner evidence, scientific approval, or completed review.

| Scene ID | Canonical content / question resolved | Prerequisite | Objective and observable success check | Representation choice |
| --- | --- | --- | --- | --- |
| `question` | Question block; why mostly forward with rare large-angle events matters. | Everyday meaning of forward and backward directions. | Reader states that the whole qualitative angular pattern, not a single dramatic event or numerical proportion, creates the explanatory problem. | Existing static cards suffice for framing; a particle picture here would leak the later model and invite trajectory claims. |
| `apparatus` | Apparatus block plus observation/history claims; what was sent, changed, and counted. | Incident direction from the question scene. | Reader distinguishes early 1907–1909 angle/thickness/back-scattering work from the refined 1912–1913 example, identifies one rotatable zinc-sulfide screen-microscope assembly, defines 0° from the incident direction, and says the screen counted directions rather than seeing a nucleus. | Original apparatus schematic shows one solid assembly, two ghost positions, and a rotation arc; it does not imply simultaneous detectors or reconstruct all early apparatus. Thin foil limits rather than eliminates multiple scattering. |
| `pattern` | Pattern block plus observation/inference claims; which qualitative consequences distinguish models. | Apparatus and angular reference. | Reader explains mostly-forward, some sideward, and rare backward observations without inventing counts; contrasts diffuse and localized charge consequences under the thin-foil condition. | Original two-band static comparison keeps observation separate from model consequences; no sourced histogram or fictional dataset is introduced. |
| `inference` | First five inference sentences, including the separately scoped sign hints; what near/far geometry can and cannot support. | Qualitative distribution and model comparison. | Reader labels near/far paths as illustrative model paths, infers concentration rather than sign from the distribution, and says positivity uses other evidence. | Original model-path schematic plus inference ledger; dashed paths and persistent caveat prevent measured-trajectory reading. |
| `empty-space-limit` | Final inference sentence; scope of “mostly empty.” | Strong-deflection region from the model scene. | Reader restates the phrase as low strong-deflection probability for this probe, not literal vacuum or removal of electrons. | Existing limit cards are more direct than another atom picture, which would imply unsupported scale or composition. |
| `history-limit` | History block and history claim; different epistemic roles across 1908–1913. | Observation/model distinction already established. | Reader orders 1908–09 observation, 1909–11 model work, and 1912–13 quantitative tests, and rejects an inevitable single-eureka path to later particle physics. | Existing timeline cards suffice because the mechanism is role separation, not spatial geometry; dates remain qualitative historical anchors. |
| `transfer` | Transfer block; what a narrow forward detector misses. | Apparatus acceptance and same qualitative event directions. | Using identical rays, reader identifies which side/back events become unseen under narrow forward acceptance, states that missing is not zero, and does not mistake broad in-plane coverage for a perfect 4π detector. | Original paired acceptance figure holds event directions fixed while changing only conceptual in-plane coverage; no quiz is needed because this is worked exposition, not assessed performance. |

## 7. Verification and review boundary

Independent fixtures must compute 0° forward, 90° side, and greater-than-90° backward classification from actual ray geometry; verify that acceptance masking preserves every ray direction; and inspect near/far path deflection geometry rather than metadata alone. Page wiring must preserve all seven IDs and use figures only for the four named scenes.

The lead owns production build and browser execution. Browser QA must inspect all seven scenes at 390 × 844 and 1920 × 1080, measure document/internal scroll and content/control bounds, and exercise direct scene navigation plus generic reader reset/restoration/invalid-state behavior where the shared reader exposes it. Because this topic has no scientific input or topic adapter, tests must not invent 44 controls or fake topic state; the lead should reconcile any external control-count requirement against the actual rendered contract.

Source checks, unit fixtures, and screenshots cannot establish nuclear-physics correctness, historical completeness, learner understanding, assistive-technology behavior, exact source revision, rights clearance, audio readiness, publication approval, or measured 168-second narration. Those remain explicitly pending.
