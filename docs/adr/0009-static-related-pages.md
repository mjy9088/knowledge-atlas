# ADR 0009 — Static routes with atomic interactive entry

## Context

Articles must remain readable without a running client application or SPA fallback. Painting the static source before replacing it with an interactive layout produces an incorrect temporary scene, especially when the requested scene is in a fragment that the server cannot see.

## Project impact

Catalog routing, build/dev HTML generation and browser entry share article identity and content ranges. Every reader uses materialized scene paths.

## Alternatives

Continue visible progressive enhancement and accept a source-to-interactive layout change; introduce a runtime framework with server rendering of every experiment; or retain static delivery and mount the interactive document atomically. A framework adds dependencies and does not itself resolve fragment-only initial state.

## Decision

Keep the small Node static builder and shared HTML renderer. Use domain-root directory routes and stable block/sentence references. Deliver the interactive source in an inert template, load the shared controller, and mount its resolved scene and adapters synchronously before the first reader paint. Supply a separate readable no-script document and recover static navigation if controller loading fails. Select scenes only from their directory paths.

## Consequences

Hosting needs directory indexes/root-relative paths, without a client-router fallback. Interactive readers wait for their modules before appearing, rather than painting an incompatible temporary layout. Static fallback remains readable; interactive state uses validated browser adapters and survives client scene navigation. Fragments address document anchors and panels, rather than scenes. Build hashes identify review candidates, not publication approval.
