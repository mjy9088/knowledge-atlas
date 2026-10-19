# Projection contracts

The proof-specific `Timeline` in `types.ts` and its Canvas presentation remain separate from static article projections.

## Static article timing

`static-article.ts` accepts canonical article/page data and an unknown quality record. The quality record is validated against the article identity, series and ordered scene IDs before construction. This bounded adapter supports only `counting-zero` and `inertial-motion`; model, interactive and experiment pages are rejected. It performs no I/O or rendering.

`createStaticArticleTimeline` returns frozen contiguous cues containing the scene title, canonical sentence-range text, block claim references and complete static reader state `{sceneId}`. Scene budgets come from `quality.json`, resolve to integer milliseconds, and retain `timingStatus: planned`. These are silent review timing plans, not observed narration measurements or approved content.

`staticArticleFrameAt(timeline, timeMs)` selects half-open intervals at hard cuts. The duration endpoint and later times select the final cue; negative and nonfinite times are rejected. Frames are detached snapshots. Scene IDs resolve against the matching canonical static build; this timeline alone does not capture or fingerprint build bytes.

`createStaticArticleCursor` exposes `getState`, `setState`, `seek` and `reset`. Saved state is exactly `{version: 1, articleId, timeMs}`. Restoration rejects foreign identities, extra fields and times outside the closed duration range atomically. `seek` clamps beyond-duration times; `reset` returns the opening frame. Neither requires prior interaction.

DOM capture, media encoding, captions, immutable build snapshots and artifact previews are not implemented by this module. The existing local proof renderer remains documented in [Development](../../docs/DEVELOPMENT.md).
