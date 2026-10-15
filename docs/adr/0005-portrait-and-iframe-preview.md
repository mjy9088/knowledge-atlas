# ADR 0005 — Portrait projection and iframe comparison

- Date: 2026-10-16
- Status: Historical screen implementation; superseded by ADR 0014

Keep narrow interactive web reading separate from portrait projection. Compare desktop, narrow web, and portrait through independent scaled iframes in /preview.html. Large reference viewports should be scaled to fit the review page.

The original 9:16 proposal was replaced by the user's 3:4 decision: 1080×1440. Optional title/context occupy the top/bottom while essential reasoning remains central. The legacy lab shows automatic progression with a filling row background, canceled on invalidation or scene exit. Projection and web share proof/model data; iframe preview is not publication or a media export.

The standalone prototype described here is retired. [ADR 0014](0014-topic-layout-and-prototype-retirement.md) defines current reader/tool boundaries; reusable scientific/timeline contracts are preserved.
