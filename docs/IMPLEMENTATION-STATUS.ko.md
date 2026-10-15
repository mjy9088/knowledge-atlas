# 초기 구현 현황 — 2026-10-16

이 문서는 ‘설계 요구’와 ‘실제 실행 가능한 기능’을 혼동하지 않기 위한 구현 감사표다.

## 현재 확인된 기능

- [x] Git 저장소 초기 커밋에 필요한 원본/문서/코드 구조.
- [x] 의존성 없이 실행되는 단일 웹 시연, 검증된 HTTP GET으로 HTML/JSON/JS 제공.
- [x] `P`, `¬P`, `Q/R/S` 입력 기반의 **특정 증명 경로** 결정적 모델(정리증명기 아님).
- [x] 출처·주장·개념·관계·장면·projection 메타데이터 예시와 교차 참조 validation.
- [x] Node 기본 테스트 4개 통과.
- [x] 30초 예시 timeline → 스토리보드 JSON 생성 (실제 미디어 아님).
- [x] 원자료 ID → 영향받을 Claim/ContentBlock/Scene/Projection 후보 표시.
- [x] 공개 전에 필요한 승인/원자료 스냅샷/렌더 미완료 상태를 감지해 `release:check` 실패.

## 아직 없는 기능

- [ ] 별도 과학 전문 검토 및 원자료 본문 범위/해시의 불변 스냅샷.
- [ ] 완전한 Scene API, 독립 시간 seek, 참값/증명 일반 엔진, 접근성 자동화.
- [ ] Astro/MDX/React, Remotion/FFmpeg와 실제 프레임 렌더의 통합.
- [ ] TTS·자막·음성·최종 MP4 생성.
- [ ] AI 에이전트 자동 제작, CV 검사, 전문 편집기, 피드백 적용·보존.
- [ ] 외부 데이터 자동 수집, 최신성 감시, 실제 공개 manifest와 배포.
- [ ] 수익화 가능 여부를 포함한 실제 출처·이미지·음원별 권리 심사.

## 현재 테스트 기록

실행 환경: Node.js v22.16.0, npm 10.9.2 (초기 로컬 검증 환경).  
`npm run validate`: 성공 (2 sources, 9 concepts, 7 relations, 3 claims, 5 30초 placeholder segments).  
`npm test`: 4/4 통과.  
`npm run storyboard`: `artifacts/storyboard.json` 생성.  
`npm run impact`: 영향 후보 출력.  
`npm run release:check`: **의도된 실패** (근거·권리 승인·콘텐츠 검토·실제 영상 렌더 미완료).  
`npm run dev`: 루프백 HTTP에서 HTML/JS/JSON 응답을 확인. 실제 브라우저 상호작용/CV 테스트는 아직 자동화하지 않았음.

실행 기록은 초기 확인값이며 후속 작업 후에는 새로운 환경에서 검사 결과를 갱신한다.
