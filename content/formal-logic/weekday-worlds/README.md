# Weekday worlds: content and interaction specification

## Goal, source and scope

The article introduces modal logic through the Korean yesterday/tomorrow riddle. Aim for enjoyment and awareness of the concept, not a complete calculus or a literacy/IQ assessment. Classical logic is recommended background, not a navigation prerequisite. Explain only necessary concepts. Avoid premise-set/model-set notation in primary copy when it adds no explanatory value.

Canonical Korean wording, stable blocks and source locators belong to [article.ko.json](article.ko.json), [claims.json](claims.json) and [page.ts](page.ts). The route is `/knowledge/weekday-worlds/`. [Source consultation](../../../docs/SOURCE-REVIEW.md) records the readings and exclusions; claim/source review is independent of implementation tests. The assessment criticism is a proposed editorial inference, not a measured finding or institutional quotation.

The short title is “이걸로 IQ를 재겠다고?”; the full title is “이걸로 IQ를 재겠다고? (어제가 내일이었으면...)”. [cover.svg](cover.svg) is an independently authored editorial composition retaining the supplied meme reference’s riddle, 20-second invitation and weekday choices without retaining its original artwork or former house style. The original pixels/logos are not imported. The user-authorized system redesign replaces the old meme-like appearance with an original editorial cover; preserve the riddle and ungraded challenge framing, not its old palette or shapes. Keep authorship/reference/rights notes in the artwork metadata. The narrow cover uses the full 366px canvas, with at least 14px actual riddle text and 12px choice labels; it does not reserve an empty navigation column. This is title artwork, not a catalog thumbnail; the catalog is text-only.

## Narrative and disclosure

Scene identity determines disclosure on forward/back navigation, direct links and restoration. It never depends on having visited a prior scene or overrides a reader's saved calendar settings. There is no modality checkbox.

| Scene | Visible explanation and interaction |
| --- | --- |
| `question` | Original riddle and optional 20-second attempt; answer or skip leads to reflection within the same page. |
| `conditional` | Simplify explicitly to “만약 어제가 내일이라면, 오늘이 금요일이다.” for explanation; say “가정한 오늘”. |
| `sunday` | Ordinary weekday reasoning. |
| `wednesday` | Contrast Wednesday with Sunday and introduce reality versus an assumed possible world before symbols. No access controls/operators yet. |
| `notation` | Concrete date definitions for A/B and A → B; symbolization permits explicit rule application. |
| `inference` | Brief review of modus ponens/tollens, conjunction introduction/elimination and disjunctive syllogism; not a complete calculus. |
| `nonmodal-proof` | Simplified sentence, symbols, explicit problem-case premise and modulo-7 derivation together. |
| `contexts` | Nonmodal world model: original references, symbols, inferred calendars and presets; no access editor. |
| `modal-comparison` | Only separate concept valuations for P, ◇P and □P; no riddle/equations/presets/editor/expansion/reference link. |
| `alethic` | Apply some/all-accessible-world operators to the riddle's weekday proposition. |
| `modal-expansion` | Full editor, finite disjunction/conjunction expansion and optional reference sheet. |
| `modal-rules` | Brief normal-K basis, theorem-only necessitation and conditional use of T. |
| `modal-systems` | Compare K, D, T, B, S4 and S5 by axiom schemas and frame conditions. |
| `frame-system` | Property checks for the current edited direct relation. |
| `transfer`, `literal`, `conclusion` | Changed target, same-context inconsistency/explosion and interpretation limits. |

Experienced readers may skip notation/inference directly to the worked nonmodal proof. The skip must name its scope and destination. Normal Next still visits every scene. Keep symbols with the simplified sentence after their introduction. `page.ts` owns scene order/ranges; do not duplicate a page count as a maintenance requirement.

The modal introduction has two declared three-world fixtures, all accessible from reality: Sunday/Friday/Monday gives P false, ◇P true, □P false; Friday/Friday/Friday gives all true. These are teaching valuations, not riddle deductions or saved editor worlds. [modal-examples.ts](modal-examples.ts) owns their values; distinct example identities prevent confusion with deleted reader worlds.

## Calendar meaning and proof

