# Experiment input components

## Symbolic premise editor

`premise-editor.ts` normalizes `{premises:[{formula,enabled}],goal,customized}` and accepts a caller-owned `derive` adapter. It supports up to eight premises and 512 characters per formula. Preserve incomplete drafts; suggestions must not replace customized input. Explicit reset restores the current suggestion. The inference explorer renders the selected proof/reference/countervaluation row supplied by the adapter; domain configuration owns rules, presets and explanatory wording. Invalidate stale diagrams and narration together. These are symbolic components, not a universal numeric form.

## Captured inline choices

[inline-select.ts](inline-select.ts) exposes `mountInlineSelect(select)`. The native select remains the source for value, options, optgroups, disabled/selected state, label and bubbling change events. A DOM popover/listbox makes choices visible in page/video captures; OS-native popup capture is not assumed. Values and domain validation belong to the caller.

Pointer activation or Enter/Space/Up/Down opens the list. Up/Down/Home/End navigate enabled choices; Escape/Tab close, and explicit dismissal restores focus. Outside dismissal updates expanded state. Position the popup inside viewport margins and bound its scrolling. Rebuild choices on open. Return `close(restoreFocus?)` and `destroy()`; callers close transient popovers when inputs/stages change and destroy them with their owning UI. Open state is not a scientific assumption or saved model field.

Verify pointer and keyboard selection, disabled/current entries, optgroups, selected state, emitted change events, focus restoration, outside dismissal, cleanup and reachable choices at narrow/200% capture sizes. Scientific editor contracts remain caller-specific; the symbolic premise editor is not a universal numeric form.

## Choice surface

`inline-select.css` owns the shared DOM popover styling and is loaded by the article foundation. Use neutral rectangular options, a blue selected/focus state and labelled identity rails. Topic styles supply scientific identity variables without owning a second popup skin. Keep viewport placement, keyboard traversal, disabled current options, focus restoration and native-select validation in the existing controller contract.
