# Pilot source-reading record

This consolidates the 2026-10-16 research notes and their later rule-adapter supplement. It preserves the previously recorded reading scope; the documentation cleanup is not a new source verification. Machine-readable source IDs, rights notes, and exact claim locators remain in `sources/registry.json` and the claim files. Do not infer stronger approval from the English translation.

## Recorded readings and use

1. [forall x: Calgary, Chapter 17](https://forallx.openlogicproject.org/html/Ch17.html): §17.8 for contradiction/explosion and its valuation discussion; §§17.3/17.4/17.7 for the bounded engine's other natural-deduction rules. The existing source ID is preserved. The book index advertised revision `c5cb415` dated 2026-09-27, but exact provider-revision correspondence and immutable bytes have not been independently locked.
2. [Can Başkent, Paraconsistency and Topological Semantics, arXiv v2](https://arxiv.org/abs/1107.4939v2): PDF p.1 §1.1 for explosion, the explosiveness of classical/standard intuitionistic logic, and the definition of paraconsistency. Its topological results are not used as evidence here. The v2/2011 listing and internal HTML/PDF dates differ and need reconciliation. The recorded HTML CC BY-NC-SA 3.0 notice is not publication permission for this project.
3. [Andrew Marks, Set Theory](https://math.berkeley.edu/~marks/notes/set_theory_notes_4.pdf): §1 pp.4–6 for cardinality/ZFC, §1.1 pp.7–8 for consistency and Gödel/Cohen results, §2 pp.10–11 for axioms, and §11 p.49 for CH notation. The cover says “Updated January 31, 2026.” The author's warning about possible errors motivated cross-checking CH and the Gödel direction against Feferman's lecture. §§20–21/26 are further-reading locations, not a record of checking their complete proofs.
4. [Solomon Feferman, Second Bernays Lecture](https://virtualmath1.stanford.edu/~feferman/papers/BernaysLecture2.pdf): slides 8–12 for cardinality/countability and CH, slide 15 for Gödel's ZF relative-consistency direction. Later philosophical views were not adopted as established mathematical facts.
5. [Priest, Tanaka, and Weber, Paraconsistent Logic, SEP Summer 2026 archive](https://plato.stanford.edu/archives/sum2026/entries/logic-paraconsistent/): introduction, §1, §1.1, and citation/authorship information. Classified as expert-authored exposition for distinguishing nonexplosive consequence from dialetheism, not a replacement for a primary paper proving a new theorem.
6. [Sutcliffe, Pelletier, and Hazen, Making Belnap's “Useful Four-Valued Logic” Useful](https://cdn.aaai.org/ocs/17599/17599-77711-1-PB.pdf): FLAIRS-31 (2018), printed p.116 §1, Figure 1 and Table 1 for FDE values/designated values and ¬/∧/∨ matrices; p.117 for the lack of an original FDE conditional and the classical-material-conditional MP counterexample. The paper's later conditional extensions are not implemented. The PDF's AAAI 2018 all-rights-reserved notice was recorded. `source:sutcliffe-fde-2018` has no approved reuse permission or captured immutable source bytes. The implementation uses independently written calculations, not copied tables, artwork, or code.

For set adapters, Marks p.4 (subset definition), p.10 §2 (subset notation and extensionality), and p.8 §1.1 (the two extensions and independence) were revisited. The resulting diagrams apply a restricted rule set and registered metatheorems; they do not re-prove relative consistency.

## Exclusions and unresolved evidence

Cohen's [1963 paper bibliographic record](https://pmc.ncbi.nlm.nih.gov/articles/PMC221287/) was found, but a CAPTCHA blocked the body. It was not registered as fully read evidence. Priest's publication list was consulted for bibliography only; the 1979 LP paper was not claimed as read. A Tennant LP draft carried citation/circulation restrictions and was not used. A candidate Unicamp PDF could not be read and was excluded.

No external prose, figures, tables, or quotations were copied into the published explanation source during this research. The registry's rights statuses still need review; independent wording does not itself settle every legal question.

## Claim coverage and limits

The related collection covers consistency/nontriviality, paraconsistency versus intuitionistic logic and dialetheism, ZFC and its consistency condition, and CH/cardinality/relative consistency/independence. `claim:logic.classical.contradiction-unsatisfiable` separately records the absence of a classical two-valued interpretation satisfying P and ¬P. The later adapter work added `claim:logic.fde.four-values`, `claim:set.relations.membership`, and `claim:set.relations.extensionality` without changing existing IDs or fixtures.

The original notes recorded eight new related claims and four new sources at that stage; subsequent additions bring the current registry to 19 total claims and seven sources. Historical counts are not current coverage claims.

Source alignment is provisional: claims remain `draft-source-aligned`, reader explanations `needs-content-review`, source content hashes may be null, and `sourceSnapshotVerified`/`published` remain false. Exact revision reconciliation, immutable-byte hashes, independent expert review, rights clearance, and publication authorization are incomplete. An external archive URL does not prove that this project verified its own snapshot. No publication or YouTube upload is implied.
