# ADR 0004 — Scene navigation and scientific state

- Date: 2026-10-16
- Status: Implemented locally

Keep selected slide state separate from premise/goal/model state. Previous/next, direct selection, hashes, and keyboard navigation must not reset experiments. Show static reasoning relationships as well as animation. Format parser-supported ASCII aliases as logical symbols without changing semantics.

Place navigation/information behind compact controls. Preserve input focus and avoid intercepting typing or native button/link activation. The later self-paced reader (0007) and viewport contract (0011) refine this presentation.
