# Knowledge Catalog Design System

## 1. Atmosphere & Identity

The catalog is a quiet atlas frontispiece, not a ranked product shelf or inventory dashboard. Every active topic is an equally valid starting point. Warm paper, botanical ink and one repeated reading-card primitive provide orientation without implying that article length, age or current review maturity makes one topic a flagship.

The primary task is scanning questions and choosing any topic. The layout must support keyboard and narrow-screen readers, readers zooming text, and readers who need plain, repeated information order with low memory demand.

## 2. Color

| Role | Token | Value | Usage |
| --- | --- | --- | --- |
| Page | `--catalog-paper` | `#f6f8f0` | Page background |
| Surface | `--catalog-surface` | `#ffffff` | Topic entrances |
| Ink | `--catalog-ink` | `#293f35` | Primary text |
| Muted | `--catalog-muted` | `#5f6f65` | Domain, payoff prefix and review notice |
| Link | `--catalog-link` | `#365c42` | Entry affordances |
| Line | `--catalog-line` | `#d5dfcc` | Surface boundaries |
| Wash | `--catalog-wash` | `#eaf0df` | Interactive hover/focus feedback |
| Focus | `--catalog-focus` | `#648a4c` | Keyboard focus |

## 3. Typography

The inherited Korean-capable system stack remains authoritative. Display uses `clamp(29px, 4vw, 48px)` with a `1.25` line height; the single section heading uses `clamp(20px, 2vw, 28px)`; every card title uses the same `clamp(20px, 2vw, 26px)` scale. Card questions use 16px, while domain and payoff metadata use 12px for every topic. Korean copy uses `word-break: keep-all`, balanced headings and emergency wrapping.

## 4. Spacing & Layout

The base unit is 4px. Catalog spacing tokens are 4, 8, 12, 16, 24, 32 and 48px, and the page reading measure is 1120px. Cards use the established 12px radius and a 160ms interaction transition. One `#connections` section contains one knowledge grid. At 1200px and above, three equal 340px cards fit the 1056px inner measure with at least 16px gaps, avoiding an isolated first pair and keeping the current five entries within supported desktop reading heights. Between 721px and 1199px the grid uses two equal `minmax(0, 1fr)` tracks, and at 720px and below one track; no entry spans tracks or changes track weight. Grid items stretch to the row height where content permits, while text remains untruncated. Section spacing is 32px and question-to-payoff spacing is 16px, preserving the same density for every card.

The catalog owns normal document scrolling at every viewport. It overrides the shared desktop knowledge-index frame's fixed-height and hidden-overflow behavior rather than creating internal scrolling. The document must have no horizontal overflow at 390px or at enlarged text sizes.

## 5. Components

### Topic entrance
- One canonical anchor primitive is used for every active topic.
- Information order is always domain, authored display title, opening question, then final mainline payoff (or final scene when no chapter mainline exists).
- Every instance has identical classes, typography, padding, border, background and width rules. There are no main, secondary, retained or review-badge variants.
- Default, hover, active and focus states are shared. Hover/focus uses the wash and a one-token translate without changing layout; active removes the lift.
- The anchor remains at least 44px tall, preserves the canonical route and exposes the full title through its title attribute.

### Catalog section
- One labelled `#connections` section contains all active topic entrances in registry order.
- The Korean heading is neutral: `질문에서 시작하는 지식 지도`. Supporting copy invites readers to begin with any question and contains no topic counts or tier language.

### Draft notice
- One notice after the grid states that all entries remain drafts awaiting content, source, rights and publication review.
- Review status is shared page-level context, not a per-topic badge or comparative approval signal.

## 6. Motion & Interaction

Only interactive anchors move. Hover/focus may translate upward by 4px and change the background; active returns to the resting position. Reduced-motion removes transitions and translation through the catalog and global contracts. No decorative or continuous animation is permitted.

## 7. Depth & Surface

Use borders and tonal shift only. No shadow, blur, texture, illustration or image hero. The repeated card rhythm and question/payoff structure carry the visual identity; no topic gains hierarchy through scale, area, accent color or decoration.

## 8. Accessibility Constraints & Accepted Debt

- Semantic headings and canonical anchors; visible focus and at least 44px targets.
- Full titles, opening questions and payoffs remain readable without JavaScript or truncation.
- Repeated information order lowers scanning and memory cost; domain labels supplement rather than replace topic titles.
- Native vertical document scrolling remains available at desktop, narrow viewports and text zoom. No horizontal or internal card clipping is allowed.
- All active entries remain review-required; the catalog must not imply content, rights or publication approval.
- Browser visual QA is intentionally pending for the lead's serialized static-build review; this scoped change does not claim rendered approval.
