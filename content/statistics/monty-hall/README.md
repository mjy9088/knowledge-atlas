# monty-hall draft reader

## Explanatory purpose and scene plan

The payoff is the ability to recalculate after changing the host rule or the evidence event, not merely remember the switching answer. Distinguish an always-switch strategy over all games, conditioning on any goat reveal, and conditioning on one numbered reveal. The [scene plan](slide-plan.json) is a proposed authoring contract; learner attainment and independent approval remain unassessed.

| Scene | Content and purpose | Representation or interaction | Success check |
| --- | --- | --- | --- |
| `question` | Two unopened doors alone do not establish equal posterior weights. | Static door setup without an answer gate. | Reader asks for the host's selection rule. |
| `protocol` | Fix a uniform prize, an independent initial choice, an informed always-goat host, and an always-offered switch. | Static rule sequence; distinguish fair tie-breaking from the essential host constraints. | Reader identifies what is fixed before comparing probabilities. |
| `strategy` | Enumerate prize positions for a fixed initial door; switching wins in both initially wrong cases. | Existing exact branches and optional sampling, with a complete case argument in prose. | Reader derives 2/3 without assuming fair host tie-breaking. |
| `shortened` | Explain why observing one goat does not reveal the policy that generated it. | Static missing-policy comparison. | Reader distinguishes an actual event from an always-followed rule. |
| `compare` | Derive retained masses 1/3,1/6,1/6 under a blind uniformly random reveal; normalize by 2/3. | Existing rule selector compares informed and blind hosts; exact arithmetic is given before sampling. | Reader derives conditional switching probability (1/3)/(2/3)=1/2 and explains which games were excluded. |
| `specific` | With initial door 1 and informed host, define D2 as door 2 opened; use host tie probability t to obtain masses t/3,0,1/3. | Original three-case table and worked t=1/2,1,0 examples. Static exposition is deliberate: the existing experiment does not vary tie policy or condition on a named door. | Reader derives 1/(1+t) and explains why this does not contradict unconditional 2/3. |
| `close` | Answer the original question through prior, rule and evidence event rather than the count of unopened doors. | Static synthesis and a relevant link to family observation. | Reader can specify what must change when recalculating a different version. |

All seven scenes form one self-paced mainline through the shared chaptered reader. Native document scrolling preserves the worked arithmetic rather than shrinking it into a fixed caption. Selected scenes retain the registered possibility adapter; its [state, scene, observation and layout contract](../../../apps/web/topics/statistics/possibility-lab.md) owns seeded experiments and absolute playback. The adapter conditions on any goat reveal with uniform tie-breaking; it must not be mistaken for the separate numbered-door calculation. Edited experiment results supplement the canonical argument.

## Source scope

Gautam Iyer's [Conditional Probability and Independence](https://www.math.cmu.edu/~gautam/c/2026-425/notes/independence.html), Definition 2 and Propositions 5–6, were reconsulted on 2026-10-20 for conditioning and total observation probability. The three prize cases, blind-host weights and numbered-door t calculation are independently authored finite deductions, not examples or quotations from that source. The separate Gill abstract reference remains an inherited consultation with its existing limits; this revision does not claim a fresh full-paper review. No external artwork, prose or code is imported, and no exact source-byte revision is established.

Canonical article and claim IDs, prose and evidence locators remain topic-owned. Source and rights review, independent editorial approval, measured video pacing and publication remain pending. Web reading and interaction are unlimited; the format budget concerns video playback only. Preserve accepted source edits and request explicit diffs rather than regenerating the manuscript.
