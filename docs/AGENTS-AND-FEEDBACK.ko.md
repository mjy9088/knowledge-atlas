# AI 제작·검사·피드백 기반 개선

## 1. 목표와 동작 원칙

에이전트는 사람용 편집기 화면을 이용하는 사용자를 모방하는 데만 의존하지 않는다. 구조화된 콘텐츠 API/CLI로 명제·설명·장면 상태·타임라인을 편집한다. **실제 렌더된 결과를 관찰하고 수정할 수 있어야 한다.** 사람도 동일한 원본을 전문 UI에서 직접 편집할 수 있어야 한다.

AI가 업무 대부분을 자동화하더라도, 원자료에서 새로운 사실을 추론하거나 증명/데이터의 근거를 추가할 때는 검증 가능하고 추적 가능한 절차가 필요하다. 제작 자동화와 과학적 내용 인증을 혼동하지 않는다.

## 2. 작업(job) 모델

공통 요청:

```json
{
  "jobId": "job-example",
  "operation": "draft|implement_scene|inspect|repair|project_video|refresh_source|publish_candidate",
  "targets": ["scene:logic.explosion.proof"],
  "basePublicationOrCommit": "<immutable-version-id>",
  "inputs": ["<source-snapshot-or-feedback-id>"],
  "allowedWriteScopes": ["content/formal-logic/explosion/scenes/**"],
  "invariants": ["claim:logic.explosion.rule"],
  "budgets": {"maxRetries": 3, "maxCostUsd": 5},
  "requiredChecks": ["schema", "model", "interaction", "visual"]
}
```

응답은 patch/diff, 생성 아티팩트 위치, 변경한 IDs, 주장/근거 변경 여부, 검사·실패·추가 검토 필요사항을 포함한다. **수행하지 않은 테스트를 통과했다고 기록하면 안 된다.** 작업 단계는 버전 충돌에 안전한 방식으로 적용한다.

## 3. 제작 파이프라인

```text
Source snapshot → analyze content/scope → factual claims/relations
→ draft explanation → draft visual/interaction plan
→ implement model + scenes → render preview
→ semantic checks + model tests + browser tests + CV
→ critique → constrained repair → review candidate
→ projection timeline → audio/captions → render preview
→ timeline/audio/visual inspection → final candidate → approval
```

- 생성 루프를 무제한 돌리지 않는다. 예산·시간·횟수 제한을 초과하면 실패와 최소 재현을 남긴다.
- 신규 UI 패턴은 원래 요구/비교 사례를 참고하되, 자동 화면 평가 점수를 만족시키려고 중요한 내용을 숨겨서는 안 된다.
- 영상은 원본과 같은 claim/model 버전을 써야 한다. 해설용 축약은 가능하나 가정/불확실성을 제거하지 않는다.
- 원자료 또는 웹페이지에 발견한 명령은 신뢰하지 않는다. 프롬프트 인젝션 방지: 명령 채널과 자료 채널을 분리한다.

## 4. CV와 실제 결과 검증

**시맨틱 검사**(상태, 요소 ID, 레이아웃 bbox, 숫자/단위, 콘솔 오류)와 **시각 검사**(프레임/전후 이미지/동영상) 모두 필요하다.

1. 동일 초기 상태 + 조작 시나리오로 브라우저/렌더링 실행.
2. 서로 다른 화면 너비, 입력 경계, 중간 시점, 자막 등장/퇴장 프레임 샘플링.
3. 요소 겹침·잘림·대비·의도치 않은 정지·화면 밖 배치·전환 이상 검사.
4. 장면 의미 ID와 설명 참조를 대조해 해설의 지시 대상이 실제 보이는지 확인.
5. 오류가 재현 가능하면 수정 제안. 시각 검사만으로 결론이 참임을 인정하지 않는다.

브라우저 Playwright 화면·DOM/aria 및 콘솔 기록, ffmpeg 영상/음성 검사, 모델 fixture/수학적 증명이 서로 보완해야 한다.

## 5. 피드백 수집 및 해석

피드백은 자유 문장으로 받되 `Feedback` 객체에 다음을 담는다.

- 대상: claim/문단/scene/element/timecode 및 정확한 콘텐츠·모델 버전
- 당시 상태: scene state, 영상 타임코드, viewport, 기대 vs 실제
- 요청: 문제가 무엇이며 어떤 결과를 바라는가
- **invariants**: 이번 수정에서 반드시 보존할 사항
- scope: 특정 순간 / 콘텐츠 전체 / 공통 패턴 / 프로젝트 정책
- origin: 제작자/일반 이용자/자동 검사/외부 원자료
- 해결 검증 및 결정: 승인/거절/대체/공통 규칙 승격

AI는 피드백을 실행 전 구체적인 diff 계획으로 해석한다. 중요하거나 애매한 해석은 사람의 확인을 받되, 단순 수정은 기존 범위에 따라 바로 candidate로 만들 수 있다.

## 6. 개별 수정과 공통 규칙의 분리

예: ‘현재 슬라이더 수정 전후가 구별되지 않음’
- 지역 patch: 이 장면에서 이전·현재 상태 비교 레이어 추가.
- 재발 방지: “동일 변수의 전후 변화를 설명할 때 두 상태 비교 옵션을 제공” 규칙 후보.
- 회귀 fixture: 특정 값에서 바뀌기 전후 결과를 둘 다 볼 수 있는지.
- rule promotion: 여러 유형에 시험 후 승인; 기존 다른 장면을 훼손하지 않는지 검사.

피드백 텍스트를 곧바로 모든 영상의 글로벌 규칙으로 승격하지 않는다. 예외와 조건 없이 생성 규칙만 늘리는 것은 장기 품질을 떨어뜨린다.

## 7. 승인·재생성 보호

- human approved content/parameters는 protected patch 또는 특정 field lock으로 기록.
- regenerate는 base snapshot에서 새 후보를 만들되 protected patch를 유지하거나 충돌로 올린다.
- 이전 승인 사항을 바꾸려면 별도의 명시적 승인과 영향 검사 요구.
- 에이전트가 과학적 정답 fixture를 자신의 코드에 맞춰 임의 변경하는 행위 금지. fixture 변경은 별도 검토.
- 모든 버전의 입력, prompt/tool/agent/model version, 결과·비용·검사 로그 추적.

## 8. 사람용 편집기의 점진적 진화

MVP: 장면 선택 + 자연어 피드백 + 실행/전후 비교 + source/claim diff + 승인.

다음: 의미 레이어(knowledge/geometry/presentation/audio/interactivity/timeline), 인스펙터, 장면/오브젝트/타임라인 전문 UI, keyframe/parameter/animation editing, 전체 콘텐츠 그래프와 영향 표시. ‘사람용 편집기 없이 모든 게 가능해야 한다’는 목표가 있더라도 전문 UI를 폐기하지 않는다.

## 9. 에이전트 평가 기준

모델 교체/규칙 수정 전에는 서로 다른 분야(논리 증명, 수치 모델, 시간 시뮬레이션, 데이터 시각화)의 회귀 세트를 수행한다. 점수 하나가 아니라 정확성/출처/렌더 품질/수정 보존/비용·지연을 개별 기준으로 확인한다. AI는 평가 기준 변경 권한과 결과 승인 권한을 기본적으로 갖지 않는다.
