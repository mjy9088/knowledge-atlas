# ADR 0001 — 웹 원본과 영상 projection

- Date: 2026-10-16
- Status: Accepted for first vertical slice

## Decision

내용/근거/모형/Scene은 공통 원본으로 관리한다. 웹에서 상태는 사용자가 조작하고, 동영상은 승인된 scene state/timeline의 deterministic playback이다. 영상의 음성·강조·시간 편집은 별도 projection metadata에 포함되며, claim 자체를 영상 전용으로 무단 변경하지 않는다.

## Reasons

- 웹 중심의 비선형 지식 탐색 목표에 부합.
- 내용을 한 군데서 정정해 여러 출력물에 반영 가능.
- 에이전트가 UI/영상 결과를 동일 scene contract로 검사·수정 가능.

## Consequences

- 장면은 의미 있는 state API/semantic element IDs가 필요함.
- 영상에 적합한 시점·강조·타이밍은 별도 경로로 제작해야 함.
- 특정 시점 렌더를 가능하게 하려면 이벤트 리플레이/seed 기반 결정성 확보 필요.

## Revisit when

비결정적 실시간 시뮬레이션이나 무거운 WebGPU 장면을 영상으로 처리하는 방식이 성능을 심각하게 제한하는 경우. 대체 엔진을 써도 공개된 claim/model/scene event contract는 유지한다.
