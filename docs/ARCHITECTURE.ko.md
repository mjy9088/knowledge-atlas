# 시스템 아키텍처와 데이터 계약

## 1. 전체 구조

```text
SOURCE ADAPTERS (Wikimedia / 공개 교재 / OA 원문 / 데이터)
        |  snapshot + rights + revision + diff
        v
SOURCE REGISTRY ─────── Knowledge graph (concepts / relations)
        |                         |
        v                         v
CLAIMS + MODELS  ──────────> CONTENT UNITS (explanations)
        |                         |
        +─────────────────────────v
                           EXPERIENCE / SCENES
                            /             \
              interactive web         projection path
                    |                      |
                 website              renderer + audio
                                            |
                                       video assets

                     ^ feedback + review
                     | from web, previews, users
              agent tasks / tests / CV / human editor

Separate: source→claim→scene→projection dependency DAG
          != user's concept→concept knowledge graph
```

**진실의 단일 원본:** 승인된 claims/models + content project의 버전 집합. 웹 출력과 영상은 같은 승인된 스냅샷에서 빌드한다. 외부 출처의 내용이 프로젝트의 동의 없이 자동으로 '참'으로 전환되지는 않는다.

## 2. 식별자와 버전

- 논리적 ID 예: `concept:logic.explosion`, `claim:logic.explosion.rule`, `scene:logic.explosion.proof`, `projection:logic.explosion.youtube.ko`.
- 인간에게 보이는 URL slug는 변경할 수 있지만 내부 ID는 안정적이다.
- 콘텐츠 파일 변경은 Git 이력, 외부 근거는 공급자 revision/URL + snapshot digest로 추적한다.
- `source_snapshot_id`는 실질적으로 불변. 새 원문은 새 snapshot을 만든다.
- 그래프 엣지는 작성자·근거·검토 상태를 가진다. 명칭의 일치는 곧 개념의 동일성이 아니다.
- 출판할 때 `publication_manifest`에 claim/version, model/version, scene/version, audio/version, projection/version, source/license snapshot을 잠근다. 없는 의존성이 있으면 빌드 실패.

## 3. 핵심 엔터티 계약

**SourceSnapshot**: `id`, `canonical_url`, `retrieved_at`, `provider_revision`, `content_hash`, `author`, `title`, `license`, `rights_review_status`, `kind`, `stored_at`. 매체 별도 라이선스도 지원. 원문 내 작은 범위인 `SourceSpan`은 path/section/locator를 가진다.

**Concept**: `id`, 이름/별칭/분야별 분류, 외부 식별자와 매핑 검토 상태. 노드의 개념과 원자료의 '문서'는 분리한다.

**Relation**: `(from,to,type,context,sourceRefs,assertedBy,reviewStatus)`. `mentions`와 `derivesFrom` 등 관계 강도를 혼동하지 않는다.

**Claim**: `id`, `statement`, `language`, `scope`, `assumptions`, `kind`(formal/modeled/empirical/hypothesis/... ), `source_refs`, `confidence_status`, `review_status`; 경우에 따라 proof/test/uncertainty. 복잡한 설명 전체를 강제로 단일 명제화하지 않고 중요 경계를 분리한다.

**Model**: 계산을 담당하는 순수 함수와 입출력 계약, 단위·경계·알려진 한계, 검증 fixture. AI 생성 텍스트를 임의의 계산 엔진으로 쓰지 않는다.

**ContentUnit/Experience**: 설명 텍스트·부분 블록 ID·연결 개념·참조 claims·사용 scenes·접근성 대체 내용. 하나의 페이지가 여러 개념을 다룰 수 있다.

**Scene**: 상태 스키마, allowed actions, `getState`, `setState`, `reset`, `seek`(재생형일 때), geometry/semantic element ID, 설명 참조, 입력/출력, 미리보기 상태들, 테스트 fixture.

