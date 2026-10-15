# ADR 0006 — Local video rendering

- Date: 2026-10-16
- Status: Implemented locally; web MP4 API superseded by 0010

Use shared timeline snapshots to draw Canvas frames and encode VP8 WebM with WebCodecs. Support 1080×1440 or 1920×1080 at 24/30 fps. Generate captions and diagnostics; validate queue handling, cancellation, frame timing, metadata, and preview errors explicitly.

The local helper currently stores packets in memory and produces silent video. Browser preview is not guaranteed on every profile/platform. A successful render does not prove frame quality or scientific correctness. The original 180-second generic lesson was superseded by the focused 134-second episode, with 180 seconds a ceiling rather than a target.

MP4 conversion now uses only the local mise FFmpeg/ffprobe CLI described in [Development](../DEVELOPMENT.md) and ADR 0010. The earlier conversion endpoint is historical, not an active contract. End-to-end headless frame rendering, audio, and approved publication manifests remain incomplete.
