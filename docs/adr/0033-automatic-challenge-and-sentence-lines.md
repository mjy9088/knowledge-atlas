# ADR 0033: Automatic challenge entry and stable sentence lines

Date: 2026-10-18. Status: implemented locally; independent content review and publication pending.

## Opening behavior

Start a fresh 20-second attempt when the question actually becomes active, without a separate Start button. The cover and hidden scenes do not start or accumulate time. Keep the validated ready phase for inactive fresh state and legacy snapshots. Only ready state becomes live on visible entry; independent paused seek frames remain frozen, and answered/expired/skipped phases are not restarted. Reset deactivates the interaction before restoring fresh state so a hidden cover cannot inadvertently start a deadline.

An answer retains the existing reflection prompt. Expiry or skip without an answer uses a distinct invitation to consider the basis of the solution. Both remain phases of the same first page. Put Retry and View Explanation beside each other; View Explanation navigates to the same conditional scene as Next after reflection, preserving input and ordinary navigation. This refines ADR 0028 and supersedes ADR 0027's explicit-start requirement.

## Nonmodal input and typography

The contexts scene exposes the preset row while world creation, evaluation/access selectors and relationship configuration remain withheld until the modal introduction. Preserve ordinary preset semantics and saved edits.

Render the antecedent and consequent of the interactive source sentence as two explicit, nonwrapping rows, with the opening quote in the first row and the closing quote/punctuation in the second. Retain the existing alignment forest and inline reference controls; do not flatten the semantic nesting or mask overflow. Verify every supported viewport and the 200% capture baseline with all three presets.

## Verification

Check cover inactivity, automatic visible entry, exact deadline, answer/no-answer wording, retry, both explanation actions, reset/restoration, frozen seek and return from another scene. Clock-dependent snapshot tests must freeze time or explicitly account for elapsed time rather than require two live observations to be identical. Measure both sentence rows, preset access and control bounds with standalone Playwright on the static build.
