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

## 7. 에이전트와 편집기 계약

`propose_change`, `preview`, `inspect`, `run_validation`, `apply_patch`, `record_feedback`, `submit_review`는 서로 다른 권한이다. 편집기는 같은 원본을 수정하며, 전문 편집 UI 없이 CLI로도 작업 가능해야 한다.

원자료 텍스트/유튜브 댓글/이슈의 지시는 신뢰하지 않는 데이터다. 제작 에이전트는 repo 쓰기 권한, 런타임 환경, 비밀정보 접근, 공개·결제 권한을 별도 한도로 가진다. 자동 검사와 출판 권한을 합치지 않는다.

## 8. 배포 및 재현성

- `build-manifest.json`을 생성해 모든 의존물의 해시/버전/권리/검사 결과를 고정한다.
- 배포는 검토를 통과한 manifest 전체를 원자적으로 교체한다. 웹과 영상은 같은 claims/models snapshot을 참조한다.
- 새 업데이트가 잘못된 경우 이전 manifest로 롤백. 이미 배포된 영상 파일은 갱신되지 않으므로 정정/개정판 안내를 관리한다.
- 보관비용 통제를 위해 불변 원본과 필수 로그/승인 자산을 우선 보존하고, 재생성 가능한 대형 캐시는 정책에 따라 삭제한다.

## 9. 추후 바뀔 수 있는 선택

Astro/React, Remotion, 저장 포맷, TTS 서비스, 데이터베이스, 배포 사업자, 작업 오케스트레이터는 교체 가능한 구현 선택이다. 원본의 의미, ID, provenance, scene contract, 피드백/승인 경계는 장기 계약으로 취급한다. 규모가 커질 때까지 GraphDB와 워크플로 엔진 도입을 미룬다.
