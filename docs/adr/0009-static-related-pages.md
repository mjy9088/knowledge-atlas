# ADR 0009 — Static related articles

- Date: 2026-10-16
- Status: Implemented locally

Pre-render related articles and evidence from shared content, block IDs, and sentence ranges; enhance with client-side dialogue navigation and experiments. Development and build use the same HTML renderer. Preserve a static reading fallback rather than rely on SPA routing.

Use a small Node builder rather than require Astro/React now. Generate domain-root directory routes and hashes for local review. The original consistency-only experiment was later extended by topic-specific adapters in 0011. Public asset selection and local production tools are governed by 0010. Building files is not deployment or publication approval.
