# ADR 0014 — Topic ownership and prototype retirement

- Date: 2026-10-16
- Status: Implemented locally

Retire the three-view comparison, legacy slide lab, and standalone portrait playback screens. Make the knowledge catalog the home page. Preserve the active custom lesson/article readers and their public URLs. Move local media production to `tools/media/`, served only by the development server; retain the MP4 CLI.

Organize articles and their owned claims by domain/topic. Move consistency and paraconsistency out of the explosion folder, and ZFC/CH into set theory. Preserve all scientific text, IDs, source locators, and review states. The unreferenced-in-articles classical contradiction claim belongs to explosion and is moved into that topic's claim file. Collections retain stable editorial metadata; navigation relationships remain explicitly source-backed.

Register article data and presentation metadata in `content/catalog.mjs`. Share catalog loading between browser and build through injected I/O. Reject conflicting routes/article identities and duplicate claim definitions. A topic without an experiment uses the same reader with conceptual cards; selecting a model requires a real registered adapter.

Separate browser components, page wiring, domain configuration, pure input state, projection data, and local media tools. Extract shared pure proof presentation/input state so projection modules do not depend on browser page adapters. Keep the original pilot source/state contracts and their scientific fixtures; remove only tests specific to retired screen navigation.

The authoring contract is [Content structure](../CONTENT-STRUCTURE.md). ADRs 0004/0005's legacy screens and 0003's standalone HTML player are superseded by this cleanup; their reusable model/timeline contracts remain. This is a local organization change, not a new source review, media render, framework migration, or publication.
