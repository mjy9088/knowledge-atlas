# ADR 0002 — 초기 파일 기반 관리와 판본 추적

- Date: 2026-10-16
- Status: Accepted for bootstrap only

## Decision

초기에는 Git + JSON/Markdown 파일로 `source`, `claim`, `concept`, `relation`, `scene`, `projection`을 관리한다. 파일 하나의 내용이 진리/승인을 자동 의미하지는 않는다. 테스트 가능한 validation scripts를 둔다.

## Reasons

- 1개 파일럿 제작 전 DB·분산 큐 구축을 피함.
- AI와 사람이 원본을 읽고 수정하고 diff/rollback하기 쉬움.
- 나중에 그래프 DB/관계형 저장소로 이전할 때 stable ID를 유지할 수 있음.

## Consequences

- 아직 승인 워크플로·진정한 immutable snapshots·동시 수정 충돌·원자적 배포는 미구현.
- 파일/링크 수가 늘면 외부 변경 추적과 DB 검색을 도입해야 함.

## Revisit when

여러 제작자가 동시 편집하거나 수천 개의 자료 변경을 자동 처리하기 시작할 때.
