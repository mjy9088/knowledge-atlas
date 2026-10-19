# Logic content purpose inventory

## Status and provenance

This is a retrospective **proposed-purpose** inventory, not evidence of pre-existing approved intent. It reconstructs the most defensible job for each current scene/section from the canonical article text, page metadata, topic specifications, and the rendered static build. It does not approve weekday-worlds as a gold standard and does not add scientific verification.

- Review date: 2026-10-18
- Reviewer: OpenAI `gpt-5.6-sol` operating as Sisyphus-Junior
- User-feedback origin: the initiating audit request stated that the user was dissatisfied with the content, including weekday-worlds, and required separate purpose, learning/interaction, and visual review.
- Scope-source bundle SHA256: `ab53342f325317c4ed62dd6381d22cf873acec7e1b51b80b7bad07c6812145df` (ordered hash list of the seven scoped article/page pairs plus `content/formal-logic/explosion/episode.ts`)
- Static build-manifest SHA256: `b4ae9daa844c699d63553eac5fea0bca10b629decfc98b96c3b98417feca57d1`
- Repository revision inspected: `79451861aa3dbe4d33f8c89c00d25f47095199b4`
- Build served: existing `dist/` at `http://127.0.0.1:4174`; no build was run.
- Review state retained: claims remain draft/source-aligned as recorded by their owners; articles remain `needs-content-review`; source snapshots, exact revisions, expert approval, rights clearance, publication approval, and actual comprehension remain pending.

## Coverage

| Surface | Proposed-purpose entries |
| --- | ---: |
| `article:logic.weekday-worlds.ko` | 17 |
| `article:logic.consistency.ko` | 4 |
| `article:logic.paraconsistent.ko` | 7 |
| `article:set.zfc.ko` | 6 |
| `article:set.ch-independence.ko` | 6 |
| `article:computing.curry-howard.ko` | 8 |
| `article:computing.lambda-calculus.ko` | 8 |
| `lesson:logic.explosion.short.ko` | 12 |
| **Total** | **68** |

## `article:logic.weekday-worlds.ko`

