# ADR 0013 — Separate evaluation feedback from topic identity

- Date: 2026-10-16
- Status: Implemented locally

Keep scene titles stable when an input produces a counterexample, an unavailable result, or a validation error. Present that outcome in a separate live status and disable the dependent explanation instead of replacing its heading with the result. Re-enable it on valid recovery/reset. Preserve editing and previous/next navigation, as well as useful counterexample visualization. Default conceptual prose is independent of a customized explanation's availability.

Use a domain-neutral availability component with caller-supplied boolean availability and summary/detail text. It has detached state, validated restoration, and reset, without references to logic, proof rules, or scientific terminology. The lesson and related readers both use it. This chooses the explicit unavailable-content behavior allowed by the request; it does not automatically replace the selected goal or invent a queue of alternative goals.

Browser regressions cover FDE feedback/title separation, invalid lesson input, navigation/recovery, viewport fitting, and a non-logic measurement-content example using the same component. Scientific models, claims, fixtures, and publication state are unchanged.