**Projection**: 승인된 콘텐츠를 포함하는 stable source snapshot, 장면 ID의 시퀀스, 시점·명령·카메라·표시 레이어·해설 블록·지속시간·자막, 출력 프로파일(해상도/fps 등). 영상 대본은 별도 진리 원본이 아니다.

**Feedback**: `id`, `target_type/id`, `content_version`, `capture_state`, `timecode`, `issue`, `requested_change`, `invariants`, `scope`, `origin`, `status`, `resolution_refs`.

**Review/Publication**: 검사 결과, 승인 주체·시간, 검토한 범위, 공개 상태, 되돌릴 수 있는 manifest.

초기 예시는 `packages/contracts/*.schema.json`와 `content/.../*.json`, `knowledge/*.json`을 참조한다. **여기 적힌 전체 필드가 초기 코드에 모두 구현되었다는 뜻은 아니다.** 계약을 확장할 때 하위 호환 또는 명시적 마이그레이션을 작성한다.

## 4. 두 개의 관계 그래프

### 4.1 지식 그래프 (방향/순환 가능)

`concept→concept`, `experience→concept`, `source→concept` 관계. 위키 기반의 원자료 링크는 초기에는 낮은 확신의 `mentions/relatedTo`; 사람이/검증된 근거가 `specialCaseOf`, `derivesFrom`을 확인하면 강화한다. 그래프 탐색은 이용자에게 ‘커리큘럼’을 강제하지 않는다.

### 4.2 생성·갱신 의존 DAG

`sourceSnapshot→sourceSpan→claim/model→explanation→scene/narration→projection/publication`. 각 변환에 generator version/prompt version/code version/input hash가 붙는다. **개념 A가 B와 관련 있다고 해서 B의 빌드를 재실행하지 않는다.** 직접 의존 경로에 변경이 있을 때 영향 평가를 수행한다.

## 5. 모노레포 경계

첫 단계는 파일 기반 구조와 무의존성 샘플이다. 다음 후보 스택은 **잠정적 결정**이다.

- `apps/web`: 초기 정적 프로토타입 → 장차 Astro/MDX + React islands 도입 검토.
- `apps/video`: projection schema와 이벤트 시뮬레이션 → Remotion/FFmpeg 엔진 추가 검토.
- `packages/contracts`: 버전 관리되는 스키마와 유효성 검사 (향후 Zod/JSON Schema 및 generator).
- `packages/models`: 외부 시스템 없는 순수 계산/논증 로직, 독립 테스트 가능한 모형.
- `knowledge`, `sources`, `content`: 기계가 읽을 수 있는 출처·관계·승인 콘텐츠 원본.
- `feedback`: 제출된 수정 요청과 적용 내역; 나중에는 DB-backed tool로 교체 가능.
- `scripts`: 명령형 작업/validation CLI. 향후 에이전트 작업기는 이 명령 인터페이스를 래핑하도록 설계.

Astro 공식 문서: https://docs.astro.build/en/guides/integrations-guide/mdx/  / Remotion: https://www.remotion.dev/docs/license/pricing

## 6. Scene API 목표

```ts
type SceneAdapter<TState, TAction> = {
  getState(): TState;
  setState(next: TState): void;  // validated, deterministic
  reset(): void;
  dispatch(action: TAction): void;
  seek?(timeMs: number): void;   // pure from initial state + timeline
  describeState(): { semanticElements: Record<string, unknown> };
  getInspectionSnapshot(): {
    state: TState;
    displayedValues: Record<string, unknown>;
    warnings: string[];
  };
};
```

- **렌더러는 모형 계산을 재발명하지 않는다.** 입력/단위/출력은 `Model` API를 호출한다.
- `setState` 이후 동일한 상태는 동일한 의미적 결과를 내야 한다(무작위성은 seed로 고정).
- 영상 프레임은 시간 t로 seek해 독립적으로 얻을 수 있어야 한다. 이벤트 순서를 실제 마우스 클릭 시퀀스로만 기록하지 않는다.
- 자동 검사와 AI가 이용할 의미 요소 ID를 제공한다. 스크린샷 픽셀 비교만 유일한 관찰 수단으로 삼지 않는다.
- 강제 화면·컴포넌트 구조를 정하지 않고 WebGL/Canvas/SVG/React 등을 어댑터 뒤에서 바꿀 수 있다.

