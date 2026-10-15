# ADR 0005 — 모바일 웹과 세로 재생의 분리

상태: 로컬 구현 후보 / 2026-10-16. 피드백 `feedback:2026-10-16.three-views`.

모바일 웹은 기기 가용 영역에 맞춘 입력·탐색 화면으로 유지한다. `shorts.html`은 독립적인 1080×1920(9:16) HTML 재생 화면이다. 위 제목과 아래 보조 설명은 내용을 이해하는 데 필수인 조건을 담지 않는다. 중앙은 목표·전제·참조 행·규칙·결론과 의미의 한계를 담는다. 재생 조작은 비율 영역 바깥에 둔다. YouTube 업로드·파일 렌더·음성·플랫폼별 UI 안전영역 검증은 포함하지 않는다.

두 표현은 공유 예시(`inference-presets.mjs`)와 동일 `deriveProof/createVideoTimeline/frameAt`을 사용한다. 세로 표현은 모형을 다시 정의하지 않고 같은 proof를 `mountInferenceVisual`로 표시한다. `window.__atlasShorts`의 `getState/setState/reset/seek`는 밀리초 시점을 재현하며 상태 복원/seek는 일시정지한다. 기본 HTML 재생은 한 번 실행해 끝에서 멈춘다. 문서가 숨겨지면 정지하고 사용자가 재생을 다시 선택한다. CSS reduced motion은 등장 애니메이션만 제거한다.

`preview.html`은 데스크톱 1920×1080, 모바일 웹 390×844, 세로 stage 1080×1920의 독립 iframe을 보여준다. 세로 iframe의 전체 높이 1972px는 stage 1920px와 조작부 52px의 합이다. CSS transform으로 표시만 축소하며 iframe viewport는 보존한다. 데스크톱 축소 상한은 50%, 세로 화면은 40%이고 가용 너비·높이에 맞춰 더 줄인다. 작은 비교 페이지는 패널을 줄바꿈한다.

공통 예시 전환/다시 시작은 세 iframe을 새로 로드한다. 이후 편집과 재생 시점은 독립적이다. `preset` query는 등록된 여섯 예시만 선택하며 잘못된 이름은 기본 예시로 되돌린다. 임의 스크립트·외부 iframe·postMessage 명령은 받지 않는다. 기존 slide hash 이동은 iframe 안에서 상위 비교 페이지를 자동 스크롤하지 않는다. 재생 이력의 동기 비교나 임의 편집 상태의 세로 투영은 후속 범위다.