| Exact scene ID | Content | Proposed purpose | Observable success | Representation / interaction justification |
| --- | --- | --- | --- | --- |
| `question` | Timed Korean weekday riddle, ungraded weekday choice, reflection transition. | Create a concrete interpretive problem before terminology and collect a prediction without treating it as an IQ measure. | A reader can select or skip, state that the wording needs a reference convention, and reach reflection without a correctness gate. | A time-limited choice makes the ambiguity felt; it is justified only if skip is equally available and the answer remains ungraded. |
| `conditional` | Explicit simplification to “if yesterday were tomorrow, today would be Friday.” | Declare the authored simplification and separate it from a full semantics of the original wish. | A reader can repeat the simplified conditional and name it as a modeling choice rather than a literal translation. | Static source/simplification comparison is sufficient; no world editor is needed yet. |
| `sunday` | Forward ordinary-language weekday calculation. | Work one familiar reading completely before introducing competing contexts. | A reader can reconstruct Friday → Saturday → real Sunday and name which yesterday/tomorrow references were equated. | A short annotated calendar trace is justified; controls should expose the chosen reading, not merely display the answer. |
| `wednesday` | Reverse reference assignment and first possible-world distinction. | Show why another answer appears and motivate separating reality from an assumed situation. | A reader can contrast the Sunday and Wednesday assignments without claiming equal linguistic naturalness. | A two-context comparison is justified because prose alone makes the switched indexicals easy to miss. |
| `notation` | `t`, `h`, A, B, `A → B`, and congruence notation with semantic alignment. | Compress the already-worked reading into symbols so later rule applications can cite exact parts. | Hover/focus maps each source fragment to the correct symbol path, and a reader can explain A and B in words. | Bidirectional alignment is justified by a real translation task; symbols must not precede their concrete meanings. |
| `inference` | Modus ponens/tollens, conjunction rules, disjunctive syllogism. | Supply only the classical-rule background needed to read the next derivation. | A reader can identify modus ponens as the rule actually used next and distinguish the other reviewed rule shapes. | A compact rule table is preferable to an editable proof engine here; interaction adds value only if it compares valid and invalid applications. |
| `nonmodal-proof` | Explicit A premise, modus ponens to B, and modulo-7 derivation. | Demonstrate that the selected weekday answer follows by ordinary classical and arithmetic reasoning without modal operators. | A reader can follow every numbered dependency to `t ≡₇ d+2` (or the supported reverse case) and identify the resulting weekday. | Numbered proof rows are justified; current reference controls are justified only when changed input regenerates every row and answer. |
| `contexts` | Nonmodal finite worlds, reference assignments, inferred calendars, presets. | Generalize the two readings into an inspectable context model while keeping accessibility out of scope. | Changing a reference changes the constraint/result, and the reader can say worlds here are indexed situations, not discovered universes. | A world/reference editor is justified because the learning target is sensitivity to indexical assignment. |
| `modal-comparison` | Two fixed three-world valuations for P, ◇P, □P. | Introduce actuality, possibility, and necessity independently of the riddle machinery. | A reader can explain why one fixture is actual-false/possible-true/necessary-false and why the all-Friday fixture makes all three true. | Fixed comparison cards are justified; exposing the full editor here would overload the first modal distinction. |
| `alethic` | P at a selected world and direct-successor evaluations of ◇P and □P. | Apply some/all-accessible-world semantics to the weekday proposition while denying whole-riddle translation. | A reader can identify the evaluation point, direct successors, and truth conditions for each operator. | A labeled graph plus explicit truth text is justified because relation scope, not color, determines the result. |
| `modal-expansion` | Editable worlds/access relation and finite ∨/∧ expansions. | Show that modal operators compactly summarize P over exactly the current direct successors. | Adding/removing access updates both expansion and verdict, including empty-access `⊥`/`⊤`, without changing calendar constraints. | The editor is justified by the changed-condition comparison; it must visually connect selected successors to expansion terms. |
| `modal-rules` | K, modus ponens, theorem-only necessitation, stronger-system conditions. | Prevent semantic examples from being mistaken for a complete inference calculus and state the common normal-K basis. | A reader can reject necessitation of a local assumption and name the conditional nature of T or stronger principles. | A compact rule/condition comparison is justified; the world editor is secondary and should not dominate. |
| `modal-systems` | K, D, T, B, S4, S5 axioms and frame conditions. | Compare systems by added constraints rather than present “possible worlds” as one undifferentiated logic. | A reader can match each named system to its stated frame condition and avoid equating S5 with universal access only. | A table is justified because the task is structured comparison; interaction is unnecessary until checking a concrete frame. |
| `frame-system` | Property checks for the currently edited relation. | Transfer the system table to a concrete finite frame while preserving the limit that one frame is not an entire logic. | Editing reverse/self edges updates serial/reflexive/symmetric/transitive/euclidean checks and compatible systems. | Interactive relation editing is justified because one edge can visibly change several properties. |
| `transfer` | Change target weekday from Friday to Monday. | Test whether the same reference and reasoning structure transfers when a condition changes. | A reader predicts/reconstructs the changed answer and explains which values changed and which rules did not. | Reusing the editor is justified; a prediction/reveal would make the transfer diagnostic rather than demonstrative only. |
| `literal` | Same-context yesterday=tomorrow inconsistency and explosion link. | Distinguish a genuinely inconsistent constraint set from ambiguity or a sample mismatch. | The no-calendar state suppresses answer extraction, explains classical explosion without asserting real truth, and links to the focused lesson. | An explicit contradiction state and cross-link are justified; the general modal display should not obscure this branch. |
| `conclusion` | Recap of “if,” possible worlds, modal logic, and interpretation dependence. | Answer the opening by replacing IQ framing with a scoped lesson about assumptions and reference conventions. | A reader can give a two-sentence answer that names the interpretive choice and the limited role of modal logic. | A concise recap and related route are sufficient; retaining the full editor is justified only if it visibly supports the recap. |

## `article:logic.consistency.ko`

| Exact scene ID | Content | Proposed purpose | Observable success | Representation / interaction justification |
| --- | --- | --- | --- | --- |
| `theory` | Axioms plus permitted inference rules. | Establish what counts as the starting theory before defining consistency. | A reader can distinguish assumptions from rules. | Two labeled cards are sufficient; the proof editor is optional until a concrete derivation is used. |
| `definition` | Inability to prove a contradiction. | State consistency as a property of a specified theory, not of isolated prose. | A reader can paraphrase “T does not derive ⊥” with the theory/rules held fixed. | A static definition plus one contrasted non-example is more direct than an unchanged proof canvas. |
| `explosion` | Contradiction leading to Q and ¬Q in classical logic. | Explain why derivable contradiction destroys proof-theoretic discrimination. | With P and ¬P enabled, the displayed dependencies reach arbitrary Q; removing one premise breaks this shown path. | An interactive proof is justified because premise removal exposes dependence. |
| `boundary` | The example does not establish ZFC consistency or CH independence. | Prevent transfer from an elementary explosion demo to metamathematical results. | A reader can name the unproved claims and the need for separate arguments. | Static boundary copy and links are sufficient; manipulation adds little. |

