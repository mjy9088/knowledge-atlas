# 모순 폭발 본편과 연관 지식

2026-10-16 사용자 피드백 `feedback:2026-10-16.focus-and-related`를 반영했다. 범용 추론 실험실 소개로 바뀐 영상의 중심을 원래 질문으로 복원했다. 짧은 설명에서 3분은 채워야 할 길이가 아니라 상한이다. 본편은 **134초(2분 14초)**다. 음성/TTS 시간으로 검증한 길이가 아니라 무음 자막·장면 타임라인이다.

## 웹 원본과 경로

`content/formal-logic/explosion/episode.mjs`의 `lesson:logic.explosion.short.ko`를 웹 해설 `/lesson.html`, HTML 세로 재생 `/shorts.html`, 렌더 `/render.html`이 공유한다. 본편 projection ID는 `projection:logic.explosion.short.ko`다. 기존 30초 `projection.json`의 ID와 Scene 1 계약을 교체하지 않는다. 원래 범용 추론 실험과 예시도 보존한다. 기본 렌더는 이제 본편이며 실험 예시는 별도로 선택한다.

| 시점 | 장면 |
|---|---|
| 0:00 | 모순에서 무엇이든 증명할 수 있는가? |
| 0:12 | 한 정수에 관한 문장 P와 부정 ¬P, 가정과 사실 구별 |
| 0:25 / 0:31 | P와 ¬P를 전제로 놓기 |
| 0:38 | 두 전제에서 모순 ⊥ |
| 0:49 | ⊥ 제거로 Q |
| 1:03 / 1:13 | 목표를 R, S로 변경 |
| 1:20 | ¬P를 제거해 보여준 폭발 경로 끊기 |
| 1:33 | 도출과 현실의 사실 구별 |
| 1:48 | 일관성이 중요한 이유 |
| 2:02–2:14 | 요약과 연관 웹 해설 안내 |

각 cue는 전제·목표·proof가 포함된 독립 presentation을 가진다. 렌더러/웹/세로 화면은 `frameAt`에서 그 presentation을 사용한다. 목표만 화면 글자로 바꾸거나 이전 증명 행을 남기지 않는다. 임의 시점 seek에서도 선행 조작이 필요 없다. 기존 모형·과학 fixture는 변경하지 않았다. 웹에서 일시정지한 장면을 선택하면 강조 결과를 즉시 보여준다.

범용 `expandedCues`도 고정 180초 분배를 제거하고 설명 길이와 행별 시간으로 구성한다. 긴 증명을 상한에 맞춰 압축하지 않는다. 세로 영상 렌더 계획은 180초 초과를 거절하고 별도 편 구성을 안내한다. 긴 웹 탐색과 가로 영상 도구의 일반 기능은 보존한다. Shorts 규정은 [YouTube 공식 안내](https://support.google.com/youtube/answer/15424877?hl=ko)를 확인했으며, 자동 업로드나 Shorts 분류 검증은 수행하지 않았다.

## 연관 콘텐츠와 근거

`related.json`에는 일관성, 초일관 논리, ZFC, CH/독립성 4편과 8개 새 claim이 있다. 각 문단은 claim ID에 연결되고 claim은 조건·범위·출처 절을 가진다. 기존 8개와 합쳐 총 16개다. 새 source 4개를 추가해 총 6개다. 조사 범위·제외 자료·권리/판본 제한은 `RELATED-SOURCE-REVIEW.ko.md`에 기록했다. 지식 메뉴에서 일관성·초일관 논리·ZFC·CH/독립성 노드를 선택하면 해당 해설로 이동한다. 각 해설은 기본 정의부터 시작하며 전체 정리의 증명을 제공한다고 주장하지 않는다.

기존 `claim:logic.explosion.*`와 새 `claim:logic.consistency.nontrivial`, `claim:logic.classical.contradiction-unsatisfiable` 등이 본편을 뒷받침한다. 수학적 의미의 교차 검토는 수행했으나 외부 전문가/사람의 내용 승인, 원문 불변 snapshot 및 정확 판본 검증, 권리 감사, 출판 승인은 미완료다. 비폭발 논리 엔진이나 ZFC/강제법 계산기를 구현한 것은 아니다.

## 검증과 산출물

- 검증기: 개념·주장·자료·문단 ID 및 참조, 본편 180초 상한 검사.
- 테스트: 기존 과학 정답 보존, Q/R/S 전환과 전제 제거의 모형 snapshot 동등성, 순서 없는 seek, 긴 세로 렌더 거절.
- 실제 MP4: `artifacts/video-renderer/explosion-short.mp4`, H.264, 1080×1440, 30fps, 4020프레임, 134초, 무음. ffprobe 진단·타임라인 manifest·VTT를 함께 보관했다. 64초 MP4 프레임을 실제 디코드해 R로 변경된 근거·결론을 확인했다.
- 브라우저: 1920×940 데스크톱과 390×844 좁은 화면에서 본편·전제 제거·연관 설명 확인. 가로 넘침 없음. 세로 HTML stage가 전체 가용 높이에 들어가도록 축소 중심 배치도 보정했다. 전체 세로 본편 인코딩은 완료했으며 16:9 전체 인코딩과 모든 실험 예시 재인코딩은 미실시다.

로컬 파일과 진단은 Git 제외 산출물이다. 재생 가능한 로컬 후보이며 출판 manifest나 공개/과학 승인 완료본이 아니다. `npm run preview:manifest`는 이제 본편 HTML의 타임라인·VTT·의존 해시·전제/목표별 진단을 `artifacts/explosion-preview`에 생성한다.
