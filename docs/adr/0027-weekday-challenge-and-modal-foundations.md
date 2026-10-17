# ADR 0027: A timed opening and gradual modal foundations

Date: 2026-10-17. Status: implemented locally; content review and publication pending.

The opening-page structure is superseded by [ADR 0028](0028-single-page-weekday-opening.md). Modal semantics and legacy state validation below remain applicable.

## Narrative and semantics

Supersede the wish/counterfactual presentation in ADRs 0021/0025. Keep those historical claims and independent mathematical fixtures, but remove Wish and closest-world operators from the active article. The authored explanation explicitly simplifies the original to “만약 어제가 내일이라면, 오늘이 금요일이다.”; this is a teaching choice, not an equivalence claim. Use “가정한 오늘”.

Preserve existing scene IDs and append new blocks/IDs. The sequence is question, reason, conditional, Sunday, Wednesday, notation, inference, contexts, modal-comparison, alethic, modal-rules, transfer, literal, conclusion. Symbols and classical modus ponens precede named worlds and modal operators. The full editor is withheld until modal-comparison. The modal-rules step briefly distinguishes K/T axiom schemas from modus ponens/necessitation inference rules. Necessitation applies only to theorems without local assumptions. Arbitrary editable R does not guarantee T.

P means “this world's today is the target weekday”, with each world's reference explicitly supplied. Compare P at the evaluation point with some/all directly accessible worlds. These are examples of modal usage, not a translation of the entire conditional. `deducedWeekdayModal` evaluates each satisfying calendar independently and reports an agreed Boolean or undetermined. No satisfying calendars suspends the displayed verdict; this is an extraction policy, not a rejection of explosion. Empty access with consistent calendars gives diamond false and box true. Legacy weekday samples remain validated but never drive visible truth values. Preserve the old sample-based evaluator and its fixtures.

## Challenge and deterministic runtime

An explicitly started 20-second attempt shows the original riddle, seven day choices and a countdown. The initial state does not consume time. Answer or expiry requests the reflection scene without grading. Next can skip the challenge. The attempt freezes its target weekday and selected answer, and optional reasoning text is bounded to 1,000 characters. Retain it across navigation and validated detached restoration. Missing challenge fields in old snapshots migrate to ready.

The pure experiment owns phase, elapsed time and answer validation. The DOM adapter owns a monotonic clock only while the question is active and the cover is closed. Leaving pauses accumulation; returning resumes live attempts. `seek(ms)` independently sets a frozen attempt frame, with no inherited answer/reason and no timer-driven navigation. Reset clears the attempt. A deadline is elapsed time, not interval callback count; long callback gaps do not extend it. Stop the old clock only after validating restoration input.

The shared topic contract gains optional activity, pre-Next and scene-request hooks; existing topic adapters need not implement them. A requested scene must exist in the article. Navigation from an automatic completion focuses the destination heading. The textarea DOM remains stable during edits.

## Verification

Keep all preexisting calendar and modal fixtures unchanged. Add pure tests for deadline, restoration, independent seek, sample-independent modal truth, unknown completions and empty versus inconsistent models. Standalone Playwright uses fake time against the static build for answer/expiry/reflection and measured geometry for all authored scenes, including desktop, narrow and 960×540 CSS at DPR 2. These checks establish behavior, not linguistic equivalence, comprehension, expert review or publication approval.
