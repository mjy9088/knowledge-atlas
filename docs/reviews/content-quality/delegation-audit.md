# Delegation prompt audit: physics-discovery and number-systems

## Record

- **Target/version:** OpenCode authoring and review delegations for the 18 physics-discovery and number-systems articles present in `/workspace`, sampled from the original 2026-10-18 authoring wave through the later full-catalog audit wave. Evidence was retrieved on 2026-10-18 from the current OpenCode SQLite store.
- **Origin:** User feedback that the 18 new articles were quantity-first and poor in content, purpose, interaction, and visualization, followed by the question whether author and reviewer subagents had actually received separate rules.
- **Scope:** Representative original author prompts for both series; an original pedagogical reviewer; original visual reviewers; the later `nuclear-constituents` substantive reviewer; a later tightly scoped author; the independent source audit; and the final all-scene review prompts for all 10 physics and all 8 number-system articles.
- **Resolution:** Historical evidence recovered; the missing original per-slide contract is confirmed. The original delegations did contain separate domain-specific authoring rules and some independent review. They did **not** explicitly require a learning objective and attainment test for every slide, nor did they enforce an independent scene-by-scene pedagogical and visual review. Those requirements were added explicitly in the later full-catalog audit prompts. Their reports were incomplete at the initial retrieval below but are now present for all 274 scoped IDs. This later completion does not retroactively change the original instructions or establish educational approval.

## Retrieval method and limits

The required `coding-agent-sessions` finder was run first with `--platform opencode --cwd /workspace --include-subagents` and the requested phrase lanes: `physics-discovery`, `counting-zero`, `nuclear-constituents`, `content quality`, `source audit`, and `visual QA`. The indexed finder exposed the relevant parent/child sessions, but most exact phrases were absent from its title/preview index. The raw evidence below therefore comes from direct joins of `message.data` and `part.data` in `/home/dim-agent/.local/share/opencode/opencode.db`, ordered by message time. Session titles and summaries were not used as proof of the prompt body or of a PASS.

Times below are UTC. Excerpts omit team-communication boilerplate. No secrets or encrypted reasoning were copied. The search was bounded after representative early and later author/reviewer evidence was found; unrelated platforms and unrelated `/workspace` sessions were not scanned.

The store does not establish that a current policy document had its present wording at every earlier instant. This report therefore attributes requirements only when they occur in timestamped raw messages. At the initial retrieval, the final two audit sessions had tool activity but no final audit text or assigned files. That historical observation is superseded for current coverage by the completed reports linked in the [assessment index](README.md); it is retained only to distinguish retrieval time from later execution.

## Original author delegations

### Physics: first three episodes

- **Session:** `ses_eb08134f9ffeTni5tM5Vxl8Rko`
- **Message/time:** `msg_14f7ecb7f001Oa70m64fr4UcMG`, 2026-10-18 14:51:12.127
- **Relevant verbatim excerpts:**
  - “each <=180s planned narration, concrete question/evidence/inference/limits/transfer, not glossary slides”
  - “Include per-topic quality.json with ... openingQuestion, readerOutcome, assumedKnowledge ... misconception, transfer ... narration ... segments:[{sceneId,seconds}] ... review:{status:'review-required'...}”
  - “history must not be inevitable linear march or model illustration misrepresented as observed data.”

This was not a generic production request. It gave the physics author evidence/inference boundaries, history cautions, source-consultation duties, a worked-transfer contract, and unresolved-review status. It did **not** ask for a distinct learning objective, observable success criterion, or representation/interaction rationale for each scene. `segments:[{sceneId,seconds}]` required timing coverage, not a scene-level pedagogical purpose.

### Number systems: first three episodes, including `counting-zero`

- **Session:** `ses_eb0813479ffephxNexG57QO77B`
- **Message/time:** `msg_14f7ecba7001fPuVFZ5aFoa02p`, 2026-10-18 14:51:12.167
- **Relevant verbatim excerpts:**
  - “with question-led quality rather than vocabulary dump”
  - “scoped worked reasoning and transfer answers”
  - “Define convention N includes zero explicitly, distinguish historical motivation from construction, rational equivalence/density not completeness, division zero excluded.”
  - The same series-level `openingQuestion`, `readerOutcome`, `misconception`, transfer, per-scene timing, and `review-required` fields were required.

This author received rules distinct from the physics author: natural-number convention, construction/history separation, rational equivalence, density/completeness, and division-by-zero scope. Again, there was no explicit per-slide objective or per-slide attainment evidence requirement.

## Original and intermediate review delegations

### Pedagogical critique of the first number episodes

