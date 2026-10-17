# ADR 0010 — Public web and local media boundary

## Context

Readers do not need encoders, production endpoints or local tool dependencies.

## Project impact

Asset selection and deployment exclude local media tooling from the public runtime.

## Alternatives

Expose browser/server MP4 conversion as a public feature; this couples production resources and permissions to the reader.

## Decision

Copy only selected reader roots. Keep local WebM tools under tools/media and invoke FFmpeg/ffprobe through the local CLI using argument arrays, overwrite refusal and output diagnostics.

## Consequences

Deploy only the generated static site, never the repository/development server. Video review and explicit publication authorization remain independent of a successful conversion.
