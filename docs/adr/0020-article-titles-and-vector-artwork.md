# ADR 0020: Short titles and topic-owned vector artwork

Date: 2026-10-17. Status: implemented locally; publication remains separate.

## Title contract

`Article.title` is the canonical full title. Optional `Article.shortTitle` supplies a compact display name. The catalog card and article's visible heading use `articleDisplayTitle()`, falling back to the full title for every existing article without a short title. Document titles, Open Graph title metadata and title attributes retain the full form. Validate both fields when loading catalog JSON: nonempty strings, at most 300 characters for the full title and 160 for the short form. Adding this presentation field does not change article, scene or claim identity or saved reader state.

The weekday article uses the requested short title `이걸로 IQ를 재겠다고?` and full title `이걸로 IQ를 재겠다고? (어제가 내일이었으면...)`. This editorial question does not introduce an IQ assessment or score. Its cover recreates the meme's challenge heading and 20-second motif for discussion, without enforcing a timer.

## Artwork ownership and consumption

Optional `ContentPage.coverArtwork` declares a local SVG `src` and meaningful `alt`. Validate the content-only asset path. Do not accept an external URL or script as artwork configuration. The reader adds the image only on an opted-in title slide. The catalog remains text-only; cover/reference artwork does not define a thumbnail. Titles remain real HTML headings rather than only pixels or SVG text. This corrects the earlier shared thumbnail/named-view design; a reusable title-page authoring system is not required.

The topic owns `content/formal-logic/weekday-worlds/cover.svg`. The full image appears beneath the HTML title: a brown challenge banner, a drawn stopwatch with “20초”, the riddle and its question/choices. Metadata records its independent drawing, meme reference, rhetorical framing, absence of imported pixels/logos and pending rights/publication review. No generated raster asset is referenced. The user-supplied reference image itself is not stored in the site or represented as a scientific source.

The static builder copies SVG files only with content assets, hashes them in the review manifest and serves them with the existing SVG MIME handling. Narrow catalogs retain ordinary page scrolling. Cover CSS scales the complete poster to the available height without cropping its text, preserving title/content restoration and fixed navigation.

## Verification

Model tests exercise short-title selection, legacy fallback, unchanged canonical titles and rejection of malformed JSON. Standalone Playwright checks canonical document/Open Graph titles, visible short headings, text-only catalog cards, successful cover SVG decoding and challenge text, cover restoration, the mapped question, legacy articles and supported viewport/content bounds. Screenshots establish presentation only; source/rights review and publication approval remain independent.