Four references independently choose yesterday, tomorrow, consequent today and queried today. With 1–4 stable worlds, enumerate all 7ⁿ weekday assignments satisfying A: tₐ − 1 ≡₇ tᵦ + 1 and B: t꜀ ≡₇ d. Extract a day only if the satisfying set is nonempty and all assignments agree. Report undetermined for multiple candidates and no solution for an empty set. Additional worlds/access edges never add calendar equalities. Legacy sample days are not premises.

The two-world 16-assignment taxonomy is eight contradictory, four repeated target answers, two reversed questions and two real-today inferences. Presets A/B retain real-today as the question and produce Sunday/Wednesday for assumed Friday; C uses reality for all references. These are explicit interpretations, not exhaustive Korean semantics or equally natural readings. Merely reversing the sides of one equality does not give the other reference interpretation.

A → B alone asserts neither A nor B. For the case asked by the simplified problem, assume A as the problem-case premise and derive B by modus ponens. Define ≡₇ as a difference that is an integer multiple of seven. State symmetry, transitivity and same-integer addition; use explicit premise/rule references for lifting h ≡₇ d to h±1 ≡₇ d±1, combining with A, adding ±1, and reducing the constant. Ordinary integer arithmetic/equality rewriting is background; congruence is not integer equality. The forward direction yields t ≡₇ d+2; the reverse direction yields t ≡₇ d−2. The short t/h trace supports the two declared directions and declines unsupported/unconstrained references without resetting input. It is not arithmetic proof search.

An inconsistent same-context constraint set yields a brief classical-explosion note and an in-reader `#evidence` link. The standalone lesson route is retired. Under the contradictory assumptions, bottom elimination derives every weekday proposition; that does not establish the actual real-world day. Do not show this note for a satisfiable but underdetermined case or a merely mismatching legacy sample. The nonempty-model answer policy does not deny classical vacuous consequence.

## Modal meaning

P means “this world's today is the target weekday”. Evaluate P/◇P/□P at the chosen point and its **direct** successors for every satisfying calendar. Show an agreed Boolean, otherwise undetermined; no satisfying calendars suspends verdict extraction. With consistent calendars and empty access, diamond is false and box true. Preserve the legacy sample evaluator and independent fixtures, but do not use saved sample days as visible deductions.

The finite expansion is the disjunction/conjunction of P at exactly the current direct successors; empty expansions are bottom/top. P(w) means evaluating the weekday proposition at w. Modal notation makes the varying list compact; it does not prove classical logic incapable of describing worlds or translate the original Korean wish. No similarity ordering, desire valuation, Korean parser, whole-riddle truth evaluator or modal proof engine is supplied. The inactive wish/counterfactual claim remains identifiable for provenance, without appearing as the current interpretation.

The arbitrary-relation editor uses normal K: classical reasoning, K, modus ponens and necessitation restricted to system theorems, not local assumptions. Defining possibility by duality imposes no frame condition. B means K+T+B. S5 permits disconnected equivalence classes, not only universal access. The default direct edges {(0,0),(0,1),(1,1)} are serial, reflexive and transitive, not symmetric: K/D/T/S4 conditions hold, B/S5 do not. This does not identify that single finite frame's exact logic as S4 or prove completeness. Derived frame checks quantify over all valuations, use all existing IDs/edges, ignore the evaluation point and never silently add closure edges.

## Opening and saved-state compatibility

Start a fresh 20-second attempt on visible question entry. Cover/hidden scenes consume no time. Ready becomes live only on active entry; frozen seek and answered/expired/skipped phases never automatically restart. Count elapsed monotonic time, not callback invocations; leaving pauses and returning resumes a live attempt. Validate restoration before stopping the existing clock. Reset deactivates the adapter before fresh state, preventing a hidden deadline.

An answer shows “왜 그렇게 생각하셨나요?”; expiry/Skip without an answer uses a distinct invitation to consider the solution. Hide the problem, choices, timer, redundant headings and writing field during reflection. Both phases use the main canvas without the fixed explanation band. Retry starts fresh; View Explanation and post-reflection Next go to `conditional`. Initial Next is Skip and consumes the move to reflection rather than advancing scene. The target/answer remain ungraded. Focus the resulting heading.

Reader snapshots store the optional cover flag separately from scientific state. Root/reset shows the cover, direct scene hashes bypass it, and returning to the cover retains edits. Old snapshots without cover restore content. Old `reason` links/scene IDs alias to `question`; saved answered/expired/skipped state restores reflection, while a bare old link opens the problem. Retain the bounded legacy `challenge.reason` text and `example: reason` value without a writing UI.

