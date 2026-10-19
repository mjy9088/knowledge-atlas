# Knowledge Atlas Studio Design System

## 1. Atmosphere & Identity

Studio is a quiet, evidence-first editorial workbench: compact enough to compare a manuscript, its implementation workspace and review evidence without turning the surface into a dashboard spectacle. Its signature is the muted botanical status language—paper-white working surfaces, moss-green actions and restrained amber/red review states—used only to clarify state and provenance.

## 2. Color

| Role | Token | Value | Usage |
| --- | --- | --- | --- |
| Canvas | `--surface-canvas` | `#f5f6f2` | Page background |
| Panel | `--surface-panel` | `#ffffff` | Editing and production surfaces |
| Field | `--surface-field` | `#fbfcfa` | Inputs and text areas |
| Selected | `--surface-selected` | `#e8f0e8` | Current topic or slide |
| Subtle | `--surface-subtle` | `#edf3eb` | Quiet labels and hover |
| Text | `--text-primary` | `#23372f` | Primary copy |
| Muted text | `--text-muted` | `#5f6f65` | Metadata and help with AA contrast on canvas and selected surfaces |
| Accent | `--accent-primary` | `#28644f` | Primary actions and current-state borders |
| Focus | `--accent-focus` | `#28644f` | Focus outline with at least 3:1 contrast |
| Border | `--border-default` | `#dce3db` | Surface and field boundaries |
| Border strong | `--border-strong` | `#cbd7cd` | Buttons |
| Warning surface | `--warning-surface` | `#fff9e9` | Review warnings |
| Warning border | `--warning-border` | `#d7bc79` | Review warnings |
| Error | `--status-error` | `#943c32` | Failures and blockers |

Accent color is reserved for interaction/current state. Status colors do not imply scientific or publication approval.

## 3. Typography

| Level | Token | Size | Weight | Line height | Usage |
| --- | --- | --- | --- | --- | --- |
| H1 | `--text-h1` | `1.4375rem` | 700 | 1.3 | Studio heading |
| H2 | `--text-h2` | `1.125rem` | 700 | 1.4 | Workspace heading |
| H3 | `--text-h3` | `1rem` | 700 | 1.5 | Panel heading |
| Body | `--text-body` | `0.875rem` | 400 | 1.6 | Controls and prose |
| Small | `--text-small` | `0.75rem` | 400 | Metadata |
| Overline | `--text-overline` | `0.625rem` | 400 | Local/private context |

Primary stack: `"Segoe UI", "Malgun Gothic", "Noto Sans CJK KR", Arial, "Liberation Sans", sans-serif`. JSON and logs: `Consolas, ui-monospace, monospace`. Explicit Linux sans/CJK fallbacks avoid certifying accidental monospace or missing-glyph captures. No remote fonts.

## 4. Spacing & Layout

Base unit: 4px. Tokens: `--space-1: 4px`, `--space-2: 8px`, `--space-3: 12px`, `--space-4: 16px`, `--space-5: 20px`, `--space-6: 24px`, `--space-7: 28px`.

The document owns vertical scroll. Desktop retains the 16.25rem library sidebar plus a fluid workspace up to 1920px. Compact library and topic-button inline padding reserves room for titles without reducing the built preview's width. Editor/review columns use overflow-safe intrinsic tracks and stack below 960px; the library becomes part of the document flow below 760px. Logs, horizontal slide navigation and built previews own only their named bounded scroll directions. Primary content must not scroll horizontally at 375px.

At host widths up to 37.5rem, the built-preview frame reserves `--preview-narrow-frame-height: 846px`, including its two border pixels, so the embedded reader receives the supported 844 CSS-pixel narrow reading height. This viewport token deliberately uses CSS pixels rather than the Studio's smaller root-relative text units. The old frame provided even less than its nominal 650px because the Studio root is 14px; ordinary probability controls overlapped narration at its roughly 316px embedded width. The host document may scroll vertically to inspect the complete preview; do not shrink reader prose, clip the lab or remove its controls to preserve the shorter frame.

## 5. Components

### Action button
- Structure: native `button`, optional `.primary`.
- States: default, hover, active, focus-visible, disabled.
- Spacing: `--space-2`/`--space-3`; 8px radius.
- Accessibility: native keyboard behavior, 44px minimum height, and 3px visible focus outline.

### Field
- Structure: visible `label` wrapping `input`, `textarea` or `select`.
- States: default, focus-visible, readonly, invalid through the page alert.
- Spacing: `--space-2`; 7px radius.
- Accessibility: no placeholder-only labels; long values wrap or scroll inside their field.
- Native authoring fields preserve literal manuscript text, including whitespace. They wrap at word boundaries without inserting nonbreaking characters or rewriting accepted prose to force grammatical phrase grouping; judge presentation phrasing in the reader, not by mutating an editing value. Static labels and selector titles are shaped separately.

### Slide intent editor
- Structure: a native `details` disclosure inside the slide editor with labeled status, content-reference, prerequisite, success-check, representation-rationale and interaction fields.
- States: `unplanned` is the visible legacy/new-slide state and blocks readiness; `authored` requires every contract field plus either an interaction declaration or reasoned static choice.
- Accessibility: status and interaction use native selects; multiline references and rationales use labeled textareas. Collapsing the disclosure never changes or approves its values.

### Topic/scene selector
- Structure: native buttons in a library stack or horizontal reel.
- States: default, hover, focus-visible and `aria-current=true`.
- Layout: library stack and keyboard-accessible horizontal reel with 10.5rem items and intrinsic wrapped height.

### Evidence panel
- Structure: bordered white section with heading, explanatory copy, actions and bounded details/logs.
- Variants: production, handoff, review, feedback and built-preview.
- States: empty guidance, running, completed, warning and error.
- Accessibility: headings retain hierarchy; status changes use `role=status`/`aria-live` where appropriate.

### Handoff packet control
- Structure: explanatory evidence panel, work/review download actions, labeled JSON file input and import status.
- States: workspace unavailable, ready, importing, accepted and rejected.
- Accessibility: packet kind and revision are visible in text; file selection is keyboard reachable; errors use the shared alert.

## 6. Motion & Interaction

Studio uses no automatic decorative motion. Hover/focus/active feedback is immediate; polling updates content without moving focus. Reduced-motion therefore requires no alternate animation path. Navigation never discards dirty input silently.

## 7. Depth & Surface

Borders-only. Panels use `1px solid var(--border-default)` and no drop shadows. Selected/interactive state uses tonal shift plus border color; status boxes use their semantic surface and border tokens.

## 8. Accessibility Constraints & Accepted Debt

Target WCAG 2.2 AA: full keyboard reachability, visible focus, 4.5:1 body-text contrast, native labels, no color-only status, and no horizontal primary-content overflow at 375px. Korean UI copy remains functional and explicit about draft/review/publication boundaries.

| Item | Location | Why accepted | Owner / Exit |
| --- | --- | --- | --- |
| Existing single-file DOM renderer | `app.ts` | Current dependency-free architecture; this change retires runtime coupling rather than introducing a framework | Split only when a subsequent feature needs reusable modules |
