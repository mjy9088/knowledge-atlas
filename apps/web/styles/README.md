# Public design foundations

The public UI uses the [Carbon White theme](https://www.carbondesignsystem.com/building-blocks/foundations/themes/overview) as its design foundation. `design-system.css` owns the semantic roles, spacing, typography families, focus and shared reset. Local DOM/SVG components implement the experience; this does not install Carbon components or claim Carbon conformance. No external font, icon, illustration or component source is bundled by this choice. System-installed font fallbacks are used; network font services are not required.

## Visual rules

- Use white content surfaces on Gray 10 canvas, Gray 100 primary text, Gray 70 secondary text, Gray 20 separators and Blue 60 primary actions. Choose colors by semantic role through `--ds-*` tokens rather than a topic palette for ordinary UI.
- Use the 4/8/12/16/24/32/48 spacing scale and a clear label/body/heading hierarchy. Start with typography, alignment and whitespace before adding containers. Square edges and fine rules replace nested rounded cards. Keep shadows for genuine overlay separation.
- One primary action owns each control group. Secondary actions use neutral surfaces; links use blue. Keyboard focus remains visible and information never relies on color alone. Avoid decorative animation, card lift and gradient treatments.
- Diagrams use the same ink, line weights, type and role colors as the UI. Scientific identities may use additional stable, labelled accents; selection, truth, exclusion and accessibility remain distinguishable. A palette change must reach references, legends, controls, diagrams and static SVG alternatives together.
- Preserve meaningful quantities and exact labels. Use accurate schematic shapes and connected relationships rather than decorative illustrations or repeated prose boxes. State illustrative geometry and sampling limits visibly where relevant.
- Every explanation receives the same foundations and review. No topic or scene is an exemplar, a template to imitate, or exempt from the criteria.

## Ownership and verification

The catalog owns equal entrance tiles, the reader owns its shared navigation/panels and each topic owns its scientific representations. Bounded and document-scroll layouts retain their contracts in Product and topic READMEs. Typography must be inspected at the logical 960×540 composition, uniformly fitted 1920×940 desktop and 390×844 narrow viewport; do not solve clipping with hidden overflow or arbitrarily smaller text.

Evaluate visual hierarchy, craft, contrast, correspondence and whole-flow consistency on the actual static build. Separately exercise changed/unsupported input, reset, restoration, reduced motion and navigation. Geometry tests support that inspection without establishing good design or learner understanding. New design decisions supersede obsolete appearance constraints, while models, claims, sources, stable IDs and reader edits retain their contracts.

Official references: [color roles](https://www.carbondesignsystem.com/building-blocks/foundations/color/tokens), [spacing](https://www.carbondesignsystem.com/building-blocks/foundations/spacing/overview), [2x Grid](https://www.carbondesignsystem.com/building-blocks/foundations/2x-grid/overview). These are design references, not imported assets or source-code licensing assertions.
