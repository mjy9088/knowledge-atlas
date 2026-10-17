# ADR 0024: Continuous reading and compact inline choices

Date: 2026-10-17. Status: implemented locally; observational user research and video production remain separate.

## One source frame

The weekday reader shows input and reasoning together at every supported size. Desktop and the 960×540 CSS video layout use two columns; narrow screens stack them. Remove the Input/Reasoning tabs. Retain the validated legacy `narrowPanel` snapshot field for compatibility, with no visibility effect. This supersedes the tabbed narrow presentation in ADR 0018 and the earlier Product exception.

Original-language expressions are compact colored triggers containing the numbered word and short world name. Clicking anywhere on the term opens a DOM popover with the complete world labels, peer-reference annotations, unavailable current choices and explicit creation options. The target weekday is also selected by clicking the weekday in the original sentence; it has no field in Selection. The only preset row is the pane's internal heading `선택:` followed by A/B/C buttons, without repeating the action word in every button or adding a duplicate heading row.

The domain-neutral `components/experiment/inline-select.ts` retains native select values/change events and creates a captured DOM listbox. Pointer activation, Enter/Space, arrow navigation, Home/End, Escape, Tab, selected/disabled options, focus restoration and outside dismissal follow the same source state. Ordinary OS-native select popups are insufficient for this use because they need not appear in page/video captures. Open popovers are transient presentation state, closed when source input changes, and are not new scientific assumptions.

## Video usability inspection

At the 1920×1080/200% baseline, the explanation uses 124 CSS pixels (248 output pixels), down from the prior 150 CSS pixels. It occupies less than 24% of the frame rather than reserving a large subtitle box. Original and explanation text remain at least 12 CSS pixels (24 output pixels). Native state fields no longer impose wide boxes on the sentence. Check actual pointer activation on the numbered text and capture the open options, not just programmatic selection.

Four modal worlds use one horizontal row, keeping graph labels legible when the viewport is compact. Long access edges arc around unrelated nodes rather than crossing them and falsely suggesting an intermediate-world link. At widths up to 1100 CSS pixels, duplicate modal formula/wish text is omitted from the graph area because the canonical formula and definitions remain visible in Symbols. The graph's essential similarity limit and the distinction between translation and additional Γ deductions remain visible. This is removal of duplicated content, not clipping an oversized diagram. Selection and open menus retain their documented bounded scrolling exception.

These are implementation and frame-inspection criteria, not evidence that viewers learned the subject or understood speech pacing. Test all nine scenes, both representations, four-world edits, impossible/undetermined results, restoration and hover emphasis at the actual output size. Encoded video, narration, observed reader comprehension and publication remain unperformed.

## Bounded contents menu

The side contents/evidence menu is fixed inside a 12px viewport margin with bounded internal scrolling; it must not be positioned upward by its unconstrained content height. A sticky close button, Escape and outside click dismiss it, with keyboard focus returned to the summary when explicitly closed. Its open stacking order stays above the hover chrome. Verify the menu and close control at 200%, including after scrolling to its last item.

## Notation correspondence

`weekday-equivalence` is a shared meaning node below the constraint root. Every displayed `≡₇` token in clauses, results and relation text maps to the complete `≡₇: 같은 요일` glossary phrase. Hover or focus highlights all those occurrences, including the whole glossary phrase, in both translation modes. It retains the shared root-to-leaf alignment behavior without changing the calendar model or source claims.
