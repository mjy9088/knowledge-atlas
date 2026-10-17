# ADR 0020: Short titles and topic-owned vector artwork

Date: 2026-10-17. Status: implemented locally; publication remains separate.

## Title contract

`Article.title` is the canonical full title. Optional `Article.shortTitle` supplies a compact display name. The catalog card and article's visible heading use `articleDisplayTitle()`, falling back to the full title for every existing article without a short title. Document titles, Open Graph title metadata and title attributes retain the full form. Validate both fields when loading catalog JSON: nonempty strings, at most 300 characters for the full title and 160 for the short form. Adding this presentation field does not change article, scene or claim identity or saved reader state.

The weekday article uses the requested short title `이걸로 IQ를 재겠다고?` and full title `이걸로 IQ를 재겠다고? (어제가 내일이었으면...)`. This editorial question does not introduce an IQ assessment, score or time limit.

## Artwork ownership and consumption

Optional `ContentPage.thumbnail` declares a local SVG `src`, meaningful `alt`, and an optional `coverSrc` referencing a named view in that same file. Validate the content-only asset path and view fragment. Do not accept an external URL or script as artwork configuration. The shared catalog renderer displays the thumbnail; the shared reader adds the cover image only for articles opting into a title slide. Titles remain real HTML headings rather than only pixels or SVG text.

The topic owns `content/formal-logic/weekday-worlds/thumbnail.svg`. Its ordinary view contains the full poster; the `#question` view exposes the question card and choices for use beneath the HTML title. Both views use one editable vector source. Metadata records its original authorship, reference-only composition inspiration, absence of imported pixels/logos and pending publication status. No generated raster asset is referenced. The user-supplied reference image itself is not stored in the site or represented as a scientific source.

The static builder copies SVG files only with content assets, hashes them in the review manifest and serves them with the existing SVG MIME handling. Thumbnail cards use a compact side-by-side layout on supported desktop catalogs so one illustration cannot clip its caption or push other topics outside the frame. Narrow catalogs retain ordinary page scrolling. Cover CSS constrains image and heading bounds without changing the existing title/content restoration or fixed navigation contract.

## Verification

Model tests exercise short-title selection, legacy fallback, unchanged canonical titles and rejection of malformed JSON. Standalone Playwright checks canonical document/Open Graph titles, visible short headings, successful SVG decoding, both artwork consumers, cover restoration, legacy articles and supported viewport/content bounds. Screenshots establish presentation only; source/rights review and publication approval remain independent.
