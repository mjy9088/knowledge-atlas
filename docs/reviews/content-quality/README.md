# Open content-quality assessment

## Target and status

Origin: user feedback that the explanations were expanded without sufficient educational/visual quality, including missing alpha-bombardment visualization and weaknesses in weekday-worlds. Status: **unresolved corrective review, not approval**. Scope: all 35 registered articles (262 authored scenes) and the separate focused Explosion lesson. Private Studio manuscripts and the historical 30-second storyboard are not additional approved articles.

This assessment separates proposed intent from the evaluation of the current reader. Reconstructed plans are **retrospective proposed intent**, not evidence that original authors received or met those objectives. Each report identifies its actual source/build revision and observation limits. Later repairs do not inherit the original report's conclusions; attach scoped re-review evidence to the changed revision instead.

Each audit lane reconstructed proposed intent and separately judged the pre-correction implementation. It was not the original content author, but the retrospective plan itself did not receive a separate human approval. The reports are provisional AI editorial review. All scene IDs were covered; only the explicitly named representative screenshots received individual visual inspection. Do not describe the complete capture count as a complete expert, learner or image-by-image review.

## Scene coverage

| Scope | Articles / authored scenes | Content and purpose | Separate assessment |
| --- | --- | --- | --- |
| Physics discovery | 10 / 73 | [Physics intent](physics-plan.md) | [Physics review](physics-review.md) |
| Number systems | 8 / 63 | [Number-system intent](numbers-plan.md) | [Number-system review](numbers-review.md) |
| Logic, sets and typed functions | 7 / 56, plus Explosion | [Logic intent](logic-plan.md) | [Logic review](logic-review.md) |
| Remaining comparisons and physics readers | 10 / 70 | [Other-reader intent](other-plan.md) | [Other-reader review](other-review.md) |

[Delegation audit](delegation-audit.md) distinguishes actual historical agent instructions from later written policy. [Authoring workflow verification](authoring-workflow.md) records what the isolated new-manuscript route actually supports, separately from content quality and approval.

## Scoped corrective assessment

The catalog assessment remains unresolved. The following narrower evidence does not supersede the historical [corrective surface review](corrective-surface-review.md) or clear uninspected scenes.

- Target build: SHA-256 of `dist/build-manifest.json`, `39e138693c01b4a0a92249eeace5c2805ae62442dd0f9149eed03ee1f6f93fae`; local static review build, not publication.
- Origin: the existing user request for actual explanation and rendered-quality improvements. Review date: 2026-10-19. Lead: Hephaestus. Independent read-only AI reviewers: Oracle sessions `ses_eada84d4fffeFjppijOc4zu8qe` (functional/design integrity) and `ses_eada84d43ffeChXVwLCTN3BF1d` (visual/CJK precision).
- Inspected set: both reviewers directly opened all eight full-page captures for `rational-numbers/density` and `inertial-motion/{comparison,inference,transfer}` at 1920×1080 and 390×844. Evidence is under ignored `test-results/content-quality/latest/<target-build>/{fhd,mobile}/<topic>/<scene>.png`; mobile transfer also has `final-footer-layout.json`.
- Expected: complete rationality and strict-order reasoning, visible controlled motion comparisons and balanced forces, readable labels and Korean units, separated force/velocity notation, adjacent captions, and reachable non-overlapping navigation. Actual: both reviewers returned scoped **PASS** with no remaining visual blockers in this set. The stationary equation now equates positions, not times, and clears the force glyph. Final narrow navigation occupies one 44px row with separate links and buttons; the intermediate two-row layout's mobile ZFC overflow was repaired rather than accepted.
- Live behavior: the lead exercised density → Skip → transfer → Previous → completeness, restored density, and opened the inertial transfer evidence dialog at 390×844 without page errors. Static figures have no additional scientific-input controls; navigation is not treated as an experiment. Browser geometry/state checks and the full repository checks passed, but neither establishes learner comprehension.

### Remaining educational and verification gaps

