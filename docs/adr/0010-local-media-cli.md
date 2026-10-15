# ADR 0010 — Public web and local media CLI

- Date: 2026-10-16
- Status: Implemented locally

Separate reader-facing JAMstack pages from media production. The static builder copies explicitly selected web assets. Local render helpers, encoders, muxers, and CLI instructions are outside the reader's public navigation/build. HTML animation and iframe review remain web features.

Convert existing WebM through scripts/encode-mp4.mjs, invoking mise FFmpeg/ffprobe via argument arrays. Refuse overwrite and record hashes/media metadata. There is no web MP4 conversion endpoint. The development-only WebM helper is retained; this decision does not claim a headless frame-rendering CLI has been implemented.

Verify CLI preflight and actual output diagnostics when changing media behavior. Do not use lists of deleted filenames/UI strings as a substitute for behavioral tests. Review, rights, and publication approval remain separate.
