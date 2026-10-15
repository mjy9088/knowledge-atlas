# 모순 폭발의 연관 설명과 출처 조사

2026-10-16. 사용자 요청에 따라 빈 근거로 남아 있던 네 지식 관계에 근거를 연결하고, 웹에서 독립적으로 읽는 설명 네 개를 작성했다. 영상의 중심 주제를 늘리기 위한 삽입물이 아니라 모순 폭발에서 이어 탐색하는 웹 원본이다.

## 작성한 내용과 계약

`content/formal-logic/explosion/related.json`의 `claims` 배열은 기존 claim 형식(`id/kind/statement/scope/assumptions/sourceRefs/reviewStatus`)을 따른다. `articles` 배열은 `id/conceptId/title/reviewStatus/blocks/relatedConcepts`를 가진다. 각 블록에는 안정적인 ID와 `text/claimRefs`가 있다. CH 설명은 `concept:set.ch`를 주 개념으로 삼고 `concept:logic.independence`도 연결한다.

- 일관성: 모순을 도출할 수 없다는 성질, 폭발로 인한 모든 문장의 도출.
- 초일관 논리: 비폭발성, 직관주의 논리와의 구별, 추론 관계와 진리관의 구별.
- ZFC: ZF에 선택공리를 더한 공리계, `Con(ZFC)` 조건의 의미.
- CH와 독립성: 기수 비교와 CH, 괴델·코언의 상대일관성 결과, 고정된 이론에 대한 독립성.

새 claim 8개 중 `claim:logic.consistency.nontrivial`은 본편에서도 참조할 수 있는 공통 설명이다. **폭발 규칙이나 제한된 탐색 실패가 CH의 독립성 증명이라는 서술은 없다.** `Con(ZFC)`는 상대일관성 정리의 조건이며, 일관성이라는 말 자체에서 CH 독립성이 따라오는 것이 아니다.

## 실제 읽은 자료와 사용 범위

1. [forall x: Calgary, Chapter 17 §17.8](https://forallx.openlogicproject.org/html/Ch17.html): 모순과 폭발 규칙, 임의 문장으로의 도출. 기존 source ID를 보존했다.
2. [Can Başkent, Paraconsistency and Topological Semantics](https://arxiv.org/abs/1107.4939v2), PDF p.1 §1.1: 저자 연구논문의 도입에서 폭발, 고전·직관주의 논리의 폭발성, 초일관성의 정의를 확인했다. 이 논문의 위상수학 결과는 콘텐츠 근거로 사용하지 않는다. arXiv 표기는 v2/2011이지만 HTML·PDF 내부 날짜가 서로 다르게 표시되어 정확 판본 대조가 필요하다. HTML의 CC BY-NC-SA 3.0 표기는 기록했으며 공개 사용 승인으로 해석하지 않았다.
3. [Andrew Marks, Set Theory](https://math.berkeley.edu/~marks/notes/set_theory_notes_4.pdf): 저자 대학 강의노트의 §1 pp.4–6(기수/ZFC), §1.1 pp.7–8(일관성/괴델·코언 결과와 독립성), §2 pp.10–11(공리), §11 p.49(CH 표기)를 읽었다. 표지는 Updated January 31, 2026이라고 표시한다. 저자가 오타·오류 가능성을 경고한 노트여서 CH의 정의와 괴델 방향은 다음 자료와 교차 대조했다. §§20–21/26은 심화 읽기 위치이며 이번에 증명 전체를 검증한 범위가 아니다.
4. [Solomon Feferman, 2nd Bernays Lecture](https://virtualmath1.stanford.edu/~feferman/papers/BernaysLecture2.pdf): 저자 강연 슬라이드 8–12(기수·가산성과 CH), 15(괴델의 ZF 상대일관성 방향). 강연 후반의 철학적 견해를 확립된 수학 사실로 채택하지 않았다.
5. [Priest·Tanaka·Weber, Paraconsistent Logic, SEP Summer 2026](https://plato.stanford.edu/archives/sum2026/entries/logic-paraconsistent/): 도입·§1·§1.1과 저자/인용 정보를 읽었다. 연구논문의 새 정리를 대신하는 근거가 아니라, 비폭발 추론과 참인 모순을 인정하는 진리관의 구별을 위한 **전문가 집필 해설**로 유형을 구분했다.

추가 조사에서 Cohen의 [1963년 원논문 서지](https://pmc.ncbi.nlm.nih.gov/articles/PMC221287/)를 찾았으나 본문 접근이 CAPTCHA로 막혀 이번 콘텐츠의 검토 완료 근거로 등록하지 않았다. Priest의 저자 논문 목록은 서지 확인만 했으며 1979년 LP 논문 본문을 읽었다고 주장하지 않는다. 검색 중 열어 본 Tennant의 LP 초안에는 인용/회람 제한 고지가 있어 저장소 근거와 설명에 사용하지 않았다. Unicamp 후보 PDF는 읽기 실패하여 사용하지 않았다.

고전 이가 해석에서 P와 ¬P의 동시 참 해석이 없다는 본편 문장은 `claim:logic.classical.contradiction-unsatisfiable`로 별도 분리했으며, forallx §17.8 끝의 valuation 설명에 연결했다.

## 검토 상태와 제한

구현한 것은 출처 메타데이터·정밀 절 위치·조건이 있는 claim·짧은 설명·관계의 연결이다. 새 claim과 관계는 `draft-source-aligned`, 독자가 읽는 설명은 `needs-content-review`이다. 외부 원문, 그림, 표, 직접 인용문을 저장소에 복제하지 않았다.

원문 바이트 스냅샷/해시, 원문 판본의 정확한 검증, 독립적인 전문가 검토, 권리 검토 및 공개 승인은 **아직 완료되지 않았다**. `contentHash: null`, `sourceSnapshotVerified: false`, `published: false`를 유지한다. 외부 기관의 아카이브 URL이 있어도 이 프로젝트에서 원문 스냅샷을 검증했다는 뜻은 아니다. 공개/유튜브 업로드를 수행하지 않았다.

검증 스크립트의 참조 검사와 UI 연결은 통합 작업에서 확인한다. 구조 검사 통과가 수학 내용의 독립 검토를 대신하지 않는다.
