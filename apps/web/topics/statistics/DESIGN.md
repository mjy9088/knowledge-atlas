# Statistics experiment design system

This owner design extends the shared reader styles for `base-rates` and `possibility-lab`. It records the existing visual language and the probability-ledger pattern; it does not replace the shared reader design.

## 1. Atmosphere & identity

The experiments should feel like a quiet working notebook: exact quantities are easy to compare, controls stay subordinate to the explanation, and sampling looks like a check rather than the source of truth. The signature is the **retained-mass ledger**: each fixed case reads left to right from prior through observation likelihood to retained and normalized weight.

## 2. Color

| Role | Token | Value | Usage |
| --- | --- | --- | --- |
| Page ink | `--lab-ink` | `var(--ink)` | Headings and exact values |
| Muted ink | `--lab-muted` | `var(--muted)` | Supporting labels and notes |
| Line | `--lab-line` | `var(--line)` | Table rules and control outlines |
| Surface | `--lab-surface` | `#ffffff` | Lab and row surfaces |
| Soft surface | `--lab-soft` | `var(--soft)` | Column headers and sampling disclosure |
| Retained surface | `--lab-retained` | `#e4f0e8` | Cases retained by the observation |
| Excluded surface | `--lab-excluded` | `#f0efeb` | Zero-likelihood cases |
| Accent | `--lab-accent` | `var(--green)` | Current stage, focus relationship, exact result |
| Warm sample | `--lab-sample` | `#ab7850` | Empirical reference line only |
| Blue sample | `--lab-sample-line` | `#356bba` | Empirical frequency only |
| Focus | `--lab-focus` | `#317f66` | Keyboard focus ring |

Colors convey semantic status in combination with text; retained and excluded rows never rely on color alone. New statistics colors must be added here before use.

## 3. Typography

| Level | Size | Weight | Line height | Usage |
| --- | --- | --- | --- | --- |
| Section | `1rem` | 700 | 1.4 | Lab heading and normalization result |
| Body | `0.95rem` | 400 | 1.6 | Controls and ledger rows |
| Small | `0.85rem` | 400 | 1.5 | Notes and sampling summary |
| Caption | `0.75rem` | 600 | 1.4 | Column labels and stage labels |

The primary stack is the shared Korean-capable system stack. Exact fractions and counts use tabular figures. Labels remain Korean; compact notation such as BB/BG/GB/GG is explained in adjacent text.

## 4. Spacing & layout

All spacing follows the shared 4px unit.

| Token | Value | Usage |
| --- | --- | --- |
| `--lab-space-1` | `0.25rem` | Tight label/value spacing |
| `--lab-space-2` | `0.5rem` | Controls and cell padding |
| `--lab-space-3` | `0.75rem` | Row and panel padding |
| `--lab-space-4` | `1rem` | Major internal separation |
| `--lab-space-6` | `1.5rem` | Long-form section separation |
| `--lab-radius-sm` | `0.5rem` | Controls and inner panels |
| `--lab-radius-lg` | `0.75rem` | Lab boundary |

The lab width follows its reader container up to the existing `68.75rem` maximum. At desktop, the ledger is a semantic table with fixed conceptual columns. At `650px` and below, each table row becomes a one-column case card whose cells carry visible column labels; primary content never scrolls horizontally. Long-form readers use natural document height: no fixed `230px` visual region, no shrinking of the worked ledger, and no internal prose scroll.

## 5. Components

### Exact case ledger
- **Structure**: heading and event statement, semantic `table`, fixed-case `tbody` rows, and a normalization `footer` region.
- **Variants**: family cases BB/BG/GB/GG; Monty prize-door cases 1/2/3 mapped around the selected initial door.
- **Spacing**: `--lab-space-1` through `--lab-space-4`.
- **States**: stages 0–3 progressively expose case identity, prior, likelihood/retained mass, then normalized weights and exact target fraction. Excluded rows remain present and named.
- **Accessibility**: caption names the event; row and column headers retain table semantics; stage-hidden values use readable pending text; mobile labels repeat header meanings.
- **Motion**: no decorative motion. Explicit unfold changes only opacity and preserves reduced-motion completion.
- **Layout**: table on wide layouts, stacked case cards on narrow layouts; document owns long-form scrolling.

### Experiment controls
- **Structure**: existing `.lab-inputs`, `.lab-stage-controls`, and reset control selectors.
- **Variants**: relation edges, family report process, Monty host process and initial choice.
- **States**: default, hover, active, visible focus, disabled at stage 3, and reset.
- **Accessibility**: native buttons/selects, stable labels, at least shared-reader minimum hit area where space permits.
- **Motion**: state changes are immediate; unfolding is optional and reduced-motion safe.

### Sampling disclosure
- **Structure**: native `details`/`summary` containing the existing `.lab-trials`, `.lab-chart`, status and sample note.
- **Variants**: closed at initial exact explanation; remains functional when opened.
- **States**: closed/open, zero trials, sampled, playing/paused.
- **Accessibility**: native disclosure keyboard behavior; exact result remains outside and before it; live status remains available inside.
- **Motion**: none required.
- **Layout**: secondary stack below the exact ledger; chart keeps intrinsic width without forcing page overflow.
- **Chart labels**: the explanatory legend is normal DOM text at `0.85rem`, not scaled SVG text. Numeric 0/1 axis labels use 28 SVG units, projecting above 12 CSS pixels at the narrow chart width; a textual axis description remains available alongside the line meanings.

### Binary relation diagram
- **Structure**: existing SVG nodes and directed edges.
- **Variants/states**: unchanged relation stages and selected edges.
- **Accessibility**: existing role, label, controls and text summary remain unchanged.
- **Layout**: bounded SVG inside the existing lab.

## 6. Motion & interaction

| Type | Duration | Easing | Usage |
| --- | --- | --- | --- |
| Micro | `150ms` | ease-out | Hover/focus surface feedback |
| Unfold | `400ms` per stage | ease-out | Explicit “unfold” action only |

Animation may use only opacity or transform. `prefers-reduced-motion: reduce` completes the exact ledger immediately. Sampling playback remains model state progression, not decorative motion.

## 7. Depth & surface

Use a mixed but quiet strategy: one outer border for the lab, table rules for comparison, and tonal shifts for retained/excluded cases. No new shadows. Rounded corners indicate containment, not decoration; inner ledger rows use the smaller radius only in the narrow card layout.

## 8. Accessibility constraints & accepted debt

### Constraints
- Target WCAG 2.2 AA contrast, visible focus, keyboard operation and meaningful reading order.
- Exact reasoning must remain understandable without color, animation, sampling or SVG interpretation.
- At 390px and 200% zoom, every fixed case, factor and normalization result must reflow without horizontal page scrolling.
- The event is stated as **any unchosen goat is opened**; the ledger must not imply conditioning on a numbered door.
- Reader state, reset, restored snapshots and stage 0–3 remain deterministic.

### Inclusive readers
- A reader with low vision or enlarged text needs stacked labels rather than a horizontally clipped table.
- A reader using a screen reader needs row/column relationships and an explicit numerator/denominator statement.
- A reader with limited working memory needs prior, likelihood, retained mass and normalized weight in one case-local reading path, with empirical sampling collapsed by default.

### Accepted debt

None accepted for this change. Browser visual, keyboard, screen-reader and learner-comprehension review remain pending rather than accepted debt.