- **Session:** `ses_eb06579d5ffefpeRa2fVykTTvy`
- **Message/time:** `msg_14f9a8636001P6XMCVmT6dJ0jc`, 2026-10-18 15:21:29.398
- **Prompt excerpt:** “Independently critique the three number-system episodes counting-zero, negative-numbers, and rational-numbers against docs/CONTENT-QUALITY.md ... especially whether worked explanations actually evaluate reasoning and whether transfers require adaptation rather than vocabulary recall.”
- **Actual check evidence:** The session recorded 16 file reads, four globs, and two greps. Its result message `msg_14f9aae47001ThN0oy8ye39kgZ` identified `counting-zero`’s transfer as a revision because it “mainly checks classification vocabulary,” identified the unproved rational midpoint inequality, and ranked findings by article/block/claim ID.

This was a genuine independent pedagogical critique, not a summary PASS. It was article/block-specific, but the prompt did not require a row, objective, visual rationale, or attainment verdict for every scene.

### Visual review of the first physics episodes

- **Sessions:** `ses_eb05ee809ffemjj7CE7kDHGcrM` and `ses_eb05ee816ffd5xwjSEHJjmBo7a`
- **Prompt message/time:** `msg_14fa1180c001l5u3LzRZ6zdwKw`, 2026-10-18 15:28:39.948 (the companion CJK pass began in the same second)
- **Prompt excerpt:** “Read-only visual QA pass A (design-system and functional integrity) ... Inspect ALL 72 fresh screenshots ... (3 pages × 6 scenes × fhd/desktop/compact/mobile)” and judge whether “every scene/control remains accessible.”
- **Actual check evidence:** One session recorded 22 reads and the other 75 reads. Result messages `msg_14fa1809b001I0ZjqLmTpzNlNh` and `msg_14fa1a280001wUxBIGR2YoSp3u` returned **REVISE** and **FAIL**, not PASS, because Korean rendered as tofu boxes. They also distinguished geometry/controls from CJK readability.

These reviews covered every rendered scene at several viewports, but their stated purpose was layout, controls, typography, and visual integrity. They did not independently test each scene’s explanatory purpose or whether its representation caused the intended learning. Screenshot coverage is therefore not evidence of scene-level pedagogy.

### Second-unit substantive critique, including `nuclear-constituents`

- **Session:** `ses_eb0498794ffeogLeBI4ZaEAQTJ`
- **Message/time:** `msg_14fb67870001IaeSk9zme8rufw`, 2026-10-18 15:52:00.880
- **Prompt excerpts:**
  - “Read-only independent substantive critique that finds false/missing reasoning or scopes the remaining uncertainty, not rubber approval.”
  - “Specific risks ... nuclear constituent neutral penetration comparison assumes species/mass, broad transfer single-target impossibility maybe overclaim.”
  - “Do not judge screenshots; UI has own tests.”
- **Actual check evidence:** Result `msg_14fb97fae001H2RFs23hIXWPA8` recomputed the head-on elastic-collision relation, obtained an approximately `0.89` proton-mass projectile, found the one-target transfer underdetermined only under stated conditions, and found a false proton source locator. Follow-up result `msg_14fd77d32001QG84UOVBCzCobs` rechecked fixes and still retained source/wording blockers.

This was strong independent reasoning/source review, deliberately separate from visual review. It still reviewed six articles in a batch and did not require independent pedagogical and visual judgments for every scene.

## Tightening after discovered failures

The tightening is visible in timestamped messages, so it is not inferred retroactively from today’s `docs/CONTENT-QUALITY.md`.

1. **Source-locator stop:** In the original numbers author session, lead message `msg_14fbc01240010SqCMM11oxLoDj` at 15:58:03.556 said: “STOP expansion. Oracle live source audit found SOURCE LOCATOR BLOCKERS (not optional)” and listed false irrational-number and completeness locators, required actual replacement sources, explicit proof steps, and “No more content until corrected.”
2. **Later author packet:** Quark author session `ses_eb0134f45ffeXq0C8y5N2LMo2o`, message `msg_14fecb159001zQifraN7FSWEEB` at 16:51:14.393, explicitly said the content-quality document “contains sourceauditgates learnedfromfalse-locatorfailures.” It required “explicit observation→modelinference→limits→workedcharge/transfer,” actual decisive passages, specified scientific distinctions, and one bounded episode.
3. **Independent source audit:** Session `ses_eaffa96e8ffefrur5vNh53xJ3r`, message `msg_15005691b001fK6qbrWMdJtx1w` at 17:18:14.299, required an “Independentread-onlysubstantiveaudit” that opened sources and independently recalculated examples. The session recorded 64 reads, 39 web fetches, three web searches, seven greps, and nine shell checks. Result `msg_150088f5d001JZ9BmMtXLP88RS` blocked registration over source access, idealization, notation, DIS, Bjorken-`x`, charged-center/gluon, and load/coherence defects. A later recheck still reported narrow remaining defects rather than converting the work into expert approval.

