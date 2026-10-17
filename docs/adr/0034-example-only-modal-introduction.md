# ADR 0034: An example-only modal introduction

Date: 2026-10-18. Status: implemented locally; independent content review and publication pending.

## Disclosure and sequence

Keep `modal-comparison` as the introduction scene and its existing URL. Show only two authored conceptual valuations, the proposition P (Friday), accessible-world cards, actuality and possibility/necessity verdicts. Hide the original riddle, its calendar equations/derivation, presets, editor, finite symbolic expansion and reference-sheet entry point. This supersedes the combined introduction/editor arrangement in ADRs 0027 and 0032.

The first example assigns Sunday/Friday/Monday to the three worlds, so P is false at reality, diamond true and box false. The second assigns Friday to all three worlds, making all three judgments true. Both evaluate at reality with all displayed worlds accessible. Declare that these are concept examples, not inferred solutions of the riddle or the reader's edited frame. Use separate example-world identities so hidden fixtures cannot be mistaken for editor-owned worlds during deletion or inspection.

Keep the following `alethic` scene for applying the operators to the riddle. Move the existing full editor, finite expansion and optional reference sheet to a new `modal-expansion` scene after that application and before modal rules. Preserve existing scene and block IDs; add the expansion block at the end of the article. The sequence now has seventeen content pages. Reader edits survive the static introduction and subsequent navigation.

## Model boundary and evidence

Extract a validated atom/diamond/box valuation evaluator independent of date constraints. Use it for the two declared intro fixtures, and delegate the existing sample evaluator to it without changing fixtures. The active riddle UI still aggregates over satisfying calendar completions; teaching valuations must not silently become calendar premises or replace that aggregation. No modal proof engine or whole-riddle translation is added.

The examples are independently authored instances of Schwarz Chapter 3 §3.1 clauses (a), (g), (h), recorded under a scoped claim. Check the exact teaching judgments, invalid frames, empty accessibility, preservation of reader input, staged visibility, actual successor navigation and all scene geometry. Use standalone Playwright on the static build, including desktop, narrow and 960×540 CSS/DPR 2. Passing tests and local source alignment do not establish expert or publication approval.
