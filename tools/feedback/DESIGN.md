# Async Questions Design System

## 1. Atmosphere & Identity

This is a quiet, trust-first inbox for answering a small number of project questions without interrupting ongoing work. It inherits Knowledge Atlas Studio's paper-white surfaces, botanical green actions, restrained status color, native controls, and borders-only depth. The signature is a compact question ledger where identity, state, and timestamps remain readable without dashboard decoration.

## 2. Color

| Role | Token | Value | Usage |
| --- | --- | --- | --- |
| Canvas | `--surface-canvas` | `#f5f6f2` | Page background |
| Panel | `--surface-panel` | `#ffffff` | Question surfaces |
| Field | `--surface-field` | `#fbfcfa` | Answer fields |
| Subtle | `--surface-subtle` | `#edf3eb` | Status and context labels |
| Text | `--text-primary` | `#23372f` | Primary copy |
| Muted text | `--text-muted` | `#66766c` | Metadata and help |
| Accent | `--accent-primary` | `#28644f` | Submit actions and focus context |
| Accent hover | `--accent-hover` | `#205440` | Primary action hover |
| Focus | `--accent-focus` | `#8fb4a7` | Focus outline |
| Border | `--border-default` | `#dce3db` | Panel and field boundaries |
| Border strong | `--border-strong` | `#cbd7cd` | Buttons |
| Success surface | `--success-surface` | `#e8f0e8` | Answered state |
| Error | `--status-error` | `#943c32` | Validation and request failures |

Accent indicates interaction or current state only. Answer status does not imply content, review, or publication approval.

## 3. Typography

| Level | Token | Size | Weight | Line height | Usage |
| --- | --- | --- | --- | --- | --- |
| H1 | `--text-h1` | `1.5rem` | 700 | 1.3 | Page heading |
| H2 | `--text-h2` | `1.125rem` | 700 | 1.4 | Question heading |
| Body | `--text-body` | `0.9375rem` | 400 | 1.6 | Questions and answers |
| Small | `--text-small` | `0.75rem` | 400 | IDs and timestamps |
| Overline | `--text-overline` | `0.6875rem` | 600 | Private asynchronous context |

Primary stack: `"Segoe UI", "Malgun Gothic", system-ui, sans-serif`. Identifiers use `Consolas, ui-monospace, monospace`. No remote fonts.

## 4. Spacing & Layout

Base unit: 4px. Tokens: `--space-1: 4px`, `--space-2: 8px`, `--space-3: 12px`, `--space-4: 16px`, `--space-5: 20px`, `--space-6: 24px`, `--space-8: 32px`, `--space-10: 40px`.

The document owns vertical scrolling. Content is a single readable column capped at 760px. At 375px, question cards, answer fields, metadata and actions remain inside the viewport with no primary horizontal scroll. Touch targets are at least 44px high.

## 5. Components

### Question card
- **Structure**: `article` with status, stable ID, question heading, optional context, timestamps, answer form or saved answer.
- **Variants**: pending required, pending optional, answered.
- **Spacing**: `--space-4` through `--space-6`.
- **States**: pending, submitting, answered, inline error.
- **Accessibility**: heading hierarchy, visible text status, and status updates through an `aria-live` region.
- **Motion**: none beyond immediate hover, active, and focus feedback.
- **Layout**: vertical stack; document scroll owner.

### Answer field
- **Structure**: visible `label`, `textarea`, character hint, and submit button.
- **States**: default, focus-visible, disabled while submitting, invalid with text error.
- **Accessibility**: no placeholder-only label; native keyboard behavior; bounded answer length is visible.

### Status badge
- **Structure**: short text inside a semantic status row.
- **Variants**: awaiting answer, optional, answered.
- **Accessibility**: never relies on color alone.

### Action button
- **Structure**: native `button`.
- **States**: default, hover, active, focus-visible, disabled.
- **Accessibility**: native keyboard behavior, 44px minimum target, 3px focus outline.

## 6. Motion & Interaction

No automatic or decorative motion. Hover, active, focus, submitting, success, and failure feedback communicate affordance and request state immediately. Reduced-motion needs no alternate animation path. A failed submission preserves the typed answer.

## 7. Depth & Surface

Borders-only. Panels use `1px solid var(--border-default)` with no shadows. State changes use tonal surfaces and stronger border color rather than elevation.

## 8. Accessibility Constraints & Accepted Debt

Target WCAG 2.2 AA: full keyboard reachability, visible focus, 4.5:1 body-text contrast, native labels, text status in addition to color, 44px touch targets, useful errors, and no horizontal primary-content overflow at 375px. Copy is plain and explicitly says optional questions do not block balanced default work.

| Item | Location | Why accepted | Owner / Exit |
| --- | --- | --- | --- |
| No JavaScript-disabled answer submission | Answer form | The capability and JSON API are intentionally narrow; the question text remains readable without script | Add a bounded native form route only if a no-script respondent is required |