Thus the later process did materially strengthen source verification, bounded-question discipline, explicit inference chains, independent calculations, and stop-the-line behavior. Those later rules must not be presented as if the 14:51 authors had received all of them in their original packets.

## Final full-catalog scene audits requested after user feedback

### Physics: all 10 registered articles

- **Session:** `ses_eaeab7a80ffdOJIk1hJ3zRSHgv`
- **Message/time:** `msg_151548596001RnqiVL0nz0WyIN`, 2026-10-18 23:24:16.150
- **Verbatim excerpts:**
  - “User rejects quantity-first quality and asks every slide's content/purpose plus a separate review of purpose attainment, missing interactions and visualization.”
  - “For EACH scene include ... why this slide exists, observable learning success, needed representation/interaction and why static or animated.”
  - “Review separate file with EACH scene: purpose verdict ... reasoning gap, visual/interaction gap, actual tested behavior and concrete acceptance criterion.”
  - “Plan must explicitly label purposes as retrospective proposed purposes, not original approved plans.”

### Number systems: all 8 registered articles

- **Session:** `ses_eaeab787fffe8ugXYPTp94tXIf`
- **Message/time:** `msg_151548bd4001CIZ9mu14oTaYSk`, 2026-10-18 23:24:17.748
- **Verbatim excerpts:**
  - “Complete per-scene intent inventory and separate critical rendered review for all eight.”
  - “Each plan row: article/scene ID, topic/content, explanatory purpose, observable success, justified representation/interaction.”
  - “Separate review EACH scene: purpose verdict ... reasoning/visual/interaction deficiencies, actual tested behavior, concrete acceptance criteria.”
  - “Don't equate correct prose or fit with comprehension.”

These are the first recovered prompts that unambiguously require both (a) a purpose and observable learning criterion for every scene and (b) a separate scene-specific pedagogical/visual/interaction review. They also correctly mark the purpose inventory as retrospective, preventing it from being misreported as the original author plan.

**Historical enforcement status at initial retrieval:** requested but not completed. The raw sessions then showed substantial setup/file-reading activity (76 tool parts for physics and 73 for numbers), but only setup commentary, no final audit message. The four assigned files did not yet exist. **Current coverage:** those files now contain 73 physics and 63 number-system purpose rows and corresponding assessment rows; the other two scope reports complete 262 article scenes plus 12 Explosion sections. This establishes recorded review coverage, not that every scene passed, that every screenshot was individually inspected, or that later corrections inherit those pre-correction verdicts.

## Direct answers

1. **Did authoring and reviewing subagents receive separate content rules?** Yes, partially. The first physics and number authors received different domain-specific authoring constraints. Independent pedagogical, scientific/source, and visual reviewers also received distinct review briefs. This separation was real, not merely stated in a parent summary.
2. **Were per-slide learning objectives explicitly requested and enforced originally?** No. Original `quality.json` requirements covered one article-level reader outcome and timing for each scene, not a learning objective and observable success test for each scene. Explicit per-scene purpose/success requirements appear in the later 23:24 audit prompts; their retrospective purpose inventories are now complete but do not prove original author intent or learner attainment.
3. **Was independent scene-specific pedagogical/visual review explicitly requested and enforced originally?** No. Early pedagogical review was article/block/claim-oriented; early all-scene visual review checked rendered layout, controls, and CJK. Neither combined independent purpose attainment with reasoning, representation, interaction, and acceptance criteria for every scene. The later audits now provide that recorded scene coverage as provisional AI review, with many blocking/revise findings still unresolved and only representative screenshot inspection.
4. **Can prior PASS claims be trusted?** Not from a lead/main-session summary alone. The recovered child evidence includes substantive REVISE/FAIL findings and source blockers. Only raw child prompts, tool evidence, result messages, and revision-bound report artifacts should support a review claim.

## Unresolved gaps and workflow implication

- The full-catalog row coverage is complete. Resolve its findings and obtain fresh source/build-bound assessment for each corrected scene and adjacent flow; do not reuse an old “no process” observation as the review of a new animation, or infer that a completed row means successful learning.
- Bind future author packets to explicit per-scene purpose, observable success, and justified representation/interaction before implementation; do not reconstruct these only after criticism.
- Keep pedagogical/content-source review and rendered visual/interaction review independent, then require a revision/hash-matched synthesis. Geometry fit, source correctness, and learning effectiveness are different claims.
- Preserve stop-the-line source verification and independent worked-example/transfer calculation. Do not let structural validation, screenshots, or a general reviewer PASS override located blockers.
- Historical prompts beyond the representative sessions above were not exhaustively enumerated. This bounded audit supports the process conclusion but does not claim that every one of the 18 author sessions had identical wording.