### 첫 Scene 어댑터 구현 (M1)

`apps/web/proof-scene.mjs`는 DOM과 분리된 `createProofScene({onChange})`를 제공한다. 상태는 기존 `hasP/hasNotP/conclusion`을 유지하고 계산은 `packages/models/explosion.mjs`에 위임한다. 브라우저의 `window.__atlasScenes.proof`에서 상태·초기화·액션·의미 요소·검사 스냅샷 API를 사용할 수 있다.

`seek(timeMs)`는 기존 `projection.json`의 30초 초안 segment 전체 상태를 시간만으로 선택한다. 음수·비유한 값·숫자가 아닌 입력은 거절하고, 마지막 시점 이후는 마지막 상태를 유지한다. `reset()`은 웹 초기 상태(두 전제/Q), `seek(0)`은 스토리보드 시작 상태(전제 없음/Q)를 복원하므로 서로 다르다. 타임라인은 실제 영상 렌더나 최종 해설 타이밍이 아니다. JSON module import를 지원하는 브라우저가 필요하다.

별도 `scene:logic.inference.lab`는 `packages/models/propositional.mjs`의 제한된 전방 추론을 사용한다. 새 경험/주장 계약은 `inference.json`과 `inference-claims.json`에 보관한다. HTML 재생 어댑터 `inference-video.mjs`는 계산된 proof를 고정 복사한 timeline에서 `frameAt(timeMs)`로 화면과 애니메이션을 만든다. 실제 미디어 파일 렌더를 구현했다는 뜻은 아니다. 범위·호환성 결정은 [ADR 0003](adr/0003-bounded-inference-html-preview.md)을 참조한다.

슬라이드 탐색은 `apps/web/slide-deck.mjs`의 별도 표현 상태 `{slideId}`로 관리한다. 기존 과학 장면의 상태와 분리해 장면 이동으로 전제를 초기화하지 않는다. `inference-visual.mjs`의 정적 관계 도표도 같은 proof와 선택 행만 사용한다. `formula-display.mjs`는 파서가 이미 지원하는 입력 별칭의 표시 변환만 담당한다. 메뉴·초점·hash 계약은 [ADR 0004](adr/0004-slide-scene-navigation.md)에 기록한다.

## 7. 에이전트와 편집기 계약

`propose_change`, `preview`, `inspect`, `run_validation`, `apply_patch`, `record_feedback`, `submit_review`는 서로 다른 권한이다. 편집기는 같은 원본을 수정하며, 전문 편집 UI 없이 CLI로도 작업 가능해야 한다.

원자료 텍스트/유튜브 댓글/이슈의 지시는 신뢰하지 않는 데이터다. 제작 에이전트는 repo 쓰기 권한, 런타임 환경, 비밀정보 접근, 공개·결제 권한을 별도 한도로 가진다. 자동 검사와 출판 권한을 합치지 않는다.

## 8. 배포 및 재현성

독자용 웹 자산은 `scripts/build-site.mjs`의 명시적 `PUBLIC_WEB_FILES`로 제한한다. 영상 제작 UI·인코더·muxer·FFmpeg 실행 코드는 공개 빌드에 포함하지 않는다. MP4는 `scripts/encode-mp4.mjs` CLI로 변환하고 웹 API는 제공하지 않는다. HTML 재생/상호작용과 제작 도구의 경계는 [ADR 0010](adr/0010-local-media-cli.md)을 따른다.

