# ADR 0026: Compact weekday actions and unobstructed alignment

Date: 2026-10-17. Status: implemented locally; publication and observational usability review pending.

## Actions and help

The weekday explanation rail contains Contents/Evidence, Previous and Next in that order, with adjacent button rows. Remove the visible keyboard-help and final continuation-link rows. The knowledge-index link moves into the existing menu and the existing evidence/scope link remains there once, available on every scene. Other article readers retain their navigation layout. Next keeps invariant viewport bounds across the title, scenes, final scene, modes and restored state, but no longer has a requirement to hug the viewport bottom. This supersedes the rail ordering in ADRs 0023/0024; bounded menu dismissal and viewport contracts remain.

Previous/Next expose keyboard shortcuts via native button tooltips and `aria-keyshortcuts`. Alignment fragments expose no native title tooltip: immediate nested emphasis supplies pointer feedback without a covering bubble. The first explanation teaches hover discovery in ordinary prose. Preserve focus interaction, the full semantic path and live accessible path feedback, but do not allocate a visible alignment-instruction row in the weekday pane. The shared alignment controller retains descriptive accessibility metadata. Native button/choice help outside highlighted fragments may retain its tooltip.

## Explanation height and heading

The three actions no longer justify the previous 132/124/152 CSS-pixel explanation reserves. Use 104 pixels for wide desktop, 96 for compact landscape (192 physical pixels at the 200% capture baseline), and 136 for narrow reading. Keep 4–6 pixels of vertical prose padding and align content to the top. The title occupies the left side of a flex heading row and progress sits at its right end, so progress does not consume a separate line. Long titles may wrap within the title cell without pushing the progress below it. This supersedes the 124-pixel capture explanation reserve in ADR 0024. Keep source/prose font sizes, semantic content and both visual columns intact; verify real scroll extents rather than clipping content. The per-profile reserve keeps navigation stationary across scenes, title entry, restored edits and both logic modes.

## Direction and validation

Vision explicitly states the video's two roles: an independently enjoyable, informative explanation and a route to the web's deeper interaction. Neither a withheld explanation nor click-through optimization satisfies that requirement. This is an editorial direction, not evidence of measured conversions or audience response.

Verify compact action order and bounds, keyboard navigation, tooltip metadata, direct hover emphasis without title attributes, menu index/evidence navigation, title/final/restored states and the unchanged layout of other readers. Run standalone Playwright against the static build, including narrow screens and 960×540 CSS at DPR 2. No model, claim semantics, encoded video or publication changes are introduced.