## `article:logic.paraconsistent.ko`

| Exact scene ID | Content | Proposed purpose | Observable success | Representation / interaction justification |
| --- | --- | --- | --- | --- |
| `rules` | Nonexplosive consequence from A and ¬A. | Define paraconsistency by a consequence relation that does not validate arbitrary explosion. | A reader can distinguish “contains a contradiction” from “entails every B.” | A concrete countervaluation is eventually justified; the opening should first show the failed entailment plainly. |
| `intuitionistic` | Standard intuitionistic logic still validates explosion. | Block the misconception “nonclassical means nonexplosive.” | A reader can state that paraconsistency and nonclassical logic are not synonyms. | A small comparison is sufficient; the FDE editor is not required for this contrast. |
| `truth` | Consequence rules versus dialetheist truth claims. | Separate paraconsistent inference from accepting true contradictions. | A reader can state that adopting a nonexplosive logic does not itself assert real contradictions. | A two-axis conceptual comparison is better suited than a generic proof flow. |
| `boundary` | Different paraconsistent logics have different rules. | Keep the FDE demonstration from standing for all paraconsistent logics. | A reader can identify FDE as one model and avoid importing every classical rule. | Static scope text plus visible syntax limits is sufficient. |
| `four-values` | FDE values T/F/B/N and negation. | Build the minimum semantic vocabulary needed for the counterexample. | A reader can interpret both information bits and compute ¬B=B. | A 2-bit/value table is justified and clearer than proof cards. |
| `counterexample` | P=B, Q=N with designated premises and undesignated goal. | Work the decisive semantic counterexample to explosion. | The display explicitly marks P and ¬P designated, Q undesignated, and concludes invalidity in FDE. | An assignment table or linked value cards are justified because evidence is semantic, not syntactic derivation. |
| `valid-rules` | Conjunction elimination and disjunction introduction remain valid. | Show that rejecting explosion does not reject all inference. | A reader can test at least one preserved rule over all displayed FDE values. | Presets are justified for comparing valid and invalid inferences; explanatory feedback must state the preserving condition. |

## `article:set.zfc.ko`

| Exact scene ID | Content | Proposed purpose | Observable success | Representation / interaction justification |
| --- | --- | --- | --- | --- |
| `sets` | Sets and membership. | Introduce the basic object/relation before naming ZFC. | A reader distinguishes an object from membership in a set. | A small membership diagram is sufficient. |
| `axioms` | ZF plus choice gives ZFC. | Present ZFC as an axiom system and distinguish assumptions from consequences. | A reader expands the acronym and explains the role of C without treating the page as a full axiom list. | A labeled composition card is justified; the relation proof editor is not yet relevant. |
| `consistency` | Meaning of Con(ZFC). | Tie the earlier consistency concept to a specific formal theory. | A reader paraphrases Con(ZFC) without claiming it has been proved here. | Static notation translation is sufficient. |
| `boundary` | If inconsistent, CH and ¬CH follow; independence needs a condition. | Explain why the relative consistency assumption cannot be omitted. | A reader can state the conditional form and reject an unconditional independence inference from this page. | A dependency diagram is justified if it clearly distinguishes assumption from theorem. |
| `membership` | `X∈A`, `A⊆B` imply `X∈B`. | Work a limited set-relation inference and distinguish ∈ from ⊆. | Editing/removing either premise changes the shown path without conflating the relations. | The premise editor is justified for this exact derivation. |
| `extensionality` | Mutual inclusion yields equality. | Show one application of extensionality and its required two directions. | The visible premises are `A⊆B` and `B⊆A`, and the conclusion is `A=B`. | A converging two-premise diagram is justified; a membership-transfer diagram is not. |

## `article:set.ch-independence.ko`

