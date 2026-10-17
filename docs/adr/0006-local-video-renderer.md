# ADR 0006 — Local Canvas/WebCodecs rendering

## Context

A deterministic projection needs a local video path without adding a media runtime to public readers.

## Project impact

The projection boundary connects shared timeline snapshots to a replaceable local rendering/encoding engine.

## Alternatives

Require a server renderer or application framework now; neither is needed for the bounded silent local workflow.

## Decision

Render shared complete snapshots with Canvas and encode VP8 WebM with WebCodecs. Keep production UI outside public assets and MP4 transcoding in the local CLI.

## Consequences

Software rendering and in-memory packets limit size/duration; browser codec/preview support varies. Headless DOM rendering and narration/audio remain planned. Output profiles and review procedures belong in Development.