The interaction's version-3 detached snapshot includes four references, 1–4 worlds, legacy weekday samples, explicit R, evaluation point, choice scope, representation, mode/modeSource, narrowPanel and challenge state. Validate legacy fields even when they no longer control display. Scene owns the active interpretation; representation and narrowPanel do not hide either input or reasoning. Migrate unversioned fixed-rule and version-2 snapshots before atomic validation. Reject duplicates, dangling IDs/edges, malformed versions and invalid input without partial mutation. Independent seek freezes the opening attempt without inherited answer/reason; other comparisons are atemporal. No video renderer is provided.

## World editor and visual identity

Reality is stable ID 0 and cannot be removed; assumptions retain IDs 1–3 regardless of deletion order. General UI says 현실/가정 1–3; formulas use w₀–w₃. The user explicitly authorized replacing the previous palette and shapes. Use blue for reality and teal/purple/cyan for assumptions consistently across references, formulas, rectangular calendar cells, square graph nodes and matrix. Identity color is an accent on white/gray surfaces, not a truth value. Evaluation uses thickness, access uses dashes and truth uses explicit text; color alone must not conflate them. Matrix cells combine source/destination tints with row/column labels.

Adding a world initializes its legacy sample, self-loop and edge from the previous evaluation point; the sample does not become a premise. Removing one removes incident edges and existing-world UI entries, moving affected references/evaluation to reality as disclosed. Presets explicitly restore their example worlds/edges while preserving the target. Edits survive navigation/restoration. W includes every configured world, including unreferenced ones.

Reference/evaluation lists offer absent IDs only as explicit `new:<id>` creation actions. Selecting one atomically creates and assigns it, sorts stable IDs and adds the same edges as Add World. Creation remains possible under direct-successor filtering. Filtering never rewrites an out-of-scope selected reference: retain it as a disabled current option. Existing options identify other numbered expressions using that world; exclude the current expression's own number, but list all references in evaluation choices. Refresh lists after edits/deletion/navigation/restoration. Deleted worlds are absent everywhere except explicit creation actions.

## Layout, controls and alignment

