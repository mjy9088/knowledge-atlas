# 구현 현황 — 2026-10-16

이 문서는 ‘설계 요구’와 ‘실제 실행 가능한 기능’을 혼동하지 않기 위한 구현 감사표다.

## 입력 즉시 추론 갱신

`feedback:2026-10-16.live-inference`에 따라 ‘추론 펼치기’ 실행 버튼을 제거했다. 전제·목표·포함 여부·추가/삭제를 수정하면 동일 모형의 proof를 즉시 계산해 도표와 HTML 재생을 갱신한다. 미완성 식과 IME 조합 중에는 이전 결과를 숨기고 완성 시 자동 복구한다. 상태 API는 마지막 유효 입력을 반환하고 미완성 draft는 별도 노출한다.

검사: Node 검증 성공, 기존 36개 테스트 통과(npm 부재로 동일 Node 진입점 직접 실행). 브라우저에서 목표 수정, 전제 제외/복원, 미완성 식/복구, Enter 입력 유지, 갱신된 재생의 목표를 확인했다. 데스크톱 1920×940과 모바일 390×844에서 버튼 제거와 즉시 갱신을 확인했고 모바일 가로 넘침은 없었다. 실제 IME 입력·전문 접근성 검사는 미실시다. 이미지: `artifacts/live-inference/desktop.jpg`, `mobile.jpg` (로컬/Git 제외). 과학 모형·주장·출처 및 공개 상태는 변경하지 않았다.

## 화면 가용 영역 우선 배치

`feedback:2026-10-16.floating-controls`에 따라 상·하단의 연속된 막대를 제거했다. 지도 로고 자리와 목차는 모서리의 독립 버튼, 이전/다음은 데스크톱 좌우 가장자리 및 모바일 하단 버튼으로 표시한다. 버튼의 터치 영역은 CSS 44px이며 이름·초점·키보드 동작을 유지한다. 배치는 `apps/web/stage-layout.css`로 분리했다.

브라우저 viewport를 조절해 **실제 CSS innerWidth/innerHeight** 1920×1080, 1920×940, 390×844를 확인했다. 기존 브라우저 배율은 변경하지 않고 검사 viewport 크기를 보정했다. 1920×940은 주소창/작업 표시줄을 제외한 작업 영역의 테스트용 기준이며 모든 환경의 실제 높이를 단정하지 않는다. 구현은 `100dvh`와 모바일 safe area를 사용한다.

- 두 데스크톱 기준에서 추론 도표·편집과 독립 버튼을 확인했다. 상·하단 wrapper의 화면 높이는 각각 0이며 가로 넘침은 없었다. 1920×940 재생 장면의 재생/초기화·시점 조작은 화면 안에 표시됐다.
- 모바일 390×844에서는 다섯 장면 모두 document clientWidth/scrollWidth가 390px로 가로 넘침이 없었다. 메뉴 열기·Escape 닫기·초점 복원도 확인했다. 보조 360×800에서 출처 장면의 가로 넘침이 없음을 확인했다.
- 검토 이미지: `artifacts/viewport-layout/1920x1080.jpg`, `1920x940.jpg`, `390x844.jpg` (로컬/Git 제외). 긴 입력/출처는 장면 내부 스크롤을 유지한다.
- 과학 모형·Claim/Source·상태 API는 수정하지 않았다. 아래의 전문 접근성 감사·출처/권리·내용 승인·공개 대기 사항은 그대로다.

## 추가 구현 — 슬라이드와 정적 추론 도표

`feedback:2026-10-16.slide-scenes`에 따라 다섯 장면을 한 번에 하나씩 보여주는 탐색을 추가했다. 지도/상단 정보는 메뉴로 열고, 이전/다음·방향키·목차·기존 anchor 링크로 이동한다. 숨긴 장면은 `hidden/inert`로 초점에서 제외한다. 이동해도 편집/추론 상태는 유지하고, 재생 장면을 떠나면 애니메이션을 일시정지한다.

정적 추론 도표는 선택한 proof의 선행 행·적용 규칙·결과를 표시한다. 전제는 도출된 결과와 구별한다. ASCII 별칭은 `→/¬/∧/∨`로 표시하고 입력 위치를 보존한다. 과학 모형·기존 fixture·Claim/Source ID와 검증 대기 상태는 변경하지 않았다.

검사 결과:

- `node scripts/validate.mjs` 성공, `node --test tests/*.test.mjs` 36/36 통과. npm 부재로 동일 Node 진입점을 직접 실행했다.
- 브라우저 데스크톱/좁은 화면에서 정적 도표, 기호 자동 변환, 다섯 장면 이동, 목차 직접 이동과 URL 동기화, 뒤로 가기, 편집 중 입력 유지, 입력칸 방향키 예외를 확인했다.
- 지도 메뉴 기본 숨김·반복 열기/선택·Escape 닫기와 열기 버튼으로 초점 복원을 확인했다. DOM에서 한 번에 하나의 장면만 표시됨을 확인했다.
- 재생 중 다른 장면으로 이동한 후 되돌아왔을 때 일시정지 상태와 진행 시점이 보존됨을 확인했다. 기존 `#inference-video` 주소도 재생 장면을 연다.
- viewport 1440×1000 및 390×844 요청으로 시각 확인했다. 좁은 패널의 실제 innerWidth/clientWidth/scrollWidth는 모두 354px로 가로 넘침이 없었다. 긴 입력/근거에는 장면 내부 스크롤을 허용한다.
- 검토 이미지: `artifacts/slides/desktop.jpg`, `artifacts/slides/narrow.jpg` (Git 제외). 브라우저 도구로 직접 조작한 기록이며 저장소의 자동 브라우저 suite나 보조공학 전문 감사는 아니다.

