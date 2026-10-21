---
name: atlas-workflow
description: Run the Knowledge Atlas author, independent review and correction workflow. Use when the user asks for atlas-improve, atlas-review, atlas-resume, or an Atlas content workflow.
---

# Atlas workflow

This skill is the discoverable entry point when the client does not display project slash commands. Read `.opencode/commands/atlas-improve.md` and execute it against the requested registered slug. For a frozen candidate read `.opencode/commands/atlas-review.md`; for a saved run read `.opencode/commands/atlas-resume.md`.

Use the executable `pnpm content:workflow` gate, not a prose-only review. Preserve the independent evaluator boundary, current source/build identity and unverified dimensions. Do not invent execution, erase findings, or publish. The calling agent must have author permissions; `atlas-reviewer` is read-only.

If command discovery is in question, run `node --import tsx tools/content-workflow/activation.ts` to query the current loopback server. This check reports only command/agent names, never credentials. A fresh terminal `opencode` process alone does not prove the hosted client's registry was refreshed.
