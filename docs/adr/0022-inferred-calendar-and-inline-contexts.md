# ADR 0022: Inferred calendars and inline reference choices

Date: 2026-10-17. Status: implemented locally; review and publication remain separate.

[ADR 0024](0024-continuous-reader-and-inline-choices.md) refines the inline choices into compact captured popovers and consolidates preset labeling. The deduction and saved-state contracts below remain unchanged.

## Decision

The weekday reader puts each of the four reference-world selectors inside its corresponding original-language expression. Keep accessible names, stable world colors, creation options, cross-reference labels, full ancestry alignment and native select keyboard behavior. The Selection pane has the same white background, border and internal heading as Original and Symbols. Its preset group says “select” explicitly, and each A/B/C button names the selection action rather than resembling a representation tab. Only Selection scrolls.

Remove the editable Reality-today sample and every world-today field in the world/access dialog. Keep the sentence's target weekday as a premise, four world references, world creation/removal and direct-access filtering. Access edges do not supply calendar equalities.

`weekdayDeductions()` projects the existing satisfying-calendar enumeration onto each world's yesterday/today/tomorrow. Show a weekday only when all satisfying calendars agree, “undetermined” for multiple candidates, and “no solution” for an empty set. Original-language annotations, world cards, modal graph labels, result status and narration must never present a saved sample day as a deduction. Unlinked worlds remain undetermined even if a legacy sample day happens to equal the target. The counterfactual translation still does not receive a truth verdict without a similarity/desire model; calendar results remain conditional on adopting Γ={A,B}.

## Compatibility and verification

Version 3 snapshots retain their validated sample-day fields and earlier migrations for compatibility with existing saved states and pure-model fixtures. Those fields are not additional premises and do not affect displayed deductions. Existing sample-comparison model outputs are retained for prior consumers; the reader consumes the new deduction projection instead. This supersedes ADR 0018's sample-editing/display UI contract without changing its stable model fixtures or the source-translation contract in ADR 0021.

Model tests vary legacy samples independently of the constraints and check unique, unconstrained and impossible calendars. Standalone Playwright checks selector ownership, native keyboard events inside alignment, preset changes, access edits without fabricated weekday deductions, sample-independent world cards, restoration, reset, dialog controls, scroll reachability and supported viewport bounds. Screenshots establish presentation, not mathematical authority.
