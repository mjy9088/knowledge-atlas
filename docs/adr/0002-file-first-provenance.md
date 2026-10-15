# ADR 0002 — File-first provenance

- Date: 2026-10-16
- Status: Accepted for bootstrap

Use Git, JSON, Markdown, and modules for sources, claims, concepts, relations, scenes, and projections. Preserve logical IDs and inspectable diffs when storage changes. File presence is not scientific approval.

This avoids building a database and distributed queue before validating the pilot. Immutable source capture, concurrent editing, protected-patch conflict handling, and atomic publication are not implemented. Revisit storage when concurrent authors or large source-refresh workloads justify it. ADR 0012 defines documentation/feedback record retention.
