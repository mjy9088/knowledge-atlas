# ADR 0023: Focus reader and 200% landscape capture

Date: 2026-10-17. Status: weekday reader implemented locally; rendered video and publication remain separate.

[ADR 0024](0024-continuous-reader-and-inline-choices.md) further compacts the explanation and inline choices and replaces upward menu placement with a bounded, explicitly dismissible viewport panel, while retaining this capture baseline and focus-navigation contract.

## Layout and capture target

The weekday article must fit a 1920×1080 physical frame at 200% display scale. This means a 960×540 CSS layout, captured at device scale factor 2 to produce 1920×1080 pixels. Setting DPR 2 on a 1920×1080 CSS viewport would instead produce 3840×2160 and would not exercise the required compact layout. Browser page zoom, OS scaling and screenshot pixel density are distinct mechanisms; the regression profile fixes the effective layout and output dimensions explicitly.

This is the landscape YouTube rendering baseline for this article and future DOM-based projections using this reader. It does not change the existing explosion Canvas renderer's independent 1080×1440 and 1920×1080 profiles or claim that a weekday video renderer, audio, upload or publication has been completed. A future capture must restore deterministic scene/input state and apply this layout before encoding; scaling an overflowing desktop screenshot afterward is not a substitute.

## Focus chrome

The weekday reader opts into a focus frame. Its workbench fills the upper area. The explanation occupies the lower area, with an independent vertical action rail at its right edge: contents/evidence at the top, followed by Previous, keyboard instructions, final-scene continuation links and Next. There is no separate top/bottom layout track. Keep Next at the same bounds across title/content/final states and restored inputs. This supersedes the weekday horizontal footer and fixed top-chrome layout in ADR 0018 and Product's prior navigation placement; other article readers keep their existing layout.

The global navigation is a fixed overlay, collapsed to a 7px top-edge hover target. Hover reveals it; leaving hides it. Keyboard focus also reveals it, and its links stay in the tab order. Opening it does not change the content's dimensions or state. The side menu opens upward into a bounded panel and remains keyboard/touch operable. Evidence/connections still use the existing on-demand dialogs.

Compact typography and spacing at 960×540 preserve the simultaneous Original/Symbols panes, left/right comparison, logical limits and inference. Only the authored Selection pane and open menus/dialogs may scroll; measurements must reject clipping in the sentence, formulas, diagrams, prose and action rail. Keep the standard desktop and narrow reader profiles as well.

## Verification

The standalone Playwright `youtube-200` project uses a 960×540 CSS viewport and DPR 2 against the actual static build. Its tests cover title, all nine scenes, both translations, four worlds, restoration, invariant Next bounds, selection reachability, native configuration, side-menu evidence, hover and keyboard reveal. Inspect full-resolution 1920×1080 captures in ignored test artifacts. These checks do not certify video pacing, audio, scientific correctness, rights or publication approval.
