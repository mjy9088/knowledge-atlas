# ADR 0001 — Shared web/video source

## Context

Web and video must preserve the same claims, assumptions and scientific state.

## Project impact

All content/model/scene/projection boundaries follow one source of truth.

## Alternatives

Maintain independent video scripts/models; this risks competing scientific explanations.

## Decision

Claims, models, explanation blocks and scenes are shared source. Video timing, narration and emphasis are projection metadata. Scenes expose stable state and independent seeking.

## Consequences

Corrections can be traced across outputs; alternative renderers must preserve those contracts. Publication dependency locking remains planned.