The frame follow-up targets build-manifest SHA-256 `e7e86d7d36c445e41d5ad8e0cf38be391c7c107b92c74144e8dd87c53b137c75`. Two independent read-only AI visual reviewers, sessions `ses_ead834a8affeuhfsHyra3lkuRV` and `ses_ead834a83ffeBavYAUJ16X7I8q`, inspected all twelve final captures for the six inertial-motion scenes at 1920×1080 and 390×844 and returned scoped **PASS**. Captures and geometry observations are under ignored `test-results/content-quality/latest/<frame-build>/{fhd,mobile}/inertial-motion-flow/`. This does not renew the earlier rational-density visual verdict against the newer build.

Separately, Oracle session `ses_ead8c0dfcffe6IxCIq7V9Lp5fp` independently opened the existing OpenStax §5.2 first-law, inertial-reference-frame, and Equation 5.2 passages, checked the authored coordinate calculations, and assessed `inference → frame → limit`. After explicit net-force wording, initial speed/unit clarification, and claim-reference correction, all three were judged **adequate** for worked exposition. That semantic re-review used build `56279b7ee5fb17b70093029fc6092b25c2fe48df887e99db0972cf956a220d22`; the subsequent final-build changes only suppress the question/limit decorative connectors at wide viewports. OpenStax supports the laws and frame classification, not the independently authored numerical example. The lead exercised adjacent navigation, reset/restoration, and atomic rejection of an unsupported scene in the final desktop/narrow reader without page errors.

| Target | Expected versus current evidence | Required next correction or verification | Invariant and status |
| --- | --- | --- | --- |
| `inertial-motion/frame` | Matched-time ground/object positions and bus-origin positions now yield `x′=x−X`, exposing equal ground displacements and increasing bus-relative displacements without a new physical forward force. Scoped AI reasoning and rendered reviews found the missing worked comparison supplied. | Obtain expert/learner evidence and measure narration before claiming comprehension or 27-second pacing. | Preserve approximate inertial ground, shared initial speed, zero horizontal net force on the object, ignored drag/contact/end collision, and authored-model/non-passenger scope. **Implementation gap repaired; expert review, learner attainment, and timing remain open.** |
| `rational-numbers/density` | Internal reasoning now supplies closure and both positive half-gaps; this revision's visual pass is not verification of the cited external passage. | Independently open the decisive source locator and distinguish the authored derivation from source evidence. | Keep rational endpoints, strict order, nonzero divisor, and density/completeness distinction. **Source verification pending.** |
| Other scenes and catalog findings | Automated fit coverage is broader than the eight images independently inspected here. | Continue scene-specific reasoning, representation, interaction, and rendered review; do not inherit this scoped pass. | Preserve stable IDs, accepted human edits, conditions, and unresolved review states. **Open assessment.** |

The original eight-image review performed no new external source audit. The frame follow-up separately consulted only the named live OpenStax passages, without immutable source bytes or exact provider-revision verification. Neither review grants expert approval, learner-attainment assessment, screen-reader/cross-browser approval, rights clearance, measured narration, video production, or publication authorization. Learner attainment remains **not assessed**. The existing isolated authoring-workflow evidence was not promoted to a general canonical merge or publication capability.

## Resolution contract

- Preserve accepted human text, stable IDs, source conditions, review states and rights boundaries. Do not replace an unexplained claim with a fabricated animation of an unobserved mechanism.
- Repair the earliest blocking explanatory dependency before expanding that sequence. Prefer worked evidence, explicit reasoning and meaningful representations over extra articles or decorative motion.
- For every changed scene, check its declared success condition, source scope, representation correspondence, relevant interactions and actual desktop/narrow surface. Recheck adjacent flow. Mark unobserved checks unverified.
- Record changed revision, expected/actual result, remaining finding and review scope when resolving an item. An implementation test alone does not resolve a pedagogical objection or accepted user feedback.
- Keep source/expert, learner-comprehension, rights, audio and publication approvals pending until their corresponding work occurs. No aggregate quality pass is asserted by these documents.

The durable author/evaluator rules live in [Content quality](../../CONTENT-QUALITY.md). Ignored browser captures under `test-results/content-quality/` are inspection evidence, not canonical scientific data or publication artifacts.