| Exact scene ID | Content | Proposed purpose | Observable success | Representation / interaction justification |
| --- | --- | --- | --- | --- |
| `size` | Cardinal comparison and naturals versus reals. | Establish the question's objects before CH. | A reader explains cardinal comparison by bijection and that the real cardinality is larger. | Static paired-set mapping is sufficient; metaproof controls are premature. |
| `ch` | No cardinal strictly between naturals and reals. | State CH and reject the “gaps on the number line” misconception. | A reader states CH as a cardinality claim, not a metric-density claim. | A cardinal ladder is justified; proof-path UI is unnecessary. |
| `independence` | Conditional nonprovability of CH and ¬CH from ZFC. | Define independence relative to a fixed theory and consistency assumption. | A reader names both nonprovability directions and keeps them in ZFC. | A two-branch metatheoretic diagram is justified. |
| `boundary` | Constructible universe/forcing theorems are not reproduced. | Mark the difference between cited metatheorems and search failure. | A reader rejects “the program found no proof” as an independence proof. | Static boundary text should dominate; the tool can only show registered dependencies. |
| `branches` | Separate Con(ZFC+CH) and Con(ZFC+¬CH) branches. | Show that the extensions are alternatives, not one combined contradictory theory. | Each branch visibly starts from Con(ZFC) and remains separate. | A fork diagram is justified and should label theorem dependence. |
| `metaproof` | Combine the two nonprovability directions into Ind(CH,ZFC). | Expose the final registered dependency chain without pretending to prove forcing or L. | A reader can trace which extension-consistency result supports which nonprovability result. | An interactive dependency graph is justified if metalevel status and assumptions stay visible. |

## `article:computing.curry-howard.ko`

| Exact scene ID | Content | Proposed purpose | Observable success | Representation / interaction justification |
| --- | --- | --- | --- | --- |
| `question` | Propositions/types and proofs/terms in a bounded fragment. | State the correspondence and its intuitionistic implication/product scope. | A reader can name both correspondences and one excluded overgeneralization. | A paired mapping is sufficient before the editor. |
| `identity` | `A→A` and `λx:A.x`. | Work the smallest closed function/proof and explain discharged assumption. | The displayed typing tree derives `⊢ λx:A.x : A→A`; the reader can explain why A need not be asserted first. | A typing derivation is justified because it exposes assumption discharge. |
| `context` | `x:A` and `Γ⊢t:B`. | Distinguish open terms under assumptions from closed proofs. | Editing context changes the judgment, and the display marks dependence/closure. | Context/term editing is justified; closure status must be prominent. |
| `application` | Function application corresponds to implication elimination. | Show exactly how `f:A→B` and `a:A` produce `f a:B`. | The typing derivation visibly cites both premises and the application rule. | A proof tree is justified; a detached final type alone is insufficient. |
| `composition` | `A→B`, `B→C` compose to `A→C`. | Make the matching intermediate type the condition for chaining proofs/functions. | Changing B to a mismatched type invalidates the exact application and identifies the mismatch. | Editable types plus highlighted flow through B are justified. |
| `pair` | Conjunction/product introduction and projections. | Relate evidence for both conjuncts to an ordered product and its eliminations. | A reader can construct `<a,b>:A×B` and inspect `fst`/`snd` results. | Pair/projection steps are justified; ordered-product limits remain visible. |
| `calculation` | Beta reduction removes introduction-followed-by-elimination. | Connect program evaluation to proof normalization through one worked reduction. | One-step control shows the before/after substitution and its typing preservation. | A synchronized typing/reduction trace is justified. |
| `limits` | Type checking only proves encoded conditions in the selected calculus. | Prevent “type checks, therefore all requirements are proved.” | An invalid term clears derivation; a valid term still displays excluded effects/requirements. | A changed-input counterexample is justified; the scene needs an explicit transfer prompt. |

## `article:computing.lambda-calculus.ko`

| Exact scene ID | Content | Proposed purpose | Observable success | Representation / interaction justification |
| --- | --- | --- | --- | --- |
| `function` | Lambda abstraction syntax. | Teach how to parse binder, annotation, and body. | A reader points to each part of `λx:A.x` and states its role. | Scope highlighting is justified; a generic type result is not enough. |
| `apply` | Abstraction versus application. | Separate a function value from calling it and compare their types. | The display places `λx:A.x:A→A` beside `(λx:A.x)a:A`. | A before/call comparison is justified. |
| `substitution` | Beta reduction and non-textual substitution. | Show one computation step as capture-aware substitution. | A step action transforms the exact redex to `a` and names the replaced free occurrences. | Before/after trace and occurrence highlighting are justified. |
| `binding` | Shadowing, free/bound variables, capture avoidance. | Make lexical scope and alpha-renaming necessary rather than decorative vocabulary. | Identically named binders are visually distinguished; substitution leaves the inner bound x untouched. | Binder-to-occurrence paths are justified; plain text cards cannot show scope reliably. |
| `composition` | Higher-order function composition and type matching. | Extend application to functions passed as inputs/results. | A reader traces A→B→C and identifies a mismatch before reduction. | A typed flow/derivation is justified. |
| `mismatch` | Ill-typed application versus false/uninhabited proposition. | Explain exactly what a type error establishes and what it does not. | An A/C mismatch invalidates this derivation while copy denies a universal impossibility conclusion. | Editable invalid input with synchronized explanation is justified. |
| `self-application` | Why `x x` conflicts with one finite simple type. | Work the local typing obstruction without generalizing to all recursion/type systems. | The display exposes simultaneous T and T→U requirements on x. | A constraint-conflict diagram is justified. |
| `limits` | Progress/preservation, termination, and specification are distinct. | Close by separating type safety from termination and correctness. | A reader can name what progress+preservation guarantee and two properties they do not. | A static comparison plus one transfer case is sufficient; the pair example is useful only if it supports that distinction. |

