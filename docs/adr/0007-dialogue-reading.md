# ADR 0007 — Self-paced dialogue reading

- Date: 2026-10-16
- Status: Implemented locally

Present /lesson.html as a diagram and dialogue rather than a video player. Support previous/next, direct chapter selection, contextual skipping, and keyboard navigation without time waits. Keep source episode and projection timing unchanged.

Ignore global navigation keys while editing or using menus/dialogs, and preserve native activation of focused links/buttons. Expose deterministic reading state/reset/inspection; legacy seek maps time to a scene. Full screen-reader review is still pending. ADR 0008 makes suggested premises editable inside this reader.
