# 공개 지식 원자료 및 권리 관리 정책

**기본 원칙:** 무료로 읽을 수 있다는 사실은 번역·재배포·상업 이용·AI 자동 수집/가공·영상 녹화/수익화 허가를 의미하지 않는다. 사이트 서비스 약관, 책/페이지 본문, 외부 이미지/도표/음원, 데이터와 소프트웨어는 각각 별도 검토한다.

## 1. 자료의 역할별 후보

| 역할 | 후보 | 사용 방식 | 초기 참고 URL |
|---|---|---|---|
| 범분야 개념 색인 | Wikipedia / Wikidata | 문서 링크/관계/다국어 명칭의 **출발점**, 확정된 선수관계로 취급하지 않음 | https://www.wikidata.org/wiki/Wikidata:Licensing |
| 깊이 있는 분야별 교재 | LibreTexts 및 각종 공개 교재 | 각 장/절의 근거와 권리 개별 승인 후 활용 | https://libretexts.org/ |
| 이해 가능한 과학 설명 | Science in School / Frontiers for Young Minds | 원자료·문제·인용문헌 탐색; 개별 기사/그림 권리 확인 | https://scienceinschool.org/ , https://kids.frontiersin.org/ |
| 형식과학 파일럿 | forall x: Calgary / Open Logic Project | 명제논리의 모순 폭발 설명·규칙의 근거 | https://forallx.openlogicproject.org/html/ , https://openlogicproject.org/olp-license/ |
| 논문/관측 데이터 | 출판사·저장소·기관 데이터 | 최신 연구·개정 추적, 철회/정정 감시, 데이터와 해석 분리 | https://www.crossref.org/documentation/retrieve-metadata/retraction-watch/ |

처음부터 모든 제공자의 본문을 대량 수집하지 않는다. 파일럿의 허용된 일부 자료만 고정 판본으로 실험한다. 다양한 제공자의 동일 이름이 같은 개념을 뜻한다고 추정하지 않는다.

## 2. 재사용 판단 단계

1. **Source registry**: 저자/게시자/소유자/원본 URL/판본·수정 ID/수집 시점/라이선스 텍스트와 범위를 기록.
2. **rights review**: CC0/CC BY/CC BY-SA 등 적용 범위, NC/ND 또는 독자적 제한, 출판사/서비스 AI 이용 약관, 로봇·API 정책 확인. 플랫폼 표기만으로 개별 매체 권리 추정 금지.
3. **assets audit**: 이미지/도표/음원/폰트/영상 클립은 본문과 분리하여 관리, 없거나 제한적이면 자체 대체로 제작.
4. **adaptation tracking**: 번역/도식화/재구성인지 단지 사실 학습 뒤 독립적으로 작성한 것인지 기록. 문장 일부만 바꿨다고 자동으로 권리가 소멸하는 것은 아니다.
5. **publish notice**: 필요한 저자 표시, 링크, 라이선스, 수정 이력, 해당 변경의 제작 주체, 공식 승인/협업 여부의 오해 방지 문구.
6. **automated gate**: 배포 manifest에 unresolved rights가 있는 공개 자산/개작물이 있으면 기본적으로 공개 보류.

## 3. 간단 라이선스 메모 (법률 자문 아님)

- CC0: 권리 포기/허용의 범위에 법역별 차이가 있을 수 있고, 인격권·상표·초상권 등은 별도.
- CC BY: 상업적 사용·개작 허용, 출처·라이선스·수정 표시 등 필요.
- CC BY-SA: 상업적 사용 가능하지만 **개작물에 동일/호환 라이선스**가 필요. 별도 저작물의 단순 모음과 개작물의 범위를 확인.
- NC: 사용이 상업적 성격이면 허가가 필요할 수 있다. 유튜브 수익화/광고/상업 사이트 사용 시 보수적으로 관리.
- ND: 개작물을 공유할 권한 없음. 번역·편집된 콘텐츠용으로 적합하지 않을 수 있음.
- 단순 공개 저장소: LICENSE가 없으면 수정·재배포 허가를 추정하지 않는다.

공식: https://creativecommons.org/cc-licenses/ / https://creativecommons.org/faq/

## 4. 파일럿의 권리 상태

- `forall x: Calgary` 공개 HTML에 CC BY 4.0 계열의 원작/개작 출처가 명시되어 있다. **실제 사용할 문장/도표의 판본별 확인**이 필요하다. 2026-09-27로 안내된 HTML revision `c5cb415`가 검토된 출발점이다. https://forallx.openlogicproject.org/html/
- `Open Logic Project` 일반 웹사이트 본문은 별도 표시가 없다면 CC BY 4.0. 개작 시 표시·변경 고지 필요. https://openlogicproject.org/olp-license/
- 초기 예시 데이터는 **원문 교재 문장을 복사하지 않고 자체 서술로 만든** 파일럿 구조다. 게시 전 정확한 source spans와 판본, 선택한 외부 시청각 자산의 권리 검토 필요.
- 이 저장소 자체는 아직 오픈소스 라이선스를 선택하지 않았다. 외부 자료의 라이선스와 저장소 자체 라이선스는 분리한다.

## 5. 지식 최신성과 권리의 충돌

원자료가 새 버전으로 바뀌었다면 *현재* 라이선스를 재확인하고, 이미 취득한 특정 버전의 허가 조건은 그 판본의 기록으로 유지한다. 허가 없는 새 자료로 자동 대체하지 않는다. 정확성 개선이 필요하지만 권리 확인이 안 되는 경우 별도 허용 자료를 찾거나 독립 설명으로 갱신하고 근거를 명확히 표시한다.

## 6. 영상·TTS·음원

- 자신이 생성한 음성이라도 TTS 제공자 약관, 상업적 이용, 계정 권한, 인물 음성 모사 권리를 확인.
- 인용 그림·수업용 도표의 권리는 새 캡처에 그대로 따라올 수 있다. 인코딩/녹화는 권리를 지우지 않는다.
- 영상에 사용된 라이선스/출처를 description 및 웹 rights pane/필요시 화면 credit으로 산출.
- Remotion 자체 라이선스는 일반적인 MIT가 아니다. 조직 규모·자동화와 제품화에 따른 조건을 확인: https://www.remotion.dev/docs/license/pricing
