# ADR 0007 — Self-paced dialogue reading

- Date: 2026-10-16
- Status: Implemented locally

Present /lesson.html as a diagram and dialogue rather than a video player. Support previous/next, direct chapter selection, contextual skipping, and keyboard navigation without time waits. Keep source episode and projection timing unchanged.

Ignore global navigation keys while editing or using menus/dialogs, and preserve native activation of focused links/buttons. Expose deterministic reading state/reset/inspection; legacy seek maps time to a scene. Full screen-reader review is still pending. ADR 0008 makes suggested premises editable inside this reader.

Clarification (2026-10-17): a skip must advance beyond the ordinary next scene. The lesson inspection exposes the remaining `skippedSections` only when the next chapter starts more than one index ahead; `skip()` otherwise leaves the position unchanged. The button names its chapter/topic, the adjacent description gives scope, count and destination, and its title lists skipped scene titles. Input edits and reset update this description together. The catalog article reader has no authored skip destinations, so its legacy skip button and scope remain hidden in static and enhanced views instead of duplicating Next.
