# 정적 웹 빌드와 연관 해설

2026-10-16. 로컬 구현·검사 후보이며 공개 배포는 수행하지 않았다.

## 실행

Node.js 22+를 사용한다. 새 npm 의존성은 없다.

```bash
npm run validate
npm test
npm run build
npm run preview
# http://127.0.0.1:4174/knowledge/
```

mise 환경에서는 `mise exec -- npm run build`, `mise exec -- npm run preview`로 실행할 수 있다. npm이 PATH에 없으면 같은 진입점을 `node scripts/validate.mjs`, `node --test tests/*.test.mjs`, `node scripts/build-site.mjs`, `node scripts/serve-static.mjs`로 실행한다. 기본 개발 서버는 `npm run dev`의 4173 포트이며, 정적 미리보기와 개발 서버 모두 `PORT` 환경변수를 받는다.

`dist/` 전체가 정적 호스팅 산출물이다. 빌드 명령은 이 고정 디렉터리를 다시 생성한다. 일반적인 정적 호스트의 build command는 `npm run build`, output directory는 `dist`다. 도메인 루트 배포와 directory index를 기준으로 한다. SPA fallback이나 서버 함수는 필요하지 않으며, 현재 임의 하위 경로 배포는 지원하지 않는다. 외부 호스팅 연결·업로드·DNS 설정은 포함하지 않았다.

## 페이지와 원본

| 경로 | 원본 Article ID | 표현 |
| --- | --- | --- |
| `/knowledge/` | 연관 collection 목록 | 지식 링크 카드 |
| `/knowledge/consistency/` | `article:logic.consistency.ko` | 4개 장면 + 고전 규칙 실험 |
| `/knowledge/paraconsistent-logic/` | `article:logic.paraconsistent.ko` | 7개 장면 + FDE 실험 |
| `/knowledge/zfc/` | `article:set.zfc.ko` | 6개 장면 + 집합 관계 실험 |
| `/knowledge/continuum-hypothesis/` | `article:set.ch-independence.ko` | 6개 장면 + 등록 정리 연결 |

내용과 근거는 기존 `related.json`·Claim·source registry가 원본이다. `related-pages.mjs`는 block 참조, 문장 범위, 장면 제목·개념 도표·건너뛰기 범위만 가진다. 각 장면의 문장은 원본 블록을 빠짐·중복 없이 덮어야 하며 검증기가 이를 검사한다. 원래 block/article/claim ID는 보존한다. 후속 보강에서 FDE 의미론·집합 관계·외연성 Claim 3개와 설명 block 7개를 추가했다. 새 논문과 기존 강의노트의 확인 범위는 `RELATED-SOURCE-REVIEW.ko.md`에 기록한다.

페이지는 키보드·이전/다음·범위가 적힌 건너뛰기·목차·해시 링크를 공유한다. 본문·도표·근거·연관 링크를 HTML에 미리 생성하므로 JavaScript 없이도 전체를 읽는다. 클라이언트 모듈은 한 장면씩 읽는 이동과 선택적 실험만 추가한다. `related-reader.mjs`의 `getState/setState/reset/inspect`는 DOM과 독립적이다. 브라우저의 `window.__atlasRelated`는 장면과 실험 상태 및 실제 표시 대사 검사 API를 제공한다. 이 새 페이지들에 영상 시간표를 구현했다는 뜻은 아니다.

모든 연관 페이지가 같은 편집기와 추론 시각화를 재사용하며 서로 다른 derive 어댑터를 연결한다. 일관성은 고전 명제논리, 초일관성은 ¬∧∨에 대한 최대 5개 원자의 FDE 전수 평가, ZFC는 ∈/⊆/외연성의 제한된 관계 추론, CH는 등록된 상대일관성 정리의 메타 연결을 사용한다. 수정 입력은 장면 이동 중 유지하고 대사·도표를 함께 갱신/무효화한다. 처음 상태로는 입력과 장면을 복원한다. FDE 반례와 불완전한 경로 탐색 실패는 구분한다. ZFC 전체 증명기나 강제법의 구현이 아니다. ADR 0011 참고.

## 빌드 계약과 제한

`packages/site/related-site.mjs`를 개발 서버와 빌드가 공유한다. `scripts/build-site.mjs`는 웹 자산·명시된 데이터/모형 디렉터리의 허용 확장자만 복사하고 다섯 경로의 HTML과 404 문서를 생성한다. 문서·피드백·Git 메타데이터·환경 파일·렌더 영상·서버 코드는 산출물에 포함하지 않는다. 외부 CDN·런타임 콘텐츠 API·데이터베이스·SSR은 필요하지 않다. 기존 `/lesson.html` 등의 프로토타입도 포함하지만, 그 기존 본문 전체를 이번에 사전 렌더한 것은 아니다.

`build-manifest.json`은 출력 파일별 SHA-256, 빌더 입력 해시, 페이지→Article ID, 출처의 기존 hash/권리 상태를 기록한다. 같은 입력의 반복 빌드는 같은 manifest를 생성한다. 이 해시는 **프로젝트 산출물**의 재현성을 위한 것으로 외부 원문 스냅샷 검증을 뜻하지 않는다. `published:false`, 기존 내용 검토 상태와 `sourceSnapshotVerified:false`를 보존한다. 빌드는 공개 승인·권리 심사·외부 배포를 대신하지 않는다.

독자용 공개 웹과 로컬 영상 제작 도구를 분리한다. 웹 자산은 `PUBLIC_WEB_FILES`의 명시적 목록으로 복사한다. `render.html/render.mjs/render.css/video-renderer.mjs/webm-muxer.mjs`는 공개 산출물에 없으며, 본편·지도·화면 비교 페이지에도 렌더 링크나 MP4 변환 안내가 없다. 개발 서버의 MP4 API와 렌더 출력 HTTP 경로도 제거했다. HTML 재생과 읽기/실험 기능은 유지한다.

MP4 제작은 로컬 터미널에서 `npm run render:mp4 -- input.webm output.mp4` 또는 `node scripts/encode-mp4.mjs input.webm output.mp4`로 실행한다. 내부적으로 `mise exec -- ffmpeg/ffprobe`를 사용하며 변환·검사 결과를 `output.mp4.json`에 저장한다. 기존 출력을 덮어쓰지 않는다. `--help`로 실행 조건을 확인한다. WebM 생성용 `/render.html`은 개발 서버에서 직접 여는 로컬 보조 도구로만 유지하고 MP4 버튼·파일 선택·자동 변환은 제공하지 않는다. 새 연관 페이지의 영상 렌더는 이번 범위가 아니다.

## 검사

자동 검사는 문장 커버리지·Claim 참조·HTML 이스케이프·장면 상태와 잘못된 입력 거절·정적 HTML 링크와 모듈 import 경로·파일 해시·반복 빌드 동등성을 확인한다. 제거한 제작 파일명/문구를 열거하던 부재 검사는 삭제했다. 새 규칙은 출처의 표·반례·유한 집합 해석·가정 의존성을 검사한다. 별도로 정적 서버에서 네 페이지의 화면/이동·입력 변경·무효화와 1920×1080·1920×940·1920×900·390×844의 화면 경계를 확인한다. 연관 지식·근거는 메뉴로 열고 마지막 장면에는 작은 링크로 표시한다. 이는 전문가의 과학 내용 승인이나 완전한 접근성 감사가 아니다.