## `lesson:logic.explosion.short.ko`

| Exact section/cue ID | Content | Proposed purpose | Observable success | Representation / interaction justification |
| --- | --- | --- | --- | --- |
| `question` | Opening question and classical-natural-deduction scope. | Establish a precise derivability question rather than a real-world truth claim. | A reader can state the question with “under these premises and rules.” | A P/¬P pair is an appropriate minimal preview. |
| `symbols` | Concrete same-integer example for P and ¬P; assumptions versus facts. | Ground negation and contradiction while denying factual endorsement. | A reader identifies P and its exact negation and calls both temporary premises. | Side-by-side formula cards are justified. |
| `premise-p` | First premise P. | Begin the proof and teach premise as an accepted starting line. | The proof shows only line 1 and labels it premise. | Progressive proof reveal is justified. |
| `premise-not-p` | Second premise ¬P. | Complete the contradictory pair and emphasize shared subject matter. | Lines 1–2 are visible and distinct; both feed the next step. | Progressive reveal should add the second dependency without implying a conclusion yet. |
| `contradiction` | Infer ⊥ from P and ¬P. | Show the exact joint dependency for contradiction introduction. | Both premise references connect to the ⊥ row, and removing either disables it. | A dependency graph is justified and should show two incoming connectors. |
| `explosion` | Infer arbitrary Q by bottom elimination. | State the explosion rule and arbitrariness condition. | The Q row cites ⊥ only, and changing Q leaves the dependency structure intact. | Goal control plus proof row is justified. |
| `change-r` | Change goal Q to R. | Demonstrate that arbitrariness concerns formula content, not new evidence. | R replaces Q while premises/rules remain unchanged. | Goal editing is justified as a changed-condition comparison. |
| `change-s` | Change goal to S. | Reinforce generality once without implying empirical confirmation. | S follows through the same displayed path and copy names the sameness. | A second goal is justified only as brief consolidation. |
| `remove-premise` | Remove ¬P and lose the displayed path. | Expose premise dependence and prevent interpreting path failure as falsity/unprovability. | ⊥ and S disappear; explanation explicitly limits the conclusion to this path/search. | Premise toggle is essential interaction. |
| `truth` | Derivation versus real-world truth; no classical valuation satisfies P and ¬P. | Resolve the central misconception created by “anything follows.” | A reader distinguishes syntactic consequence, satisfiability, and factual verification. | Static recap plus the retained proof state is sufficient. |
| `consistency` | Why derivable contradiction destroys discrimination. | Connect the worked proof to the role of consistency. | A reader explains why every formula becoming derivable makes theoremhood non-discriminating. | A compact consequence map is justified; no extra editor behavior is needed. |
| `summary` | Rule/meaning recap and related topics. | Answer the opening independently and route deeper questions without withholding the answer. | A reader states “contradictory premises + explosion rule yield arbitrary conclusions, not arbitrary facts.” | A concise recap with related links is sufficient. |

## Unresolved invariants

1. Preserve all stable scene, block, claim, lesson, and cue IDs.
2. Preserve original scientific fixtures and the deliberate distinction between the proof-scene web reset and projection baseline.
3. Never turn bounded search failure into falsity, consistency, unprovability, or independence.
4. Keep weekday reference assignment separate from accessibility; keep the simplified conditional distinct from the original wish.
5. Keep FDE one paraconsistent example; keep semantic countervaluation distinct from syntactic failure.
6. Keep ZFC relation exercises bounded; do not present them as a ZFC prover or consistency checker.
7. Keep CH branches as separate theory extensions and all independence claims conditional at their recorded scope.
8. Keep typed-lambda claims inside the pure simply typed implication/product fragment; preserve capture avoidance and type-safety/termination limits.
9. Preserve reader edits across navigation; reset only explicitly; reject unsupported restoration atomically.
10. Screenshots and browser behavior do not establish comprehension or scientific correctness. Pending content/expert/rights/publication status must remain pending.