- `build-manifest.json`을 생성해 모든 의존물의 해시/버전/권리/검사 결과를 고정한다.
- 배포는 검토를 통과한 manifest 전체를 원자적으로 교체한다. 웹과 영상은 같은 claims/models snapshot을 참조한다.
- 새 업데이트가 잘못된 경우 이전 manifest로 롤백. 이미 배포된 영상 파일은 갱신되지 않으므로 정정/개정판 안내를 관리한다.
- 보관비용 통제를 위해 불변 원본과 필수 로그/승인 자산을 우선 보존하고, 재생성 가능한 대형 캐시는 정책에 따라 삭제한다.

## 9. 추후 바뀔 수 있는 선택

2026-10-16: 연관 Article 4편과 목록은 `related-pages.mjs`의 표현 명세와 `packages/site/related-site.mjs`의 공유 렌더러로 사전 생성한다. 개발 서버도 같은 함수를 호출하며, 클라이언트는 정적 본문에 장면 이동과 선택적 명제논리 실험을 추가한다. `dist/build-manifest.json`은 출력·빌더 입력의 해시와 기존 검토 상태를 기록하는 로컬 검토용 manifest다. 외부 배포·출판 승인은 포함하지 않는다. [ADR 0009](adr/0009-static-related-pages.md) 참고.

Astro/React, Remotion, 저장 포맷, TTS 서비스, 데이터베이스, 배포 사업자, 작업 오케스트레이터는 교체 가능한 구현 선택이다. 원본의 의미, ID, provenance, scene contract, 피드백/승인 경계는 장기 계약으로 취급한다. 규모가 커질 때까지 GraphDB와 워크플로 엔진 도입을 미룬다.

### 주제별 본편의 독립 상태 (2026-10-16)

`episode.mjs`의 설명 원본에서 `explosion-episode.mjs`가 version 4 타임라인을 만든다. 각 cue의 `presentation`은 전제·목표·기존 모형 proof를 포함하는 완전한 snapshot이다. `frameAt`은 선택 cue의 presentation으로 표시 행을 구성하고 웹/세로/Canvas는 이를 함께 읽는다. 원래 version 2/3 단일 proof 타임라인과 30초 projection 계약은 보존한다. 콘텐츠의 `episodeRef`/`relatedCollectionRef`는 본편과 연관 해설 원본의 stable ID를 참조한다. 이 로컬 후보의 생성은 출판 manifest나 내용 승인 완료를 뜻하지 않는다. 상세는 `FOCUSED-EPISODE.ko.md` 참고.

웹 해설은 후속 피드백으로 시간 상태 대신 `lesson-dialogue.mjs`의 `{sectionId}`를 사용한다. 같은 episode 설명과 cue별 모형 snapshot을 DOM 도표로 읽되, 영상의 시간 진행은 독립적으로 보존한다. 키보드/skip/복원 계약은 [ADR 0007](adr/0007-dialogue-reading.md) 참조.

### 해설과 실험실의 공통 입력

`premise-experiment.mjs`의 순수 입력 상태/평가와 `mountPremiseEditor`를 해설·전용 실험실이 공유한다. `suggest`는 예시 제안, 사용자 draft는 별도 상태이며 명시적 복원 전에는 덮어쓰지 않는다. 영상은 같은 `controlState`의 선택/편집 형태를 읽기 전용으로 투영한다. 현재 컴포넌트는 제한된 명제논리 범위이며 타 분야에는 검증된 별도 모형 어댑터가 필요하다. 계약과 예외는 [ADR 0008](adr/0008-inline-shared-experiments.md) 참조.

`describeExperiment(sectionId, inspection)`는 현재 proof의 규칙·참조 행에 근거한 대사와 도표 행을 함께 선택한다. 적용 불가·오류·목표 미발견에는 이전 예시 문장을 유지하지 않는다. `EXPERIMENT_RULE_CLAIMS`의 기존 Claim ID 참조를 검증기가 검사한다. 해설의 `getInspectionSnapshot().displayedDialogue`로 실제 표시 대사를 검사할 수 있다. 편집 목록/도표/대사/이동 버튼은 별도 레이아웃 영역이며 긴 내용은 내부 스크롤을 사용한다.
