# Pilot: explosion and related knowledge

## Scope and scientific guardrails

The pilot asks what follows from contradictory premises. In ordinary classical natural deduction, `P` and `¬P` yield `⊥`, and bottom elimination yields an arbitrary formula `Q`. This is derivability under rules, not a claim that every real-world statement becomes true. Removing one premise may break the displayed path without establishing that every possible proof fails.

Keep the original `experience:logic.explosion.ko`, `scene:logic.explosion.proof`, claims, and fixtures stable. The first scene offers P/¬P toggles and Q/R/S selection through `packages/models/explosion.ts`. The separate `scene:logic.inference.lab` uses the bounded engine in `propositional.ts`: up to eight symbolic premises; ¬, ∧, ∨, → and parentheses; conjunction elimination, implication elimination, contradiction, bottom elimination, and goal-directed conjunction/disjunction introduction. It does not implement unrestricted theorem proving, subproofs, implication introduction, or disjunction elimination.

Never equate search failure with falsity, consistency, unprovability, or independence. Explosion is also available in standard intuitionistic logic; it is not exclusive to classical logic. This elementary demonstration is not a proof of CH independence.

## Focused explanation

`episode.ts` defines `lesson:logic.explosion.short.ko`; `packages/projection/explosion.ts` creates `projection:logic.explosion.short.ko`. `/lesson.html` reads it at the reader's pace; the local renderer projects the same source. The original 30-second `projection.json` is a separate historical draft, not overwritten by this episode.

| Start | Scene |
| --- | --- |
| 0:00 | Question and scope |
| 0:12 | P, ¬P, assumptions, and facts |
| 0:25 / 0:31 | Introduce each premise |
| 0:38 | Derive contradiction |
| 0:49 | Derive Q by bottom elimination |
| 1:03 / 1:13 | Change the goal to R and S |
| 1:20 | Remove ¬P and break the displayed path |
| 1:33 | Distinguish derivation from real-world truth |
| 1:48 | Explain consistency |
| 2:02–2:14 | Recap and related knowledge |

The 134-second duration describes the silent caption/scene timeline, not validated speech pacing. Three minutes is the short-format project ceiling. Introduce minimum vocabulary before using it; keep the episode centered on explosion rather than turn it into a generic inference-tool tour.

Every cue contains a complete presentation snapshot. Changing the goal updates its proof; excluding a premise removes the old path. Independent seeking must reproduce those states without earlier interactions. Customized web input changes or invalidates the original example dialogue through deterministic templates tied to model rows and claim IDs.

## Related readers and model scopes

| Route | Calculation | Boundaries |
| --- | --- | --- |
| `/knowledge/consistency/` | Existing classical forward inference | Incomplete finite search; not a consistency decision procedure |
| `/knowledge/paraconsistent-logic/` | FDE designated-value preservation, or a concrete countervaluation | At most five atoms; ¬, ∧, ∨; T/F/B/N values; T and B designated; rejects → and ⊥; not every paraconsistent logic |
| `/knowledge/zfc/` | Membership transfer along inclusion, inclusion transitivity, mutual-inclusion extensionality | Limited named-set relations ∈/⊆/=; not a full ZFC prover or consistency checker |
| `/knowledge/continuum-hypothesis/` | Connections among registered relative-consistency/nonprovability results and independence | Uses source theorems at the meta level; does not construct forcing/L or decide CH's truth |

FDE uses two information bits per atom; negation exchanges them and conjunction/disjunction implement the source matrices. A countervaluation keeps all premises designated while the goal is undesignated. This is distinct from a bounded classical search failing to find a path.

The CH adapter accepts its fixed documented tokens, including Con(ZFC), Con(ZFC+CH), Con(ZFC+¬CH), the two ZFC nonprovability statements, Ind(CH,ZFC), CH, and ¬CH. The two extensions are separate theories; do not combine their assumptions into one theory or infer independence from the word “consistency” alone.

Article/block IDs, claim references, and source locators live in each topic's `article.ko.json` and `claims.json`; presentation metadata and original sentence ranges live in its `page.ts`. `content/catalog.ts` registers them; see [Content structure](CONTENT-STRUCTURE.md). Additional scientific blocks get new IDs rather than overwrite accepted source text. The source-reading history and exclusions are retained in [Source review](SOURCE-REVIEW.md).

## Verification boundaries

Unit tests preserve the original scientific fixtures and check proof references, truth-table behavior, actual countervaluations, finite-set soundness, CH assumption dependencies, state isolation/reset, invalidation, and unordered projection seeking. Browser tests verify visibility and interaction across supported viewports. Neither replaces independent mathematical review.

Claims remain `draft-source-aligned`; explanations remain `needs-content-review`. Immutable source bytes, exact revision verification, rights clearance, human/expert approval, audio, approved publication manifests, and external publication remain pending.