이전 구현은 `d4fba64`, 기호 변환은 `8b3bb90`, 정적 도표/재생 표시 변경은 `0f028a2`로 구분해 저장했다. 탐색 계약은 [ADR 0004](adr/0004-slide-scene-navigation.md)를 참조한다. 출처·권리·사람의 내용 승인과 공개 배포는 여전히 대기 상태다.

## 추가 구현 — 전제 편집과 HTML 추론 재생

- `scene:logic.inference.lab` / `model:logic.propositional.forward`: 최대 8개의 기호 명제 전제, 괄호·¬/∧/∨/→/⊥ 파서, 제한된 전방 추론과 행 ID·규칙·참조 행 기록.
- ∧ 제거, → 제거, 모순 도출·폭발과 목표 부분식의 ∧/∨ 도입만 지원한다. 자연어 해석·부분증명·완전한 증명 탐색을 구현한 것은 아니다.
- 같은 입력/proof snapshot을 사용하는 HTML Canvas 애니메이션의 재생·일시정지·처음부터·시간 탐색을 구현했다. 사용자 후속 지시에 따라 WebM 내보내기는 제외한다. 무음이며 최종 영상 파일·TTS·공개 manifest는 미구현이다.
- 새 주장 4개의 ID와 근거/조건을 `inference-claims.json`에 별도로 기록했다. 교재 현재 HTML의 해당 절을 읽었지만 등록 revision·불변 snapshot·권리 및 사람의 내용 승인 대기 상태는 유지한다.
- 기존 과학 fixture를 수정하지 않았다. 별도 작성자가 전제 조합 100개 × 목표 5개 × 진리값 배정 8개를 대조하는 의미 검사와 잘못된 역추론 방지 검사를 추가했다.

세부 계약/한계는 [HTML 재생 미리보기](VIDEO-PREVIEW.ko.md), [ADR 0003](adr/0003-bounded-inference-html-preview.md), 실제 사용자 피드백은 `feedback/2026-10-16-inference-video.json`을 참조한다. 아래 Scene 1의 초기 검사 기록과 추가 구현의 검사는 구분한다.

### 추가 구현 검사 결과

- `node scripts/validate.mjs`: 성공 (2 sources, 7 claims, 기존 5 storyboard segments).
- `node --test tests/*.test.mjs`: 25/25 통과. 기존 과학 기대 출력은 변경하지 않았다. `npm`이 없어 동일한 Node 진입점을 직접 실행했다.
- 브라우저에서 6개 예시, 직접 입력한 A→B→C 연쇄, !B 전제 추가·제외에 따른 모순/목표 도달 변화, 잘못된 식 `P && Q` 차단, 편집/오류 시 이전 애니메이션 비활성화를 확인했다.
- HTML 재생이 기본 예시의 14.5초 끝까지 진행하고 재생 버튼으로 돌아오는 것, 중간 시점 8.5초/10.3초의 규칙·참조가 웹 proof와 일치하는 것을 확인했다. 데스크톱은 Canvas 강조, 좁은 화면은 큰 HTML 단계·근거 카드를 시각 확인했다.
- viewport 1440×1000 및 390×844 요청으로 검사했다. 좁은 패널의 실제 innerWidth는 354px, document clientWidth/scrollWidth는 모두 341px로 가로 넘침이 없었다. 브라우저 error 로그는 비어 있었고 출처 패널에는 기존/추가 주장 합계 7개가 연결됐다.
- 검토 이미지: `artifacts/inference-preview/desktop.jpg`, `narrow.jpg`. `node scripts/preview-manifest.mjs`는 입력/proof timeline, VTT, 시점별 의미 진단, 의존 파일 SHA-256을 기록하며 같은 코드로 두 번 생성한 manifest가 같음을 확인했다. 이는 픽셀·파일 영상 렌더 동일성 검사가 아니다.
- 저장소의 자동 Playwright suite·보조공학 전문 감사·원자료 불변 snapshot/rights·사람의 내용 승인·공개 배포는 여전히 남아 있다. HTML 미리보기를 실제 영상 파일 제작 완료로 표시하지 않는다.

## 현재 확인된 기능