Use the shared reader. Author the desktop workbench against the shared 960×540 logical composition; larger desktop and the [200% capture baseline](../../../docs/DEVELOPMENT.md#local-media-production) scale that composition uniformly, while narrow reading stacks it. Keep input and reasoning together in two columns at the logical desktop baseline. There are no Input/Reasoning tabs. Once introduced, stack white Original/Symbols/Selection panes with internal headings on the left; only Selection scrolls and includes its reset action. Compact reference selectors use the 12px role and at least 28px logical height; primary actions and navigation remain 44px. Selection has one compact `선택:` row beside A/B/C, without duplicate action words.

The four numbered source expressions and target weekday open compact captured DOM choices; no separate reference/target fields in Selection and no Reality-today/per-world-day editor. Target controls have transparent resting backgrounds and visible focus. Source text uses two nonwrapping rows with quotes/punctuation intact. Full labels, keyboard behavior and world creation remain available. Use [inline choices](../../../apps/web/components/experiment/README.md), not OS-only popup capture assumptions.

Enhanced reading uses explicit navigation in Contents; the former invisible hover header is retired so source controls remain unobscured. Non-JavaScript reading retains the natural document header. The explanation's right rail places Contents/Evidence above one horizontal Previous/Next row; each of the three controls is at least 44×44 CSS px, with a 4px gap between rows and navigation buttons. Put knowledge-index and evidence/scope links inside its menu. Navigation help is button-only tooltip/shortcut metadata; teach alignment hover in prose without covering tooltips. Put progress at the heading's right end. Only a scene with a nonadjacent authored forward jump exposes a named skip; it gives that action its own 44px row below the workbench canvas; the title never competes with the skip for width, and scenes without a skip reserve no action row. Keep Next bounds fixed across cover/content/final/restored states. The rebuilt explanation/navigation zone reserves 100 logical pixels of height on desktop and 136 on narrow screens, with a fixed 104px action column and 44px menu/Previous/Next controls. On narrow screens prose wraps beneath the stable action rail instead of leaving its entire column empty. Source and results occupy the space above; typography and separators supply hierarchy. The opening is the explicit exception with no reserved explanation band. Source/prose at the capture baseline are at least 24 output pixels.

Contents is fixed within a 12px viewport margin with bounded scrolling and sticky reachable close; support Escape/outside dismissal and focus restoration. World/access configuration, Selection and reference dialogs may scroll within bounds; source/formulas/ordinary diagrams and navigation must fit without clipping. The world graph uses two readable lines per node (world name and weekday); source/formulas retain the reference assignments. Its natural aspect ratio preserves at least 12px actual labels at 390px. Four modal worlds use one row; long edges arc around unrelated nodes without implying intermediate links. Omit duplicate formulas in a compact graph only when the canonical expression and necessary limits remain visible elsewhere.

The [authored alignment component](../../../apps/web/components/alignment/README.md) supplies full root-to-selected paths in both directions. Keep separate yesterday/tomorrow base/offset roles, consequent/query today and target; A/B letters align with clauses and concrete date definitions. “만약 … 이라면 … 이다” shares one conditional-connective ID with →. Every ≡₇ token shares the entire “≡₇: 같은 요일” glossary node. Selecting a connective/root does not select unrelated descendants. P aligns only with the consequent's weekday proposition, never the entire riddle. Refresh after changes clears stale emphasis; do not add topic-specific hover handlers.

The optional modal-expansion reference sheet compares both date-reference directions, then fixes one equation while comparing successors {reality, assumption 1} versus {assumption 1}. Derive results from existing models with the reader's target; its declared illustrative frames are independent of saved editor state. Keep close outside its bounded scroll body; support Escape and close/invalidate on state/navigation changes. It is supplemental, not another required scene or a claim that modal syntax resolves indexicals.

## Verification obligations and remaining review

Preserve independent calendar, sample-modal and arithmetic fixtures. Exercise all targets/directions, step truth over negative/positive representatives, underdetermination, inconsistent calendars, empty access, arbitrary edited frames and invalid restoration. Clock tests must freeze time or explicitly account for elapsed time. Verify initial/changed/reset/restored input and staged visibility on direct/back navigation.

Use standalone Playwright on the actual static build, including desktop, narrow and 960×540 CSS/DPR 2. Measure real document/internal extents, source rows under every preset, path emphasis in both directions by hover/focus, close/control access, fixed navigation and preserved edits. Screenshots establish presentation only. Immutable source bytes/revisions, independent content/expert review, rights clearance, observed comprehension, DOM video capture/narration and publication remain pending. The source registry and claims own their individual review states.

## Visual revision trial

The [prospective scene plan](slide-plan.json) records every scene's purpose, representation and visible success check for the requested visual revision. Both this topic and Monty Hall use the same proposed criteria; neither is a privileged exemplar or an approved reference work. The global policy remains unchanged pending user assessment of the results.

Compare alternatives before authoring major representations: connected calendars versus a sequence of day cards, and connected accessible worlds with explicit quantified truth tokens versus verdict-only cards. The chosen calendar projection must derive all displayed days from the existing constraint result and label the shared date as equality, never temporal travel or accessibility. Unsupported or nonunique settings receive an explicit unavailable/undetermined representation. Preserve accepted input, color identity, opening timing/reflection, alignment, direct navigation and scientific fixtures. Evaluate source/model correspondence, explanatory inference, craft/readability, interaction and actual rendered use separately; a passing geometry check does not establish visual explanation quality or learner comprehension.

## System redesign contract

The current prospective scene plan rebuilds all 17 scenes from Carbon white-theme foundations: white surfaces, gray canvas, dark text, fine separators and blue primary actions. Use square or 2px corners, 4/8/16/24 spacing and 12/14/16/20/28/40 logical type roles. Replace the accumulated visual rules rather than preserving the former appearance through overrides. Graph geometry, cover artwork, calendars, menus, challenge and proof sheets share this system. Models, source claims, alignment IDs, opening/reflection timing, saved-state validation and the complete default scene order remain unchanged. Desktop is a 960×540 composition with uniform viewport scaling; narrow is 390×844. Existing fixed Next bounds and 44px action controls remain observable contracts. Rendering, accessibility, content/expert review and learner evidence remain separate pending checks.
