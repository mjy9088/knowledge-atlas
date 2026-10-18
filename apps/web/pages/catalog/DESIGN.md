# Knowledge Catalog Design System

## 1. Atmosphere & Identity

The catalog is a quiet, text-first atlas index: warm paper, botanical ink, and restrained outlined cards keep attention on questions rather than promotion. Its signature is the compact path through related knowledge, with pagination behaving like ordinary documents rather than an application dashboard.

## 2. Color

| Role | Token | Value | Usage |
| --- | --- | --- | --- |
| Page | `--catalog-paper` | `#f6f8f0` | Existing catalog background |
| Surface | `--catalog-surface` | `#ffffff` | Cards and pager controls |
| Ink | `--catalog-ink` | `#293f35` | Primary text |
| Muted | `--catalog-muted` | `#5f6f65` | Metadata and page status; AA contrast on paper and white |
| Link | `--catalog-link` | `#365c42` | Anchors and controls |
| Line | `--catalog-line` | `#d5dfcc` | Existing outlined surfaces |
| Selected | `--catalog-selected` | `#eaf0df` | Current page indicator |
| Focus | `--catalog-focus` | `#648a4c` | Keyboard focus ring |

Only these extracted catalog roles may be used by catalog-owned CSS.

## 3. Typography

| Level | Size | Weight | Line height | Usage |
| --- | --- | --- | --- | --- |
| Display | `clamp(25px, 3vw, 38px)` | default bold | `1.4` | Catalog heading |
| Card title | `18px` desktop, `21px` below wide desktop | default bold | `1.4` | Article short title |
| Body | inherited | `400` | `1.85` | Introductory copy |
| Metadata | inherited `small` | `400` | inherited | Scene/type summary |
| Eyebrow | `11px` | `400` | inherited | Atlas label |

The catalog uses `Segoe UI`, `Malgun Gothic`, `Noto Sans CJK KR`, Arial, `Liberation Sans`, `sans-serif`. Explicit Linux sans fallbacks avoid accidental monospace review captures. Korean copy retains `word-break: keep-all` with safe overflow wrapping. Card titles use `text-wrap: pretty` and compact inline phrase groups for common genitive/modifier, classifier and bound-noun constructions. Grouping preserves authored text and escaping; an unusually long group may wrap within its own bounded width rather than overflow. This is a limited typography rule, not a Korean syntax parser.

## 4. Spacing & Layout

The extracted base unit is 4px. Catalog-owned spacing uses `--catalog-space-1: 4px`, `--catalog-space-2: 8px`, `--catalog-space-3: 12px`, `--catalog-space-4: 16px`, `--catalog-space-6: 24px`, and `--catalog-space-8: 32px`.

The content limiter remains 1120px, widening to the existing 1500px at wide desktop. Enhanced desktop pages use one bounded viewport frame and a 12-card grid; narrow and unenhanced documents use normal document scrolling. No container hides overflow. The grid is four columns on wide desktop, three on standard desktop, and one on narrow screens.

At 1000–1599px enhanced desktop widths, cards use `--catalog-space-2` block padding and `--catalog-space-4` inline padding. This extracted compact density preserves the existing type scale while allowing four grid rows to fit the 900px supported height without clipping.

## 5. Components

### Catalog page
- **Structure**: labelled `section` containing one `.knowledge-grid` of canonical article anchors.
- **Variants**: selected or hidden by enhancement; all sections remain rendered and readable without JavaScript.
- **Spacing**: grid uses `--catalog-space-3` or `--catalog-space-4`.
- **States**: selected page is visible; nonselected enhanced pages use the native `hidden` state.
- **Accessibility**: section label announces page position; canonical card anchors and titles remain unchanged.
- **Motion**: none; page changes are ordinary URL navigation.
- **Layout**: intrinsic grid; desktop viewport is bounded, narrow fallback owns document scroll.

### Catalog pagination
- **Structure**: labelled `nav` with previous, numbered, and next anchors plus visible page status.
- **Variants**: first, middle, and last page omit unavailable directional links.
- **Spacing**: cluster gap uses `--catalog-space-2`; controls use `--catalog-space-2` and `--catalog-space-3`.
- **States**: default, hover, active, focus, and current page via `aria-current="page"`.
- **Accessibility**: real links preserve back, reload, and direct URLs; touch targets are at least 36px and focus uses the global visible ring.
- **Motion**: none.
- **Layout**: wrapping cluster; it never owns scroll.

## 6. Motion & Interaction

Pagination uses document navigation, not animated replacement. Existing focus behavior remains. Reduced-motion users therefore receive the same deterministic interaction without a separate motion path.

## 7. Depth & Surface

Use the existing borders-only strategy. Cards and pager controls use `--catalog-line`; the current page uses the selected tonal fill. No new shadows, textures, or decorative depth are introduced.

## 8. Accessibility Constraints & Accepted Debt

### Constraints
- WCAG 2.2 AA target, visible keyboard focus, semantic navigation, native links, and canonical hrefs.
- Every registered article appears exactly once in the enhanced sequence and remains present in unenhanced HTML.
- Desktop 1920×1080, 1920×940, and 1920×900 must have no document or card clipping; 390×844 may scroll vertically but not horizontally.
- Back, reload, and a direct `?catalog=N` URL restore the selected page.

### Accepted Debt

None.