- [x] Git 저장소 초기 커밋에 필요한 원본/문서/코드 구조.
- [x] 의존성 없이 실행되는 단일 웹 시연, 검증된 HTTP GET으로 HTML/JSON/JS 제공.
- [x] `P`, `¬P`, `Q/R/S` 입력 기반의 **특정 증명 경로** 결정적 모델(정리증명기 아님).
- [x] 출처·주장·개념·관계·장면·projection 메타데이터 예시와 교차 참조 validation.
- [x] Node 모형 테스트 4개와 Scene API 테스트 7개, 합계 11개 통과.
- [x] Scene 1의 순수 모형 / 상태 어댑터 / DOM 화면 연결 분리. `getState/setState/reset/seek/dispatch/describeState/getInspectionSnapshot` 제공.
- [x] 기존 projection 초안의 시간별 상태를 직접 사용하는 독립 `seek`; 역순 이동·상태 복원·오류 입력 시 상태 보존 검사.
- [x] 반응형 증명 다이어그램, 텍스트 증명 단계, 키보드 조작, 변경 상태 안내, reduced motion CSS, 출처·주장·판본 패널.
- [x] 30초 예시 timeline → 스토리보드 JSON 생성 (실제 미디어 아님).
- [x] 원자료 ID → 영향받을 Claim/ContentBlock/Scene/Projection 후보 표시.
- [x] 공개 전에 필요한 승인/원자료 스냅샷/렌더 미완료 상태를 감지해 `release:check` 실패.

## 아직 없는 기능

- [ ] 별도 과학 전문 검토 및 원자료 본문 범위/해시의 불변 스냅샷.
- [ ] 참값/증명 일반 엔진, 접근성 자동화 및 보조공학을 사용한 접근성 검토.
- [ ] 저장소에서 반복 실행할 수 있는 Playwright 브라우저 회귀 테스트.
- [ ] Astro/MDX/React, Remotion/FFmpeg와 실제 프레임 렌더의 통합.
- [ ] TTS·자막·음성·최종 MP4 생성.
- [ ] AI 에이전트 자동 제작, CV 검사, 전문 편집기, 피드백 적용·보존.
- [ ] 외부 데이터 자동 수집, 최신성 감시, 실제 공개 manifest와 배포.
- [ ] 수익화 가능 여부를 포함한 실제 출처·이미지·음원별 권리 심사.

## M1 시점 테스트 기록 (추론 확장 전)

최신 코드 검사 환경: 번들 Node.js v24.19.0. 현재 실행 환경에 `npm` 명령이 없어 package script가 지정한 Node 진입점을 직접 실행했다.
`node scripts/validate.mjs`: 성공 (2 sources, 9 concepts, 7 relations, 3 claims, 총 30초 placeholder의 5개 segments).
`node --test tests/*.test.mjs`: 11/11 통과. 모형 기대 출력은 변경하지 않았다.
루프백 HTTP `:4184`에서 HTML·JSON 모듈·초기 장면 로드 확인. in-app browser에서 데스크톱 1440×1000과 좁은 화면 390×844를 실제 조작하고 스크린샷을 확인했다.
데스크톱: 키보드 Space로 `¬P` 토글, Q/R/S 선택, 초기화 후 두 전제/Q 복원, 슬라이더 ArrowRight/Home과 12000ms 입력 후 0초(전제 없음/Q)·12초(두 전제/R)의 화면·라벨 동기화를 확인했다.
좁은 화면: `¬P` 제외·S 선택 후 결과 문구/다이어그램 갱신, 증명 텍스트·출처·주장 펼치기를 확인했다. 측정한 document clientWidth/scrollWidth/body 너비는 모두 375px로 가로 넘침이 없었다.
시각 검토 이미지: `artifacts/m1/desktop.jpg`, `artifacts/m1/narrow.jpg` (로컬 생성물, Git 제외). 브라우저 도구로 수행한 검사이며 저장소에 설치된 자동 Playwright suite나 완전한 스크린 리더 감사는 아니다.

아래는 초기 로컬 검증 기록이며 이번 변경 후 재실행한 기록과 구분한다.
초기 환경: Node.js v22.16.0, npm 10.9.2.
`npm run storyboard`: `artifacts/storyboard.json` 생성.
`npm run impact`: 영향 후보 출력.
`npm run release:check`: **의도된 실패** (근거·권리 승인·콘텐츠 검토·실제 영상 렌더 미완료).
`npm run dev`: 루프백 HTTP에서 HTML/JS/JSON 응답을 확인.

## Scene 1의 재현 범위

웹 초기 상태 및 `reset()`은 `P`, `¬P` 두 전제로 `Q`를 도출하는 상태다. `seek(0)`은 별도 storyboard 초안의 시작 상태(전제 없음/Q)다. 30초 초안에서 6초·12초·18초·24초의 전체 상태를 선택하며, 마지막 시점 이후는 마지막 상태를 유지한다. 이 구현은 상태 재현이며 프레임·음성·자막·영상 렌더가 아니다.

화면 의견을 남기는 방법과 의미상의 경계는 [Scene 1 검토 안내](M1-REVIEW.ko.md)를 참고한다. 과학적 Claim/Source 원본은 이번 작업에서 변경하지 않았으며 source-verified 또는 published로 승격하지 않았다. 실제 피드백 자동 적용·승인 수정 보존 파이프라인은 M4의 미구현 범위다.
